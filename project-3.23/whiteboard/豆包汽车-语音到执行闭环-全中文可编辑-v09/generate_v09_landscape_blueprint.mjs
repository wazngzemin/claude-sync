import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('./diagram-v09-landscape-blueprint.svg', import.meta.url));
const toolSource = fileURLToPath(new URL('../豆包汽车-语音到执行闭环-全中文可编辑-v08/generate_v08_final_flow.mjs', import.meta.url));
const W = 18000;
const H = 7600;

const C = {
  bg: '#ECECEC', ceramic: '#F4F2EE', paper: '#F8F7F3', paper2: '#F2F4F6', white: '#FFFFFF',
  ink: '#17324D', muted: '#52687B', blue: '#185DB7', blue2: '#0D4FA8', pale: '#EAF2FD',
  sage: '#E8F2EA', sageLine: '#4E8A68', sand: '#F6F0E2', amber: '#A96D14',
  risk: '#B84B4B', riskBg: '#FBECEC', wip: '#7B6B9A', wipBg: '#F1EDF7', line: '#B8C3CC',
};

const esc = value => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&apos;');

const bgSvg = [];
const edgeSvg = [];
const nodeSvg = [];
const overlaySvg = [];
const nodes = new Map();
let textCount = 0;

function text(x, y, value, size = 20, weight = 500, fill = C.ink, anchor = 'start', layer = nodeSvg) {
  layer.push(`<text x="${x}" y="${y}" font-size="${size}px" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`);
  textCount += 1;
}

function rect(x, y, w, h, fill = C.white, stroke = C.line, sw = 1.5, rx = 12, layer = nodeSvg, dash = '') {
  layer.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
}

function circle(x, y, r, fill = C.blue, stroke = C.blue, sw = 1, layer = nodeSvg) {
  layer.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
}

function units(value) {
  let total = 0;
  for (const ch of String(value)) total += /[\u0000-\u00ff]/.test(ch) ? 0.56 : 1;
  return total;
}

function wrap(value, maxUnits) {
  const source = String(value);
  if (units(source) <= maxUnits) return [source];
  const out = [];
  let part = '';
  let used = 0;
  for (const ch of source) {
    const u = /[\u0000-\u00ff]/.test(ch) ? 0.56 : 1;
    if (used + u > maxUnits && part) {
      out.push(part);
      part = ch;
      used = u;
    } else {
      part += ch;
      used += u;
    }
  }
  if (part) out.push(part);
  return out;
}

function card(id, x, y, w, h, titleValue, lines = [], opts = {}) {
  const {
    fill = C.white, stroke = C.line, sw = 1.5, dash = '', titleFill = C.ink,
    titleSize = 24, lineSize = 20, lineGap = 27, maxTitleUnits, maxLineUnits,
    badge = '', lastRisk = false,
  } = opts;
  rect(x, y, w, h, fill, stroke, sw, 12, nodeSvg, dash);
  if (badge) {
    const bw = Math.max(92, units(badge) * 20 + 30);
    rect(x + w - bw - 14, y + 12, bw, 32, stroke, stroke, 1, 8);
    text(x + w - bw / 2 - 14, y + 35, badge, 18, 750, C.white, 'middle');
  }
  const titleMax = maxTitleUnits ?? Math.max(12, (w - 32) / (titleSize * 0.95));
  const titleLines = wrap(titleValue, titleMax).slice(0, 2);
  titleLines.forEach((line, index) => text(x + 16, y + 34 + index * 27, line, titleSize, 780, titleFill));
  const lineMax = maxLineUnits ?? Math.max(12, (w - 32) / lineSize);
  const body = lines.flatMap(line => wrap(line, lineMax));
  const startY = y + (titleLines.length > 1 ? 82 : 67);
  body.forEach((line, index) => text(x + 16, startY + index * lineGap, line, lineSize, 500,
    lastRisk && index >= body.length - 1 ? C.risk : C.muted));
  const usedBottom = startY + Math.max(0, body.length - 1) * lineGap + 12;
  if (usedBottom > y + h - 10) throw new Error(`Text overflow in ${id}: ${usedBottom} > ${y + h - 10}`);
  nodes.set(id, { x, y, w, h });
  return id;
}

function anchor(id, side = 'right') {
  const n = nodes.get(id);
  if (!n) throw new Error(`Unknown node: ${id}`);
  if (side === 'left') return [n.x, n.y + n.h / 2];
  if (side === 'right') return [n.x + n.w, n.y + n.h / 2];
  if (side === 'top') return [n.x + n.w / 2, n.y];
  if (side === 'bottom') return [n.x + n.w / 2, n.y + n.h];
  return [n.x + n.w / 2, n.y + n.h / 2];
}

function route(points, opts = {}) {
  const { color = C.blue, width = 3, dash = '', arrow = true, label = '', labelAt = null } = opts;
  edgeSvg.push(`<polyline points="${points.map(point => point.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`);
  if (label) {
    const p = labelAt ?? points[Math.floor(points.length / 2)];
    const lw = Math.max(96, units(label) * 22 + 34);
    rect(p[0] - lw / 2, p[1] - 22, lw, 40, C.white, color, 1, 8, overlaySvg);
    text(p[0], p[1] + 7, label, 20, 700, color, 'middle', overlaySvg);
  }
}

function hconnect(a, b, opts = {}) {
  const from = anchor(a, opts.from ?? 'right');
  const to = anchor(b, opts.to ?? 'left');
  const via = opts.via ?? (Math.abs(from[1] - to[1]) < 2 ? [] : [[(from[0] + to[0]) / 2, from[1]], [(from[0] + to[0]) / 2, to[1]]]);
  route([from, ...via, to], opts);
}

function vconnect(a, b, opts = {}) {
  const from = anchor(a, opts.from ?? 'bottom');
  const to = anchor(b, opts.to ?? 'top');
  const via = opts.via ?? (Math.abs(from[0] - to[0]) < 2 ? [] : [[from[0], (from[1] + to[1]) / 2], [to[0], (from[1] + to[1]) / 2]]);
  route([from, ...via, to], opts);
}

function stageHeader(x, w, num, titleValue, subtitle) {
  rect(x, 250, w, 150, C.white, C.blue, 1.5, 10, bgSvg);
  circle(x + 45, 300, 28, C.blue, C.blue, 1, bgSvg);
  text(x + 45, 308, num, 20, 800, C.white, 'middle', bgSvg);
  text(x + 88, 292, titleValue, 28, 800, C.ink, 'start', bgSvg);
  text(x + 88, 334, subtitle, 20, 500, C.muted, 'start', bgSvg);
}

rect(0, 0, W, H, C.bg, C.bg, 0, 0, bgSvg);
rect(80, 40, 17840, 170, C.blue2, C.blue2, 0, 18, bgSvg);
text(130, 105, '豆包汽车｜语音用户请求到真实结果｜横向单主链业务架构图', 52, 850, C.white, 'start', bgSvg);
text(130, 162, '从语音输入逐步下沉到真实执行；所有结果沿唯一 feedback 回路回到同一 Context 与同一 Planner。', 24, 550, C.white, 'start', bgSvg);

const stages = [
  [420,1230,'01','语音输入','声音→统一请求'], [1650,2400,'02','端云路由','候选→唯一裁决'],
  [4050,2400,'03','Context','输入治理→事实快照'], [6450,1800,'04','Planner / Director','理解→规划→候选动作'],
  [8250,2700,'05','门禁与长期任务','确定性校验→即时/持久'], [10950,4700,'06','27 工具与执行','统一 IN/OUT 总线'],
  [15650,1250,'07','反馈与完成门','结果→feedback→互斥状态'], [16900,1020,'08','输出与用户感知','语音/界面/形象/实体'],
];
stages.forEach(stage => stageHeader(...stage));

