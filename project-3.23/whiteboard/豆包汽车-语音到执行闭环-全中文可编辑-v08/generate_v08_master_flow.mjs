import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const output = join(here, 'diagram-v08-master-flow.svg');

const W = 3600;
const H = 17380;
const C = {
  white: '#FFFFFF',
  ceramic: '#F4F2EE',
  cobalt: '#185DB7',
  deep: '#0D4FA8',
  paleBlue: '#EEF4FB',
  sage: '#8E9179',
  paleSage: '#F1F2EB',
  ink: '#17345C',
  muted: '#52647D',
  line: '#0D4FA8',
};

const svg = [];

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function rect(x, y, w, h, fill = C.white, stroke = C.deep, sw = 2.5, rx = 8, dash = '') {
  svg.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
}

function circle(cx, cy, r, fill = C.cobalt, stroke = C.deep, sw = 2) {
  svg.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
}

function text(x, y, lines, opts = {}) {
  const {
    size = 18,
    weight = 400,
    fill = C.ink,
    anchor = 'start',
    lineHeight = Math.round(size * 1.35),
    letterSpacing = 0,
  } = opts;
  const content = Array.isArray(lines) ? lines : [lines];
  svg.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${letterSpacing}">`);
  content.forEach((line, index) => {
    svg.push(`<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`);
  });
  svg.push('</text>');
}

function markerName(color) {
  if (color === C.sage) return 'arrow-sage';
  if (color === C.muted) return 'arrow-muted';
  return 'arrow-blue';
}

function connector(points, opts = {}) {
  const {
    color = C.line,
    width = 3,
    dash = '',
    arrow = true,
    label = '',
    labelX,
    labelY,
    labelFill = color,
    labelSize = 16,
  } = opts;
  const pts = points.map(([x, y]) => `${x},${y}`).join(' ');
  svg.push(`<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ` marker-end="url(#${markerName(color)})"` : ''}/>`);
  if (label) {
    const labelWidth = Array.from(label).reduce((sum, char) => sum + (char.charCodeAt(0) < 128 ? 9 : 17), 20);
    rect(labelX - labelWidth / 2, labelY - 20, labelWidth, 29, C.white, color, 1.2, 4);
    text(labelX, labelY, label, { size: labelSize, weight: 600, fill: labelFill, anchor: 'middle' });
  }
}

function domainPill(x, y, label, color = C.cobalt, width = 86) {
  rect(x, y, width, 30, C.white, color, 2, 15);
  text(x + width / 2, y + 21, label, { size: 16, weight: 700, fill: color, anchor: 'middle' });
}

function badge(x, y, label, kind = 'blue', width = 116) {
  const color = kind === 'sage' ? C.sage : C.cobalt;
  const fill = kind === 'sage' ? C.paleSage : C.paleBlue;
  rect(x, y, width, 32, fill, color, 2, 16);
  text(x + width / 2, y + 22, label, { size: 16, weight: 700, fill: color, anchor: 'middle' });
}

function card({
  x, y, w, h, title, lines = [], step = '', domain = '', fill = C.ceramic,
  stroke = C.deep, dash = '', titleSize = 21, bodySize = 17, lineHeight = 24,
  titleFill = C.ink,
}) {
  rect(x, y, w, h, fill, stroke, 2.5, 8, dash);
  let titleX = x + 24;
  if (step) {
    circle(x + 42, y + 42, 25, C.cobalt, C.deep, 2);
    text(x + 42, y + 49, step, { size: 16, weight: 700, fill: C.white, anchor: 'middle' });
    titleX = x + 82;
  }
  text(titleX, y + 38, title, { size: titleSize, weight: 700, fill: titleFill });
  if (domain) domainPill(x + w - 112, y + 16, domain, domain === '车端' ? C.sage : C.cobalt, 92);
  if (lines.length) text(x + (step ? 82 : 24), y + 76, lines, { size: bodySize, lineHeight, fill: C.ink });
}

function compact({
  x, y, w, h, title, lines = [], fill = C.white, stroke = C.deep, dash = '', domain = '',
  titleFill = C.ink, bodyFill = C.ink,
}) {
  rect(x, y, w, h, fill, stroke, 2.2, 6, dash);
  text(x + 18, y + 29, title, { size: 18, weight: 700, fill: titleFill });
  if (domain) domainPill(x + w - 100, y + 10, domain, domain === '车端' ? C.sage : C.cobalt, 82);
  if (lines.length) text(x + 18, y + 57, lines, { size: 16, lineHeight: 21, fill: bodyFill });
}

function panel(x, y, w, h, title, subtitle = '', opts = {}) {
  rect(x, y, w, h, opts.fill || C.white, opts.stroke || C.deep, opts.sw || 3, 10, opts.dash || '');
  rect(x, y, w, 54, opts.headerFill || C.cobalt, opts.headerFill || C.cobalt, 0, 8);
  text(x + 24, y + 36, title, { size: 22, weight: 700, fill: C.white });
  if (subtitle) text(x + w - 24, y + 35, subtitle, { size: 16, weight: 600, fill: C.white, anchor: 'end' });
}

function section(y, number, titleText, note = '') {
  rect(80, y, 70, 42, C.cobalt, C.cobalt, 0, 4);
  text(115, y + 29, number, { size: 18, weight: 700, fill: C.white, anchor: 'middle' });
  text(175, y + 30, titleText, { size: 24, weight: 700, fill: C.deep });
  if (note) text(3520, y + 29, note, { size: 16, weight: 600, fill: C.muted, anchor: 'end' });
}

function toolCard({ x, y, code, title, field, input, mechanism, outputLine, gate, domain, fill = C.white, stroke = C.deep, dash = '' }) {
  rect(x, y, 740, 160, fill, stroke, 2, 6, dash);
  text(x + 18, y + 27, `${code} ${title}`, { size: 18, weight: 700, fill: C.ink });
  domainPill(x + 638, y + 10, domain, domain === '车端' ? C.sage : C.cobalt, 84);
  text(x + 18, y + 51, [
    `字段：${field}`,
    `输入：${input}`,
    `机制：${mechanism}`,
    `输出：${outputLine}`,
    `门禁：${gate}`,
  ], { size: 16, lineHeight: 21, fill: C.ink });
}

svg.push(`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`);
svg.push(`<defs>
  <marker id="arrow-blue" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 4 L0 8 z" fill="${C.deep}"/></marker>
  <marker id="arrow-sage" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 4 L0 8 z" fill="${C.sage}"/></marker>
  <marker id="arrow-muted" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 4 L0 8 z" fill="${C.muted}"/></marker>
</defs>`);
rect(0, 0, W, H, C.white, C.white, 0, 0);

// Header and responsibility lanes.
rect(0, 0, W, 230, C.cobalt, C.cobalt, 0, 0);
text(90, 86, '豆包汽车 Driver Agent 2.0｜语音用户请求到真实结果', { size: 38, weight: 700, fill: C.white });
text(90, 145, '一条主轴串起端侧小模型、云端路由、上下文、决策规划、工具执行、长期任务和评测闭环', { size: 20, weight: 500, fill: C.white });
badge(90, 178, '主链｜钴蓝', 'blue', 160);
badge(270, 178, '回流｜鼠尾草', 'sage', 190);
badge(480, 178, '虚线｜待验真/建设中', 'blue', 250);

