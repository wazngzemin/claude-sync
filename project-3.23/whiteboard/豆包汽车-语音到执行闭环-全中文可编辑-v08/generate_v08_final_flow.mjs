import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('./diagram-v08-final-flow.svg', import.meta.url));
const W = 4240;
const H = 18580;

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

function card(id, x, y, w, h, title, lines = [], opts = {}) {
  const { fill = C.white, stroke = C.line, sw = 1.5, titleFill = C.ink, tag = '', dash = '', titleSize = 20, lineSize = 16 } = opts;
  rect(x, y, w, h, fill, stroke, sw, 16, nodeSvg, dash);
  if (tag) {
    const tw = Math.max(78, tag.length * 18 + 24);
    rect(x + 18, y + 14, tw, 30, stroke, stroke, 1, 8);
    text(x + 18 + tw / 2, y + 36, tag, 16, 750, C.white, 'middle');
    text(x + 18, y + 70, title, titleSize, 750, titleFill);
  } else {
    text(x + 18, y + 34, title, titleSize, 750, titleFill);
  }
  const start = tag ? y + 98 : y + 64;
  lines.forEach((line, i) => text(x + 18, start + i * 25, line, lineSize, 500, i === lines.length - 1 && opts.lastRisk ? C.risk : C.muted));
  nodes.set(id, { x, y, w, h });
  return id;
}

function pill(x, y, w, label, fill = C.pale, stroke = C.blue, color = C.blue2) {
  rect(x, y, w, 36, fill, stroke, 1.2, 18);
  text(x + w / 2, y + 25, label, 16, 700, color, 'middle');
}

function anchor(id, side = 'bottom') {
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
    const lw = Math.max(88, label.length * 17 + 24);
    rect(p[0] - lw / 2, p[1] - 19, lw, 34, C.white, color, 1, 8, overlaySvg);
    text(p[0], p[1] + 5, label, 16, 700, color, 'middle', overlaySvg);
  }
}

function connect(a, b, opts = {}) {
  const from = anchor(a, opts.from || 'bottom');
  const to = anchor(b, opts.to || 'top');
  const via = opts.via || (Math.abs(from[0] - to[0]) < 3 ? [] : [[from[0], (from[1] + to[1]) / 2], [to[0], (from[1] + to[1]) / 2]]);
  route([from, ...via, to], opts);
}

function stage(y, num, titleValue, subtitle) {
  edgeSvg.push(`<line x1="40" y1="${y}" x2="4160" y2="${y}" stroke="${C.line}" stroke-width="2"/>`);
  rect(60, y + 22, 56, 56, C.blue, C.blue, 1, 28);
  text(88, y + 61, num, 20, 800, C.white, 'middle');
  text(138, y + 56, titleValue, 28, 800, C.ink);
  text(138, y + 86, subtitle, 17, 500, C.muted);
}

// Canvas and responsibility swimlanes.
rect(0, 0, W, H, C.bg, C.bg, 0, 0, nodeSvg);
const lanes = [
  [40, 650, '用户 / 语音界面', '听见、打断、最终感知'],
  [690, 680, '车端感知 / 快路', '声学、端侧模型、实时状态'],
  [1370, 700, '云端接入 / 上下文', '路由、事实、记忆、知识'],
  [2070, 700, 'AI 决策 / 长期任务', '规划决策、目标、任务与触发'],
  [2770, 680, '工具 / 执行器', '27 工具、车端与生态执行'],
  [3450, 710, '反馈 / 呈现 / 验收', '回读、完成门、指标与证据'],
];
lanes.forEach(([x, w, name, sub], i) => {
  rect(x, 326, w, H - 386, i % 2 ? C.paper2 : C.paper, C.line, 1, 0);
  rect(x, 326, w, 82, i === 3 ? C.pale : C.white, C.blue, 1.5, 10);
  text(x + w / 2, 357, name, 19, 800, C.blue2, 'middle');
  text(x + w / 2, 385, sub, 16, 500, C.muted, 'middle');
});

rect(40, 40, 4120, 118, C.blue2, C.blue2, 0, 20);
text(80, 90, '豆包汽车｜语音用户请求到真实结果｜单主链业务架构图', 34, 850, C.white);
text(80, 127, '一条请求主轴贯穿端侧、云端、AI、工具、真实执行、反馈与再次规划；所有分支必须有去向和回流。', 18, 500, C.white);
rect(40, 176, 4120, 114, C.white, C.blue, 1.5, 16);
text(70, 212, '读法：先沿钴蓝粗线追一次请求；再看绿色真实结果回流；虚线表示异常、等待或仍需链路验真的机制。', 18, 700, C.ink);
text(70, 246, '完成口径：被接收 ≠ 工具调用成功 ≠ 真实状态生效 ≠ 用户完整目标完成；最后一级必须有真实证据。', 18, 700, C.risk);

stage(440, '01', '语音进入系统', '声音先变成带身份、座位、时间和追踪编号的统一请求。');

card('U1', 80, 560, 540, 120, '用户发声', ['原始声音；说话人候选；声区 / 座位', '可能同时包含打断、指代、否定、时间与地点']);
card('U2', 760, 560, 540, 160, '唤醒、权限与会话门', ['是否已唤醒 / 免唤醒；麦克风权限', '当前是否正在播报；新输入是插话还是延续', '失败：无权限、未唤醒、会话已关闭'], { fill: C.pale, stroke: C.blue });
card('U3', 760, 760, 540, 185, '声学前处理', ['回声消除、降噪、波束定位、多人声分离', '人声起止：早截断、尾噪、抢话、停顿', '输出：干净音频片段＋声区＋时间戳'], { fill: C.pale, stroke: C.blue });
card('U4', 760, 985, 540, 190, '语音识别 ASR', ['增量文本 → 最终文本', '重点保真：否定词、数字、时间、地点、人名', '输出：文本＋置信度＋起止时间＋说话人候选'], { fill: C.pale, stroke: C.blue });
card('U5', 1450, 985, 570, 215, '统一用户请求 user_query', ['query：用户原话；speaker_name：说话人', 'speaker_position：座位；timestamp：时间', '建议补齐：request_id / trace_id / turn_id', '识别置信度与 ASR 来源进入后续追踪'], { fill: C.sage, stroke: C.sageLine });
card('UERR', 3480, 560, 640, 300, '输入异常必须可归因', ['无权限 / 未唤醒 / 回声 / 噪声 / 早截断', '否定、数字、时间、地点识别错误', '多人同时说或说话人与座位冲突', '处理：重听、澄清、明确拒绝；禁止猜测补全'], { fill: C.riskBg, stroke: C.risk, lastRisk: true });
card('VUI', 3480, 910, 640, 270, '语音界面状态机 VUI', ['待机→唤醒→聆听→识别→理解→准备回复', '语音合成排队→播报→下一轮 / 待机', '用户打断只停止播报，不自动取消实体动作', '无效输入是否恢复播报必须有明确产品策略'], { fill: C.sand, stroke: C.amber });

connect('U1', 'U2', { from: 'right', to: 'left', label: '声音进入' });
connect('U2', 'U3');
connect('U3', 'U4');
connect('U4', 'U5', { from: 'right', to: 'left', label: '最终文本' });
route([anchor('U2', 'right'), [3350, 640], [3350, 650], anchor('UERR', 'left')], { color: C.risk, width: 2, dash: '10 8', label: '异常' });
route([anchor('U4', 'right'), [3390, 1080], [3390, 790], anchor('UERR', 'bottom')], { color: C.risk, width: 2, dash: '10 8' });
connect('U2', 'VUI', { from: 'right', to: 'left', color: C.amber, width: 2, dash: '10 8', label: '会话状态' });

stage(1360, '02', '接入、端侧快路与端云唯一裁决', '登录→专用模块→句法快路→并行准备→云 FC / 拒识→最终仲裁；一轮只允许一个执行结果。');