const lanes = [
  [430,750,'用户 / VUI','发声、打断、输出与最终感知'], [1180,980,'车端感知 / 快路','声学、ASR、端侧模型、VLM'],
  [2160,1380,'云端接入 / Context','接入、事实、记忆、动态知识'], [3540,1580,'AI 决策 / 长期任务','Planner、Goal、Task、Trigger'],
  [5120,1530,'工具 / 真实执行','27 工具、车端与生态能力'], [6650,870,'反馈 / 验收 / 指标','tool_feedback、完成证据与归因'],
];
lanes.forEach(([y,h,name,sub],index) => {
  rect(80, y, 17840, h, index % 2 ? C.paper2 : C.paper, C.line, 1, 0, bgSvg);
  rect(95, y + 18, 310, 70, C.white, C.blue, 1.3, 10, bgSvg);
  text(250, y + 47, name, 24, 800, C.blue2, 'middle', bgSvg);
  text(250, y + 76, sub, 18, 500, C.muted, 'middle', bgSvg);
});
route([[80,2160],[17920,2160]], { color: C.blue2, width: 2, dash: '12 10', arrow: false });
rect(250, 2138, 310, 42, C.white, C.blue2, 1, 8, overlaySvg);
text(405, 2167, '车端 ↑　端云协议边界　↓ 云端', 20, 750, C.blue2, 'middle', overlaySvg);

// 01 — voice query enters the vehicle and becomes a traceable request.
card('U1', 500, 600, 420, 180, '用户发声', [
  '原始音频＋声区 / 座位', '包含指代、否定、时间、地点', '可能是插话、打断或延续',
], { fill: C.white, stroke: C.blue, lineSize: 20, lineGap: 25 });
card('U2', 970, 580, 540, 230, '唤醒、权限与会话门', [
  '唤醒 / 免唤醒 / 麦克风权限', '播报中判断插话、延续或新目标', '失败必须进入明确出口',
], { fill: C.pale, stroke: C.blue });
card('U3', 970, 1280, 540, 230, '声学前处理', [
  '降噪、回声消除、波束定位', '多人声分离、端点检测、早截断治理', '输出：音频片段＋声区＋时间戳',
], { fill: C.pale, stroke: C.blue });
card('U4', 970, 1570, 540, 250, '语音识别 ASR', [
  '增量文本→最终文本', '保真否定、数字、时间、地点、人名', '输出置信度、起止时间、说话人候选',
], { fill: C.pale, stroke: C.blue });
card('U5', 1560, 2320, 680, 250, '统一用户请求 user_query', [
  'query＋speaker_name＋speaker_position', 'timestamp＋goal_list＋env_info', '补齐 request_id / trace_id / turn_id',
], { fill: C.sage, stroke: C.sageLine });
card('UERR', 500, 875, 800, 240, '输入异常归因', [
  '无权限 / 未唤醒 / 回声 / 噪声 / 早截断', '否定、数字、时间、地点或人名识别错误', '重听 / 澄清 / 明确拒绝；禁止猜测补全',
], { fill: C.riskBg, stroke: C.risk, lastRisk: true });
card('VUI', 1340, 875, 980, 240, '语音界面状态机 VUI', [
  '待机→唤醒→聆听→识别→理解→准备回复', '合成排队→播报→下一轮 / 待机', '打断只停播报；是否取消实体动作另定策略',
], { fill: C.sand, stroke: C.amber });

hconnect('U1', 'U2', { color: C.blue, width: 4, label: '声音进入' });
vconnect('U2', 'U3', { color: C.blue, width: 4, label: '通过', labelAt: [1240, 1210] });
vconnect('U3', 'U4', { color: C.blue, width: 4 });
route([anchor('U4','right'), [1540,1695], [1540,2445], anchor('U5','left')], { color: C.blue, width: 4, label: '最终文本', labelAt: [1540, 2050] });
route([anchor('U2','bottom'), [1240,845], [900,845], anchor('UERR','top')], { color: C.risk, width: 2, dash: '10 8', label: '权限 / 会话异常', labelAt: [850,845] });
route([anchor('U4','left'), [930,1695], [930,1160], [900,1160], anchor('UERR','bottom')], { color: C.risk, width: 2, dash: '10 8', label: '识别异常', labelAt: [930,1190] });
route([anchor('U2','right'), [1540,695], [1540,840], [1830,840], anchor('VUI','top')], { color: C.amber, width: 2, dash: '10 8', label: '会话状态', labelAt: [1830,840] });

// 02 — candidates are generated by different routes, but only one execution token may survive.
card('R1', 2290, 2320, 500, 200, '接入网关', [
  '校验结构 / 会话 / 车型 / 网络', '统一车企协议并写入 Trace',
], { fill: C.pale, stroke: C.blue });
card('R2', 2840, 2320, 500, 200, '登录 / 身份通过？', [
  '否：只给认证提示', '不得读取私有 Context / Memory',
]);
card('R3', 3390, 2320, 540, 200, '指定专用模块？', [
  'Direct Agent / 已注册能力', '命中也只是候选，不能绕过门禁',
]);
card('R4', 2840, 1370, 1090, 300, '句法 RAG＋端侧小模型', [
  '低时延识别明确、高置信、低风险指令', '句法 RAG 做规则匹配和参数抽取；端侧小模型做轻量分类 / 补槽',
  '输出：结构化意图＋参数＋置信度', '不确定、复杂、多步或需知识时继续上云',
], { fill: C.pale, stroke: C.blue, titleSize: 26, lineSize: 21, lineGap: 29 });
card('RDIRECT', 2290, 2700, 500, 220, 'Direct Agent 候选', [
  '明确任务由专用 Agent 处理', '只产候选动作；仍须安全、幂等与回传',
], { fill: C.sand, stroke: C.amber });
card('RPRE', 2840, 2700, 500, 220, '并行准备与预取', [
  '预取 Context、目标、知识、工具可用性', 'Planner 可预热；完整 Context 前无执行权',
], { fill: C.wipBg, stroke: C.wip, dash: '10 8' });
card('RFC', 3390, 2700, 540, 250, '云 FC 简繁分流', [
  '判断简单 / 复杂 / 澄清 / 拒识', '分类结果不可直接执行', '简单、复杂和拒识都先提交唯一仲裁',
], { fill: C.sand, stroke: C.amber });
card('R7', 3390, 3000, 540, 460, '端云唯一裁决＋迟到保护', [
  '候选：Direct / 端侧快路 / 云 FC 简单 / 复杂 / 拒识', '一轮只签发一个 execution_token',
  '端侧已执行后，迟到云结果丢弃且记录', '预启动 Planner 只是降时延，不获得第二执行权',
  '输出：复杂→Context；简单候选→V1；拒识→输出',
], { fill: C.sage, stroke: C.sageLine, titleSize: 25, lineSize: 20, lineGap: 29 });
card('RAUTH', 2300, 875, 760, 220, '认证失败', [
  '输出登录 / 绑定提示', '不读记忆、私有目标或任务', '用户完成认证后作为新请求重进',
], { fill: C.riskBg, stroke: C.risk });
card('RREJECT', 3150, 875, 800, 240, '拒识 / 澄清 / 仅记录', [
  '歧义高、越界、能力不足或安全不允许', '必须给出原因、必要追问与降级路径', '禁止伪造工具、执行状态或“试一下”',
], { fill: C.riskBg, stroke: C.risk, lastRisk: true });