// Lane boundaries: vehicle edge, cloud, ecosystem / OEM.
rect(0, 245, 1050, 15120, C.paleSage, C.paleSage, 0, 0);
rect(1050, 245, 1500, 15120, C.white, C.white, 0, 0);
rect(2550, 245, 1050, 15120, C.paleBlue, C.paleBlue, 0, 0);
connector([[1050, 245], [1050, 15365]], { color: C.sage, width: 2, dash: '12 10', arrow: false });
connector([[2550, 245], [2550, 15365]], { color: C.cobalt, width: 2, dash: '12 10', arrow: false });
badge(90, 260, '车端｜感知、本地执行、真实状态', 'sage', 820);
badge(1290, 260, '云端｜路由、Context、Planner、编排', 'blue', 1020);
badge(2700, 260, '车企/生态｜协议和外部服务', 'blue', 760);

// 01. Edge speech entry.
section(330, '01', '车端语音入口与端侧小模型分流', '原始声音→最终文字→端/云唯一结果');
card({ x: 120, y: 410, w: 820, h: 150, step: '01', domain: '车端', title: '用户发声', lines: ['输入：原始声音、座位/声区、说话人候选', '目标：保留完整语义与用户真实意图', '异常：多人抢话、噪声、距离、权限'] });
card({ x: 120, y: 630, w: 820, h: 180, step: '02', domain: '车端', title: '唤醒与注意状态机', lines: ['输入：音频流＋会话/播报状态', '判断：唤醒、免唤醒、监听、拒绝、打断', '输出：已接纳语音流＋被打断内容', '注意：停止播报不等于取消实体动作'] });
card({ x: 120, y: 880, w: 820, h: 190, step: '03', domain: '车端', title: '声学预处理与人声起止', lines: ['处理：回声消除、降噪、波束定位、人声检测', '判断：起点、终点、插话、尾噪', '输出：完整的语音片段', '指标：早截断、尾噪、回声残留、处理时延'] });
card({ x: 120, y: 1140, w: 820, h: 200, step: '04', domain: '车端', title: '语音识别（ASR）', lines: ['输入：完整语音片段', '输出：部分/最终文字、说话人、座位、时间', '关键保真：否定词、数字、时间、地点、人名', '异常：拒识/低置信→重听或明确澄清'] });
connector([[530, 560], [530, 630]]);
connector([[530, 810], [530, 880]]);
connector([[530, 1070], [530, 1140]]);

// Explicit edge small model / FC branch.
card({ x: 120, y: 1410, w: 820, h: 260, step: '05', domain: '车端', title: '端侧小模型／函数调用候选', dash: '9 7', lines: ['输入：最终文字＋当前车态＋车型能力', '输出：意图、工具/参数候选、置信度', '覆盖：白名单内的明确原子指令', '不上云：高置信＋低风险＋能力可用＋本地被采纳', '转 Planner：未命中、低置信、复合/多步、需联网/记忆', '状态：端侧是真实候选路；精确接入点待链路验真'] });
connector([[530, 1340], [530, 1410]], { dash: '8 6' });

// Edge-local guard and executor for accepted endpoint FC results.
compact({ x: 120, y: 1740, w: 820, h: 150, title: '端侧本地门禁与执行', domain: '车端', fill: C.paleSage, stroke: C.sage, lines: ['白名单/参数/权限/安全全部通过才执行', '输出：本地回执＋真实车态＋卡片/播报'] });
connector([[530, 1670], [530, 1740]], { color: C.sage, label: '仅允许的原子场景', labelX: 760, labelY: 1715 });

// Cloud gateway and routing.
section(1960, '02', '云端网关、云函数调用候选与真实分流', '登录失败/拒识结束｜直达/句法快路进入公共门禁｜复杂进入 Context');
panel(1110, 2030, 1380, 890, '云端对话网关与唯一路由决策', '云端');
compact({ x: 1320, y: 2110, w: 960, h: 100, title: '06 车企协议→统一对话请求', lines: ['文字＋说话人/座位＋时间＋车型/环境＋会话'] });
compact({ x: 1320, y: 2230, w: 960, h: 100, title: '07 登录、账号与车辆绑定通过？', fill: C.paleBlue, lines: ['否：认证提示后结束；是：继续路由'] });
compact({ x: 1320, y: 2350, w: 960, h: 100, title: '08 已注册的专用直达模块？', fill: C.paleBlue, lines: ['命中：直达执行服务；未命中：继续句法匹配'] });
compact({ x: 1320, y: 2470, w: 960, h: 100, title: '09 句法 RAG／规则快路命中？', fill: C.paleBlue, lines: ['明确＋低风险＋参数完整才进简单流程'] });
compact({ x: 1260, y: 2590, w: 1080, h: 130, title: '10 准备阶段并行', lines: ['Context 预取＋Planner 预启动', '云端函数调用/意图候选＋拒识判断＋推荐回流'] });
compact({ x: 1260, y: 2740, w: 1080, h: 140, title: '11 最终仲裁＋端云唯一结果锁', fill: C.paleBlue, lines: ['五选一：端侧采纳／拒识／简单意图／强制 Planner／新 Planner', '一旦某结果被采纳，拒绝迟到端/云结果，禁止双执行'] });
connector([[940, 1510], [1000, 1510], [1000, 2110], [1320, 2110]], { dash: '8 6', label: '未本地采纳→上云', labelX: 1055, labelY: 1985 });
connector([[940, 1570], [1030, 1570], [1030, 2810], [1260, 2810]], { color: C.sage, dash: '8 6', label: '并行候选→唯一裁决', labelX: 1120, labelY: 2680 });
connector([[1800, 2210], [1800, 2230]]);
connector([[1800, 2330], [1800, 2350]]);
connector([[1800, 2450], [1800, 2470]]);
connector([[1800, 2570], [1800, 2590]]);
connector([[1800, 2720], [1800, 2740]]);

compact({ x: 2680, y: 2200, w: 800, h: 150, title: '登录失败｜输出后结束', domain: '云端', fill: C.white, stroke: C.deep, dash: '8 6', lines: ['生成认证说明→语音/界面提示→用户', '不进 Context、Planner 或工具执行'] });
compact({ x: 2680, y: 2410, w: 800, h: 170, title: '直达/句法快路｜公共执行入口', domain: '云端', fill: C.paleBlue, lines: ['直达模块或简单流程产生候选工具调用', '仍必须经过参数/能力/安全/幂等门禁'] });
compact({ x: 2680, y: 2700, w: 800, h: 170, title: '拒识｜输出后结束', domain: '云端', fill: C.white, stroke: C.deep, dash: '8 6', lines: ['给出拒识原因、可用澄清/降级选项', '写入事件日志，用于误拒识监控'] });
connector([[2280, 2280], [2680, 2280]], { color: C.muted, label: '否', labelX: 2480, labelY: 2260 });
connector([[2280, 2400], [2500, 2400], [2500, 2490], [2680, 2490]], { color: C.sage, label: '命中', labelX: 2500, labelY: 2380 });
connector([[2280, 2520], [2550, 2520], [2550, 2490], [2680, 2490]], { color: C.sage, label: '命中', labelX: 2540, labelY: 2555 });
connector([[2340, 2810], [2510, 2810], [2510, 2785], [2680, 2785]], { color: C.muted, dash: '7 6', label: '拒识', labelX: 2490, labelY: 2760 });
connector([[3480, 2490], [3540, 2490], [3540, 6480], [2520, 6480]], { color: C.sage, width: 3, label: '直达/快路执行总线', labelX: 3410, labelY: 4460 });