card('R1', 1450, 1490, 570, 135, '接入网关', ['校验请求结构、会话、车型、渠道与网络', '统一车企协议为内部请求；写入追踪事件'], { fill: C.pale, stroke: C.blue });
card('R2', 1450, 1665, 570, 120, '登录 / 身份通过？', ['否：只给认证提示，不读取私有上下文', '是：继续检查专用执行能力']);
card('R3', 1450, 1825, 570, 135, '指定专用执行模块？', ['Direct Agent / 已注册能力处理明确任务', '命中仍必须经过安全、幂等和结果回传']);
card('R4', 1450, 2000, 570, 150, '句法 RAG / 端侧小模型命中？', ['适合高置信、明确、低风险的即时指令', '输出：结构化意图＋参数＋置信度', '不确定、复杂、多步或需知识时继续上云']);
card('R5', 1450, 2190, 570, 160, '并行准备与预取', ['准备 Context、历史、目标、知识、工具可用性', '可并行预启动云端 Planner 以降低等待', '预启动不是最终执行权；结果仍须等待仲裁']);
card('R6', 1450, 2390, 570, 165, '云 FC / 意图与拒识判断', ['判断简单 / 复杂、是否需要澄清或拒识', '简单候选交给确定性执行；复杂交给 Planner', '搜索摘要、建议或模型分类都不能直接执行']);
card('R7', 1450, 2595, 570, 215, '端云最终仲裁与执行令牌', ['候选：专用模块 / 端侧快路 / 云 FC 简单 / 拒识 / 复杂请求', '并行预启动 Planner 只为降时延；Context 形成前绝无执行权', '只采纳一个路径并发出唯一 execution_token', '快路已执行后丢弃迟到云结果；记录选择原因、版本与冲突'], { fill: C.sage, stroke: C.sageLine });

card('RAUTH', 3480, 1665, 640, 145, '登录失败 → 响应收口', ['输出认证提示；不进入 Context / Memory', '记录失败原因；用户完成登录后作为新请求重进'], { fill: C.riskBg, stroke: C.risk });
card('RDIRECT', 2160, 1825, 540, 135, '专用执行路径', ['专用 Agent 给出可执行动作', '下一站：统一动作门禁，不绕开安全与反馈'], { fill: C.sand, stroke: C.amber });
card('RFAST', 2160, 2000, 540, 150, '端侧快路 / 简单动作', ['毫秒级确定性意图与参数', '可不上 Planner，但必须有执行令牌与真实回读'], { fill: C.sand, stroke: C.amber });
card('RFC', 2160, 2390, 540, 165, '云 FC 简单候选', ['简单任务转统一门禁；复杂任务进入 Context', '端侧 / 云端候选冲突由 R7 唯一裁决'], { fill: C.sand, stroke: C.amber });
card('RREJECT', 3480, 2390, 640, 180, '拒识 / 澄清 / 仅记录', ['必须给出原因、必要追问或明确降级', '拒识不是静默丢弃；监控误拒与漏拒', '安全或能力不允许时禁止“试一下”'], { fill: C.riskBg, stroke: C.risk });
card('RCOMPLEX', 1450, 2845, 570, 125, '复杂请求 → 统一输入治理', ['多步、复合、条件、持续或需知识的请求', '进入 Context 后再交给 Planner / Director'], { fill: C.pale, stroke: C.blue });

connect('U5', 'R1');
connect('R1', 'R2');
connect('R2', 'R3', { label: '身份通过' });
connect('R3', 'R4', { label: '未指定' });
connect('R4', 'R5', { label: '未命中' });
connect('R5', 'R6');
connect('R6', 'R7', { label: '提交候选' });
connect('R7', 'RCOMPLEX', { label: '只在选择复杂路径时' });
connect('R2', 'RAUTH', { from: 'right', to: 'left', color: C.risk, dash: '10 8', label: '否' });
connect('R3', 'RDIRECT', { from: 'right', to: 'left', color: C.amber, label: '是' });
connect('R4', 'RFAST', { from: 'right', to: 'left', color: C.amber, label: '命中' });
connect('R6', 'RFC', { from: 'right', to: 'left', color: C.amber, label: '简单' });
connect('R7', 'RREJECT', { from: 'right', to: 'left', color: C.risk, dash: '10 8', label: '只在选择拒识时' });
connect('RDIRECT', 'R7', { from: 'left', to: 'right', color: C.amber, width: 2, dash: '10 8', via: [[2080, 1892], [2080, 2690]], label: '候选' });
connect('RFAST', 'R7', { from: 'left', to: 'right', color: C.amber, width: 2, dash: '10 8', via: [[2100, 2075], [2100, 2690]], label: '候选' });
connect('RFC', 'R7', { from: 'left', to: 'right', color: C.amber, width: 2, dash: '10 8', via: [[2120, 2472], [2120, 2690]], label: '候选' });

stage(3040, '03', '四类输入、事实治理与本轮 Context', 'Planner 看到的不是信息仓库，而是按本轮目标筛选、隔离、裁决和压缩后的最小充分事实快照。');

card('I4', 760, 3170, 560, 260, '四类当前输入', ['① 用户请求 user_query：用户原话', '② 顾问建议 advisor：建议，不是执行权', '③ 工具反馈 tool_feedback：到达即开启新一轮', '④ 系统事件 event：变化＋时间＋来源', '优先级：用户请求 > 反馈 / 建议 / 事件'], { fill: C.pale, stroke: C.blue });
card('I0', 1450, 3170, 570, 260, '统一输入治理', ['分类→优先级→打断 / 合并 / 排队 / 丢弃', '隔离用户、车辆、会话、任务和来源', '补齐追踪编号、发生时间、有效期和置信度', '过期、重复、迟到或越权输入不进入本轮', '主动建议与旧兼容旁路需要同一 Trace 验真'], { fill: C.sage, stroke: C.sageLine });
card('CTXFACT', 80, 3490, 1240, 350, '十二类事实来源', ['1 当前输入　2 近期对话　3 端侧状态　4 视觉情境', '5 事件日志　6 身份关系　7 当前目标 / 任务', '8 联网新事实　9 车型知识　10 可用工具 / 版本', '11 助手角色与价值边界　12 时间 / 位置 / 设备 / 网络', '每项必须能回答：谁写、何时写、何时过期、属于谁'], { fill: C.white, stroke: C.blue });
card('MEM', 80, 3880, 1240, 300, '四类记忆与隐私边界', ['瞬时：本轮声音 / 视觉；短期：会话 / 临时对象 / 最新反馈', '长期情景：地点、同行人、时间与经历关系', '长期语义：稳定偏好、习惯、关系与画像', '按用户 / 车 / 会话隔离；空结果就是未找到，禁止臆造'], { fill: C.white, stroke: C.blue });
card('GOV1', 1450, 3490, 570, 150, '① 来源与身份隔离', ['写入者、用户、车辆、会话、任务和权限', '顾问、事件、模型推断与真实结果分型']);
card('GOV2', 1450, 3680, 570, 150, '② 新鲜度与相关性', ['发生时间 / 写入时间 / 有效期；陈旧则刷新', '只保留完整目标真正需要的事实']);
card('GOV3', 1450, 3870, 570, 160, '③ 冲突裁决', ['最新端态优先旧对话；真实回读优先模型话术', '无法裁决保持“未知”，用查询或追问补齐']);
card('GOV4', 1450, 4070, 570, 160, '④ 摘要与预算', ['远区历史压缩，近区动作和反馈完整保留', '关键人物、否定、时间、目标状态不可被摘要丢失']);
card('DYN', 2160, 3490, 1190, 360, '动态知识与示例注入', ['检索触发：当前请求＋车型 / 环境＋候选任务', '选择：专业知识、车型规则、工具技巧、相似正反例', '质量门：来源、车企×环境、版本、得分、过期、冲突去重', '低分 / 无命中只降低覆盖；不能编造知识或放宽安全规则', '输出进入系统提示词动态区，并记录版本与来源'], { fill: C.sand, stroke: C.amber });
card('SNAP', 1450, 4310, 1280, 230, '本轮最小充分事实快照 ContextSnapshot', ['当前输入＋身份座位＋端侧状态＋视觉情境＋相关记忆', '目标 / 任务进度＋工具能力 / 版本＋车型知识＋最新结果', '它是本轮唯一决策事实视图；新 tool_feedback 到来后必须重建', '质量指标：必要事实覆盖、陈旧率、冲突率、越权率、输入长度'], { fill: C.sage, stroke: C.sageLine, titleSize: 22 });
card('PROMPT', 1450, 4580, 1280, 270, '送入 Planner 的 [系统提示词 SP，用户提示词 UP]', ['SP：角色 / 输入类型 / 工具定义 / 输出协议 / 安全规则 / 正反例 / 车型知识', '动态区：车辆状态、视觉、目标队列、记忆、工具可用性', 'UP：近期对话＋本轮输入数组＋ContextSnapshot＋历史 feedback', '缓存只影响性能，不替代事实新鲜度；版本必须进入 Trace'], { fill: C.pale, stroke: C.blue });