hconnect('U5', 'R1', { color: C.blue, width: 4, label: '统一请求' });
hconnect('R1', 'R2', { color: C.blue, width: 4 });
hconnect('R2', 'R3', { color: C.blue, width: 4, label: '身份通过' });
route([anchor('R2','top'), [3090,1140], [2680,1140], anchor('RAUTH','bottom')], { color: C.risk, width: 2, dash: '10 8', label: '否', labelAt: [2760,1140] });
route([anchor('R3','top'), [3660,1730], [3385,1730], anchor('R4','bottom')], { color: C.blue, width: 3, label: '未指定', labelAt: [3490,1730] });
route([anchor('R3','bottom'), [3660,2635], [2540,2635], anchor('RDIRECT','top')], { color: C.amber, width: 3, dash: '10 8', label: '命中候选', labelAt: [2590,2635] });
route([anchor('R4','bottom'), [3385,2620], [3090,2620], anchor('RPRE','top')], { color: C.blue, width: 3, label: '未命中', labelAt: [3385,2160] });
hconnect('RPRE', 'RFC', { color: C.blue, width: 3, label: '云端候选' });
route([anchor('RDIRECT','right'), [3330,2810], [3330,3230], anchor('R7','left')], { color: C.amber, width: 2, dash: '10 8' });
route([anchor('R4','right'), [3980,1520], [3980,3230], anchor('R7','right')], { color: C.amber, width: 2, dash: '10 8', label: '快路候选', labelAt: [3980,1870] });
vconnect('RFC', 'R7', { color: C.amber, width: 3, label: '提交候选' });
route([anchor('RFC','top'), [3660,1200], [3550,1200], anchor('RREJECT','bottom')], { color: C.risk, width: 2, dash: '10 8', label: '拒识候选', labelAt: [3650,1200] });

// 03 — all complex decisions use one governed factual snapshot.
card('I0', 4790, 2290, 700, 280, '统一输入治理', [
  'user_query / advisor / tool_feedback / task-event', '分类→优先级→打断 / 合并 / 排队 / 丢弃',
  '校验身份、时间、TTL、幂等与关联编号', '四类输入统一进入 Context',
], { fill: C.sage, stroke: C.sageLine, titleSize: 26, lineSize: 21 });
card('I4', 4120, 2660, 1000, 300, '四类当前输入', [
  '① user_query：用户原话　② advisor：建议，不是执行权', '③ tool_feedback：真实工具结果　④ task / trigger 回调',
  '优先级：用户请求 > 反馈 / 建议 / 事件', '任何摘要都不能替代原始结果与真实状态',
], { fill: C.pale, stroke: C.blue, titleSize: 25, lineSize: 20, lineGap: 28 });
card('FACT', 4120, 3010, 1000, 400, '十二类事实＋四类记忆', [
  '当前输入｜近期对话｜端侧状态｜实时视觉｜事件日志｜身份关系', 'Goal / Task｜联网新事实｜车型知识｜工具能力版本｜角色边界｜时间位置网络',
  '瞬时 / 短期 / 长期情景 / 长期语义记忆按身份隔离', '每项必须回答：谁写、何时写、何时过期、属于谁', '空记忆结果就是未找到，禁止臆造',
], { fill: C.white, stroke: C.blue, titleSize: 25, lineSize: 20, lineGap: 29 });
const govDefs = [
  ['GOV1',2660,'① 来源与身份隔离',['区分用户原话、工具结果、Advisor 与模型推断','保留用户 / 车辆 / 会话 / 任务作用域']],
  ['GOV2',2840,'② 新鲜度与相关性',['发生时间、写入时间、TTL 与采集来源','过期则刷新；只保留目标所需事实']],
  ['GOV3',3020,'③ 冲突与优先级',['真实回读 > 新工具结果 > 旧对话','不能裁决则保持未知并查询 / 追问']],
  ['GOV4',3200,'④ 摘要、预算与隐私',['远区压缩、近区动作反馈完整','人物、否定、时间、目标状态不能丢']],
];
govDefs.forEach(([id,y,titleValue,lines]) => card(id, 5180, y, 560, 160, titleValue, lines, {
  fill: C.white, stroke: C.line, titleSize: 21, lineSize: 18, lineGap: 23,
}));
card('DYN', 5780, 2660, 580, 520, '动态知识与示例注入', [
  '当前请求＋车型 / 环境＋候选任务触发检索', '注入车型规则、工具技巧、专业知识、相似正反例',
  '校验来源、车企×环境、版本、得分、过期与冲突', '低分 / 无命中只能降低覆盖，不能编造知识',
  '注入版本、来源和选择原因全部写入 Trace',
], { fill: C.sand, stroke: C.amber, titleSize: 24, lineSize: 19, lineGap: 28 });
card('SNAP', 5200, 3650, 1160, 300, '本轮最小充分事实快照 ContextSnapshot', [
  '当前输入＋身份座位＋端态＋视觉＋相关记忆＋目标 / 任务进度', '工具能力 / 版本＋车型知识＋最新真实结果',
  '它是本轮唯一决策事实视图；新 feedback 到来后必须重建', '质量：覆盖率、新鲜度、冲突率、越权率和输入长度',
], { fill: C.sage, stroke: C.sageLine, titleSize: 26, lineSize: 21, lineGap: 29 });
card('PROMPT', 5200, 4010, 1160, 300, '送入 Planner 的系统提示词 SP＋用户提示词 UP', [
  'SP：角色 / 输入类型 / 27 工具 / 输出协议 / 安全 / 示例 / 车型知识', '动态区：车辆状态、视觉、目标队列、记忆、工具可用性',
  'UP：近期对话＋本轮输入数组＋ContextSnapshot＋历史 feedback', '缓存只影响性能，不替代事实新鲜度',
], { fill: C.pale, stroke: C.blue, titleSize: 25, lineSize: 20, lineGap: 28 });

route([anchor('R7','right'), [4020,3230], [4020,2430], anchor('I0','left')], { color: C.blue, width: 4, label: '选择复杂路径', labelAt: [4200,2430] });
route([anchor('I4','top'), [4620,2610], [5140,2610], anchor('I0','bottom')], { color: C.blue, width: 3, label: '四选一 / 排队', labelAt: [4700,2610] });
hconnect('FACT', 'GOV3', { color: C.blue2, width: 2 });
vconnect('I0', 'GOV1', { color: C.blue, width: 3 });
vconnect('GOV1', 'GOV2', { color: C.blue, width: 3 });
vconnect('GOV2', 'GOV3', { color: C.blue, width: 3 });
vconnect('GOV3', 'GOV4', { color: C.blue, width: 3 });
route([anchor('DYN','left'), [5760,2920], [5760,3370], [5740,3370], anchor('GOV4','right')], { color: C.amber, width: 2, dash: '10 8', label: '动态注入', labelAt: [5760,3320] });
route([anchor('GOV4','bottom'), [5460,3500], [5780,3500], anchor('SNAP','top')], { color: C.blue, width: 4 });
vconnect('SNAP', 'PROMPT', { color: C.blue, width: 4 });