// 03. Unified input governance.
section(2980, '03', '四类输入治理与排队', '用户请求／顾问建议／工具反馈／系统事件');
panel(1090, 3050, 1420, 430, '统一输入治理', '云端');
compact({ x: 1160, y: 3130, w: 610, h: 100, title: '用户请求', lines: ['原话、说话人、座位、时间'] });
compact({ x: 1830, y: 3130, w: 610, h: 100, title: '顾问建议', lines: ['建议不是用户命令，不得直接执行'] });
compact({ x: 1160, y: 3250, w: 610, h: 100, title: '工具执行反馈', lines: ['结果到来后开启新一轮判断'] });
compact({ x: 1830, y: 3250, w: 610, h: 100, title: '系统事件', lines: ['触发、车态、生命周期或手动操作'] });
compact({ x: 1160, y: 3370, w: 1280, h: 80, title: '输入决策：类型、优先级、打断、合并、排队、过期丢弃', fill: C.paleBlue });
connector([[1800, 2880], [1800, 3050]], { label: '复杂/强制 Planner', labelX: 2020, labelY: 2990 });

// 04. Context sources and governance attached to the actual Context node.
section(3550, '04', 'Context 事实来源、治理与本轮快照', '先把事实做对，再判断 AI 能力');
compact({ x: 1320, y: 3620, w: 960, h: 100, title: '十二类事实来源总线', fill: C.paleBlue, lines: ['每个值带来源、时间、有效期、归属和可信度'] });

const contextLeft = [
  ['C01 当前输入', '请求/建议/反馈/事件'],
  ['C02 近期对话', '原话/回复/动作/反馈/打断'],
  ['C03 最新端侧状态', '车辆/导航/媒体/应用'],
  ['C04 当前视觉情境', '场景/观察主题/置信度'],
  ['C05 事件日志', '传感/手动/拒识/触发'],
  ['C06 身份与关系', '账号/人脸/座位/权限/隐私'],
];
const contextRight = [
  ['C07 当前目标/任务', '状态/进度/待办/等待条件'],
  ['C08 联网新事实', '天气/网页/地点/路况'],
  ['C09 参考知识', '车书/技巧/车型/规则'],
  ['C10 可用工具', '参数/能力/版本/取消'],
  ['C11 助手角色边界', '角色/表达/价值/拒绝'],
  ['C12 时间位置设备', '日期/位置/车型/网络'],
];
contextLeft.forEach(([title, line], i) => {
  const y = 3650 + i * 118;
  compact({ x: 80, y, w: 900, h: 102, title, lines: [line], fill: C.white, stroke: C.sage, domain: '车端' });
  connector([[980, y + 51], [1050, y + 51], [1050, 3670], [1320, 3670]], { color: C.sage, width: 2, arrow: false });
});
contextRight.forEach(([title, line], i) => {
  const y = 3650 + i * 118;
  compact({ x: 2620, y, w: 900, h: 102, title, lines: [line], fill: C.white, stroke: C.cobalt, domain: i === 1 ? '生态' : '云端' });
  connector([[2620, y + 51], [2550, y + 51], [2550, 3670], [2280, 3670]], { color: C.cobalt, width: 2, arrow: false });
});

const gov = [
  ['12', '来源与身份隔离', '谁写入，属于哪个用户/车辆/会话/任务'],
  ['13', '新鲜度与有效期', '发生时间、写入时间、过期与陈旧'],
  ['14', '当前目标相关性', '只保留完成本轮目标真正需要的事实'],
  ['15', '冲突裁决', '最新端态优先旧对话；不能裁决保持未知'],
  ['16', '事实分型', '事实/建议/结果/假设不能同等信任'],
  ['17', '摘要与上下文预算', '按人物、场景、任务压缩；关键事实不丢'],
];
gov.forEach(([step, title, line], i) => {
  const y = 3750 + i * 122;
  compact({ x: 1250, y, w: 1100, h: 104, title: `${step} ${title}`, lines: [line], fill: i === 3 ? C.paleSage : C.white, stroke: i === 3 ? C.sage : C.deep });
  if (i > 0) connector([[1800, y - 18], [1800, y]], { width: 2.5 });
});

card({ x: 80, y: 4380, w: 900, h: 310, title: '记忆支路｜挂在 C02/C06', domain: '云端', fill: C.paleSage, stroke: C.sage, lines: ['瞬时记忆：本轮声音、视觉和输入', '短期记忆：近期对话、当前任务、临时对象', '长期情景记忆：经历、地点、同行人与时间', '长期语义记忆：稳定偏好、习惯和关系', '共同门禁：身份/范围/隐私；空结果不得臆造'] });
card({ x: 2620, y: 4380, w: 900, h: 310, title: '默认视觉与动态知识支路', domain: '端/云', fill: C.paleBlue, lines: ['默认常驻视觉：主题集→端侧周期取帧', '→通用场景摘要→C04（来源/时间/有效期）', '动态知识：请求＋车型/环境＋候选任务', '→知识/技巧/正反例→版本/车企×环境/过期门', '→注入提示词动态区；无命中不编造'] });
connector([[530, 4380], [530, 4310], [1250, 4310]], { color: C.sage, width: 2.5 });
connector([[3070, 4380], [3070, 4310], [2350, 4310]], { color: C.cobalt, width: 2.5 });

card({ x: 1120, y: 4540, w: 1360, h: 210, step: '18', domain: '云端', title: '本轮最小充分事实快照', lines: ['当前输入＋身份座位＋最新端态＋视觉情境＋相关记忆', '目标/任务进度＋工具能力＋参考知识＋最新结果', '输出：本轮唯一 ContextSnapshot；每轮新反馈都重新生成'] });
connector([[1800, 4480], [1800, 4540]]);

// 05. Prompt composition and Planner/Director single decision module.
section(4820, '05', '提示词组装与 Planner／Director 同一决策模块', '模型负责判断；工程负责不可违反的边界');
card({ x: 1120, y: 4890, w: 1360, h: 210, step: '19', domain: '云端', title: '本轮模型输入', lines: ['固定规则包＋四类输入之一＋ContextSnapshot', '近期对话＋当前目标/任务＋工具能力＋历史反馈', '动态知识/场景示例只在版本与环境门禁后注入'] });
connector([[1800, 4750], [1800, 4890]]);