connect('RCOMPLEX', 'I0'); connect('I4', 'I0', { from: 'right', to: 'left', label: '四选一 / 排队' });
connect('CTXFACT', 'GOV1', { from: 'right', to: 'left', color: C.blue2 });
connect('MEM', 'GOV3', { from: 'right', to: 'left', color: C.blue2 });
connect('I0', 'GOV1'); connect('GOV1', 'GOV2'); connect('GOV2', 'GOV3'); connect('GOV3', 'GOV4');
route([anchor('DYN', 'left'), [2080, 3670], [2080, 4200], anchor('GOV4', 'right')], { color: C.amber, width: 2, dash: '10 8', label: '动态注入' });
connect('GOV4', 'SNAP'); connect('SNAP', 'PROMPT');

stage(4900, '04', 'Planner / Director：同一个 AI 决策中枢', 'AI 的核心不是意图分类，而是持续根据新事实、未完成目标和工具结果，生成下一步最小可执行计划。');

card('AICAP', 80, 5050, 1240, 500, '产品要验收的 AI 能力', ['完整目标：不漏目标、不擅自新增动作', '已知 / 未知：可推断、可查询、必须追问要分清', '任务分型：单步、复合、多步、定时、条件、持续', '原子拆解：独立动作并行；有结果依赖才串行', '工具与参数：选对能力、作用对象、顺序和必要条件', '安全边界：车型 / 设备 / 权限 / 车速档位 / 确认', '反馈恢复：失败后改计划，不机械重试；保留已成功分支', '稳定性：同例多跑结论一致，不因话术漂移改变动作'], { fill: C.white, stroke: C.blue, titleSize: 22 });
card('P0', 2110, 5050, 620, 180, '规划决策器 Planner = Director', ['输入：固定规则包＋本轮输入类型＋事实快照', '底层模型：豆包 Seed；模型不是独立业务模块', '输出只代表决策候选，不代表真实执行'], { fill: C.sage, stroke: C.sageLine, titleSize: 22 });
card('P1', 1450, 5290, 620, 300, '理解与目标检查', ['① 解码输入：请求 / 建议 / 反馈 / 事件', '② 识别人、座位、否定、时间、地点与指代', '③ 提取完整目标、约束、优先级和退出条件', '④ 标出未知：查询、澄清、拒绝或降级', '⑤ 结合目标状态判断“现在最该做什么”']);
card('P2', 2110, 5290, 620, 300, '计划与工具检查', ['⑥ 任务分型并拆为原子动作', '⑦ 依赖 / 并发：前结果决定后参数则分轮串行', '⑧ 选择工具 / Agent、参数、作用对象与版本', '⑨ 条件 / 持续动作转 Goal / Task，不塞进单轮', '⑩ 说话时机：确认、澄清、进度、最终']);
card('P3', 2770, 5290, 620, 300, '自检与下一轮策略', ['⑪ 结构、白名单、安全、重复与冲突自检', '⑫ 继续 / 改计划 / 等待 / 追问 / 结束', '不得提前承诺未知执行结果', '不得把搜索候选、接口受理或工具成功当目标完成', '同一目标保留子目标状态和证据']);
card('POUT', 2110, 5650, 1280, 310, '当前模型输出协议', ['是否说话 talk_or_not｜回复内容 talk_content｜形象动作 emoji_id', '动作清单 action_list：动作编号 action_id＋工具名 tool_name＋参数 params', '动作清单只是“想调用什么”：尚未下发、未执行、未生效、未完成', '输入=tool_feedback 时，同一 Planner 可继续调用、补槽、等待、追问或结束'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('PGAP', 80, 5590, 1240, 420, '当前协议需要重点追的缺口', ['请求：缺 request_id / trace_id / turn_id 会导致多人多轮难串起', '顾问：缺来源、时间、关联目标、置信度与有效期', '工具反馈：若缺 action_id，同名并发返回难确认归属', '事件：缺类型、传感器来源、作用域与去重号', '动作：若缺 depends_on、并行组、超时、重试、取消结构', '长期目标：新增 / 删除之外，还要更新、暂停、恢复、过期与清理', '这些是协议 / 工程问题；不能一概归因“模型不聪明”'], { fill: C.riskBg, stroke: C.risk });

connect('PROMPT', 'P0');
connect('P0', 'P1', { from: 'left', to: 'top', via: [[1760, 5140], [1760, 5260]] });
connect('P1', 'P2', { from: 'right', to: 'left' });
connect('P2', 'P3', { from: 'right', to: 'left' });
connect('P3', 'POUT', { from: 'bottom', to: 'right', via: [[3080, 5620], [3410, 5620], [3410, 5805]] });
connect('AICAP', 'P1', { from: 'right', to: 'left', color: C.blue2, width: 2, dash: '10 8', label: '验收' });
connect('PGAP', 'POUT', { from: 'right', to: 'left', color: C.risk, width: 2, dash: '10 8', label: '协议风险' });

stage(6080, '05', '确定性门禁、即时动作与长期任务', '所有模型候选、端侧快路和专用模块先汇到同一门禁；即时与持久任务分开，但最终复用同一执行主链。');

card('V1', 2110, 6210, 620, 135, '① 字段 / 结构校验', ['四输出、必填参数、类型、枚举、工具白名单', '失败：形成标准错误，回 Planner 补槽 / 改计划']);
card('V2', 2110, 6380, 620, 150, '② 能力 / 安全门', ['车型版本、座位、权限、档位车速、运行设计域', '判断允许 / 需确认 / 拒绝 / 降级；高风险误放行为 0']);
card('V3', 2110, 6565, 620, 150, '③ 依赖 / 并发', ['独立动作可并行；依赖前序结果必须分轮串行', '禁止同时搜索地点、规划路线和控制导航造成竞态']);
card('V4', 2110, 6750, 620, 150, '④ 幂等 / 端云竞态', ['请求 / 轮次 / 动作 / 执行令牌关联；重复调用去重', '快路已执行则拒绝迟到云结果，避免双副作用']);
card('V5', 2110, 6935, 620, 165, '⑤ 生命周期与结果聚合', ['下发、运行、超时、重试、取消、部分成功', '工具受理、调用、生效、目标完成分层记录', '门禁失败也必须返回可解释、可恢复的结果']);
card('TSPLIT', 2110, 7140, 620, 165, '是否需要跨轮持久化？', ['否：单步 / 复合 / 多步，靠 tool_feedback 分轮推进', '是：定时 / 条件 / 持续，保存目标、条件、状态与退出', '无论哪条路，真实执行都从统一调度器进入']);
card('VGATE_FAIL', 3480, 6500, 640, 300, '五级门禁结果总线', ['V1 结构｜V2 安全｜V3 依赖｜V4 幂等｜V5 生命周期', '任一级：缺参 / 需确认 / 拒绝 / 冲突 / 超时 / 不可用', '都禁止进入执行调度，并形成标准结果', '回传：原因、缺失字段、可否重试、下一步建议与时间'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });

// After arbitration, only the selected direct/simple candidate may enter the common deterministic gates.
route([anchor('R7', 'right'), [2750, 2690], [2750, 6280], anchor('V1', 'right')], { color: C.amber, width: 3, label: '选择专用 / 快路 / 简单候选＋唯一执行令牌', labelAt: [2750, 6120] });
connect('POUT', 'V1'); connect('V1', 'V2'); connect('V2', 'V3'); connect('V3', 'V4'); connect('V4', 'V5'); connect('V5', 'TSPLIT');
const gateYs = ['V1','V2','V3','V4','V5'].map(id => anchor(id, 'right')[1]);
route([[3400, gateYs[0]], [3400, gateYs[4]]], { color: C.risk, width: 2, dash: '10 8', arrow: false });
['V1','V2','V3','V4','V5'].forEach(id => {
  const p = anchor(id, 'right');
  route([p, [3400, p[1]]], { color: C.risk, width: 2, dash: '10 8', arrow: false });
});
route([[3400, anchor('VGATE_FAIL', 'left')[1]], anchor('VGATE_FAIL', 'left')], { color: C.risk, width: 3, dash: '10 8', label: '任一级未通过' });

card('IMM', 2780, 7350, 640, 150, '即时动作路径', ['本轮直接进入统一运行调度器', '多步仍是一轮一轮：前序 feedback 确认后再生成后序参数'], { fill: C.sage, stroke: C.sageLine });
card('PER', 1450, 7350, 620, 175, '持久任务路径', ['保存：完整目标、条件、作用范围、频率、结束策略、版本', '当前 Goal 链与建设中 Task 架构必须分开标记', '等待不等于失败；触发命中也不等于目标完成'], { fill: C.sand, stroke: C.amber });
card('GOAL', 1450, 7570, 620, 230, '【当前】Goal / Advisor / Trigger', ['目标队列更新工具：新增 / 删除；修改、暂停恢复仍有缺口', 'Goal List 是共享看板，不是执行器', '静态 / 动态 Advisor 只产生建议输入，最终裁决仍是 Planner', 'Trigger 监听时间 / 状态 / 事件 / 视觉条件，命中后回调'], { fill: C.sand, stroke: C.amber });
card('TASK', 2110, 7570, 620, 300, '【建设中】Task Service 生命周期', ['Task Agent：入口与透传，不是第二个 Planner', 'Task Service：任务 / Run / Event / Action / Binding 唯一事实', '状态：等待→运行→完成 / 失败 / 取消 / 过期 / 离线', '可靠发件箱：待发→已发→已确认；失败重试 / 死信', 'task_id / run_id / callback_id / action_id 贯穿'], { fill: C.wipBg, stroke: C.wip, dash: '10 8' });
card('TRIGGER', 2780, 7570, 640, 325, 'Trigger 条件命中链', ['信号：时间、车态、导航、驾驶、视觉、车辆生命周期', '治理：值 / 单位 / 时间 / 来源 / 置信度 / 有效期', '求值：数值、状态变化、时间窗、组合、语义匹配', '防抖 / 迟滞 / 边沿检测；去重 / 冷却 / 最大次数', '命中生成回调证据＋规则版本＋任务编号；否则继续等待', '禁止 Trigger 直接调用工具或把命中当完成'], { fill: C.sand, stroke: C.amber });
card('RUN', 2780, 7935, 640, 250, '回调后的运行门禁', ['恢复任务与当前版本：重复 / 关闭 / 旧版本则拒绝', '同一 callback_id 只建一次 Run；重读最新权限与安全状态', '已保存的确定性动作→统一调度；需要最新环境重判→统一输入', '不通过→跳过 / 等待并保留可恢复证据；不伪装成功'], { fill: C.sage, stroke: C.sageLine });
card('CALLBACK_IN', 1450, 8070, 620, 210, '需要重新判断的任务回调', ['条件 / 持续任务、外部结果或环境变化转成 event / advisor / tool_feedback', '回统一输入治理→重建 Context→同一 Planner→新 action_list', '只有“创建时已保存的确定性动作”才可在运行门禁后直接调度'], { fill: C.pale, stroke: C.blue });
card('TR_WAIT', 3480, 7570, 640, 200, '未命中 / 未知 → 保持等待', ['不创建 Run，不调用工具；Goal / Task 继续等待', '写入求值结果、时间、规则版本与“未知”原因', '必要时调整采样或请求补充，但不得伪装命中'], { fill: C.sand, stroke: C.amber });
card('RUN_FAIL', 3480, 7935, 640, 250, '运行门禁不通过', ['旧版本 / 已关闭 / 重复回调→拒绝或丢弃', '最新权限、安全、人物、网络不满足→跳过 / 等待', '形成失败 / 跳过证据并回标准反馈；不得直接消失'], { fill: C.riskBg, stroke: C.risk });
card('VLM1', 80, 7350, 1240, 185, 'VLM ① 本轮按需视觉问答', ['Planner→视觉问答工具→摄像头取帧 / 权限→结构化描述→tool_feedback', '它属于 27 工具中的 visual_qa，必须回统一反馈，不直接修改目标'], { fill: C.pale, stroke: C.blue });
card('VLM2', 80, 7570, 1240, 185, 'VLM ② 默认常驻视觉', ['默认主题→端侧周期采样→通用摘要→按来源 / 时间 / 有效期进入 Context', '这是背景事实，不等于用户条件任务；是否上线与覆盖范围要按版本验真'], { fill: C.pale, stroke: C.blue });
card('VLM3', 80, 7790, 1240, 210, 'VLM ③ 动态长时观察', ['动态目标→全量观察清单＋版本→端侧周期取帧→客观观察报告', '报告携带任务号 / 描述 / 置信度 / 时间→恢复原条件→Trigger 语义匹配', '是→任务回调；否 / 未知→继续等待；禁止直接进 Context 或执行工具'], { fill: C.pale, stroke: C.blue });
card('SCHED', 2780, 8370, 640, 180, '统一运行调度器', ['即时路径、触发回调、专用 Agent 都回到这里', '输入：通过门禁的工具名＋参数＋作用对象＋追踪编号', '它不擅改 Task 生命周期；只调度一次可观测运行'], { fill: C.sage, stroke: C.sageLine, titleSize: 22 });

connect('TSPLIT', 'IMM', { from: 'right', to: 'top', label: '否：即时' });
connect('TSPLIT', 'PER', { from: 'left', to: 'top', color: C.amber, label: '是：持久' });
connect('PER', 'GOAL'); connect('PER', 'TASK', { from: 'right', to: 'left', color: C.wip, dash: '10 8', label: '目标架构' });
connect('GOAL', 'TRIGGER', { from: 'right', to: 'left', color: C.amber, label: '规则 / 订阅' });
connect('TASK', 'TRIGGER', { from: 'right', to: 'left', color: C.wip, dash: '10 8', label: '任务绑定' });
connect('TRIGGER', 'RUN');
connect('TRIGGER', 'TR_WAIT', { from: 'right', to: 'left', color: C.amber, dash: '10 8', label: '否 / 未知' });
connect('RUN', 'SCHED', { label: '已保存的确定性动作' });
connect('RUN', 'CALLBACK_IN', { from: 'left', to: 'right', color: C.blue2, label: '需结合最新环境重判' });
connect('RUN', 'RUN_FAIL', { from: 'right', to: 'left', color: C.risk, dash: '10 8', label: '不通过' });
connect('IMM', 'SCHED');
route([anchor('GOAL', 'left'), [1380, 7685], [1380, 3300], anchor('I0', 'left')], { color: C.amber, width: 2, dash: '10 8', label: 'Advisor 建议→统一输入', labelAt: [1380, 7080] });
route([anchor('VLM2', 'right'), [1360, 7660], [1360, 4440], anchor('SNAP', 'left')], { color: C.blue2, width: 2, dash: '10 8', label: '默认观察→Context', labelAt: [1360, 7240] });
connect('VLM3', 'TRIGGER', { from: 'right', to: 'left', color: C.blue2, dash: '10 8', label: '视觉报告' });
route([anchor('CALLBACK_IN', 'left'), [1330, 8175], [1330, 3300], anchor('I0', 'left')], { color: C.blue2, width: 3, label: '任务回调作为新输入', labelAt: [1330, 6940] });

stage(8650, '06', '27 个工具、真实执行与状态回读', '工具不是名称清单：每个都有输入、机制、输出证据和门禁；全部从统一路由进入并汇回统一结果。');

card('X0', 2780, 8780, 640, 200, '工具节点与能力路由', ['tool_name＋params＋作用对象＋request / turn / action 关联编号', '能力目录：豆包 / 车端 / 生态 / 对话服务 / 动态注册 Agent', '协议适配后交给真实执行方；注册 Agent 也不能绕过门禁'], { fill: C.sage, stroke: C.sageLine });
connect('SCHED', 'X0');

// Tool buses: every visible tool is physically connected from the shared input bus to the shared result bus.
route([[120, 9070], [4080, 9070]], { color: C.blue, width: 4, arrow: false, label: '根据 tool_name 选择一个或多个工具（依赖动作分轮调用）', labelAt: [2100, 9046] });
route([anchor('X0', 'bottom'), [3090, 9070]], { color: C.blue, width: 4, arrow: false });

const tools = [
  ['01', '基础车控', 'vehicle_basic_control', '入：窗 / 空调 / 座椅 / 灯 / 锁及目标值', '机：座位＋最新车况→车控协议→车端', '证：执行回执＋物理状态回读', '门：车型 / 权限 / 档位车速；不支持开关车门'],
  ['02', '车载系统设置', 'vehicle_system_settings', '入：蓝牙 / 网络 / 屏幕 / 声音 / 账号 / 应用', '机：定位设置项→改值或打开页面', '证：设置值或页面状态', '门：系统权限与模式；K 歌设置走这里'],
  ['03', '车载通信', 'vehicle_communication', '入：拨打 / 接听 / 挂断电话或视频', '机：联系人解析→歧义补问→通信服务', '证：通话阶段与失败原因', '门：仅主驾；联系人不清先确认；不支持短信'],
  ['04', '辅助驾驶控制', 'auto_drive', '入：泊入 / 泊出 / 贴边 / 循迹 / 巡航 / 变道', '机：安全前置→智驾服务→端态呈现', '证：可用性、运行阶段与终态', '门：运行设计域、档位车速、驾驶员确认'],
  ['05', '氛围灯控制', 'ambient_light_control', '入：开关 / 颜色 / 亮度 / 模式 / 参考物', '机：解析颜色与区域→灯光服务→回读', '证：实际灯光状态', '门：车型、区域、模式冲突；取色内部处理'],
  ['06', '导航过程控制', 'navi_basic_control', '入：开始 / 结束 / 视图 / 播报 / 偏好', '机：操作已经存在的导航会话', '证：控制结果＋当前导航阶段', '门：不找新地点；不与地点搜索 / 路线规划并发'],
  ['07', '当前媒体控制', 'media_basic_control', '入：暂停 / 切歌 / 收藏 / 倍速 / 清晰度', '机：操作当前媒体会话', '证：播放 / 界面状态', '门：须有可操作媒体；点播、预约、K 歌另走'],
  ['08', '车辆实时状态查询', 'vehicle_status_search', '入：温度 / 门窗 / 胎压 / 车速 / 续航 / 媒体', '机：读取最新车辆快照', '证：值＋采集时间＋不可用原因', '门：校验车辆与新鲜度；旧对话不冒充实时'],
  ['09', '天气查询', 'weather_search', '入：地点×时间；当前 / 目的地 / 沿途', '机：在线天气与预警', '证：对应时空的天气事实', '门：位置时间明确；陈旧结果不复用'],
  ['10', '地点与商家搜索', 'poi_search', '入：附近 / 中点 / 顺路、品类与筛选', '机：搜索→筛选→排序', '证：地点 / 距离 / 营业 / 评分', '门：不直接完成精确导航；沿途依赖已有路线'],
  ['11', '联网信息搜索', 'web_search', '入：新闻、日期、开放域实时问题', '机：检索→打开原始来源→核验', '证：事实＋来源＋时间', '门：摘要只作线索；无原证据不补事实'],
  ['12', '用车报告查询', 'car_log', '入：时间窗 / 行程 / 报告类型', '机：查询能耗与通勤历史', '证：对应周期报告', '门：不是实时车况；时间与车辆归属明确'],
  ['13', '车辆说明书问答', 'vehicle_manual_qa', '入：功能 / 硬件 / 教程 / 技巧', '机：检索当前车型说明', '证：步骤、适用范围与边界', '门：不替代实时状态；车型版本不匹配要提示'],
  ['14', '车况维养问答', 'car_care_qa', '入：保养 / 保险 / 权益 / 维修', '机：按绑定车辆查询长期车务', '证：维养与权益信息', '门：绑定正确；实时状态不走这里'],
  ['15', '当前视觉问答', 'visual_qa', '入：车内外当前可见人 / 物 / 场景', '机：选视角→取帧→识别→结构化', '证：目标 / 位置 / 描述 / 置信度', '门：只说视角内事实；屏幕 / 外部知识另走'],
  ['16', '用户记忆查询', 'user_memory_search', '入：事实 / 偏好 / 经历', '机：按身份、作用域和隐私检索', '证：命中、歧义、未找到或无权限', '门：身份不确定限制读取；空结果禁止臆造'],
  ['17', '路线规划并发起导航', 'route_planning', '入：精确目的地 / 途经点 / 偏好', '机：确认地点→规划→选方案→发起导航', '证：路线 / 预计时间 / 启动状态', '门：模糊先补清；与地点搜索 / 导航控制串行'],
  ['18', '视频搜索并播放', 'video_search', '入：名称 / 主题 / 类型 / 平台', '机：搜索→匹配→启动播放', '证：实际视频＋播放状态', '门：匹配成功不等于播放成功；校验版权 / 平台'],
  ['19', '音乐搜索并播放', 'music_search', '入：歌曲 / 歌手 / 情绪 / 场景 / 类型', '机：搜索并默认播放首条', '证：实际首播曲目＋播放状态', '门：复杂知识先联网查；不再重复媒体播放'],
  ['20', '播客搜索并播放', 'broadcast_search', '入：节目 / 有声资源 / 名称 / 控制', '机：搜索现有内容→选择→播放', '证：节目 / 集数 / 播放状态', '门：与生成新播客分开；候选与首播都回传'],
  ['21', '人脸身份注册', 'face_id_register', '入：明确姓名＋座位＋注册意图', '机：采集→质量校验→绑定人脸身份', '证：注册 / 更新 / 重试状态', '门：姓名和位置缺一不可；防错人误注册'],
  ['22', '用户记忆写入', 'user_memory_operate', '入：事实 / 偏好 / 纠正 / 删除', '机：不确定先确认；按身份增改删', '证：写入、覆盖或删除结果', '门：错用户零容忍；推断 / 临时状态不存事实'],
  ['23', '持续目标管理', 'goal_list_update', '入：新增 / 删除持续、条件、定时目标', '机：查重→建目标编号与状态→后续注入', '证：目标编号与当前状态', '门：Goal 不是执行器；顾问不得擅自建目标'],
  ['24', '人工智能播客生成', 'ai_broadcast_generate', '入：主题 / 风格 / 长度', '机：受理→排队→生成', '证：任务状态＋可播放音频', '门：受理不等于完成；必须等产物 / 回调'],
  ['25', '图片生成与编辑', 'image_generate', '入：文生图 / 图生图＋描述 / 编辑', '机：受理→生成→保存 / 推送', '证：图片、地址与最终状态', '门：无产物不报完成；隐私图片需授权'],
  ['26', '录音纪要', 'audio_record', '入：开始 / 停止 / 查看', '机：空闲→录音→停止→生成纪要→查看', '证：录音状态＋纪要产物', '门：权限 / 隐私 / 中断恢复；开始不等于纪要完成'],
  ['27', '停车缴费', 'parking_fee_pay', '入：请求＋车牌 / 车辆', '机：确认车牌→查订单→金额 / 付款地址→展示', '证：订单、金额、付款页与支付回调', '门：车牌金额确认；订单幂等；付款页不等于成功'],
];

const toolPos = [];
const toolStartY = 9140;
const toolXs = [80, 1100, 2120, 3140];
tools.forEach((t, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = toolXs[col];
  const y = toolStartY + row * 252;
  const id = `TOOL${t[0]}`;
  card(id, x, y, 920, 220, `${t[0]}｜${t[1]}（${t[2]}）`, t.slice(3), {
    fill: row % 2 ? C.paper : C.white,
    stroke: col < 2 ? C.blue : C.sageLine,
    titleSize: 19,
    lineSize: 16,
    lastRisk: true,
  });
  toolPos.push({ id, x, y, w: 920, h: 220 });
  route([[x + 460, 9070], [x + 460, y]], { color: C.blue, width: 2, arrow: true });
});

const toolBottomY = toolStartY + 6 * 252 + 220;
route([[120, toolBottomY + 80], [4080, toolBottomY + 80]], { color: C.sageLine, width: 4, arrow: false, label: '27 个工具全部汇回真实执行结果总线', labelAt: [2100, toolBottomY + 56] });
toolPos.forEach(({ x, y, h }) => route([[x + 460, y + h], [x + 460, toolBottomY + 80]], { color: C.sageLine, width: 2, arrow: false }));

const execY = toolBottomY + 150;
card('X1', 2780, execY, 640, 150, '原始执行结果', ['被受理、端侧指令、外部返回、生成产物或错误', '“调用成功”只证明服务层，不证明真实状态'], { fill: C.sage, stroke: C.sageLine });
card('X2', 2780, execY + 190, 640, 170, '真实状态回读', ['设备最终值、导航阶段、实际播放、订单终态、生成产物', '逐工具定义 observed_state；无法回读就明确证据等级'], { fill: C.sage, stroke: C.sageLine });
card('XFAKE', 80, execY, 2600, 360, '四层成功语义与常见假成功', ['① 请求被接收　② 服务调用成功　③ 真实状态生效　④ 用户完整目标完成', '假成功：接口成功就说完成；搜到但没播放；生成已受理但无产物；出现付款页就说已缴费', '原始结果＋真实回读共同进入统一反馈；任何一层都不能越级替代下一层', '工具目录按 9 月 27 项配置；旧快照餐厅订座与停车缴费是版本差异，不应混成第 28 项'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });
card('X3', 3480, execY, 640, 360, '统一结果格式', ['状态：成功 / 失败 / 部分成功 / 超时 / 取消 / 需补信息', '包含：错误码、能否重试、缺失字段、下一步建议', '保留：真实状态、产物、已自播内容、来源与时间', '关联：request / turn / action / task / run / callback 编号', '输出：tool_feedback＋完成证据'], { fill: C.pale, stroke: C.blue, titleSize: 22 });

route([[3090, toolBottomY + 80], [3090, execY]], { color: C.sageLine, width: 4 });
connect('X1', 'X2');
connect('X1', 'X3', { from: 'right', to: 'left', color: C.sageLine });
connect('X2', 'X3', { from: 'right', to: 'left', color: C.sageLine });

stage(11520, '07', 'tool_feedback、再次规划与完成证据门', '每次工具结果都是新的输入；回到同一 Context 和同一 Planner。只有互斥状态门判定后，才继续、等待或收口。');

card('ERR', 80, 11650, 1240, 430, '全链异常归一化', ['输入异常：重听 / 澄清 / 明确拒绝', '上下文异常：刷新状态 / 查事实 / 降级为未知', '决策异常：重新规划、修参数、改串并行', '执行异常：安全重试、换工具、等待、降级或结束', '时序异常：幂等、版本检查、丢弃迟到结果', '统一形成：结果＋错误码＋可否重试＋真实状态＋时间', '异常也必须进入反馈闭环，不能在模块边界静默丢失'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });
card('FB0', 3480, 11650, 640, 230, '形成 tool_feedback', ['它是新的输入事件，不是模型内部隐藏返回值', '包含：工具名、结果、真实状态、错误、产物、时间', '关联：request / turn / action / task / run / callback', '到达后进入统一输入治理，重建 Context，再调同一 Planner'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('TASKUP', 2110, 11650, 620, 230, '任务 / 目标状态写回', ['写回 Task / Run / Action、Goal 进度、端侧状态和已呈现内容', '成功：推进子目标；部分成功：保留已成分支', '等待：回等待态；终态：按策略关闭并清理 Trigger / Binding'], { fill: C.wipBg, stroke: C.wip, dash: '10 8' });
card('CORR', 2780, 11920, 640, 185, '结果关联与迟到保护', ['用 action_id / execution_token 确认这是谁的结果', '同名并发、重复回调、旧版本、取消后迟到结果不得覆盖新状态', '当前若缺 action_id，必须列为高优先级链路缺口'], { fill: C.sage, stroke: C.sageLine });
card('EVID', 2110, 11920, 620, 210, '【目标架构 / 待验真】完成证据聚合', ['聚合必要子目标、真实状态、待执行动作、等待任务与拒绝证据', '确定性形成 done / pending / waiting / failed / canceled 候选状态', '不替代 Planner 语义判断；证据不足时禁止输出“完成”'], { fill: C.sand, stroke: C.amber, dash: '10 8' });
card('STATUS', 2110, 12200, 620, 210, '完整目标当前处于哪种互斥状态？', ['由同一 Planner 基于最新 Context＋完成证据判断', '不能同时“继续执行”又“最终完成”', '空 action_list、模型说完成或单工具成功都不是充分证据'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('ST_PENDING', 760, 12470, 560, 230, '未完成 / 部分成功 / 可恢复失败', ['继续调用、换工具、补槽、追问或安全重试', '保留已成功子目标；生成新的 action_list', '回到同一确定性门禁，再进入执行主链'], { fill: C.pale, stroke: C.blue });
card('ST_WAIT', 1450, 12470, 560, 230, '等待中', ['等待时间、状态、视觉、外部结果或用户补充', '进入 Goal / Task 等待态；Trigger 命中后再恢复', '等待不是完成，也不应反复打扰用户'], { fill: C.sand, stroke: C.amber });
card('ST_DONE', 2110, 12470, 620, 230, '完成', ['所有必要子目标都有真实证据', '没有必需待执行动作；没有等待中的条件 / 任务', '进入最终输出编排，说明什么已经完成'], { fill: C.sage, stroke: C.sageLine });
card('ST_END', 2780, 12470, 640, 230, '失败收口 / 取消 / 过期', ['说明已成功、未成功和原因；给可选补救', '停止危险或无意义重试；清理任务、规则和占用资源', '仍进入输出编排，不伪装成功'], { fill: C.riskBg, stroke: C.risk });

connect('X3', 'FB0');
connect('FB0', 'CORR', { from: 'left', to: 'right', color: C.sageLine });
connect('CORR', 'TASKUP', { from: 'left', to: 'right', color: C.wip, dash: '10 8' });
route([anchor('TASKUP', 'top'), [2420, 11470], [2420, 8020], anchor('TASK', 'bottom')], { color: C.wip, width: 2, dash: '10 8', label: '结果推进 Task / Goal', labelAt: [2420, 11390] });
route([anchor('TASKUP', 'left'), [2050, 11765], [2050, 7900], anchor('GOAL', 'right')], { color: C.amber, width: 2, dash: '10 8', label: '当前 Goal 进度 / 关闭', labelAt: [2050, 11440] });
route([anchor('TR_WAIT', 'bottom'), [3800, 11490], [2550, 11490], anchor('TASKUP', 'top')], { color: C.amber, width: 2, dash: '10 8', label: '等待状态证据', labelAt: [3310, 11466] });
connect('CORR', 'EVID', { from: 'left', to: 'right', color: C.amber, dash: '10 8', label: '真实结果证据' });
connect('TASKUP', 'EVID', { color: C.amber, dash: '10 8', label: '任务与目标证据' });

// The real feedback loop returns to the original input-governance node, so it cannot be mistaken for a second Planner.
route([anchor('FB0', 'right'), [4160, 11765], [4160, 3290], [2035, 3290], anchor('I0', 'right')], { color: C.sageLine, width: 4, label: '第 2 / N 轮：反馈回统一输入', labelAt: [3760, 11480] });
route([anchor('POUT', 'right'), [3430, 5805], [3430, 11890], [2420, 11890], anchor('EVID', 'top')], { color: C.blue, width: 3, label: '输入为 feedback 或无需动作时', labelAt: [3430, 11620] });
connect('EVID', 'STATUS', { color: C.amber, dash: '10 8', label: '完成状态候选＋证据' });

connect('STATUS', 'ST_PENDING', { from: 'left', to: 'top', label: '继续' });
connect('STATUS', 'ST_WAIT', { from: 'left', to: 'top', color: C.amber, label: '等待' });
connect('STATUS', 'ST_DONE', { label: '完成', color: C.sageLine });
connect('STATUS', 'ST_END', { from: 'right', to: 'top', color: C.risk, label: '收口' });
route([anchor('ST_PENDING', 'bottom'), [1040, 12820], [2050, 12820], [2050, 6280], anchor('V1', 'left')], { color: C.blue, width: 3, label: '新 action_list 再过门禁', labelAt: [1550, 12796] });
route([anchor('ST_WAIT', 'left'), [1380, 12585], [1380, 7460], anchor('PER', 'left')], { color: C.amber, width: 3, dash: '10 8', label: '保存等待条件', labelAt: [1380, 12380] });
route([anchor('UERR', 'right'), [4090, 710], [4090, 11790], anchor('ERR', 'right')], { color: C.risk, width: 2, dash: '10 8', label: '异常总线', labelAt: [4090, 11150] });
route([anchor('VGATE_FAIL', 'right'), [4080, 6650], [4080, 11900], anchor('ERR', 'right')], { color: C.risk, width: 2, dash: '10 8', label: '门禁标准结果', labelAt: [4080, 11320] });
route([anchor('RUN_FAIL', 'right'), [4120, 8060], [4120, 11765], anchor('FB0', 'right')], { color: C.risk, width: 2, dash: '10 8', label: '跳过 / 失败证据', labelAt: [4120, 11190] });
connect('ERR', 'FB0', { from: 'right', to: 'left', color: C.risk, width: 3, label: '标准反馈' });

stage(13080, '08', '四路输出与用户真实感知', '语音、界面、形象和实体结果分别取证；最终必须一致，不能靠一句“搞定”掩盖未完成。');

card('O0', 2110, 13210, 1280, 220, '本轮输出编排', ['明确：已完成什么、还在等待什么、失败或取消了什么', '组织 talk_content、任务 / 工具状态、形象动作与可操作卡片', '用户可见承诺必须与真实状态和任务事实一致'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('O1', 80, 13480, 920, 230, '语音路', ['回复内容→语音合成→扬声器', '证据：首音、播报完成、被打断', '播报完成不等于实体动作完成；被打断不等于取消动作'], { fill: C.white, stroke: C.blue });
card('O2', 1100, 13480, 920, 230, '界面路', ['回复 / 进度→即时卡、智能条、任务中心', '证据：展示、点击、关闭、超时与结果回调', '任务中心负责入口 / 列表 / 启停 / 展示，不维护事实生命周期'], { fill: C.white, stroke: C.blue });
card('O3', 2120, 13480, 920, 230, '形象路', ['emoji_id / 动作→机器人、头像、圆屏、云台、口型', '证据：端侧接收与真实呈现', '形象字段缺失或版本不支持时必须安全降级'], { fill: C.white, stroke: C.blue });
card('O4', 3140, 13480, 920, 230, '已发生实体结果 / 状态证据呈现', ['真实执行只发生在前面的工具 / 执行器层；这里不再下发动作', '向用户呈现：车辆状态、导航阶段、订单终态或最终产物', '语音与实体状态冲突时，以真实状态为准并纠正话术'], { fill: C.white, stroke: C.sageLine });
card('O5', 80, 13770, 3980, 220, '用户最终感知：听到、看到、车辆或服务真的发生', ['完成必须同时满足：完整目标有证据、无必要待动作、无等待中的任务 / 条件', '最终验收看多路一致性：语音、界面、形象、实体状态不能各说各话', '用户新请求从语音入口重新进入；停止播报、取消工具、取消 Task 是三个不同动作'], { fill: C.sage, stroke: C.sageLine, titleSize: 24 });

connect('ST_DONE', 'O0'); connect('ST_END', 'O0', { from: 'bottom', to: 'right', color: C.risk });
connect('O0', 'O1', { from: 'left', to: 'top' }); connect('O0', 'O2', { from: 'bottom', to: 'top' }); connect('O0', 'O3', { from: 'bottom', to: 'top' }); connect('O0', 'O4', { from: 'right', to: 'top', color: C.sageLine });
connect('O1', 'O5'); connect('O2', 'O5'); connect('O3', 'O5'); connect('O4', 'O5', { color: C.sageLine });
route([anchor('VUI', 'right'), [4120, 1045], [4120, 13595], anchor('O1', 'right')], { color: C.amber, width: 2, dash: '10 8', label: '播报 / 打断状态', labelAt: [4120, 13020] });
route([anchor('RAUTH', 'right'), [4140, 1738], [4140, 13320], anchor('O0', 'right')], { color: C.risk, width: 2, dash: '10 8', label: '认证提示' , labelAt: [4140, 12950] });
route([anchor('RREJECT', 'right'), [4100, 2480], [4100, 13290], anchor('O0', 'right')], { color: C.risk, width: 2, dash: '10 8', label: '拒识 / 澄清输出', labelAt: [4100, 12880] });

stage(14100, '09', '指标、归因与产品经理掌握度', '指标由同一追踪链聚合；先证明链路事实，再判断是不是 AI 能力问题。');

// Trace bus ties every stage to the metric layer instead of leaving metrics as an isolated appendix.
route([[4060, 1200], [4060, 14420]], { color: C.blue2, width: 3, arrow: false, dash: '12 8' });
['U5','R7','SNAP','POUT','V5','X3','FB0','O5'].forEach((id, idx) => {
  const [sx, sy] = anchor(id, 'right');
  route([[sx, sy], [4060, sy]], { color: C.blue2, width: 2, arrow: false, dash: '8 8', label: idx === 0 ? '全链 Trace' : '' });
});
card('TRACE', 3480, 14240, 640, 360, '全链追踪主键与事件', ['请求编号 request_id → 轮次编号 turn_id → 动作编号 action_id → 工具名 tool_name', '任务 / 运行 / 回调 / 执行令牌编号', '工具反馈 tool_feedback → 真实状态 actual_state → 呈现事件', '完整目标状态：继续 / 等待 / 完成 / 失败 / 取消', '缺失字段必须明确标“协议缺口”，不能伪装已实现'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
route([[4060, 14220], anchor('TRACE', 'right')], { color: C.blue2, width: 3 });

const kpis = [
  ['K1', '1｜语音输入', '误 / 漏唤醒；语义字错；否定 / 数字 / 时间 / 地点保真；早截 / 尾噪；说话人 / 座位；输入时延'],
  ['K2', '2｜路由与拒识', '端侧命中；复杂上云召回；误拒 / 漏拒；双执行；迟到覆盖；高风险误放行=0'],
  ['K3', '3｜Context 与记忆', '必要事实覆盖；陈旧率；来源 / 时间 / 有效期；冲突裁决；记忆命中；隐私越权=0；输入长度'],
  ['K4', '4｜AI 决策规划', '意图 / 分型；工具参数；原子拆解；依赖；首动作；澄清；失败重规划；稳定性；完整目标成功'],
  ['K5', '5｜工具与执行', '接收 / 调用 / 生效 / 完成四段成功；超时 / 重试 / 取消；幂等；重复副作用；真实回读'],
  ['K6', '6｜长期任务与主动服务', '创建；孤儿规则；误 / 漏 / 重复触发；触发延迟；取消清理；重启恢复；视觉匹配；打扰率'],
  ['K7', '7｜端到端体验与安全', '完整任务可用率；复合目标全成；首确认 / 首动作 / 总耗时；部分失败恢复；虚假成功；多路一致；安全事故'],
];
const kpiPos = [[80,14630],[2110,14630],[80,14880],[2110,14880],[80,15130],[2110,15130],[80,15380]];
kpis.forEach((k, i) => card(k[0], kpiPos[i][0], kpiPos[i][1], i === 6 ? 3980 : 1950, 210, k[1], [k[2], '口径必须绑定：分母、车型、版本、场景、样本量、时间窗'], { fill: C.white, stroke: C.blue, titleSize: 21 }));
route([anchor('TRACE', 'bottom'), [3800, 14600], [2070, 14600]], { color: C.blue2, width: 3, label: '聚合指标' });

card('RCA', 80, 15640, 3980, 430, 'Badcase 归因门：按证据顺序排查', ['① 是否走对模块？否＝分流 / 链路问题', '② 工具定义、能力、参数和版本是否清楚？否＝工具契约问题', '③ 必要事实是否采到并进入快照？否＝Context 采集 / 治理问题', '④ 模型看到的事实是否正确且无冲突？否＝注入 / 提示词问题', '⑤ 信息完整仍理解错目标、工具、参数或依赖？是＝AI 决策能力问题', '⑥ 动作是否下发、执行、回读并正确关联？否＝执行 / 协议问题', '⑦ 新 feedback 后能否恢复、继续并收口？否＝工程时序 / 再规划问题'], { fill: C.sand, stroke: C.amber, titleSize: 23 });
connect('TRACE', 'RCA', { from: 'bottom', to: 'right', color: C.blue2, label: '先拿完整 Trace' });

card('PMQ', 80, 16120, 3980, 440, '产品经理评审十问', ['1 完整用户目标和分母是什么？　2 系统此刻已知 / 未知什么？', '3 为什么走这条路由，如何防端云双执行？　4 为什么选这个工具、参数、作用对象和顺序？', '5 工具“成功”到底是接收、调用、生效还是完整目标完成？', '6 tool_feedback 是否真的回到同一 Context 与 Planner？　7 谁维护依赖、幂等、超时、重试和取消？', '8 长期任务如何创建、更新、暂停、恢复、取消和清理？', '9 顾问 / Trigger / 用户新请求冲突时谁拥有最终裁决权？', '10 一句“搞定”依赖哪条真实证据；是否能用同一 trace_id 一键回放？'], { fill: C.pale, stroke: C.blue, titleSize: 24 });
connect('RCA', 'PMQ');

const levels = [
  ['L0','L0 名词层','能认模块；不能讲输入输出与异常；不足以独立评审'],
  ['L1','L1 链路层','能从语音讲到真实结果，说明责任、输入、判断、输出、失败'],
  ['L2','L2 诊断层','能用一条 Trace 区分输入、路由、Context、模型、工具、端侧、时序'],
  ['L3','L3 负责人层','能定义测试集、指标与阈值，推动跨模块修复并证明收益'],
  ['L4','L4 架构策略层','能取舍端云、模型 / 规则、质量 / 时延 / 成本，建立平台治理'],
];
levels.forEach((l, i) => card(l[0], 80 + i * 804, 16620, 764, 220, l[1], [l[2]], { fill: i < 2 ? C.white : C.sage, stroke: i < 2 ? C.line : C.sageLine, titleSize: 21 }));
for (let i = 0; i < levels.length - 1; i++) connect(levels[i][0], levels[i+1][0], { from: 'right', to: 'left', color: C.blue2, label: i === 1 ? '目标基线' : '' });

card('OUTCOME', 760, 16900, 2700, 240, '两年内应形成的硬成果', ['至少达到 L2：独立定位跨链 badcase；选择一个核心方向做到 L3', '交付：一套可复用评测集＋一次跨链路机制改造＋量化收益＋明确风险边界', 'AI 能力最重要，但只有在输入、Context、工具、执行与反馈证据都可信后，模型能力才可被单独衡量'], { fill: C.sage, stroke: C.sageLine, titleSize: 24 });
connect('L3', 'OUTCOME');

card('BOUNDARY', 80, 17200, 3980, 330, '责任边界：谁负责、在哪里做、输入输出、失败处理', ['产品：定义完整目标、场景分母、协议口径、验收指标、异常策略与结论；推动跨团队闭环', '模型 / 算法：理解、拆解、工具选择、参数、依赖、再规划、稳定性与安全对齐', '平台 / 服务端：输入治理、Context、路由、门禁、Task 生命周期、幂等、追踪与恢复', '车端 / 生态：真实执行、状态回读、能力版本、端上资源、安全约束和外部结果', '测试：场景集、回放、回归、跨车型 / 网络 / 多人多轮验证；线上监控给真实分母'], { fill: C.white, stroke: C.blue, titleSize: 23 });

rect(40, 17580, 4120, 960, C.white, C.line, 1.5, 16);
text(70, 17625, '颜色与连线', 22, 800, C.ink);
pill(70, 17655, 460, '钴蓝粗线：同步主链 / 下发');
pill(550, 17655, 480, '绿色：真实结果与 feedback 回流', C.sage, C.sageLine, C.sageLine);
pill(1050, 17655, 470, '琥珀：等待 / Trigger / 版本门', C.sand, C.amber, C.amber);
pill(1540, 17655, 420, '紫虚线：建设中 Task', C.wipBg, C.wip, C.wip);
pill(1980, 17655, 420, '红虚线：异常 / 拒绝', C.riskBg, C.risk, C.risk);
text(70, 17740, '最短复述主链', 22, 800, C.ink);
text(70, 17780, '用户发声 → 唤醒 / ASR → 统一请求 → 接入与端云裁决 → 输入治理 / Context → Planner / Director', 18, 650, C.blue2);
text(70, 17815, '→ action_list → 确定性门禁 → 即时或 Goal / Task / Trigger → 27 工具 / Agent → 真实执行与回读', 18, 650, C.blue2);
text(70, 17850, '→ tool_feedback → 回同一输入治理 / Context / Planner → 继续 / 等待 / 完成 / 失败取消 → 四路输出 → 用户结果', 18, 650, C.sageLine);

// Bottom acceptance checklist makes the board self-verifying without introducing a disconnected report panel.
text(70, 17910, '画板验收', 22, 800, C.ink);
const checks = [
  '从“用户发声”沿粗线可走到“用户最终感知”',
  '登录失败、拒识、Direct、端侧快路、云 FC、Planner 各有真实去向',
  '27 个工具全部接统一输入总线并汇回结果总线',
  'feedback 实际连回原统一输入、Context 与同一 Planner',
  '继续 / 等待 / 完成 / 失败取消为互斥出口',
  '默认 VLM→Context；动态 VLM→Trigger；按需 VLM→visual_qa',
  'Goal / Advisor / Trigger 与建设中 Task Service 分开标状态',
  '语音、界面、形象、实体结果分别取证后才汇成用户结果',
];
checks.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 90 + col * 2000;
  const y = 17965 + row * 70;
  rect(x, y, 28, 28, C.sage, C.sageLine, 1.5, 6);
  text(x + 14, y + 21, '✓', 18, 800, C.sageLine, 'middle');
  text(x + 44, y + 22, c, 16, 600, C.ink);
});

// Explicit on-demand VLM-to-tool edge, drawn after TOOL15 exists.
route([anchor('VLM1', 'right'), [1360, 7442], [1360, 9520], [anchor('TOOL15', 'left')[0], anchor('TOOL15', 'left')[1]], anchor('TOOL15', 'left')], { color: C.blue2, width: 2, dash: '10 8', label: '按需视觉调用 TOOL15', labelAt: [1360, 8990] });

// Finish document.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L12,6 L0,12 Z" fill="context-stroke"/>
    </marker>
  </defs>
  <g id="edges">${edgeSvg.join('')}</g>
  <g id="nodes">${nodeSvg.join('')}</g>
  <g id="labels">${overlaySvg.join('')}</g>
</svg>`;

await writeFile(output, svg, 'utf8');
console.log(JSON.stringify({ output, width: W, height: H, cards: nodes.size, connectors: edgeSvg.filter(x => x.includes('<polyline')).length, toolCount: tools.length }, null, 2));