// 04 — Planner = Director; the model only proposes the next executable step.
card('AICAP', 6500, 2240, 1650, 650, '产品要验收的 AI 能力', [
  '完整目标：不漏目标、不擅自新增动作', '已知 / 未知：可推断、可查询、必须追问要分清',
  '任务分型：单步、复合、多步、定时、条件、持续', '原子拆解：独立动作并行；结果依赖才分轮串行',
  '工具与参数：选对能力、对象、顺序和必要条件', '反馈理解：读懂部分成功、错误和真实状态',
  '再规划：换工具、补槽、等待、终止，不机械重试', '表达：不抢报完成、不重复播报，结论可解释',
  '稳定性：同例多跑结论一致，不因话术漂移动作',
], { fill: C.sand, stroke: C.amber, titleSize: 28, lineSize: 22, lineGap: 34 });
card('PGAP', 6500, 2930, 1650, 550, '协议缺口不能伪装成“模型不聪明”', [
  '请求缺 request / trace / turn，多人多轮无法串联', 'Advisor 缺来源 / 时间 / 目标 / 置信度 / 有效期',
  'feedback 缺 action_id，同名并发结果无法归属', '动作缺 depends_on / 并行组 / 超时 / 重试 / 取消',
  '长期目标除新增 / 删除外，还需更新、暂停、恢复、过期和清理', '这些先按协议与工程问题验真，再判断模型能力',
], { fill: C.riskBg, stroke: C.risk, titleSize: 27, lineSize: 21, lineGap: 32, lastRisk: true });
card('P0', 6500, 3600, 560, 240, 'Planner = Director', [
  '同一 AI 决策职能，只有一个', '完整 Context 后才有复杂决策权', '输出仍只是候选',
], { fill: C.sage, stroke: C.sageLine, titleSize: 25 });
card('P1', 7110, 3560, 980, 280, '理解与完整目标检查', [
  '解码请求 / 建议 / feedback / 事件；识别人、座位、否定、时间和指代', '提取目标、约束、优先级与退出条件；标出未知、歧义和缺槽',
], { fill: C.white, stroke: C.blue, titleSize: 25, lineSize: 21, lineGap: 30 });
card('P2', 7110, 3890, 980, 280, '任务分解、依赖与工具选择', [
  '拆为原子动作；独立动作可并行，结果依赖则分轮串行', '选择工具 / Agent、参数、对象和版本；长期动作转 Goal / Task',
], { fill: C.white, stroke: C.blue, titleSize: 25, lineSize: 21, lineGap: 30 });
card('P3', 7110, 4220, 980, 280, '自检、说话时机与下一轮策略', [
  '检查结构、白名单、安全、重复和冲突', '继续 / 改计划 / 等待 / 追问 / 结束；不得提前承诺未知结果',
], { fill: C.white, stroke: C.blue, titleSize: 25, lineSize: 21, lineGap: 30 });
card('POUT', 6500, 4560, 1590, 500, 'Planner 候选输出协议', [
  'talk_or_not＋talk_content＋emoji_id', 'action_list：action_id＋tool_name＋params＋作用对象＋依赖',
  '候选动作 ≠ 已执行；被接收 ≠ 工具调用成功', '输入=tool_feedback 时，可继续调用、补槽、等待、追问或结束',
  '任何完成声明必须绑定真实状态或产物证据',
], { fill: C.pale, stroke: C.blue, titleSize: 28, lineSize: 22, lineGap: 34 });

route([anchor('PROMPT','right'), [6420,4160], [6420,3720], anchor('P0','left')], { color: C.blue, width: 4 });
hconnect('P0', 'P1', { color: C.blue, width: 4 });
vconnect('P1', 'P2', { color: C.blue, width: 4 });
vconnect('P2', 'P3', { color: C.blue, width: 4 });
route([anchor('P3','bottom'), [7600,4525], [7295,4525], anchor('POUT','top')], { color: C.blue, width: 4 });

// 05 — deterministic gates plus current and target long-running task mechanisms.
const gateDefs = [
  ['V1',8350,'V1 字段 / 结构',['工具白名单、必填参数、类型枚举','缺参→标准错误 / 补槽']],
  ['V2',8820,'V2 能力 / 安全',['车型、权限、座位、档位、车速','允许 / 确认 / 拒绝 / 降级']],
  ['V3',9290,'V3 依赖 / 并发',['独立动作并行；依赖动作分轮','禁止竞态与冲突执行']],
  ['V4',9760,'V4 幂等 / 端云竞态',['request / action / token 去重','迟到结果不覆盖新状态']],
  ['V5',10230,'V5 生命周期 / 聚合',['下发、运行、超时、重试、取消','区分受理、生效与目标完成']],
];
gateDefs.forEach(([id,x,titleValue,lines]) => card(id, x, 3650, 430, 240, titleValue, lines, {
  fill: C.white, stroke: C.blue, titleSize: 21, lineSize: 18, lineGap: 25,
}));
card('VGATE_FAIL', 9950, 3000, 850, 320, '五级门禁失败总线', [
  'V1–V5 任一级缺参 / 冲突 / 拒绝 / 不可用 / 超时', '都禁止下发，并形成标准结果',
  '返回原因、缺字段、能否重试、下一步和时间', '异常也进入 feedback，不能静默丢失',
], { fill: C.riskBg, stroke: C.risk, titleSize: 25, lineSize: 20, lineGap: 28 });
card('CALLBACK', 9050, 3000, 760, 320, '任务 / Trigger 回调适配', [
  '回调转成 task-event / advisor / tool_feedback', '需要最新环境判断时回统一输入治理',
  '确定性保存动作仍须重新过运行门', 'Task Agent 不是第二个 Planner',
], { fill: C.pale, stroke: C.blue, titleSize: 24, lineSize: 19, lineGap: 28 });
card('TSPLIT', 10100, 3960, 770, 220, '是否需要跨轮持久化？', [
  '否：单步 / 复合 / 多步，靠 feedback 分轮', '是：定时 / 条件 / 持续，保存目标与退出条件', '多步不等于长期任务',
], { fill: C.sand, stroke: C.amber, titleSize: 24, lineSize: 19, lineGap: 26 });
card('IMM', 10100, 4230, 770, 200, '即时动作路径', [
  '本轮直接进入统一运行调度器', '多步仍按前序 feedback 分轮生成后序参数',
], { fill: C.sage, stroke: C.sageLine, titleSize: 23, lineSize: 19 });
card('PER', 8350, 4230, 650, 200, '持久任务路径', [
  '定时 / 条件 / 持续任务保存目标、范围、频率、退出和版本', '等待不等于完成',
], { fill: C.sand, stroke: C.amber, titleSize: 23, lineSize: 19 });
card('GOAL', 8350, 4470, 650, 570, '【当前】Goal / Advisor', [
  'Goal List 保存目标、条件、状态与进度', '目标更新工具当前支持新增 / 删除', '修改、暂停、恢复、过期与清理仍需补齐',
  '静态 / 动态 Advisor 只产生建议输入', '建议回同一 Planner，不能擅自执行或建目标', 'Trigger 监听时间 / 状态 / 事件 / 视觉条件',
], { fill: C.sand, stroke: C.amber, titleSize: 24, lineSize: 19, lineGap: 30 });
card('TASK', 9050, 4470, 700, 570, '【建设中】Task Service', [
  'Task Agent 是入口与透传，不是第二个 Planner', 'Task / Run / Event / Action / Binding 形成唯一事实',
  '等待→运行→完成 / 失败 / 取消 / 过期 / 离线', '可靠发件箱：待发→已发→已确认；失败重试 / 死信',
  'task_id / run_id / callback_id / action_id 贯穿',
], { fill: C.wipBg, stroke: C.wip, dash: '10 8', titleSize: 24, lineSize: 19, lineGap: 31 });
card('TRIGGER', 9800, 4470, 1000, 300, 'Trigger 条件命中链', [
  '输入时间、车态、导航、驾驶、视觉、生命周期信号', '求值：数值 / 状态变化 / 时间窗 / 组合 / 语义匹配',
  '防抖、迟滞、边沿、去重、冷却、最大次数', '输出命中 / 未命中 / 未知＋证据；禁止直接调用工具',
], { fill: C.sand, stroke: C.amber, titleSize: 24, lineSize: 19, lineGap: 27 });
card('RUN', 9800, 4800, 1000, 240, '任务恢复与运行门禁', [
  '恢复版本；重复 / 关闭 / 旧版本回调拒绝', '重读最新权限、安全、人物、网络与车辆状态',
  '确定性保存动作→调度；需重判→统一输入',
], { fill: C.sage, stroke: C.sageLine, titleSize: 24, lineSize: 19, lineGap: 27 });