panel(1070, 5180, 1460, 1340, '20 Planner／Director｜同一个决策中枢', '12 个产品验收检查点');
const plannerChecks = [
  ['P01', '输入类型解码', '分清请求、建议、结果、事件'],
  ['P02', '人/座位/指代', '否定、时间、地点、我/他/这边'],
  ['P03', '完整用户目标', '还原显式/隐式目标与子目标'],
  ['P04', '已知与未知', '可推断、可查询、必须追问、不能做'],
  ['P05', '能力/安全/拒识', '车型、权限、车速档位、确认/降级/拒绝'],
  ['P06', '任务分型', '单步、多动作、多步、条件/定时、持续'],
  ['P07', '原子动作拆解', '不漏目标、不添动作、不改意图'],
  ['P08', '依赖与并发', '独立并行；有结果依赖才串行'],
  ['P09', '选工具/任务代理', '按 schema、能力、实时状态和副作用选'],
  ['P10', '生成可执行参数', '必要时先读后写，缺失值不臆造'],
  ['P11', '说话与持久化', '确认/澄清/进度/最终；长期目标需保存'],
  ['P12', '自检与下一轮', '结构、去重、继续、改计划、等待或结束'],
];
plannerChecks.forEach(([id, title, line], i) => {
  const row = Math.floor(i / 2);
  const col = i % 2;
  const x = 1130 + col * 670;
  const y = 5260 + row * 196;
  compact({ x, y, w: 620, h: 158, title: `${id} ${title}`, lines: [line], fill: col === 0 ? C.white : C.paleBlue, stroke: col === 0 ? C.deep : C.cobalt });
  if (i > 0) {
    const prevRow = Math.floor((i - 1) / 2);
    const prevCol = (i - 1) % 2;
    const px = 1130 + prevCol * 670;
    const py = 5260 + prevRow * 196;
    const fromX = prevCol === 0 ? px + 620 : px + 310;
    const fromY = prevCol === 0 ? py + 79 : py + 158;
    const toX = col === 1 ? x : x + 310;
    const toY = col === 1 ? y + 79 : y;
    if (prevCol === 0) connector([[fromX, fromY], [toX, toY]], { width: 2 });
    else connector([[fromX, fromY], [2500, fromY], [2500, toY - 20], [toX, toY - 20], [toX, toY]], { width: 2 });
  }
});
connector([[1800, 5100], [1800, 5180]]);

// 06. Planner decision output and deterministic execution gate.
section(6580, '06', '决策输出、动作清单门禁与运行编排', '候选计划≠已下发≠工具成功≠真实生效');
panel(1090, 6650, 1420, 430, '21 PlannerDecision', '四个输出端口');
compact({ x: 1160, y: 6730, w: 610, h: 100, title: '是否说话', lines: ['yes/no；不说时不得私自填话术'] });
compact({ x: 1830, y: 6730, w: 610, h: 100, title: '回复内容', lines: ['确认/澄清/进度/阶段或最终话术'] });
compact({ x: 1160, y: 6850, w: 610, h: 100, title: '形象动作编号', lines: ['可空；必须从可用清单选择'] });
compact({ x: 1830, y: 6850, w: 610, h: 100, title: '动作清单', lines: ['动作编号＋工具名＋参数'] });
compact({ x: 1160, y: 6970, w: 1280, h: 80, title: '说与做同一轮必须一致；不得提前承诺未验真的结果', fill: C.paleSage, stroke: C.sage });
connector([[1800, 6440], [1800, 6650]]);

card({ x: 80, y: 6660, w: 900, h: 370, title: '当前协议字段缺口', fill: C.white, stroke: C.deep, dash: '8 6', lines: ['请求缺 request/trace/turn 关联编号', '顾问缺来源、时间、目标、置信度、有效期', '工具反馈缺 action_id，同名并发难归属', '动作缺显式依赖、并行组、超时、重试、取消', '长期目标的更新/暂停/恢复结构不足'] });
card({ x: 2620, y: 6660, w: 900, h: 370, title: '候选计划硬门禁', domain: '云端', fill: C.paleBlue, lines: ['结构：必填、类型、枚举、参数范围、工具白名单', '能力：车型/版本、座位、权限、档位/车速、确认', '编排：依赖、并发、动作关联、幂等、竞态、迟到保护', '生命周期：下发、运行、超时、重试、取消、部分成功', '门禁失败也必须生成标准反馈，不可静默丢弃'] });

card({ x: 1090, y: 7170, w: 1420, h: 390, step: '22', domain: '云端', title: '结构/能力/安全/幂等门禁', lines: ['输入：Planner 动作清单，或直达/句法快路工具候选', '判断：参数合法、能力可用、安全可放行、无重复下发', '输出：可执行工具调用＋作用对象＋关联编号＋回传地址', '失败：缺参数/未授权/不可用/安全拦截→标准反馈→再判断'] });
connector([[1800, 7080], [1800, 7170]]);
connector([[3540, 6480], [3540, 7365], [2510, 7365]], { color: C.sage, width: 3, label: '快路也必须过门禁', labelX: 3240, labelY: 7335 });
compact({ x: 2620, y: 7190, w: 900, h: 220, title: '门禁失败→可恢复的反馈', fill: C.paleSage, stroke: C.sage, lines: ['缺参数：追问；未授权：确认/拒绝', '能力不可用：降级/换工具', '安全拦截：不执行，说明原因', '全部作为新输入进入下一轮'] });
connector([[2510, 7300], [2620, 7300]], { color: C.sage, dash: '8 6' });

panel(1090, 7640, 1420, 390, '23 工具节点→执行服务→能力注册表', '云端');
compact({ x: 1160, y: 7720, w: 390, h: 220, title: '工具节点', lines: ['接收一个通过门禁的调用', '拆分原子工具与任务代理'] });
compact({ x: 1605, y: 7720, w: 390, h: 220, title: '执行服务', lines: ['管理超时、取消、进度与原始结果', '不自由修改 Planner 目标'] });
compact({ x: 2050, y: 7720, w: 390, h: 220, title: '能力注册表', lines: ['路由车端、云端、生态工具', '动态 Agent 不计入 27 工具'] });
connector([[1800, 7560], [1800, 7640]]);
connector([[1550, 7830], [1605, 7830]], { width: 2.5 });
connector([[1995, 7830], [2050, 7830]], { width: 2.5 });

// 07. All 27 tools: actual fan-out and result collection.
section(8110, '07', '27 个当前工具｜动作下行总线→选中工具→结果汇聚总线', '停车缴费已纳入｜每个工具都有输入、机制、输出、门禁');
connector([[1800, 8030], [1800, 8180]], { width: 4 });
connector([[90, 8180], [3500, 8180]], { width: 4, arrow: false, label: '动作下行总线（IN）｜每次只路由到被选中的工具/代理', labelX: 1800, labelY: 8150 });