route([anchor('POUT','right'), [8220,4810], [8220,3770], anchor('V1','left')], { color: C.blue, width: 4, label: 'action_list', labelAt: [8220,4100] });
for (let index = 0; index < gateDefs.length - 1; index += 1) hconnect(gateDefs[index][0], gateDefs[index + 1][0], { color: C.blue, width: 4 });
vconnect('V5', 'TSPLIT', { color: C.blue, width: 4 });
const gateCenters = gateDefs.map(([id]) => anchor(id,'top'));
route([[gateCenters[0][0],3390],[gateCenters.at(-1)[0],3390]], { color: C.risk, width: 3, dash: '10 8', arrow: false });
gateDefs.forEach(([id]) => route([anchor(id,'top'), [anchor(id,'top')[0],3390]], { color: C.risk, width: 2, dash: '10 8', arrow: false }));
route([[10325,3390], [10375,3390], anchor('VGATE_FAIL','bottom')], { color: C.risk, width: 3, dash: '10 8', label: '任一级未通过', labelAt: [10325,3370] });
route([anchor('R7','bottom'), [3660,3580], [8565,3580], anchor('V1','top')], { color: C.amber, width: 4, label: '选中专用 / 快路 / 云简单候选＋唯一令牌', labelAt: [6100,3580] });
route([anchor('TSPLIT','left'), [9450,4070], [9450,4170], [8675,4170], anchor('PER','top')], { color: C.amber, width: 3, label: '持久', labelAt: [9450,4170] });
vconnect('TSPLIT', 'IMM', { color: C.blue, width: 3, label: '即时' });
vconnect('PER', 'GOAL', { color: C.amber, width: 3 });
hconnect('PER', 'TASK', { color: C.wip, width: 2, dash: '10 8', label: '目标架构' });
hconnect('GOAL', 'TASK', { color: C.wip, width: 2, dash: '10 8', label: '状态协同' });
hconnect('TASK', 'TRIGGER', { color: C.wip, width: 2, dash: '10 8', label: '任务绑定' });
vconnect('TRIGGER', 'RUN', { color: C.amber, width: 3, label: '命中' });
route([anchor('RUN','left'), [9760,4920], [9760,3400], [9430,3400], anchor('CALLBACK','bottom')], { color: C.blue, width: 3, label: '需最新环境重判', labelAt: [9760,3460] });
route([anchor('CALLBACK','left'), [8990,3160], [8990,3430], [6420,3430], [6420,2430], anchor('I0','right')], { color: C.blue, width: 2, dash: '10 8', label: '回同一输入治理', labelAt: [7700,3430] });

// Three distinct VLM chains sit in the on-device lane and never share an ambiguous exit.
card('VLM1', 8350, 1240, 760, 300, 'VLM ① 本轮按需视觉问答', [
  'Planner→visual_qa→按视角取一帧 / 多帧', '结构化描述作为 tool_feedback 返回', '它属于 27 工具，不直接修改目标',
], { fill: C.pale, stroke: C.blue, titleSize: 23, lineSize: 19, lineGap: 28 });
card('VLM2', 9150, 1240, 760, 300, 'VLM ② 默认常驻视觉', [
  '端侧周期采样→通用客观摘要', '携带视角、来源、时间、TTL 进入 Context', '它是背景事实，不等于条件任务',
], { fill: C.pale, stroke: C.blue, titleSize: 23, lineSize: 19, lineGap: 28 });
card('VLM3', 9950, 1240, 850, 330, 'VLM ③ 动态长时观察', [
  '动态目标→观察清单与版本→端侧跨帧采样', '客观报告携带任务号、置信度、时间',
  '报告进入 Trigger 语义匹配；未命中继续等待', '禁止直接进 Context 或执行工具',
], { fill: C.pale, stroke: C.blue, titleSize: 23, lineSize: 19, lineGap: 28 });
route([anchor('VLM2','bottom'), [9530,2070], [6420,2070], [6420,3800], anchor('SNAP','right')], { color: C.blue2, width: 2, dash: '10 8', label: '带 TTL 的观察事实', labelAt: [7600,2070] });
route([anchor('VLM3','bottom'), [10375,4420], [10300,4420], anchor('TRIGGER','top')], { color: C.blue2, width: 2, dash: '10 8', label: '视觉事件证据', labelAt: [10375,2100] });

card('SCHED', 11050, 4230, 900, 260, '统一运行调度器', [
  '即时路径、确定性回调和专用 Agent 都回到这里', '输入：通过门禁的工具名、参数、对象与关联编号', '只调度一次可观测运行，不替代任务生命周期',
], { fill: C.sage, stroke: C.sageLine, titleSize: 25, lineSize: 20, lineGap: 28 });
card('X0', 12000, 4230, 1250, 260, '能力目录、协议适配与动态 Agent', [
  'tool_name＋params＋request / turn / action / execution 关联', '能力目录：豆包 / 车端 / 生态 / 对话服务 / 动态注册 Agent',
  '注册能力同样不能绕过安全、幂等与结果回传',
], { fill: C.sage, stroke: C.sageLine, titleSize: 25, lineSize: 20, lineGap: 29 });
card('BOUNDARY', 13300, 4230, 2250, 260, '端、云、生态责任边界', [
  'Planner 决定“下一步做什么”；调度器负责一次调用；Task 管跨轮生命周期', '车端负责安全前置、真实状态与执行回读；云端负责搜索、生成、记忆和规划',
  '生态 Provider 负责服务终态；任何一方都不能用“已受理”替代真实完成',
], { fill: C.white, stroke: C.blue2, titleSize: 25, lineSize: 20, lineGap: 29 });
route([anchor('IMM','right'), [10920,4330], [11050,4330], anchor('SCHED','left')], { color: C.blue, width: 4, label: '即时' });
route([anchor('RUN','right'), [10920,4920], [10920,4360], anchor('SCHED','left')], { color: C.blue, width: 4, label: '确定性保存动作', labelAt: [10920,4630] });
hconnect('SCHED', 'X0', { color: C.blue, width: 4 });

const v08 = await readFile(toolSource, 'utf8');
const toolsMatch = v08.match(/const tools = (\[[\s\S]*?\n\]);\n\nconst toolPos/);
if (!toolsMatch) throw new Error('Unable to load verified 27-tool catalogue');
const tools = Function(`"use strict"; return (${toolsMatch[1]});`)();
if (tools.length !== 27) throw new Error(`Expected 27 tools, got ${tools.length}`);

// 06 — seven columns by four rows. Each row has its own IN and OUT rails so no line crosses another card.
const toolXs = [11040, 11685, 12330, 12975, 13620, 14265, 14910];
const toolYs = [5205, 5575, 5945, 6315];
const rowInYs = [5175, 5545, 5915, 6285];
const rowOutYs = [5530, 5900, 6270, 6640];
const toolW = 600;
const toolH = 310;
const toolInputTrunkX = 10980;
const toolOutputTrunkX = 15580;
const toolPos = [];

const ownerFor = number => {
  if (number <= 8) return '车端 / 系统';
  if (number <= 18) return '云端 / 生态';
  if (number <= 20) return '内容生态';
  if (number <= 23) return '账户 / 任务';
  if (number <= 26) return '生成服务';
  return '交易生态';
};

route([[toolInputTrunkX,5175],[toolInputTrunkX,6285]], { color: C.blue, width: 4, arrow: false });
route([[toolOutputTrunkX,5530],[toolOutputTrunkX,6640]], { color: C.sageLine, width: 4, arrow: false });
route([anchor('X0','bottom'), [12625,5100], [toolInputTrunkX,5100], [toolInputTrunkX,5175]], {
  color: C.blue, width: 4, arrow: false, label: '统一工具输入 IN', labelAt: [11900,5100],
});

for (let row = 0; row < 4; row += 1) {
  const count = row === 3 ? 6 : 7;
  const lastCenter = toolXs[count - 1] + toolW / 2;
  route([[toolInputTrunkX,rowInYs[row]],[lastCenter,rowInYs[row]]], { color: C.blue, width: 2, arrow: false });
  route([[toolXs[0] + toolW / 2,rowOutYs[row]],[toolOutputTrunkX,rowOutYs[row]]], { color: C.sageLine, width: 2, arrow: false });
}

tools.forEach((tool, index) => {
  const row = Math.floor(index / 7);
  const col = index % 7;
  const x = toolXs[col];
  const y = toolYs[row];
  const id = `TOOL${tool[0]}`;
  const owner = ownerFor(Number(tool[0]));
  card(id, x, y, toolW, toolH, `${tool[0]}｜${tool[1]}（${tool[2]}）`, tool.slice(3), {
    fill: row % 2 ? C.white : C.paper,
    stroke: Number(tool[0]) <= 8 ? C.blue : C.sageLine,
    titleSize: 19, lineSize: 18, lineGap: 24, maxTitleUnits: 22,
    badge: owner, lastRisk: true,
  });
  const centerX = x + toolW / 2;
  route([[centerX,rowInYs[row]],[centerX,y]], { color: C.blue, width: 2 });
  route([[centerX,y + toolH],[centerX,rowOutYs[row]]], { color: C.sageLine, width: 2, arrow: false });
  toolPos.push({ id, x, y, row, col });
});

card('OWNERLEGEND', 14910, 6315, 600, 310, '执行责任不是完成责任', [
  '车端：安全前置＋设备终态', '云端：规划 / 搜索 / 生成 / 记忆', '生态：服务终态＋错误 / 回调',
  'Planner：基于证据判断下一步', '任何一方都不能把“已受理”当完成',
], { fill: C.sand, stroke: C.amber, titleSize: 21, lineSize: 18, lineGap: 26 });

const tool15 = toolPos.find(item => item.id === 'TOOL15');
route([anchor('VLM1','bottom'), [8730,2100], [10880,2100], [10880,tool15.y + toolH / 2], anchor('TOOL15','left')], {
  color: C.blue2, width: 2, dash: '10 8', label: '按需视觉指定 TOOL15', labelAt: [10880,2250],
});

// Tool results are separated into service response and real-world observation before feedback is created.
card('X1', 15700, 5205, 1100, 260, '原始执行结果', [
  '请求受理、车端指令、外部返回、生成产物或错误', '“服务调用成功”只证明服务层，不证明真实状态',
], { fill: C.sage, stroke: C.sageLine, titleSize: 25, lineSize: 21, lineGap: 30 });
card('X2', 15700, 5575, 1100, 260, '真实状态回读 observed_state', [
  '设备最终值、导航阶段、实际播放、订单终态、最终产物', '不能回读时必须说明证据等级与不可确认项',
], { fill: C.sage, stroke: C.sageLine, titleSize: 25, lineSize: 21, lineGap: 30 });
card('X3', 15700, 5945, 1100, 500, '统一结果格式', [
  '状态：成功 / 失败 / 部分成功 / 超时 / 取消 / 需补信息', '证据：真实状态 / 产物 / 已播内容 / 来源 / 时间',
  '建议：错误码 / 能否重试 / 缺失字段 / 下一步', '关联：request / turn / action / execution / task / run / callback',
  '输出：tool_feedback＋完成证据',
], { fill: C.pale, stroke: C.blue, titleSize: 27, lineSize: 21, lineGap: 32 });

route([[toolOutputTrunkX,5530],[toolOutputTrunkX,5335],anchor('X1','left')], { color: C.sageLine, width: 4, label: '原始结果', labelAt: [toolOutputTrunkX,5310] });
route([[toolOutputTrunkX,5900],[toolOutputTrunkX,5705],anchor('X2','left')], { color: C.sageLine, width: 4, label: '真实回读', labelAt: [toolOutputTrunkX,5680] });
route([anchor('X1','right'), [16850,5335], [16850,6040], [16800,6040], anchor('X3','right')], { color: C.sageLine, width: 3, dash: '10 8', label: '原始执行证据', labelAt: [16850,5490] });
vconnect('X2', 'X3', { color: C.sageLine, width: 4, label: '状态证据', labelAt: [16250,5885] });

// 07 — exception normalisation, feedback and an evidence-based mutually exclusive state gate.
card('ERR', 15700, 2250, 1100, 400, '全链异常归一化', [
  '输入 / Context / 决策 / 门禁 / 执行 / 时序异常统一收口', '形成错误码、能否重试、真实状态、缺字段与时间',
  '重复、旧版本、取消后迟到结果不得覆盖新状态', '异常也必须进入 feedback，不能在模块边界静默丢失',
], { fill: C.riskBg, stroke: C.risk, titleSize: 27, lineSize: 21, lineGap: 32, lastRisk: true });
card('XFAKE', 15700, 2700, 1100, 620, '四层成功语义与常见假成功', [
  '① 请求被接收', '② 服务调用成功', '③ 真实状态生效', '④ 用户完整目标完成',
  '搜到但未播放、生成已受理但无产物、出现付款页但未支付，都是假完成',
  '原始结果＋真实回读共同进入 feedback；任何一层不能越级替代下一层',
], { fill: C.riskBg, stroke: C.risk, titleSize: 27, lineSize: 21, lineGap: 36 });
card('TRWAIT', 11050, 3000, 900, 320, 'Trigger 未命中 / 未知', [
  '不创建 Run、不调用工具', 'Goal / Task 保持等待', '记录求值结果、时间、规则版本和未知原因',
], { fill: C.sand, stroke: C.amber, titleSize: 24, lineSize: 20, lineGap: 29 });
card('RUNFAIL', 12000, 3000, 900, 320, '运行门禁不通过', [
  '旧版本 / 已关闭 / 重复回调拒绝', '权限、安全、人物、网络不满足→跳过 / 等待', '形成失败 / 跳过证据并进入 ERR',
], { fill: C.riskBg, stroke: C.risk, titleSize: 24, lineSize: 20, lineGap: 29 });