const columns = [
  {
    x: 120, inputRail: 90, resultRail: 890, title: '直接控制写工具｜7', stroke: C.sage, fill: C.paleSage,
    tools: [
      ['T01', '基础车控', 'vehicle_basic_control', '对象/目标值', '座位+车态→协议执行', '执行+物理状态', '车型/权限/车速档位', '车端'],
      ['T02', '车载系统设置', 'vehicle_system_settings', '网络/屏幕/声音/应用', '定位设置项→修改/打开', '设置值/页面状态', '系统权限/当前模式', '车端'],
      ['T03', '车载通信', 'vehicle_communication', '拨打/接听/挂断', '联系人解析→歧义补问', '通话阶段/失败原因', '仅主驾/歧义必须确认', '车端'],
      ['T04', '辅助驾驶控制', 'auto_drive', '泊车/巡航/变道等', '安全前置→智驾服务', '可用性/阶段/终态', '运行设计域/司机确认', '车端'],
      ['T05', '氛围灯控制', 'ambient_light_control', '颜色/亮度/区域/模式', '解析颜色/区域→灯光服务', '实际灯光状态', '车型能力/模式冲突', '车端'],
      ['T06', '导航过程控制', 'navi_basic_control', '结束/视图/播报/偏好', '操作已有导航会话', '操作结果/当前阶段', '不找新地点/导航工具串行', '车端'],
      ['T07', '当前媒体控制', 'media_basic_control', '暂停/切歌/收藏/倍速', '操作当前媒体会话', '播放/界面状态', '必须存在可操作媒体', '车端'],
    ],
  },
  {
    x: 990, inputRail: 960, resultRail: 1760, title: '只读事实工具｜9', stroke: C.cobalt, fill: C.paleBlue,
    tools: [
      ['T08', '车辆实时状态查询', 'vehicle_status_search', '温度/门窗/胎压/车速', '读取最新状态快照', '值/时间/不可用原因', '车辆归属/新鲜度', '车端'],
      ['T09', '天气查询', 'weather_search', '地点×时间', '在线天气/预警查询', '地点与时段事实', '位置/时间明确，旧结果不复用', '生态'],
      ['T10', '地点与商家搜索', 'poi_search', '范围/品类/筛选', '搜索→过滤→排序', '候选地点与属性', '沿途搜索依赖已有路线', '生态'],
      ['T11', '联网信息搜索', 'web_search', '新闻/日期/开放域问题', '检索→打开来源→核验', '事实/来源/时间', '摘要只是线索，无原文不补写', '生态'],
      ['T12', '用车报告查询', 'car_log', '时间窗/行程/报告类型', '检索能耗/通勤/历史行程', '周期报告/统计', '不是实时车况', '云端'],
      ['T13', '车辆说明书问答', 'vehicle_manual_qa', '功能/操作/教程', '检索当前车型说明', '说明/步骤/适用边界', '车型/版本必须匹配', '云端'],
      ['T14', '车况维养问答', 'car_care_qa', '保养/保险/权益/维修', '按绑定车辆查长期车务', '维养/权益结果', '车辆绑定正确', '云端'],
      ['T15', '当前视觉问答', 'visual_qa', '当前人/物/场景问题', '权限→取帧→VLM结构化描述', '目标/位置/描述/置信', '只说视角内事实', '车端'],
      ['T16', '用户记忆查询', 'user_memory_search', '事实/偏好/过往经历', '按身份/范围/隐私检索', '命中内容/明确空结果', '身份不确定限制读取', '云端'],
    ],
  },
  {
    x: 1860, inputRail: 1830, resultRail: 2630, title: '搜索即执行＋身份/目标｜7', stroke: C.cobalt, fill: C.paleBlue,
    tools: [
      ['T17', '路线规划并发起导航', 'route_planning', '目的地/途经点/偏好', '地点确认→规划→启动导航', '路线/时间/启动状态', '地址模糊先补清/导航类串行', '生态'],
      ['T18', '视频搜索并播放', 'video_search', '名称/主题/平台', '搜索→候选匹配→播放', '实际视频/播放状态', '匹配成功不等于播放成功', '生态'],
      ['T19', '音乐搜索并播放', 'music_search', '歌曲/歌手/情绪/场景', '搜索→匹配→默认播放首条', '首播曲目/播放状态', '复杂关系先查事实/不重复播放', '生态'],
      ['T20', '播客搜索并播放', 'broadcast_search', '播客/节目/集数', '搜现有内容→选择→播放', '节目/集数/播放状态', '与生成新播客严格分开', '生态'],
      ['T21', '人脸身份注册', 'face_id_register', '姓名＋座位＋注册意图', '采集→质量检查→身份绑定', '注册/更新/重试原因', '姓名与位置缺一不可', '车端'],
      ['T22', '用户记忆写入', 'user_memory_operate', '事实/偏好/纠正/删除', '确认不确定项→按身份写入', '新增/更新/删除结果', '错用户近零容忍/临时态不存', '云端'],
      ['T23', '持续目标管理', 'goal_list_update', '新增/更新/删除目标', '查重→保存目标编号/条件/状态', '目标编号/等待状态', '目标列表不是执行器', '云端'],
    ],
  },
  {
    x: 2730, inputRail: 2700, resultRail: 3500, title: '异步生成／录音／交易｜4', stroke: C.sage, fill: C.paleSage,
    tools: [
      ['T24', '人工智能播客生成', 'ai_broadcast_generate', '主题/风格/长度', '受理→排队→生成', '状态/可播放音频产物', '受理成功不得报生成完成', '云端'],
      ['T25', '图片生成与编辑', 'image_generate', '生成/编辑指令', '受理→生成→保存/推送', '图片/地址/生成状态', '无产物不报完成/隐私授权', '云端'],
      ['T26', '录音纪要', 'audio_record', '开始/停止/查看', '空闲→录音→停止→纪要生成', '录音状态/纪要产物', '麦克风权限/隐私/中断恢复', '端/云'],
      ['T27', '停车缴费', 'parking_fee_pay', '车牌/车辆/缴费请求', '确认→订单→金额→付款页', '订单/金额/付款地址/展示状态', '订单幂等/支付成功需回调证据', '生态'],
    ],
  },
];