route([anchor('TRIGGER','right'), [10920,4620], [10920,3160], anchor('TRWAIT','left')], { color: C.amber, width: 2, dash: '10 8', label: '否 / 未知', labelAt: [10920,3400] });
route([anchor('TRWAIT','bottom'), [11500,3490], [8290,3490], [8290,4755], anchor('GOAL','left')], {
  color: C.amber, width: 3, dash: '10 8', label: '写回 Goal / Task 等待态；不创建 Run', labelAt: [9300,3490],
});
route([anchor('RUN','right'), [11840,4920], [11840,3160], anchor('RUNFAIL','left')], { color: C.risk, width: 2, dash: '10 8', label: '不通过', labelAt: [11840,3400] });
route([anchor('VGATE_FAIL','right'), [15620,3160], [15620,2450], anchor('ERR','left')], { color: C.risk, width: 3, dash: '10 8', label: '门禁标准结果', labelAt: [15000,3160] });
hconnect('RUNFAIL', 'ERR', { color: C.risk, width: 2, dash: '10 8', label: '失败 / 跳过证据' });

card('FB0', 15700, 6685, 1100, 205, '形成 tool_feedback', [
  '工具名＋结果＋真实状态＋错误＋产物＋时间＋关联编号', '它是新的输入事件，不是模型内部隐藏返回值；到达后必须重建 Context',
], { fill: C.pale, stroke: C.blue, titleSize: 24, lineSize: 19, lineGap: 27 });
card('FBWRITE', 16950, 5920, 850, 500, '反馈关联验真＋Task / Goal 状态写回', [
  '核对 request / turn / action / execution / task / run / callback',
  '比较 execution_token、task_version 与当前有效状态',
  '重复、旧版本、取消后迟到结果：丢弃并审计，不覆盖状态',
  '当前结果：原子写入 Goal / Task / Run / Action 状态与证据',
  '部分成功 / 等待 / 终态均追加版本化事件，禁止静默覆盖',
  '只有已关联且写回成功的 feedback 才返回 Context',
], { fill: C.sage, stroke: C.sageLine, titleSize: 23, lineSize: 18, lineGap: 29 });
card('STATUS', 15700, 6930, 1100, 180, '完整目标互斥状态门', [
  '同一 Planner 基于最新 Context＋完成证据判断', '空 action_list 不是完成；继续 / 等待 / 完成 / 失败收口四选一',
], { fill: C.sage, stroke: C.sageLine, titleSize: 23, lineSize: 18, lineGap: 25 });
card('ST_PENDING', 15680, 7160, 500, 250, '继续 / 部分成功', [
  '保留已成功分支', '补槽、换工具或安全重试', '生成新 action_list 再过 V1–V5',
], { fill: C.pale, stroke: C.blue, titleSize: 21, lineSize: 18, lineGap: 25 });
card('ST_WAIT', 16230, 7160, 500, 250, '等待中', [
  '保存时间 / 状态 / 用户补充条件', '回 Goal / Task 等待态', 'Trigger 命中后恢复',
], { fill: C.sand, stroke: C.amber, titleSize: 21, lineSize: 18, lineGap: 25 });
card('ST_DONE', 16780, 7160, 500, 250, '完成', [
  '必要子目标均有真实证据', '无必需待执行动作', '证据不足禁止输出“完成”',
], { fill: C.sage, stroke: C.sageLine, titleSize: 21, lineSize: 18, lineGap: 25 });
card('ST_END', 17330, 7160, 500, 250, '失败 / 取消 / 过期', [
  '说明已成、未成与原因', '停止危险或无意义重试', '仍进入输出编排',
], { fill: C.riskBg, stroke: C.risk, titleSize: 21, lineSize: 18, lineGap: 25 });

route([anchor('X3','bottom'), [16250,6550], [16250,6655], anchor('FB0','top')], { color: C.sageLine, width: 5, label: '真实结果＋完成证据', labelAt: [16250,6565] });
route([anchor('ERR','bottom'), [16250,3400], [16850,3400], [16850,6570], [16250,6570], anchor('FB0','top')], { color: C.risk, width: 3, dash: '10 8', label: '异常标准结果', labelAt: [16850,3500] });

// Feedback is accepted only after association checks and an atomic lifecycle write-back.
route([anchor('FB0','right'), [16900,6787.5], [16900,6170], anchor('FBWRITE','left')], {
  color: C.sageLine, width: 4, label: '关联验真', labelAt: [16900,6500],
});
route([anchor('FBWRITE','left'), [16920,6170], [16920,5110], [9000,5110], anchor('GOAL','right')], {
  color: C.wip, width: 3, dash: '10 8', label: '版本化写回 Goal / Task 状态与证据', labelAt: [13200,5110],
});

// The only bottom feedback loop. It starts after lifecycle write-back and returns to the original input-governance node.
route([anchor('FBWRITE','bottom'), [17375,6500], [15620,6500], [15620,7545], [4020,7545], [4020,2430], anchor('I0','left')], {
  color: C.sageLine, width: 5, label: '第 2 / N 轮：tool_feedback → 统一输入治理 → 重建 Context → 同一 Planner', labelAt: [9600,7545],
});

// Planner can only reach the completion gate after the returned evidence has been interpreted.
route([anchor('POUT','right'), [8180,4810], [8180,5080], [16880,5080], [16880,7020], anchor('STATUS','right')], {
  color: C.blue, width: 3, dash: '10 8', label: '输入为 feedback / 无新动作时', labelAt: [13300,5080],
});
route([anchor('STATUS','bottom'), [16250,7135], [15930,7135], anchor('ST_PENDING','top')], { color: C.blue, width: 3, label: '继续' });
route([anchor('STATUS','bottom'), [16250,7135], [16480,7135], anchor('ST_WAIT','top')], { color: C.amber, width: 3, label: '等待' });
route([anchor('STATUS','bottom'), [16250,7135], [17030,7135], anchor('ST_DONE','top')], { color: C.sageLine, width: 3, label: '完成' });
route([anchor('STATUS','bottom'), [16250,7135], [17580,7135], anchor('ST_END','top')], { color: C.risk, width: 3, label: '收口' });
route([anchor('ST_PENDING','left'), [15620,7285], [15620,3580], [8565,3580], anchor('V1','top')], {
  color: C.blue, width: 3, label: '新 action_list 再过 V1–V5', labelAt: [12500,3580],
});
route([anchor('ST_WAIT','right'), [16900,7285], [16900,5090], [8675,5090], anchor('GOAL','bottom')], {
  color: C.amber, width: 3, label: '保存等待条件', labelAt: [14500,5090],
});