const toolStartY = 8290;
const toolGap = 178;
columns.forEach((column) => {
  rect(column.x, 8215, 740, 58, column.fill, column.stroke, 2.2, 6);
  text(column.x + 370, 8254, column.title, { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
  const lastCenter = toolStartY + (column.tools.length - 1) * toolGap + 80;
  connector([[column.inputRail, 8180], [column.inputRail, lastCenter]], { color: column.stroke, width: 2.5, arrow: false });
  connector([[column.resultRail, toolStartY + 80], [column.resultRail, 9945]], { color: column.stroke, width: 2.5, arrow: false });
  column.tools.forEach((tool, i) => {
    const y = toolStartY + i * toolGap;
    toolCard({
      x: column.x,
      y,
      code: tool[0],
      title: tool[1],
      field: tool[2],
      input: tool[3],
      mechanism: tool[4],
      outputLine: tool[5],
      gate: tool[6],
      domain: tool[7],
      fill: C.white,
      stroke: column.stroke,
    });
    connector([[column.inputRail, y + 80], [column.x, y + 80]], { color: column.stroke, width: 2, arrow: true });
    connector([[column.x + 740, y + 80], [column.resultRail, y + 80]], { color: column.stroke, width: 2, arrow: false });
  });
});

compact({ x: 2730, y: 9060, w: 740, h: 220, title: '动态任务代理（不计入 27）', fill: C.paleBlue, stroke: C.cobalt, dash: '8 6', lines: ['运行时注册复杂地图、行程或生态服务', '仍经字段/安全/幂等门禁', '回传进度、需用户、产物、终态或错误'] });
connector([[2700, 9160], [2730, 9160]], { color: C.cobalt, width: 2 });
connector([[3470, 9160], [3500, 9160]], { color: C.cobalt, width: 2, arrow: false });

connector([[890, 9945], [3500, 9945]], { width: 4, arrow: false, label: '原始结果汇聚总线（OUT）｜工具/代理结果都必须回流', labelX: 2195, labelY: 9915 });
connector([[1800, 9945], [1800, 10040]], { width: 4 });

// 08. Real effect, feedback, re-entry and second Planner call.
section(10020, '08', '真实执行、状态回读、工具反馈与第 2／N 轮', '被接收≠服务成功≠真实生效≠用户目标完成');
card({ x: 1090, y: 10090, w: 1420, h: 220, step: '24', domain: '端/生态', title: '协议适配、真实执行与状态回读', lines: ['执行：车控/导航/媒体/系统/联网/生成/身份/记忆/交易', '回读：设备最终值、导航阶段、实际播放、订单终态、产物', '输出：受理/运行/原始结果/错误＋实际状态或产物'] });
card({ x: 1090, y: 10380, w: 1420, h: 220, step: '25', domain: '云端', title: '结果标准化', lines: ['状态：成功／失败／部分成功／超时／取消／需补信息', '字段：错误、是否可重试、真实状态、产物、已自播内容', '时序：重复/迟到/取消后结果经关联编号和版本检查'] });
card({ x: 1090, y: 10670, w: 1420, h: 210, step: '26', domain: '云端', title: '工具执行反馈（tool_feedback）', fill: C.paleSage, stroke: C.sage, lines: ['它是一条新输入事件，不是上一次模型推理中的隐藏返回值', '同时写回对话、动作、端态、目标/任务进度和已呈现内容', '异常也必须回传，才能重新规划、降级或说明部分结果'] });
connector([[1800, 10310], [1800, 10380]]);
connector([[1800, 10600], [1800, 10670]], { color: C.sage });

compact({ x: 80, y: 10120, w: 900, h: 350, title: '端侧／生态责任边界', fill: C.paleSage, stroke: C.sage, lines: ['车端：设备协议、实际状态、安全前置、播放/界面呈现', '车企能力：车型/版本差异、账号和订单协议', '生态服务：搜索、地图、媒体、生成、交易终态', '云端 Planner 不得用话术代替下游真实回读'] });

compact({ x: 2620, y: 10120, w: 900, h: 350, title: '失败与竞态的统一出口', fill: C.white, stroke: C.deep, dash: '8 6', lines: ['执行拒绝/设备忙/车辆离线：重试、换工具、等待或降级', '部分成功：保留已成功分支，不整体重做', '重复/迟到：幂等与版本检查后丢弃', '取消后仍到达：不改写已取消终态'] });

card({ x: 1090, y: 10970, w: 1420, h: 180, step: '27', domain: '云端', title: '再次进入同一输入治理', lines: ['将 tool_feedback 与当前用户请求/事件/顾问建议按同一规则排队', '处理打断、合并、过期丢弃和用户新请求抢占'] });
card({ x: 1090, y: 11220, w: 1420, h: 180, step: '28', domain: '云端', title: '重建 ContextSnapshot', lines: ['最新结果覆盖被推翻的旧状态；刷新目标/任务进度', '新快照再次执行身份、新鲜度、相关性、冲突与压缩治理'] });
card({ x: 1090, y: 11470, w: 1420, h: 240, step: '29', domain: '云端', title: '第 2／N 轮：再次调用同一个 Planner／Director', fill: C.paleSage, stroke: C.sage, lines: ['输入：新快照＋上轮结果＋仍未完成的子目标', '判断：继续调工具、换工具、补槽/追问、等待、降级、取消或结束', '原则：依据新证据改计划，不机械重复上一个失败动作'] });
connector([[1800, 10880], [1800, 10970]], { color: C.sage });
connector([[1800, 11150], [1800, 11220]], { color: C.sage });
connector([[1800, 11400], [1800, 11470]], { color: C.sage });

compact({ x: 2620, y: 11200, w: 900, h: 430, title: '还需要新动作？｜上限/超时/打断/取消可观测', fill: C.paleBlue, stroke: C.cobalt, lines: ['是：新动作清单→同一硬门禁', '→同一工具/Agent→真实执行和回读', '→新 tool_feedback→再次统一输入', '否：交给完成证据门'] });
connector([[2510, 11590], [2620, 11590]], { label: '还需动作', labelX: 2565, labelY: 11570 });
connector([[3070, 11200], [3070, 11020], [2510, 11020]], { color: C.sage, dash: '8 6', label: '新结果回到27', labelX: 2960, labelY: 10990 });

// 09. Mutually exclusive completion gate and user output.
section(11800, '09', '用户完整目标完成证据门、四路输出与用户感知', '只有互斥终态，不允许一句“搞定了”跨级');
panel(1080, 11870, 1440, 610, '30 完成证据门', '互斥分支');
compact({ x: 1160, y: 11950, w: 1280, h: 110, title: '三个同时成立的完成门槛', lines: ['用户完整目标已满足＋无必要待执行动作＋无等待中任务/条件'] });
compact({ x: 1160, y: 12090, w: 600, h: 130, title: '已完成（done）', fill: C.paleSage, stroke: C.sage, lines: ['全部必要子目标有证据', '允许生成最终话术'] });
compact({ x: 1840, y: 12090, w: 600, h: 130, title: '待办/部分/失败', lines: ['保留已成功分支', '回下一轮恢复或说明'] });
compact({ x: 1160, y: 12240, w: 600, h: 130, title: '等待中（waiting）', fill: C.paleBlue, lines: ['等工具/条件/用户', '只可报“已设置/等待”'] });
compact({ x: 1840, y: 12240, w: 600, h: 130, title: '已取消（canceled）', lines: ['阻止未开始动作并清理', '只输出取消结果'] });
connector([[1800, 11710], [1800, 11870]]);
connector([[2440, 12155], [2580, 12155], [2580, 11590], [2510, 11590]], { color: C.sage, dash: '8 6', label: '恢复/降级', labelX: 2660, labelY: 11900 });

panel(1070, 12580, 1460, 660, '31 回复与四路输出编排', '云→端');
compact({ x: 1140, y: 12660, w: 630, h: 190, title: '语音路', domain: '车端', lines: ['回复文本→语音合成排队→扬声器', '证据：首音/播报完成/被打断'] });
compact({ x: 1830, y: 12660, w: 630, h: 190, title: '界面路', domain: '车端', lines: ['回复/进度→卡片/智能条/任务中心', '证据：展示/点击/关闭/超时回调'] });
compact({ x: 1140, y: 12880, w: 630, h: 190, title: '形象路', domain: '车端', lines: ['形象动作→头像/圆屏/云台/口型', '证据：端侧接收与呈现状态'] });
compact({ x: 1830, y: 12880, w: 630, h: 190, title: '实体结果路', domain: '车端', lines: ['工具→协议→车辆/应用/外部服务', '证据：执行回执＋真实状态回读'] });
compact({ x: 1140, y: 13100, w: 1320, h: 100, title: '语音、界面、形象和真实结果各自成功，再汇聚为用户感知', fill: C.paleSage, stroke: C.sage });
connector([[1480, 12480], [1480, 12580]], { color: C.sage, label: '已完成', labelX: 1600, labelY: 12545 });
connector([[1460, 12370], [1010, 12370], [1010, 12755], [1070, 12755]], { color: C.cobalt, dash: '8 6', label: '等待：只报阶段状态', labelX: 800, labelY: 12345 });
connector([[2140, 12370], [2580, 12370], [2580, 12975], [2530, 12975]], { color: C.muted, dash: '8 6', label: '取消结果', labelX: 2770, labelY: 12345 });

card({ x: 120, y: 12580, w: 820, h: 300, step: '32', domain: '车端', title: '用户最终感知', fill: C.paleSage, stroke: C.sage, lines: ['听到：话术与当前真实阶段一致', '看到：卡片/任务状态与后台事实一致', '感受到：车辆、应用或外部服务真实发生', '完成原则：三者一致，不能只靠一句“已经搞定”'] });
connector([[1140, 13150], [1010, 13150], [1010, 12730], [940, 12730]], { color: C.sage, width: 4, label: '云→端＋实体状态', labelX: 930, labelY: 13125 });

compact({ x: 2620, y: 12590, w: 900, h: 310, title: '播报打断与实体动作分离', domain: '车端', fill: C.white, stroke: C.deep, dash: '8 6', lines: ['播报中收到新请求：停播，保留被打断内容与任务状态', '新请求→再次统一输入治理', '无效输入/拒识：当前口径为停播且不自动恢复', '停止播报、卡片消失、实体动作取消是三件事'] });

// 10. Persistent Goal / Trigger / VLM and WIP Task service, physically connected.
section(13330, '10', '条件、定时、持续任务｜Goal、Advisor、Trigger、VLM 与任务服务回接主链', '已设置≠已触发≠已执行≠已完成');
connector([[2260, 9360], [2580, 9360], [2580, 13400], [2360, 13400]], { color: C.sage, width: 3, label: 'T23 目标保存副作用', labelX: 2700, labelY: 11320 });

panel(1110, 13400, 1380, 1840, '当前 Goal／Trigger 长期任务续跑主链', '当前与待验真');
compact({ x: 1260, y: 13480, w: 1080, h: 140, title: '33 Goal List 保存长期目标', fill: C.paleSage, stroke: C.sage, lines: ['目标编号、条件、范围、频率、状态、进度、退出条件', '创建前查重；补充需求更新原目标，不重建'] });
compact({ x: 1260, y: 13650, w: 1080, h: 120, title: '34 规则／订阅注册', lines: ['任务编号＋条件表达式＋生效范围＋起止时间＋版本'] });
compact({ x: 1260, y: 13800, w: 1080, h: 220, title: '35 Trigger 只判断“现在是否命中”', fill: C.paleBlue, lines: ['信号治理：标识、值/单位、时间、来源、置信度、有效期', '求值：数值/状态/时间窗/组合/语义', '保护：防抖/迟滞/边沿→去重/频控→优先级/互斥', '禁止：Trigger 直调工具；条件命中不等于任务完成'] });
compact({ x: 1260, y: 14050, w: 1080, h: 150, title: '36 命中结果？', fill: C.paleSage, stroke: C.sage, lines: ['否/未知：保持 waiting，继续监听', '是：产生 callback_id＋task/goal_id＋规则版本＋命中证据'] });
compact({ x: 1260, y: 14230, w: 1080, h: 150, title: '37 恢复原目标＋执行前复核', lines: ['去重/过期检查；重读最新车态、人物、权限、安全、网络', '只复核执行前约束，不重判 Trigger 条件'] });
compact({ x: 1260, y: 14410, w: 1080, h: 190, title: '38 再次进入统一输入＋最新 Context＋同一 Planner', fill: C.paleSage, stroke: C.sage, lines: ['云端：callback 作为 event/advisor 进入正常决策链', '固定生态/已批准端侧策略：仍过门禁并记录结果', '接收入口需按车企/版本配置并用运行记录验真'] });
compact({ x: 1260, y: 14630, w: 1080, h: 180, title: '39 同一门禁→工具/Agent→真实回读→结果处理', lines: ['工具结果或 Agent 观察不依赖最终话术，独立写回', '更新本轮运行、动作、目标/任务状态与用户通知'] });
compact({ x: 1260, y: 14840, w: 1080, h: 180, title: '40 结束策略与完整清理', fill: C.paleSage, stroke: C.sage, lines: ['一次任务：关闭；持续任务：回等待；部分失败：保留待办', '取消/过期/超失败上限：停规则、视觉、运行、通知并说明'] });
compact({ x: 1260, y: 15050, w: 1080, h: 130, title: '41 长期任务结果通知用户', fill: C.paleSage, stroke: C.sage, lines: ['语音/卡片/任务中心/服务端推送只反映事实终态', '重试/部分成功/关闭原因对用户可解释'] });
for (const [a, b] of [[13620,13650],[13770,13800],[14020,14050],[14200,14230],[14380,14410],[14600,14630],[14810,14840],[15020,15050]]) connector([[1800, a], [1800, b]], { color: C.sage, width: 2.5 });
connector([[1260, 14125], [1110, 14125], [1110, 13910], [1260, 13910]], { color: C.sage, dash: '8 6', label: '否/未知：继续等待', labelX: 980, labelY: 14090 });
connector([[1260, 14930], [1110, 14930], [1110, 13910], [1260, 13910]], { color: C.sage, dash: '8 6', label: '持续任务：再等待', labelX: 1010, labelY: 14660 });

// Advisors feed the same input path; never execute directly.
card({ x: 80, y: 13410, w: 900, h: 300, title: 'Advisor 顾问支路｜不直接执行', domain: '云端', fill: C.paleSage, stroke: C.sage, lines: ['静态顾问：舒适/出行/内容/情感，按场景给建议', '动态顾问：监控长期目标、复盘和给建议', '输出：advisor 类型输入→统一输入治理', '顾问建议与用户新请求冲突时，由输入治理/Planner 仲裁'] });
connector([[980, 13560], [1120, 13560], [1120, 14505], [1260, 14505]], { color: C.sage, width: 2.5, label: 'advisor 回接统一输入', labelX: 980, labelY: 14340 });

// Dynamic VLM chain. Default VLM is already connected at C04; on-demand is T15 -> OUT bus.
card({ x: 80, y: 13760, w: 900, h: 1130, title: 'VLM 三条链｜按需/常驻/动态', domain: '端/云', fill: C.white, stroke: C.sage, lines: ['按需视觉：T15→权限/取帧→VLM→工具结果总线', '默认常驻：周期场景摘要→C04 Context', '动态长时：只沿下方任务关联链运行'] });
const vlmNodes = [
  ['V01 动态视觉目标', '例：观察孩子是否醒来'],
  ['V02 全量观察清单＋版本', '新清单覆盖旧清单；结束时重算/下发空清单'],
  ['V03 端侧保存任务集并周期取帧', '视觉采样周期不等于用户通知周期'],
  ['V04 客观观察报告', '任务编号＋描述＋置信度＋时间'],
  ['V05 按任务编号恢复原条件', '空包/乱序/迟到/重复报告去重'],
  ['V06 Trigger 语义匹配', '是/否/未知；只有“是”才生成一次回调'],
];
vlmNodes.forEach(([title, line], i) => {
  const y = 13940 + i * 150;
  compact({ x: 130, y, w: 800, h: 128, title, lines: [line], fill: i === 5 ? C.paleSage : C.white, stroke: C.sage });
  if (i > 0) connector([[530, y - 22], [530, y]], { color: C.sage, width: 2 });
});
connector([[930, 14718], [1080, 14718], [1080, 13910], [1260, 13910]], { color: C.sage, width: 2.5, label: '动态 VLM 只回 Trigger', labelX: 1010, labelY: 14590 });
compact({ x: 130, y: 14850, w: 800, h: 180, title: '动态视觉禁止路径', fill: C.paleSage, stroke: C.sage, dash: '8 6', lines: ['报告不直接进 Context；不直接调工具', '“睁眼”不直接等于“已醒来”', '必须经任务关联＋Trigger 语义判断'] });

// WIP Task Service branch. It is connected to the current flow, not a free-standing board.
panel(2580, 13400, 940, 1840, '建设中 Task Service 替代路径', '非当前生产', { stroke: C.sage, headerFill: C.sage, dash: '10 8' });
const wipNodes = [
  ['W01 任务管理入口', '任务接口/界面接口'],
  ['W02 Task Agent', '只做入口和透传，不是第二个 Planner'],
  ['W03 Task Ingress＋Spec Builder', '解析/绑定/幂等/恢复；创建/更新/取消/查询'],
  ['W04 Task Manager＋事实仓库', '唯一维护 Task/Run/Event/Action/绑定的确定状态'],
  ['W05 Trigger Adapter', '复用既有 RuleSpec/Trigger，不再造第二套'],
  ['W06 Callback→Ingress→Create Run', '去重/旧版本/已关闭不建新 Run'],
  ['W07 Run Guard＋Runtime Dispatcher', '读最新 Context/安全；回原 Planner 或固定生态服务'],
  ['W08 Result Hook＋HandleRunResult', '独立接结果；事务写回＋重试/补偿'],
  ['W09 Outbox＋TaskMessage', '待发送→已发送→已确认；语音/卡片/任务中心'],
];
wipNodes.forEach(([title, line], i) => {
  const y = 13480 + i * 185;
  compact({ x: 2640, y, w: 820, h: 155, title, lines: [line], fill: C.white, stroke: C.sage, dash: '8 6' });
  if (i > 0) connector([[3050, y - 30], [3050, y]], { color: C.sage, width: 2, dash: '7 6' });
});
connector([[2490, 13550], [2580, 13550], [2640, 13550]], { color: C.sage, dash: '8 6', label: '迁移/替代，不与当前链相加', labelX: 2880, labelY: 13370 });
connector([[2640, 14310], [2490, 14310], [2490, 13910], [2340, 13910]], { color: C.sage, dash: '8 6', label: '复用同一 Trigger', labelX: 2540, labelY: 14095 });
connector([[2340, 14120], [2510, 14120], [2510, 14495], [2640, 14495]], { color: C.sage, dash: '8 6', label: 'callback 回 Ingress', labelX: 2550, labelY: 14360 });
connector([[2640, 14680], [2490, 14680], [2490, 14505], [2340, 14505]], { color: C.sage, dash: '8 6', label: '同一 Planner/执行主链', labelX: 2560, labelY: 14715 });
connector([[2340, 14720], [2530, 14720], [2530, 14865], [2640, 14865]], { color: C.sage, dash: '8 6', label: '结果进 Hook', labelX: 2510, labelY: 14910 });
connector([[2640, 15050], [2490, 15050], [2490, 15115], [2340, 15115]], { color: C.sage, dash: '8 6', label: '通知回用户输出', labelX: 2750, labelY: 15180 });

// 11. Trace and evaluation are the terminal stage, attached to both immediate and async outcomes.
section(15420, '11', '全链追踪、分阶段指标与 AI 问题归因', '评测分母以用户完整目标为主，不只看单个 action');
connector([[530, 12880], [530, 15340], [1800, 15340], [1800, 15490]], { color: C.muted, width: 3, dash: '10 8', label: '即时结果写入 Trace', labelX: 830, labelY: 15310 });
connector([[1800, 15180], [1800, 15490]], { color: C.sage, width: 3, label: '长期任务结果写入 Trace', labelX: 2070, labelY: 15380 });
card({ x: 180, y: 15490, w: 3240, h: 270, step: '42', domain: '端/云', title: '同一条请求可完整回放', fill: C.paleBlue, lines: ['request_id／turn_id／action_id／tool_name／task_id／run_id／callback_id／rule_version', '车型/环境＋原始语音/文字＋路由决策＋ContextSnapshot＋提示词/模型版本', '动作下发＋工具/代理结果＋真实状态＋完成判断＋语音/界面/用户感知'] });

const metrics = [
  ['语音输入', '误/漏唤醒；早截/尾噪；否定/数字/地点保真；说话人/座位；时延'],
  ['路由与拒识', '端侧/句法快路准确；复杂上云召回；误/漏拒；双执行；迟到覆盖'],
  ['Context', '必要事实覆盖；来源/时间/有效期；陈旧；冲突裁决；隐私越权=0'],
  ['Planner', '目标/分型；工具/参数；原子拆解；依赖；澄清；同题稳定；失败重规划'],
  ['工具与执行', '已接收/已调用/已生效/已完成四段；超时/重试/取消；幂等；回读'],
  ['长期任务/VLM', '创建；孤儿规则；误/漏/重触发；时延；顾问打扰；视觉匹配；终态清理'],
  ['端到端', '完整目标成功；复合目标全成；首确认/首动作/总耗时；部分恢复；假成功'],
];
metrics.forEach(([title, line], i) => {
  const row = i < 4 ? 0 : 1;
  const col = i < 4 ? i : i - 4;
  const w = row === 0 ? 790 : 1040;
  const x = row === 0 ? 180 + col * 810 : 180 + col * 1060;
  const y = row === 0 ? 15810 : 16090;
  compact({ x, y, w, h: 240, title, lines: [line], fill: i % 2 === 0 ? C.white : C.paleSage, stroke: i % 2 === 0 ? C.cobalt : C.sage });
  connector([[x + w / 2, 15760], [x + w / 2, y]], { color: i % 2 === 0 ? C.cobalt : C.sage, width: 2, arrow: true });
});

card({ x: 180, y: 16400, w: 3240, h: 540, step: '43', domain: '云端', title: '只有证据到位后，才判定是否为 AI 决策能力问题', lines: ['① 路由是否走对？否→端侧候选/句法/拒识/端云唯一裁决问题', '② 工具定义、能力、参数与前置条件是否清楚？否→工具契约问题', '③ 必要事实是否采到并进入 Context？否→采集/过期/过滤/隔离/压缩问题', '④ 模型看到的事实是否正确无矛盾？否→提示词/知识/示例/拼装问题', '⑤ 上述全对仍理解错目标、动作、工具、参数或依赖？是→优先判 AI 决策能力', '⑥ 正确动作是否正确下发、执行、回读并关联？否→工程/工具/时序问题', '⑦ 新反馈到来后能否正确恢复和收口？否→AI 再规划或状态问题'] });
connector([[1800, 16330], [1800, 16400]], { width: 3 });
compact({ x: 900, y: 17020, w: 1800, h: 220, title: '闭环成立：用户完整目标有真实证据，且链路可回放、问题可归因', fill: C.cobalt, stroke: C.deep, lines: ['产品验收不停在模块名和单轮 JSON，而是验证整条用户任务的输入、决策、执行、状态和感知一致'], titleFill: C.white, bodyFill: C.white });
connector([[1800, 16940], [1800, 17020]], { color: C.sage, width: 4 });

svg.push('</svg>');
writeFileSync(output, svg.join('\n'));
console.log(output);