// 08 — all visible channels are orchestrated from the same outcome and must agree with actual state.
card('O0', 16500, 500, 1000, 190, '本轮输出编排', [
  '说什么、显示什么、形象做什么、实体证据如何呈现', 'talk_content、状态、动作与卡片必须一致',
], { fill: C.pale, stroke: C.blue, titleSize: 24, lineSize: 18, lineGap: 25 });
card('O1', 15680, 750, 500, 220, '语音路', ['TTS / 提示音 / 进度播报', '避免抢报完成与重复播报'], { fill: C.white, stroke: C.blue, titleSize: 22, lineSize: 18 });
card('O2', 16230, 750, 500, 220, '界面路', ['桌面 / 小窗 / 卡片 / 任务中心', '呈现事实、状态和下一步'], { fill: C.white, stroke: C.blue, titleSize: 22, lineSize: 18 });
card('O3', 16780, 750, 500, 220, '形象路', ['emoji_id / 动作 / 机器人', '与语义、情绪和状态一致'], { fill: C.white, stroke: C.blue, titleSize: 22, lineSize: 18 });
card('O4', 17330, 750, 500, 220, '实体证据路', ['车辆、导航、媒体、订单与产物终态', '这里只呈现已发生事实'], { fill: C.sage, stroke: C.sageLine, titleSize: 22, lineSize: 18 });
card('O5', 16500, 1020, 1000, 130, '用户最终感知：听到、看到、车辆或服务真的发生', [
  '最终体验看完整任务成功、真实生效、恢复与时延，而不是单一模型答题分数',
], { fill: C.sage, stroke: C.sageLine, titleSize: 22, lineSize: 18 });
card('OERR', 16950, 1320, 850, 320, '认证 / 拒识 / 澄清输出适配', [
  '登录失败只给认证提示；不读取私有上下文', '拒识必须说明原因、必要追问和可用降级', '输入异常要求重听 / 澄清，不伪装工具已执行',
], { fill: C.riskBg, stroke: C.risk, titleSize: 24, lineSize: 20, lineGap: 29 });

route([anchor('O0','bottom'), [17000,720], [15930,720], anchor('O1','top')], { color: C.blue, width: 2 });
route([[17000,720],[16480,720],anchor('O2','top')], { color: C.blue, width: 2 });
route([[17000,720],[17030,720],anchor('O3','top')], { color: C.blue, width: 2 });
route([[17000,720],[17580,720],anchor('O4','top')], { color: C.sageLine, width: 2 });
route([[15930,990],[17580,990]], { color: C.sageLine, width: 3, arrow: false });
['O1','O2','O3','O4'].forEach(id => route([anchor(id,'bottom'), [anchor(id,'bottom')[0],990]], { color: C.sageLine, width: 2, arrow: false }));
route([[17000,990],anchor('O5','top')], { color: C.sageLine, width: 4 });
route([anchor('ST_DONE','right'), [17870,7285], [17870,620], [17500,620], anchor('O0','right')], { color: C.sageLine, width: 4, label: '完成', labelAt: [17870,680] });
route([anchor('ST_END','right'), [17910,7285], [17910,660], [17500,660], anchor('O0','right')], { color: C.risk, width: 3, dash: '10 8', label: '失败收口', labelAt: [17910,720] });

// Input-side errors share one top error rail and never masquerade as tool execution.
route([[900,1150],[17780,1150]], { color: C.risk, width: 2, dash: '10 8', arrow: false });
['UERR','RAUTH','RREJECT'].forEach(id => route([anchor(id,'bottom'), [anchor(id,'bottom')[0],1150]], { color: C.risk, width: 2, dash: '10 8', arrow: false }));
route([[17780,1150],[17375,1150],anchor('OERR','top')], { color: C.risk, width: 3, dash: '10 8', label: '认证 / 输入 / 拒识出口', labelAt: [17780,1180] });
route([anchor('OERR','top'), [17375,1180], [17560,1180], [17560,600], [17500,600], anchor('O0','right')], { color: C.risk, width: 2, dash: '10 8' });

// 09 — compact observability and product-mastery band; it is cross-cutting, not a ninth serial gate.
circle(450, 6712, 28, C.blue, C.blue, 1, nodeSvg);
text(450, 6720, '09', 20, 800, C.white, 'middle');
text(500, 6720, '全链指标、根因与产品经理掌握深度', 28, 850, C.ink);

const metricDefs = [
  ['M1',450,'语音输入',['ASR 错字 / 否定数字保真 / 端点截断','说话人座位正确率＋P50/P95 时延']],
  ['M2',2530,'路由与唯一裁决',['快路命中 / 错命中 / 端云冲突率','execution_token 双执行违例必须为 0']],
  ['M3',4610,'Context 与记忆',['必要事实覆盖 / 新鲜度 / 冲突未解','身份错注入、记忆误命中与输入长度']],
  ['M4',6690,'AI 决策能力',['完整目标 / 任务拆解 / 工具参数正确','同例多跑稳定性、拒识和再规划成功率']],
  ['M5',8770,'门禁与工具执行',['非法动作拦截 / 依赖拓扑 / 幂等','调用成功、真实生效、回读覆盖与时延']],
  ['M6',10850,'长期任务与反馈',['Goal / Task 状态一致、Trigger 漏误触发','feedback 关联、等待恢复、假完成率']],
  ['M7',12930,'端到端完整性',['完整任务成功率、用户可验证结果','request→turn→action→execution→task/run→output']],
];
metricDefs.forEach(([id,x,titleValue,lines]) => card(id, x, 6700, 1980, 230, titleValue, lines, {
  fill: C.white, stroke: C.blue, titleSize: 23, lineSize: 19, lineGap: 27,
}));

card('RCA', 450, 6980, 7100, 420, 'Badcase 根因门：先看证据，再判断是不是 AI', [
  '① 是否走对模块？否＝入口 / 分流 / 回调链路问题　　② 工具定义、参数、版本清楚吗？否＝工具契约问题',
  '③ 必要事实是否进入快照？否＝Context 采集 / 治理问题　　④ 模型看到的事实正确且无冲突吗？否＝注入问题',
  '⑤ 信息完整仍理解错目标 / 工具 / 依赖？是＝AI 决策能力　　⑥ 是否真实下发、生效、回读并关联？否＝执行协议',
  '⑦ 新 feedback 后能否恢复、继续和收口？否＝工程时序 / 再规划；根因必须落到责任模块、证据、修复与回归集',
], { fill: C.riskBg, stroke: C.risk, titleSize: 27, lineSize: 20, lineGap: 34 });
card('PMQ', 7750, 6980, 7160, 420, '产品经理必须能回答的评审问题＋掌握标准', [
  '谁负责、在哪里发生、输入来自谁、输出给谁？判断条件、优先级、失败出口和真实证据是什么？',
  '为什么走这条路由、选这个工具、参数、对象与顺序？谁负责依赖、幂等、超时、重试、取消和清理？',
  'L1 会画顺序　L2 会解释输入输出与边界　L3 能用 Trace 定位链路 / 工具 / Context / 模型　L4 能改指标与回归集',
  '达到 L3 才算真正懂链路；达到 L4 才能用数据判断两年内继续深耕的价值。',
], { fill: C.pale, stroke: C.blue, titleSize: 27, lineSize: 20, lineGap: 34 });

// A single low-salience Trace rail ties the stage headers to the metric band without becoming a second business flow.
route([[420,415],[17920,415]], { color: C.line, width: 2, dash: '8 8', arrow: false });
stages.forEach(([x,w]) => route([[x + w / 2,400],[x + w / 2,415]], { color: C.blue2, width: 2, arrow: false }));
rect(14600, 215, 3160, 30, C.white, C.blue2, 1, 8, overlaySvg);
text(16180, 237, '统一 Trace：request → turn → action → execution → task / run → callback → output', 18, 750, C.blue2, 'middle', overlaySvg);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L12,6 L0,12 Z" fill="context-stroke"/></marker></defs>
  <g id="background">${bgSvg.join('')}</g>
  <g id="edges">${edgeSvg.join('')}</g>
  <g id="nodes">${nodeSvg.join('')}</g>
  <g id="overlays">${overlaySvg.join('')}</g>
</svg>`;

await writeFile(output, svg, 'utf8');
console.log(JSON.stringify({ output, width: W, height: H, cards: nodes.size, texts: textCount, connectors: edgeSvg.filter(item => item.startsWith('<polyline')).length, toolCount: tools.length }, null, 2));
