import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('./diagram-v10-business-architecture.svg', import.meta.url));
const W = 18100;
const H = 9000;

const C = {
  canvas: '#ECECEC',
  paper: '#F4F2EE',
  white: '#FFFFFF',
  ink: '#17324D',
  muted: '#50667A',
  cobalt: '#185DB7',
  deep: '#0D4FA8',
  pale: '#EAF2FD',
  pale2: '#F5F8FC',
  sageBg: '#E7F3EA',
  sage: '#3F7F5D',
  amberBg: '#FBF1D9',
  amber: '#9C681B',
  purpleBg: '#F1ECF8',
  purple: '#766092',
  redBg: '#FBEAEA',
  red: '#B04444',
  line: '#AEBBC7',
  softLine: '#D3DBE2',
};

const bg = [];
const edges = [];
const nodes = [];
const overlays = [];
const boxes = new Map();
const stats = { rectangles: 0, texts: 0, connectors: 0, circles: 0 };

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

function rect(x, y, w, h, fill = C.white, stroke = C.line, sw = 2, rx = 10, layer = nodes, dash = '') {
  layer.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  stats.rectangles += 1;
}

function circle(cx, cy, r, fill = C.cobalt, stroke = C.cobalt, sw = 2, layer = nodes) {
  layer.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
  stats.circles += 1;
}

function text(x, y, value, size = 26, weight = 500, fill = C.ink, anchor = 'start', layer = nodes, letterSpacing = 0) {
  layer.push(`<text x="${x}" y="${y}" font-size="${size}px" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${letterSpacing ? ` letter-spacing="${letterSpacing}"` : ''}>${esc(value)}</text>`);
  stats.texts += 1;
}

function multiline(x, y, lines, size = 26, gap = 42, weight = 500, fill = C.ink, layer = nodes) {
  lines.forEach((line, index) => text(x, y + index * gap, line, size, weight, fill, 'start', layer));
}

function register(id, x, y, w, h) {
  boxes.set(id, { x, y, w, h });
}

function anchor(id, side = 'right') {
  const box = boxes.get(id);
  if (!box) throw new Error(`Unknown box: ${id}`);
  if (side === 'left') return [box.x, box.y + box.h / 2];
  if (side === 'right') return [box.x + box.w, box.y + box.h / 2];
  if (side === 'top') return [box.x + box.w / 2, box.y];
  if (side === 'bottom') return [box.x + box.w / 2, box.y + box.h];
  return [box.x + box.w / 2, box.y + box.h / 2];
}

function route(points, { color = C.cobalt, width = 4, dash = '', arrow = true, label = '', labelAt = null } = {}) {
  const normalized = [];
  points.forEach((point, index) => {
    if (index > 0) {
      const previous = normalized[normalized.length - 1];
      if (previous[0] !== point[0] && previous[1] !== point[1]) normalized.push([point[0], previous[1]]);
    }
    const previous = normalized[normalized.length - 1];
    if (!previous || previous[0] !== point[0] || previous[1] !== point[1]) normalized.push(point);
  });
  edges.push(`<polyline points="${normalized.map((point) => point.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`);
  stats.connectors += 1;
  if (label) {
    const point = labelAt || normalized[Math.floor(normalized.length / 2)];
    const widthEstimate = Math.max(150, label.length * 27 + 44);
    rect(point[0] - widthEstimate / 2, point[1] - 24, widthEstimate, 48, C.white, color, 1.5, 8, overlays);
    text(point[0], point[1] + 10, label, 24, 750, color, 'middle', overlays);
  }
}

function connect(fromId, toId, options = {}) {
  const from = anchor(fromId, options.from || 'right');
  const to = anchor(toId, options.to || 'left');
  const points = [from];
  if (from[1] !== to[1]) {
    const midX = options.midX ?? (from[0] + to[0]) / 2;
    points.push([midX, from[1]], [midX, to[1]]);
  }
  points.push(to);
  route(points, options);
}

function badge(x, y, label, tone = 'blue', layer = nodes) {
  const map = {
    blue: [C.pale, C.cobalt],
    green: [C.sageBg, C.sage],
    amber: [C.amberBg, C.amber],
    purple: [C.purpleBg, C.purple],
    red: [C.redBg, C.red],
    gray: [C.paper, C.muted],
  };
  const [fill, stroke] = map[tone] || map.blue;
  const width = Math.max(126, label.length * 28 + 34);
  rect(x, y, width, 48, fill, stroke, 1.5, 24, layer);
  text(x + width / 2, y + 33, label, 23, 750, stroke, 'middle', layer);
  return width;
}

function stageHeader(stage) {
  const { x, y, w, number, title: titleValue, subtitle, status, statusTone = 'blue' } = stage;
  rect(x, y, w, 214, C.paper, C.deep, 3, 12, nodes);
  rect(x, y, 18, 214, C.cobalt, C.cobalt, 0, 0, nodes);
  circle(x + 72, y + 67, 42, C.cobalt, C.cobalt, 2, nodes);
  text(x + 72, y + 78, number, 29, 850, C.white, 'middle');
  text(x + 132, y + 72, titleValue, 35, 850, C.deep);
  text(x + 34, y + 142, subtitle, 25, 600, C.muted);
  const statusWidth = badge(x + 34, y + 156, status, statusTone);
  badge(x + 52 + statusWidth, y + 156, stage.owner, 'gray');
}

function keyCard(id, stage, titleValue, lines, tone = 'blue') {
  const { x, w } = stage;
  const y = 700;
  const tones = {
    blue: [C.pale, C.cobalt],
    green: [C.sageBg, C.sage],
    amber: [C.amberBg, C.amber],
    purple: [C.purpleBg, C.purple],
  };
  const [fill, stroke] = tones[tone] || tones.blue;
  rect(x + 26, y, w - 52, 250, fill, stroke, 3, 14, nodes);
  text(x + 54, y + 52, titleValue, 31, 850, C.ink);
  multiline(x + 54, y + 100, lines, 26, 44, 600, C.muted);
  register(id, x + 26, y, w - 52, 250);
}

function caseCard(id, stage, lines) {
  const { x, w } = stage;
  const y = 964;
  rect(x + 26, y, w - 52, 212, C.white, C.cobalt, 2.5, 10, nodes);
  rect(x + 42, y + 18, 252, 42, C.pale, C.cobalt, 1.5, 21, nodes);
  text(x + 168, y + 48, '贯穿案例｜本阶段产物', 23, 800, C.cobalt, 'middle');
  multiline(x + 42, y + 91, lines, 26, 37, 650, C.ink);
  register(id, x + 26, y, w - 52, 212);
}

function rowBox(id, stage, y, h, label, lines, tone = 'plain') {
  const { x, w } = stage;
  const tones = {
    plain: [C.white, C.line, C.pale, C.cobalt],
    mechanism: [C.pale2, C.cobalt, C.cobalt, C.white],
    output: [C.sageBg, C.sage, C.sage, C.white],
    failure: [C.redBg, C.red, C.red, C.white],
    metric: [C.paper, C.amber, C.amber, C.white],
  };
  const [fill, stroke, tagFill, tagText] = tones[tone] || tones.plain;
  rect(x + 26, y, w - 52, h, fill, stroke, 2, 10, nodes);
  rect(x + 42, y + 20, 188, h - 40, tagFill, tagFill, 0, 8, nodes);
  text(x + 136, y + h / 2 + 9, label, 24, 850, tagText, 'middle');
  const lineGap = lines.length >= 9 ? 38 : lines.length >= 7 ? 42 : 50;
  const totalHeight = (lines.length - 1) * lineGap;
  const firstY = y + (h - totalHeight) / 2 + 9;
  multiline(x + 254, firstY, lines, 26, lineGap, 560, tone === 'failure' ? C.red : C.ink);
  register(id, x + 26, y, w - 52, h);
}

function drawStage(stage) {
  rect(stage.x, 470, stage.w, 2620, stage.index % 2 ? C.pale2 : C.paper, C.line, 2, 12, bg);
  stageHeader(stage);
  keyCard(`${stage.id}_KEY`, stage, stage.keyTitle, stage.keyLines, stage.keyTone || 'blue');
  caseCard(`${stage.id}_CASE`, stage, stage.caseLines);
  rowBox(`${stage.id}_IN`, stage, 1190, 248, `${stage.number}.1 输入`, stage.input);
  rowBox(`${stage.id}_MECH`, stage, 1470, 470, `${stage.number}.2 机制`, stage.mechanism, 'mechanism');
  rowBox(`${stage.id}_OUT`, stage, 1972, 268, `${stage.number}.3 输出`, stage.output, 'output');
  rowBox(`${stage.id}_FAIL`, stage, 2272, 268, `${stage.number}.4 失败`, stage.failure, 'failure');
  rowBox(`${stage.id}_METRIC`, stage, 2572, 490, `${stage.number}.5 指标`, stage.metrics, 'metric');
}

// Canvas and title: the content itself states the architectural contract.
rect(0, 0, W, H, C.canvas, C.canvas, 0, 0, bg);
rect(80, 36, W - 160, 354, C.paper, C.deep, 4, 16, bg);
rect(80, 36, 32, 354, C.cobalt, C.cobalt, 0, 0, nodes);
text(154, 111, '豆包汽车｜语音用户请求到真实结果｜完整业务架构', 48, 900, C.deep);
text(154, 172, '一次请求只允许一条执行主线；工具返回必须回到同一 Planner / Director，重新判断后才能继续、等待或结束。', 29, 650, C.ink);
text(154, 223, '用户发声 → 语音入口 → 端云路由 → Context → Planner / Director → 确定性门禁 → 调度执行 → 反馈完成 → 用户可感知结果', 28, 800, C.cobalt);
text(154, 277, '真实完成口径：请求被接收 ≠ 服务调用成功 ≠ 真实状态生效 ≠ 用户完整目标完成。', 28, 800, C.red);
badge(154, 313, '蓝色：请求与下发', 'blue');
badge(720, 313, '绿色：真值与反馈', 'green');
badge(1306, 313, '琥珀：等待与长期控制', 'amber');
badge(2058, 313, '紫色：长期方案 / 待验真', 'purple');
badge(2860, 313, '红色：拒绝、异常、失败', 'red');
rect(9900, 66, 7870, 278, C.pale, C.cobalt, 2.5, 14, nodes);
text(9940, 119, '贯穿案例｜同一笔请求如何跑完整条链', 31, 850, C.deep);
text(9940, 171, '“我有点热，先把主驾温度调到 20°C，10 分钟后关座椅加热。”', 29, 800, C.cobalt);
text(9940, 220, '即时动作：调温；条件动作：登记等待 → 10 分钟后 Trigger 命中 → 回同一 Planner → 执行关闭。', 26, 650, C.ink);
text(9940, 268, '未获得真实结果前，只能说“已受理 / 正在执行 / 等待中”，不能提前说完整目标完成。', 26, 700, C.red);

const stages = [
  {
    id: 'S1', index: 0, x: 80, y: 470, w: 2100, number: '01', title: '语音入口',
    subtitle: '从车内声音形成可追踪 user_query', status: '需求定义｜量产现状待核', statusTone: 'purple',
    owner: 'Owner/部署｜车端语音链',
    keyTitle: '车内声音 → 统一用户请求', keyTone: 'blue',
    keyLines: ['先判断能否听、该不该听、谁在说；', '再把流式识别结果封装成可追踪的一轮输入。'],
    caseLines: ['final_text＝“我有点热，先把主驾温度调到20°C，', '10分钟后关座椅加热”｜speaker＝主驾｜zone＝前排'],
    input: ['麦克风权限＋语音总开关', '唤醒词 / 主驾免唤醒配置', '原始音频流＋座位＋会话时间', '播报中插话、连续指令与多说话人'],
    mechanism: ['① 麦克风与语音开关前置门', '② 唤醒 / 主驾免唤醒判定', '③ AEC 回声消除＋降噪＋波束', '④ 五音区定位＋说话人归属', '⑤ VAD 端点检测：何时说完', '⑥ 多 Query 合并 / 拆分与去重', '⑦ 离线首屏与在线 final 仲裁', '⑧ 打断、续说和会话轮次归一'],
    output: ['final_text＋增量文本轨迹', 'speaker_name＋position＋置信度', 'session / request / turn / timestamp', '标准 user_query 进入唯一主链'],
    failure: ['未授权 / 语音关闭 / 未唤醒', '错音区、多人串音、VAD 早截断', '否定 / 数字 / 地点 / 人名丢失', '首屏与 final 冲突却未覆盖'],
    metrics: ['唤醒率 / 误唤醒率｜五音区 / 说话人正确率', 'ASR 句准｜首字 / 尾字截断率', '否定、数字、时间与地点保真率', 'VAD 判停准确率｜多 Query 合并准确率', '离线首屏 / 在线 final 冲突率', '入口 P50 / P95 / P99 时延'],
  },
  {
    id: 'S2', index: 1, x: 2230, y: 470, w: 2250, number: '02', title: '端云路由',
    subtitle: '生成候选，但只允许一个执行者获胜', status: '当前＋演进态并列呈现', statusTone: 'amber',
    owner: 'Owner/部署｜端云路由 / 仲裁',
    keyTitle: '一轮只签发一个 execution_token', keyTone: 'green',
    keyLines: ['快路、NLU、意图路由和 Planner 不能同时执行；', '裁决结果必须带理由、置信度与被丢弃候选。'],
    caseLines: ['判定＝复杂：含“即时车控＋10分钟条件动作”', 'winner＝Planner｜其余候选不执行｜reason 可追踪'],
    input: ['标准 user_query＋会话历史摘要', '车型 / 版本 / 在线状态 / 能力集', '全量启动状态＋实时增量车况', '领域规则、风险级别与候选路由'],
    mechanism: ['【短期 ToB】传统 NLU＋领域规则', 'LLM 判断简单 / 复杂并做仲裁', '【意图路由】专用模块 / 快路候选', '当前边界、优先级与签名仍需核验', '【长期】句法 RAG：明确标准表达', '【长期】情景 RAG：车况 / 记忆 / 场景', '复杂、多步、含糊请求进入 Planner', '统一裁决：只给一个 execution_token'],
    output: ['route_id＋winner＋reason＋confidence', 'executor：快路 / 云简单 / Planner / 拒识', 'execution_token＋能力版本快照', '其余候选标记丢弃原因并审计'],
    failure: ['双执行 / 重复副作用', '复杂请求误走快路；简单请求上云过慢', '端云候选冲突、迟到候选覆盖', '拒识与澄清没有用户出口'],
    metrics: ['简单 / 复杂分类 ACC｜错分 / 兜底率', '快路命中 / 错命中｜拒识准确率', '唯一裁决率｜双执行率必须为 0', '端云冲突率｜裁决可解释覆盖率', '路由 P50 / P95 / P99 时延'],
  },
  {
    id: 'S3', index: 2, x: 4530, y: 470, w: 2250, number: '03', title: 'Context',
    subtitle: '把分散事实治理成同一轮可用快照', status: '公共 Context 方案｜现状待核', statusTone: 'purple',
    owner: 'Owner/部署｜云端 Context 公共服务',
    keyTitle: '不是“堆信息”，而是生成事实快照', keyTone: 'blue',
    keyLines: ['模型只应看与本轮目标有关、权限合法、时间有效的事实；', '缺失与冲突也必须显式交给 Planner。'],
    caseLines: ['known＝主驾、当前时间、具备空调 / 座椅加热能力', 'unknown＝当前温度 / 加热档位真值｜goal＝降温＋定时关闭'],
    input: ['user_query＋近轮 / 远轮对话', 'env_info / status：车辆与设备状态', 'memory：身份、偏好、历史事实', 'goal / advisor / event / visual_info'],
    mechanism: ['① 接入：统一多源事件与版本', '② 结构化：事实、来源、时间、归属', '③ 筛选降噪：只留本轮必要内容', '④ 权限 / 身份 / 车型 / 环境隔离', '⑤ 新鲜度校验与冲突消解', '⑥ 压缩：远区摘要、近区保真', '⑦ 分发：构造 SP＋UP＋动态变量', '⑧ 缺失 / 冲突清单随快照下发'],
    output: ['context_snapshot_id＋版本＋时间', 'known / unknown / conflict / stale', 'SP 固定规则＋UP 当前输入与历史', '给 Planner 的同一事实基线'],
    failure: ['状态缺失、过期或互相矛盾', '记忆串用户 / 串车型 / 串环境', '压缩丢失否定、依赖或未完成动作', '上下文过长导致时延与缓存断裂'],
    metrics: ['必要事实覆盖率｜新鲜度命中率', '冲突未解率｜错误记忆注入率', '权限 / 隔离违规必须为 0', '压缩保真率｜输入 token', 'Prompt Cache 命中率｜组装时延'],
  },
  {
    id: 'S4', index: 3, x: 6830, y: 470, w: 2300, number: '04', title: 'Planner / Director',
    subtitle: '同一个决策职能，不是前后串联的两个模块', status: '当前核心决策节点', statusTone: 'green',
    owner: 'Owner/部署｜云端 Planner 团队',
    keyTitle: '理解目标 → 计划 → 观察 → 再计划', keyTone: 'blue',
    keyLines: ['第一次看 user_query；后续轮次看 advisor / tool_feedback；', '输出“怎么说”和“调用哪些工具”，自己不直接控车。'],
    caseLines: ['A1＝主驾温度设20°C（即时）', 'A2＝10分钟后关闭座椅加热（条件任务）｜talk＝确认两步'],
    input: ['SP＋UP＋context_snapshot', '当前输入：user_query / advisor / tool_feedback', 'event（来自本地 SP 快照）', '工具描述 / 参数 / 能力版本＋上轮真实结果'],
    mechanism: ['① 识别用户完整目标与约束', '② 区分 known / unknown，决定是否澄清', '③ 分型：单步 / 并行 / 串行 / 条件 / 持续', '④ 拆子目标并建立依赖 DAG', '⑤ 选择工具、参数、顺序与等待条件', '⑥ 规划话术：确认 / 进度 / 结果 / 失败', '⑦ 观察 feedback 更新事实与状态', '⑧ 继续、换工具、等待或收口'],
    output: ['【已确认】话术＋工具调用候选', '本地 SP：talk_or_not / talk_content / emoji_id / action_list', '运行时字段与精确 schema 仍需核验', '候选必须继续通过确定性门禁'],
    failure: ['目标理解错、漏子目标或错误拆分', '工具 / 参数 / 依赖顺序错误', '无证据先说“已完成”', '重复规划、死循环或错误终止'],
    metrics: ['任务拆解：缺失 / 冗余 / 错误率', '工具名 ACC｜参数 ACC｜依赖拓扑正确率', 'P50 首 token ≤500ms｜P90 ≤800ms', '推理 ACC ≥90%｜端状态 ACC ≥93%（PRD目标）', '澄清率｜一致率', 'feedback 再规划成功率｜复杂任务完成率'],
  },
  {
    id: 'S5', index: 4, x: 9180, y: 470, w: 2300, number: '05', title: '门禁与任务形态',
    subtitle: '模型给候选，确定性系统决定能不能做', status: '目标门禁｜责任与联调待确认', statusTone: 'purple',
    owner: 'Owner/部署｜编排 / 安全 / 能力平台协同',
    keyTitle: 'action_list 不是执行事实', keyTone: 'amber',
    keyLines: ['先校验，再决定即时执行、并行、串行或登记长期任务；', '有依赖时前置失败必须阻断后续。'],
    caseLines: ['A1 校验通过→立即下发；A2 校验通过→登记条件任务', 'Task＝待执行 / 等待10分钟；注册成功≠A2已经完成'],
    input: ['话术＋候选工具调用＋依赖 DAG', '身份 / 权限 / 风险 / 当前真实状态', '能力注册表、参数 schema、版本', '幂等键、超时、重试与取消策略'],
    mechanism: ['① JSON / schema / 必填参数校验', '② 工具存在、车型能力与权限校验', '③ 安全规则、状态约束和风险确认', '④ 无依赖动作可并行', '⑤ 有依赖动作逐步执行', '⑥ 前置失败则后继阻断 / 降级', '⑦ execution_token＋幂等＋去重', '⑧ 即时 / 条件 / 持续任务分流'],
    output: ['accepted_actions＋blocked_actions＋原因', '执行批次、拓扑、超时与补偿策略', '任务记录：待执行 / 执行中 / 暂停', '完成 / 失败只由后续真值推进'],
    failure: ['非法动作误放行；合法动作误拦截', '重复调用造成真实副作用', '依赖拓扑错误或前置失败仍继续', '条件任务“注册成功”被当成目标完成'],
    metrics: ['结构通过率｜安全拦截 / 误拦率', '高风险误放行必须为 0', '依赖正确率｜前置失败阻断率', '幂等 / 重复执行率｜取消成功率', '并行收益｜门禁 P95｜任务状态一致率'],
  },
  {
    id: 'S6', index: 5, x: 11530, y: 470, w: 2450, number: '06', title: '调度与真实执行',
    subtitle: '统一入口下发工具，车端与生态服务产生真实结果', status: '当前执行主链｜工具注册表待核', statusTone: 'amber',
    owner: 'Owner/部署｜工具调度＋各下游 Owner',
    keyTitle: '调度器 → 适配器 → 工具 / 设备 / 服务', keyTone: 'blue',
    keyLines: ['每个 action 都带身份、版本、依赖、超时和幂等信息；', '调用成功只证明接口返回，不证明现实已经改变。'],
    caseLines: ['A1→车控工具(主驾, 20°C)；返回 raw response', 'A2→Task / Trigger 注册等待；10分钟到点只产生 event'],
    input: ['accepted action_id＋tool_name＋params', 'execution_token＋dependency＋priority', '车型 / 租户 / 环境 / 能力版本', 'timeout / retry / cancel / callback 约束'],
    mechanism: ['① 调度器按拓扑取可运行 Action', '② 工具注册中心解析能力与版本', '③ Adapter 做参数 / 协议 / 单位转换', '④ 下发车端、云服务或第三方生态', '⑤ 记录受理、执行、产物与错误', '⑥ 可安全重试才重试；支持取消', '⑦ 更新 Action / Task 状态', '⑧ 七类能力在下方逐一展开'],
    output: ['raw tool response＋错误码＋时间', 'accepted / running / success / failed / timeout', '产物、设备回执、callback 或等待句柄', '真实状态回读需另行校验【待确认】'],
    failure: ['工具不存在、版本漂移、签名不一致', '参数 / 单位 / 协议适配错误', '超时、断网、第三方失败或重复回调', '接口成功但车辆 / 服务未真实生效'],
    metrics: ['工具可用率｜超时 / 重试 / 取消率', '真实业务成功率【口径待确认】', '副作用误执行率｜重复执行率', '排队 / 执行 P50 / P95 / P99', '工具版本兼容率｜分车型 / 版本 / 场景统计'],
  },
  {
    id: 'S7', index: 6, x: 14030, y: 470, w: 2000, number: '07', title: '反馈与完成',
    subtitle: '关联真值，回到同一 Planner 再判断', status: '当前反馈闭环＋完成责任待定', statusTone: 'purple',
    owner: 'Owner/部署｜反馈 / Task / Planner｜完成待核',
    keyTitle: 'tool response → tool_feedback → replan', keyTone: 'green',
    keyLines: ['原始返回与真实回读先做关联、归一与持久化；', '再作为新事件回到同一 Planner / Director。'],
    caseLines: ['先回流：A1成功；A2等待中→Planner只报阶段进度', '10分钟后 Trigger event→同一Planner→A2执行→再回流'],
    input: ['raw response＋callback＋错误', 'observed_state 真实回读【待确认】', 'request / turn / action / task / run 标识', '当前 Goal / Task / Action 版本'],
    mechanism: ['① 用 execution_token / action_id 关联', '② 重复、迟到、取消后结果隔离', '③ 标准化成功 / 失败 / 部分 / 超时', '④ 写回 Action / Goal / Task 状态', '⑤ 重建 Context 快照', '⑥ 同一 Planner 观察并 replan', '⑦ 判断继续 / 等待 / 完成 / 失败', '⑧ 全局完成责任边界【待确认】'],
    output: ['tool_feedback＋evidence_level＋actual_state', 'next_state：继续 / 等待 / 完成 / 失败 / 取消', '新 action_list 或无动作收口', '结果与原因进入输出编排'],
    failure: ['把 response 当成真实生效', 'feedback 丢失、错绑或迟到覆盖新状态', '部分成功被说成全部完成', '重复 replan / 无限重试 / 终态回滚'],
    metrics: ['关联准确率｜丢失 / 迟到 / 重复率', '真实回读覆盖率【待确认】', 'replan 成功率｜部分失败恢复率', 'false-complete / 假完成率', '终态一致率｜完整目标成功率'],
  },
  {
    id: 'S8', index: 7, x: 16080, y: 470, w: 1890, number: '08', title: '用户输出',
    subtitle: '让用户听到、看到，并能验证真的发生', status: '当前多模态输出', statusTone: 'green',
    owner: 'Owner/部署｜车端 VUI/HMI/TTS＋实体执行',
    keyTitle: '话术、界面、形象、实体状态一致', keyTone: 'green',
    keyLines: ['只呈现当前有证据的事实；', '继续、等待、失败也必须明确告诉用户。'],
    caseLines: ['先说：已调至20°C；10分钟后将关闭座椅加热', '到点且有真值后再说：座椅加热已关闭｜GUI同步终态'],
    input: ['Planner 话术＋任务 / 工具真值', '输出策略＋音区 / 屏幕 / 会话状态', '进度、等待条件、失败原因与补救', '可操作卡片、产物与实体状态'],
    mechanism: ['① TTS / 提示音 / 首响应', '② GUI：桌面 / 小窗 / 卡片 / 任务中心', '③ 数字人 / emoji / 动作', '④ 车控 / 导航 / 媒体等实体变化', '⑤ 多屏、多音区与当前焦点仲裁', '⑥ 播报中打断、续播与重复抑制', '⑦ 完成只播真实完成的部分', '⑧ 用户追问继续进入新一轮主链'],
    output: ['听到：确认、进度、结果或失败', '看到：状态、证据、下一步与可操作入口', '发生：车辆 / 导航 / 媒体 / 服务真值', '可复核：用户能判断是否真的做成'],
    failure: ['话术、GUI、实体状态互相矛盾', '抢报完成、重复播报、错误屏 / 音区', '打断后仍继续危险或过时动作', '只报“成功”但不给实际结果'],
    metrics: ['说做一致率｜首播 / 首动作 / 总耗时', 'TTS 完整率｜打断成功率', '多屏 / 多音区正确率｜多模态一致率', '用户可验证率｜二次追问率', '端到端满意度与打扰率'],
  },
];

stages.forEach(drawStage);

for (let index = 0; index < stages.length - 1; index += 1) {
  connect(`${stages[index].id}_KEY`, `${stages[index + 1].id}_KEY`, { color: C.cobalt, width: 6 });
}

// The numbered rows themselves form the real business path: input → mechanism → output,
// then the previous stage output enters the next stage input. Failure and metrics never
// masquerade as business steps.
stages.forEach((stage) => {
  route([anchor(`${stage.id}_IN`, 'bottom'), anchor(`${stage.id}_MECH`, 'top')], { color: C.cobalt, width: 4 });
  route([anchor(`${stage.id}_MECH`, 'bottom'), anchor(`${stage.id}_OUT`, 'top')], { color: C.cobalt, width: 4 });
});
for (let index = 0; index < stages.length - 1; index += 1) {
  const from = anchor(`${stages[index].id}_OUT`, 'right');
  const to = anchor(`${stages[index + 1].id}_IN`, 'left');
  const midX = (from[0] + to[0]) / 2;
  route([from, [midX, from[1]], [midX, to[1]], to], { color: C.deep, width: 5 });
}

// Mid layer: long-running control plane.
const midY = 3180;
const midH = 3400;
rect(80, midY, 6800, midH, C.paper, C.amber, 3, 14, bg);
rect(104, midY + 20, 6752, 158, C.amberBg, C.amber, 2, 10, nodes);
text(146, midY + 79, '长期控制面｜旧链迁移、新 Task 顶层抽象、展示层与感知链分开', 34, 850, C.amber);
text(146, midY + 127, '长期任务并非每轮语音必经；所有云端 callback 仍回同一 Planner，端侧系统预设任务则可按本地规则离线闭环。', 26, 650, C.ink);

function detailCard(id, x, y, w, h, titleValue, status, tone, sections, memberLines = []) {
  const map = {
    blue: [C.pale, C.cobalt], green: [C.sageBg, C.sage], amber: [C.amberBg, C.amber],
    purple: [C.purpleBg, C.purple], red: [C.redBg, C.red], gray: [C.paper, C.muted],
  };
  const [headFill, stroke] = map[tone] || map.blue;
  rect(x, y, w, h, C.white, stroke, 2.5, 12, nodes);
  rect(x, y, w, 116, headFill, stroke, 2.5, 12, nodes);
  text(x + 28, y + 48, titleValue, 31, 850, C.ink);
  badge(x + 28, y + 58, status, tone);
  let cursor = y + 138;
  if (memberLines.length) {
    const members = memberLines.flatMap((line) => line.split('｜')).filter(Boolean);
    let chipX = x + 28;
    let chipY = cursor;
    let rows = 1;
    members.forEach((member) => {
      const visualWidth = [...member].reduce((sum, char) => sum + (char.charCodeAt(0) < 128 ? 14 : 26), 0);
      const chipWidth = Math.min(w - 56, Math.max(170, visualWidth + 38));
      if (chipX + chipWidth > x + w - 28) {
        chipX = x + 28;
        chipY += 62;
        rows += 1;
      }
      rect(chipX, chipY, chipWidth, 50, C.pale2, stroke, 1.3, 25, nodes);
      text(chipX + chipWidth / 2, chipY + 34, member, 26, 650, C.deep, 'middle');
      chipX += chipWidth + 12;
    });
    cursor += rows * 62 + 30;
    edges.push(`<line x1="${x + 24}" y1="${cursor - 18}" x2="${x + w - 24}" y2="${cursor - 18}" stroke="${C.softLine}" stroke-width="2"/>`);
  }
  const available = y + h - cursor - 18;
  const rowHeight = available / sections.length;
  sections.forEach(([label, lines], index) => {
    const rowY = cursor + index * rowHeight;
    if (index > 0) edges.push(`<line x1="${x + 24}" y1="${rowY}" x2="${x + w - 24}" y2="${rowY}" stroke="${C.softLine}" stroke-width="1.5"/>`);
    rect(x + 24, rowY + 18, 102, Math.min(48, rowHeight - 30), headFill, stroke, 1.3, 8, nodes);
    text(x + 75, rowY + 51, label, 23, 800, stroke, 'middle');
    const gap = lines.length > 2 ? 36 : 40;
    const total = (lines.length - 1) * gap;
    const first = rowY + (rowHeight - total) / 2 + 9;
    multiline(x + 148, first, lines, 26, gap, 540, C.ink);
  });
  register(id, x, y, w, h);
}

detailCard('OLD_CHAIN', 104, 3380, 2100, 850, '旧链｜Goal＋Dynamic Advisor＋Trigger', '迁移链｜灰虚线', 'gray', [
  ['输入', ['Goal List、动态建议、旧 Trigger 事件']],
  ['机制', ['共享目标＋动态观察＋条件触发', '逐步迁移到 Task Service']],
  ['输出', ['旧 goal / advisor / trigger 状态']],
  ['失败', ['新旧双写、重复触发、状态语义不一致']],
  ['指标', ['迁移覆盖率｜双写冲突率｜遗留调用量']],
], ['Goal List｜Dynamic Advisor｜旧 Trigger']);

detailCard('TASK', 2228, 3380, 4628, 850, '新在研 Task Service｜唯一异步顶层抽象', '长期方案｜责任与联调待闭合', 'purple', [
  ['输入', ['用户异步 Task、长期 / 条件 / 持续目标', '系统预设任务不是同一入口']],
  ['机制', ['Task / Run / Event / TaskView 四对象', 'waiting → running → closed；Trigger Adapter＋Runtime Dispatcher']],
  ['输出', ['独立 Result Hook＋版本化 callback', 'TaskView、当前 run、终态、下一等待事件']],
  ['失败', ['重复创建 / 回调、状态回滚', '取消后仍运行、afterFlow 丢结果、终态未清理']],
  ['指标', ['状态一致率｜恢复率｜Result Hook 覆盖', '重复任务率｜取消成功率｜终态清理率']],
], ['Task｜Run｜Event｜TaskView｜Trigger Adapter｜Runtime Dispatcher｜Result Hook']);

detailCard('STATIC_ADV', 104, 4254, 2100, 850, 'Static Advisor｜静态建议面', '独立于 Task', 'amber', [
  ['输入', ['舒适 / 出行 / 情感 / 内容四类 Context']],
  ['机制', ['规则 / 模型生成建议', '不创建 Task、不拥有执行权']],
  ['输出', ['advisor 建议 → Planner / AI Bar']],
  ['失败', ['过度打扰、重复建议、无证据建议']],
  ['指标', ['采纳率｜打扰率｜重复率｜场景收益']],
], ['舒适｜出行｜情感｜内容']);

detailCard('TASK_CENTER', 2228, 4254, 2100, 850, '任务中心｜展示与交互层', '不是 Task Service', 'blue', [
  ['输入', ['TaskView：待办 / 进行中 / 任务记录']],
  ['机制', ['展示、查看详情、取消、删除', '用户操作转成 event 回传']],
  ['输出', ['可见状态＋cancel / delete / open event']],
  ['失败', ['展示态与服务态不一致、弱网无数据']],
  ['指标', ['展示一致率｜取消成功率｜弱网可用性']],
], ['待办｜进行中｜任务记录｜取消｜删除']);

detailCard('TRIGGER', 4352, 4254, 2504, 850, 'Trigger｜云端与端侧两条路', '入口与闭环不同', 'amber', [
  ['输入', ['云：Task 等待事件 / 订阅条件', '端：结构化车信号 / 系统预设规则']],
  ['机制', ['云 Trigger Adapter → callback → Task', '端信号 → 本地规则 → 本地执行，可离线']],
  ['输出', ['云 trigger_event / 端侧真实执行结果']],
  ['失败', ['误触发、漏触发、重复触发、旧任务命中']],
  ['指标', ['命中准确率｜重复率｜离线成功率｜触发延迟']],
], ['云端 Trigger Adapter｜端侧结构化信号｜本地规则｜本地执行']);

rect(104, 5128, 6752, 1394, C.purpleBg, C.purple, 2.5, 12, nodes);
text(146, 5182, 'VLM 三条链｜不能泛化成“视觉都进 Context”', 31, 850, C.purple);
badge(146, 5200, '三路严格分流', 'purple');
detailCard('VLM_VQA', 128, 5282, 2184, 1210, '① 用户视觉问答', '按需 VQA', 'blue', [
  ['输入', ['用户 query＋当前图像 / 摄像头权限']],
  ['机制', ['Planner 调 VQA 工具', '不读屏、不联网']],
  ['输出', ['VQA tool result → feedback → Planner']],
  ['失败', ['遮挡、旧帧、把读屏 / 网络问题交给视觉']],
  ['指标', ['问答准确率｜新鲜度｜feedback 关联率']],
]);
detailCard('VLM_ALWAYS', 2336, 5282, 2184, 1210, '② 默认 AlwaysOn', '常驻感知', 'green', [
  ['输入', ['默认视觉感知流＋时间 / 位置 / 置信度']],
  ['机制', ['VLM SDK → 端数据中心 → Context']],
  ['输出', ['visual_info → Static Advisor / Planner']],
  ['失败', ['旧帧、误检、Context 过期注入']],
  ['指标', ['感知准确率｜新鲜度｜资源占用']],
]);
detailCard('VLM_DYNAMIC', 4544, 5282, 2288, 1210, '③ 动态观察任务', '不进通用 Context', 'purple', [
  ['输入', ['Task Service 下发 dynamic_watch_tasks(task_id)', '全量替换；最多 3 个任务']],
  ['机制', ['VLM SDK → 单 task 结果', '云语义 Y / N → callback → Task']],
  ['输出', ['带 task_id 的结果，只推进对应 Task']],
  ['失败', ['task_id 错绑、替换丢任务、callback 丢失']],
  ['指标', ['任务关联率｜替换正确率｜callback 成功率']],
]);
register('VLM', 104, 5128, 6752, 1394);

// Mid layer: seven tool capability families.
rect(6940, midY, 11160, midH, C.pale2, C.cobalt, 3, 14, bg);
rect(6964, midY + 20, 11112, 158, C.pale, C.cobalt, 2, 10, nodes);
text(7006, midY + 79, '六类工具能力＋统一运行契约｜每类都必须讲清“怎么调用、怎样证明、失败怎么办”', 34, 850, C.deep);
text(7006, midY + 127, '本地最新 SP 快照（2026-07-31）含 27 个唯一工具；运行时有效工具集按车型 × 场景 × 版本动态注入。', 26, 650, C.ink);

const toolCards = [
  {
    id: 'T1', x: 6964, y: 3380, title: '① 车辆与驾驶｜6', tone: 'blue',
    members: ['vehicle_basic_control｜vehicle_system_settings', 'vehicle_communication｜vehicle_status_search', 'ambient_light_control｜auto_drive'],
    sections: [
      ['输入', ['设备、动作、目标值', '座位 / 区域＋当前状态']],
      ['机制', ['查当前态 → 安全 / 能力校验', '协议适配 → 车端下发 → 状态确认']],
      ['输出', ['端侧受理 / 执行回执', '最终设备状态【回读待确认】']],
      ['失败', ['状态冲突、设备离线、危险动作', '单位 / 区域错误、重复副作用']],
      ['指标', ['工具可用率｜真实生效率｜状态回读率', '误控率｜重复控制率｜执行时延']],
    ],
  },
  {
    id: 'T2', x: 9744, y: 3380, title: '② 出行与本地生活｜5', tone: 'blue',
    members: ['weather_search｜poi_search｜route_planning', 'navi_basic_control｜restaurant_reserve'],
    sections: [
      ['输入', ['地点、出发 / 到达、时间', '偏好、当前位置与确认状态']],
      ['机制', ['POI / route / navi 串行互斥', '选定路线后自动发起导航']],
      ['输出', ['POI 候选 / 路线 / 导航阶段', '真实目的地与导航启动状态']],
      ['失败', ['同名 POI、时间过期、无路线', '未确认就导航或串行步骤重复']],
      ['指标', ['POI 命中率｜路线可用率', '导航启动成功率｜串行冲突率']],
    ],
  },
  {
    id: 'T3', x: 12524, y: 3380, title: '③ 媒体与内容｜6', tone: 'blue',
    members: ['video_search｜music_search｜media_basic_control', 'ai_broadcast_generate｜broadcast_search｜image_generate'],
    sections: [
      ['输入', ['内容需求、筛选条件', '播放动作、设备与当前播放态']],
      ['机制', ['搜索 → 候选 → 控制', '音乐搜索工具在搜索后自动播放']],
      ['输出', ['内容清单＋实际播放项', '播放 / 暂停 / 切换状态或生成产物']],
      ['失败', ['搜到未播、版权不可用', '错设备、重复播放或产物缺失']],
      ['指标', ['检索满足率｜实际播放率', '状态一致率｜副作用误执行率']],
    ],
  },
  {
    id: 'T4', x: 15304, y: 3380, title: '④ 记忆与身份｜3', tone: 'amber',
    members: ['user_memory_search｜face_id_register｜user_memory_operate'],
    sections: [
      ['输入', ['用户身份、查询 / 写入内容', '用途、授权与当前版本']],
      ['机制', ['鉴权 → 租户 / 用户隔离', '检索 / 写入 → 回执 / 冲突处理']],
      ['输出', ['命中事实 / 未命中原因', '写入结果与身份注册状态']],
      ['失败', ['串用户、越权写入、误记忆', '并发冲突覆盖或旧版本回滚']],
      ['指标', ['授权覆盖率｜错误注入率', '冲突率｜跨用户泄露必须为 0']],
    ],
  },
  {
    id: 'T5', x: 6964, y: 4420, title: '⑤ 信息与车辆知识｜4', tone: 'blue',
    members: ['web_search｜vehicle_manual_qa｜car_care_qa｜car_log'],
    sections: [
      ['输入', ['问题、车型 / 部件、时效 / 地域', '来源要求或日志时间范围']],
      ['机制', ['检索 → 打开原文 / 知识 / 日志', '核验适用范围 → 生成回答']],
      ['输出', ['答案＋证据', '适用边界 / 不确定性 / 结构化日志片段']],
      ['失败', ['摘要当证据、车型错配、信息过期', '无来源、日志缺段或错时间窗']],
      ['指标', ['有据回答率｜事实正确率', '车型适配率｜日志完整率']],
    ],
  },
  {
    id: 'T6', x: 9744, y: 4420, title: '⑥ 长时目标、录音与视觉｜3', tone: 'purple',
    members: ['goal_list_update｜audio_record｜visual_qa'],
    sections: [
      ['输入', ['goal 变化、录音范围', '车内视觉问题与隐私权限']],
      ['机制', ['幂等更新 / 录制 / 车内视觉问答', '视觉问答工具不读屏、不联网']],
      ['输出', ['Goal 回执 / 音频产物', '带时间与置信度的视觉事实']],
      ['失败', ['状态回滚、录音越权、旧帧', '把读屏 / 网络问题误交给视觉']],
      ['指标', ['状态一致率｜产物可用率', '视觉事实准确率 / 新鲜度']],
    ],
  },
  {
    id: 'T7', x: 12524, y: 4420, title: '统一工具运行契约', tone: 'green',
    members: ['所有工具共享：Registry / Adapter / Trace / Feedback'],
    sections: [
      ['输入', ['tool_name＋schema＋能力版本', 'action_id＋幂等 / 超时 / 取消']],
      ['机制', ['动态注入 → 校验 → 适配 → 调用', '回读 → 关联 → 归一化']],
      ['输出', ['原始返回＋证据', '标准 tool_feedback＋实际状态']],
      ['失败', ['协议漂移、回调错绑', '返回成功但真值失败']],
      ['指标', ['调用成功率与真实生效率分开', '版本兼容｜反馈关联｜副作用率']],
    ],
  },
  {
    id: 'T8', x: 15304, y: 4420, title: 'SP 工具契约｜3 个阻塞缺口', tone: 'red',
    members: ['本地 SP 快照审计｜必须在联调前闭合'],
    sections: [
      ['缺口1', ['action_list 有 action_id', 'feedback 仅 tool_name＋自由文本']],
      ['风险', ['缺 action_id / task_id / 标准状态 / 可重试', '多个同名动作的结果关联歧义']],
      ['缺口2', ['注册表无 parking_fee_pay', '但参考示例调用它']],
      ['缺口3', ['POI / route / navi tips', '引用未注册 trip_plan_record']],
      ['验收', ['反馈关联准确率｜未注册工具引用=0', 'schema 与可重试字段覆盖率']],
    ],
  },
];

toolCards.forEach((tool) => {
  const status = tool.id === 'T8' ? '红色阻塞项' : tool.id === 'T7' ? '全工具共用' : '本地 SP 快照';
  detailCard(tool.id, tool.x, tool.y, 2756, 1020, tool.title, status, tool.tone, tool.sections, tool.members);
});

detailCard('B1', 6964, 5480, 2756, 1020, '阻塞①｜端云执行优先级冲突', '未解决', 'red', [
  ['证据A', ['8/11 讨论：云优先，端兜底']],
  ['证据B', ['9/3 Task 长期方案：端优先，云取消']],
  ['风险', ['同一动作双执行、迟到结果覆盖']],
  ['拍板', ['唯一裁决点、execution_token 与取消时序']],
  ['验收', ['唯一执行率=100%｜迟到覆盖=0']],
]);
detailCard('B2', 9744, 5480, 2756, 1020, '阻塞②｜弱网下两种 UI', '未解决', 'red', [
  ['端侧', ['本地任务卡可离线展示与操作']],
  ['云端', ['任务中心依赖 TaskView，弱网可能不可用']],
  ['风险', ['混成一种 UI 后状态、取消语义错误']],
  ['拍板', ['离线卡与云任务中心的展示 / 合并规则']],
  ['验收', ['弱网可见率｜状态一致率｜操作回传率']],
]);
detailCard('B3', 12524, 5480, 2756, 1020, '阻塞③｜旧动态 Advisor 迁移', '未解决', 'red', [
  ['旧链', ['Goal List＋Dynamic Advisor＋Trigger']],
  ['新链', ['Task Service 作为唯一异步顶层抽象']],
  ['风险', ['双写、重复触发、目标 / 任务状态分裂']],
  ['拍板', ['迁移顺序、兼容期、流量切换与回滚']],
  ['验收', ['遗留调用归零｜双写冲突率=0']],
]);
detailCard('B4', 15304, 5480, 2756, 1020, '阻塞④｜结果回传仍未闭合', '未解决', 'red', [
  ['现状', ['afterFlow 为 best-effort，可能丢结果']],
  ['目标', ['独立 Result Hook 负责可靠结果回传']],
  ['端侧', ['本地执行结果上云仍是 TODO']],
  ['风险', ['Task 卡住、假完成、重复 replan']],
  ['验收', ['Result Hook 覆盖率｜回传成功 / 迟到率']],
]);

// Connections between control plane and the main chain are event-based, not mandatory per request.
connect('OLD_CHAIN', 'TASK', { color: C.muted, width: 3, dash: '12 10', label: '迁移', labelAt: [2216, 3805] });
route([anchor('STATIC_ADV', 'top'), [1154, 3138], [7100, 3138], [7100, 1314], anchor('S4_IN', 'left')], { color: C.amber, width: 3, dash: '12 10', label: '建议 → Planner / AI Bar', labelAt: [3680, 3138] });
route([anchor('S5_OUT', 'bottom'), [10330, 3148], [4542, 3148], anchor('TASK', 'top')], { color: C.purple, width: 4, dash: '12 10', label: '用户异步 Task 入口', labelAt: [8500, 3148] });
route([anchor('TASK', 'bottom'), [4542, 4242], [3278, 4242], anchor('TASK_CENTER', 'top')], { color: C.cobalt, width: 3, label: 'TaskView' });
route([anchor('TASK_CENTER', 'top'), [3278, 4238], [2500, 4238], [2500, 4200], anchor('TASK', 'bottom')], { color: C.amber, width: 2.5, dash: '10 8', label: '取消 / 删除 / event', labelAt: [2800, 4238] });
route([anchor('TASK', 'bottom'), [4542, 4240], [5604, 4240], anchor('TRIGGER', 'top')], { color: C.amber, width: 3, label: 'Trigger Adapter' });
route([anchor('TRIGGER', 'top'), [5604, 4228], [6500, 4228], [6500, 3980], anchor('TASK', 'right')], { color: C.amber, width: 3, dash: '10 8', label: '云 callback → Task', labelAt: [6300, 4228] });
route([anchor('TASK', 'right'), [6880, 3805], [6880, 1314], anchor('S4_IN', 'left')], { color: C.purple, width: 4, dash: '12 10', label: 'Result Hook / event → 同一 Planner', labelAt: [6880, 2880] });
route([anchor('S4_OUT', 'bottom'), [7980, 3130], [1220, 3130], [1220, 5262], anchor('VLM_VQA', 'top')], { color: C.cobalt, width: 3, dash: '10 8', label: '按需 VQA 工具调用', labelAt: [7350, 3130] });
route([anchor('VLM_ALWAYS', 'top'), [3428, 3114], [5655, 3114], anchor('S3_IN', 'bottom')], { color: C.sage, width: 3, dash: '10 8', label: 'AlwaysOn → 端数据中心 → Context', labelAt: [4400, 3114] });
route([anchor('TASK', 'bottom'), [4542, 5110], [5688, 5110], anchor('VLM_DYNAMIC', 'top')], { color: C.purple, width: 3, dash: '12 10', label: 'dynamic_watch_tasks(task_id｜全量替换｜最多3)', labelAt: [5200, 5110] });
route([anchor('VLM_DYNAMIC', 'right'), [6844, 5887], [6844, 4400], [6500, 4400], anchor('TASK', 'right')], { color: C.purple, width: 3, dash: '12 10', label: '单 task Y/N callback｜不进通用 Context', labelAt: [6844, 5000] });

// Bottom feedback expansion.
const feedbackY = 6620;
rect(80, feedbackY, W - 160, 620, C.sageBg, C.sage, 3, 14, bg);
text(122, feedbackY + 58, '绿色反馈总线｜只有完成关联、持久化与真值分级的结果，才可进入下一轮 Context / Planner', 32, 850, C.sage);

function busCard(id, x, y, w, titleValue, lines, tone = 'green') {
  const map = { green: [C.white, C.sage], red: [C.white, C.red], blue: [C.white, C.cobalt], purple: [C.white, C.purple] };
  const [fill, stroke] = map[tone] || map.green;
  rect(x, y, w, 412, fill, stroke, 2.5, 10, nodes);
  text(x + 24, y + 48, titleValue, 29, 850, stroke);
  multiline(x + 24, y + 94, lines, 26, 41, 560, C.ink);
  register(id, x, y, w, 412);
}

const fbCards = [
  ['FB1', 122, '原始工具返回', ['受理 / 执行 / 产物 / 错误 / callback', '只证明服务层发生了什么'], 2620],
  ['FB2', 2830, '真实状态回读【待确认】', ['设备终值 / 播放项 / 导航阶段 / 产物', '不可回读时必须标证据等级'], 2620],
  ['FB3', 5538, '关联、去重与迟到保护', ['request → action → execution_token', '重复 / 旧版本 / 取消后迟到只审计'], 2620],
  ['FB4', 8246, '标准 tool_feedback', ['成功 / 失败 / 部分 / 超时 / 取消', '附真实状态、缺失字段与可重试性'], 2620],
  ['FB5', 10954, '写回状态并重建 Context', ['更新 Action / Goal / Task；保留已成事实', '形成新 snapshot 与本轮 unknown'], 2980],
  ['FB6', 14022, '同一 Planner 再判断', ['继续 / 换工具 / 等待 / 完成 / 失败', '无证据不得越级宣布完整目标完成'], 3910],
];
fbCards.forEach(([id, x, titleValue, lines, w]) => busCard(id, x, feedbackY + 118, w, titleValue, lines));
for (let index = 0; index < fbCards.length - 1; index += 1) connect(fbCards[index][0], fbCards[index + 1][0], { color: C.sage, width: 5 });

// Explicit returns from execution and feedback stage into the expanded bus.
route([anchor('S6_OUT', 'bottom'), [12755, feedbackY - 26], [1432, feedbackY - 26], anchor('FB1', 'top')], { color: C.sage, width: 5, label: 'raw response / callback', labelAt: [11900, feedbackY - 26] });
route([anchor('S7_KEY', 'bottom'), [15030, feedbackY - 28], anchor('FB3', 'top')], { color: C.sage, width: 5, label: '展开关联机制', labelAt: [15030, feedbackY - 212] });
route([anchor('VLM_VQA', 'bottom'), [1220, feedbackY - 20], anchor('FB1', 'top')], { color: C.sage, width: 3, dash: '10 8', label: 'VQA tool result → feedback', labelAt: [2500, feedbackY - 20] });
// Re-enter through Context and the exact same Planner/Director node.
route([anchor('FB5', 'top'), [12444, feedbackY - 30], [6800, feedbackY - 30], [6800, 1200], anchor('S4_IN', 'left')], { color: C.sage, width: 6, label: 'tool_feedback / event 进入同一 Planner', labelAt: [9100, feedbackY - 30] });

// Exception bus.
const errorY = 7270;
rect(80, errorY, W - 160, 570, C.redBg, C.red, 3, 14, bg);
text(122, errorY + 58, '红色异常总线｜任何阶段都必须把失败变成可关联、可解释、可恢复的标准结果，禁止静默丢失', 32, 850, C.red);
busCard('ER1', 122, errorY + 112, 3450, '异常来源', ['入口拒绝 / 路由冲突 / Context 缺失', '模型候选错误 / 门禁拦截 / 工具失败', '回调错绑 / 输出不一致'], 'red');
busCard('ER2', 3660, errorY + 112, 3700, '标准错误信封', ['phase＋error_code＋retryable＋actual_state', 'request / action / task / version＋时间', '用户影响、已完成部分与证据等级'], 'red');
busCard('ER3', 7448, errorY + 112, 3600, '恢复策略', ['澄清 / 换工具 / 安全重试 / 补偿 / 回滚', '暂停等待 / 取消 / 迟到丢弃 / 人工兜底', '每种策略都必须定义上限与终止条件'], 'red');
busCard('ER4', 11136, errorY + 112, 3400, '回主链而不是旁路说成功', ['标准失败也形成 tool_feedback', '同一 Planner 决定继续、等待或失败收口', '保留真实状态，绝不覆盖已成事实'], 'red');
busCard('ER5', 14624, errorY + 112, 3340, '面向用户透明收口', ['说明做成什么、没做成什么、为什么', '给出可执行补救；高风险场景立即停', '话术 / GUI / 实体状态必须一致'], 'red');
['ER1', 'ER2', 'ER3', 'ER4', 'ER5'].slice(0, -1).forEach((id, index) => connect(id, ['ER2', 'ER3', 'ER4', 'ER5'][index], { color: C.red, width: 4, dash: '12 9' }));

// Every stage failure port drains to the same red line. Cards cover the long verticals, keeping the layout clean.
route([[115, errorY + 508], [17920, errorY + 508]], { color: C.red, width: 5, dash: '14 10', arrow: false });
stages.forEach((stage) => {
  const port = anchor(`${stage.id}_FAIL`, 'bottom');
  route([port, [port[0], errorY + 508]], { color: C.red, width: 2.5, dash: '10 10', arrow: false });
});
route([[17920, errorY + 508], anchor('ER5', 'bottom')], { color: C.red, width: 5, dash: '14 10' });
route([anchor('ER4', 'top'), [12836, errorY - 16], anchor('FB4', 'bottom')], { color: C.red, width: 3, dash: '10 8', label: '标准失败 feedback', labelAt: [12836, errorY - 16] });

// Bottom truth, evidence and whole-chain metrics.
const truthY = 7870;
rect(80, truthY, W - 160, 700, C.paper, C.deep, 3, 14, bg);
rect(104, truthY + 22, 5230, 638, C.white, C.deep, 2, 10, nodes);
text(146, truthY + 78, '四层成功语义｜不能越级', 32, 850, C.deep);
const successBoxes = [
  [146, '① 请求被接收', '网关或工具受理'],
  [1420, '② 服务调用成功', '接口返回 success'],
  [2694, '③ 真实状态生效', '车 / 服务有真值'],
  [3968, '④ 完整目标完成', '必要子目标均有证据'],
];
successBoxes.forEach(([x, titleValue, body]) => {
  rect(x, truthY + 112, 1190, 184, C.pale, C.cobalt, 2, 9, nodes);
  text(x + 24, truthY + 160, titleValue, 27, 800, C.cobalt);
  text(x + 24, truthY + 210, body, 26, 560, C.ink);
});
text(146, truthY + 346, '全链必须同时审：完整任务成功率｜部分失败恢复率｜假完成率｜首响应 / 首动作 / 总耗时｜安全事故与打扰率', 26, 700, C.ink);
text(146, truthY + 397, '所有分母必须绑定车型、版本、环境、网络、场景、样本量与时间窗；单一模型准确率不能替代端到端结果。', 26, 600, C.muted);
text(146, truthY + 448, 'Badcase 归因顺序：入口 / 路由 → 工具协议与参数 → Context 缺失 / 过期 / 隔离 → 模型能力 → 执行 / 时序 / 反馈。', 26, 700, C.red);

rect(5370, truthY + 22, 5690, 638, C.white, C.cobalt, 2, 10, nodes);
text(5412, truthY + 78, '产品评审的最小追问集｜每一节点都要回答', 32, 850, C.deep);
const reviewQuestions = [
  '谁负责？在哪发生？输入来自谁，输出给谁？',
  '核心判断条件、优先级、状态变化和真实成功证据是什么？',
  '缺参、冲突、无权限、超时、迟到、重复、取消时怎么办？',
  '哪条是当前事实、短期 ToB、长期方案或待确认边界？',
  'Trace 能否还原 request → action → execution → feedback → output？',
  '改动以后用什么分母、指标、回归集和灰度策略验收？',
];
reviewQuestions.forEach((question, index) => {
  circle(5444, truthY + 139 + index * 77, 18, index < 3 ? C.cobalt : C.sage, index < 3 ? C.cobalt : C.sage, 0, nodes);
  text(5444, truthY + 148 + index * 77, String(index + 1), 22, 850, C.white, 'middle');
  text(5480, truthY + 149 + index * 77, question, 26, 620, C.ink);
});

rect(11096, truthY + 22, 6980, 638, C.white, C.purple, 2, 10, nodes);
text(11138, truthY + 78, '证据台账｜结论必须区分现状、方案、讨论与待确认', 32, 850, C.purple);
let legendX = 11138;
[
  ['已确认现状', 'green'],
  ['需求 / 长期方案', 'purple'],
  ['讨论中', 'amber'],
  ['待确认', 'red'],
].forEach(([label, tone]) => {
  legendX += badge(legendX, truthY + 94, label, tone) + 22;
});

const evidenceSources = [
  ['①《车内语音》需求定义', '需求定义；量产待核', 'purple'],
  ['②《多人同时语音交互体验》', '讨论中', 'amber'],
  ['③《座舱 Planner OnePage》', '长期方案', 'purple'],
  ['④《TOB 简单复杂仲裁升级》', '时点现状 / 短期', 'green'],
  ['⑤《公共 Context 管理》', '长期方案', 'purple'],
  ['⑥《E68 AI Engine 核心方案》', '基线；RMT 待填', 'red'],
  ['⑦《任务 Planner PRD》', '长期方案', 'purple'],
  ['⑧《目标驱动任务与对话管理》', '长期方案', 'purple'],
  ['⑨《对话推理引擎(Director) PRD》v1.5', '本地需求基线', 'purple'],
  ['⑩ 动态示例 sp.md｜27 工具', '本地快照；线上待核', 'red'],
  ['⑪《[技术方案]Task 任务管理设计》', '在研方案', 'purple'],
  ['⑫ 7/15 动态 adv 与任务管理合并逐字稿', '方案评审', 'amber'],
  ['⑬《赛力斯任务中心 PRD》', '产品契约', 'purple'],
  ['⑭《静态 Advisor PRD v0.6》', '分阶段方案', 'purple'],
  ['⑮ 7/28 静态 Advisor / 交互 / 消息盒子逐字稿', '讨论中', 'amber'],
  ['⑯《VQA 需求》', '需求定义', 'purple'],
  ['⑰《Watcher AlwaysOn PRD》', '需求 / 方案', 'purple'],
  ['⑱《TaskService dynamic_watch_tasks 至 VLM》', '接口契约', 'purple'],
  ['⑲ 7/16 云端触发器解析 VLM 逐字稿', '讨论中', 'amber'],
  ['⑳《端侧触发器 PRD》', '需求 / 方案', 'purple'],
  ['㉑ 8/11 端侧自闭环逐字稿', '讨论中', 'amber'],
];

evidenceSources.forEach(([titleValue, status, tone], index) => {
  const col = Math.floor(index / 7);
  const row = index % 7;
  const x = 11138 + col * 2260;
  const y = truthY + 170 + row * 68;
  const statusWidth = badge(x, y, status, tone);
  text(x + statusWidth + 18, y + 33, titleValue, 26, 620, C.ink);
});

// Product-manager mastery is an acceptance line attached to the architecture, not a detached essay column.
const masteryY = 8600;
rect(80, masteryY, W - 160, 350, C.pale, C.deep, 3, 14, bg);
text(122, masteryY + 54, '产品经理验收线｜能复述不等于真正掌握；L3 是两年内值得带走的深度', 31, 850, C.deep);

const masteryCards = [
  [122, 2350, 'L1｜能复述节点｜不够', ['知道八阶段名称与大致顺序', '但无法解释责任、输入输出与失败出口'], 'red'],
  [2508, 3650, 'L2｜能解释每一跳｜入门合格', ['说清 Owner、发生位置、输入、判断、输出', '知道当前事实 / 长期方案 / 待确认边界'], 'amber'],
  [6194, 6440, 'L3｜能用真实 Trace 定位并验收｜目标深度', ['沿 ASR → 路由 → Context → Planner → 工具协议 → 执行时序 → 结果回传定位根因', '为改动定义分母、指标、失败边界、回归集与跨团队验收；这是两年内真正可迁移的能力'], 'green'],
  [12670, 5290, 'L4｜会写模型 / SDK｜非默认要求', ['产品默认不必亲自实现模型或 SDK，但必须理解其能力边界与成本', 'AI能力＝理解规划模型 × Context证据 × 工具可执行性 × 反馈真值 × 工程门禁', '单看模型分数 ≠ 座舱 AI 能力'], 'purple'],
];
masteryCards.forEach(([x, w, titleValue, lines, tone]) => {
  const map = { red: [C.redBg, C.red], amber: [C.amberBg, C.amber], green: [C.sageBg, C.sage], purple: [C.purpleBg, C.purple] };
  const [fill, stroke] = map[tone];
  rect(x, masteryY + 76, w, 238, fill, stroke, 2, 10, nodes);
  text(x + 24, masteryY + 122, titleValue, 27, 850, stroke);
  multiline(x + 24, masteryY + 164, lines, 26, 36, 600, C.ink);
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L12,6 L0,12 Z" fill="context-stroke"/>
    </marker>
  </defs>
  ${bg.join('')}
  ${edges.join('')}
  ${nodes.join('')}
  ${overlays.join('')}
</svg>`;

const forbidden = ['foreignObject', '<filter', '<linearGradient', '<radialGradient', '<pattern', '<clipPath', '<mask', '<g'];
for (const token of forbidden) {
  if (svg.includes(token)) throw new Error(`Forbidden SVG token: ${token}`);
}
if (!svg.includes('marker-end="url(#arrow)"')) throw new Error('No native arrow connectors were generated');
if (stages.length !== 8) throw new Error(`Expected 8 stages, got ${stages.length}`);
if (toolCards.length !== 8) throw new Error(`Expected 6 tool families plus runtime contract and defect ledger, got ${toolCards.length}`);

await writeFile(output, svg, 'utf8');
console.log(JSON.stringify({
  output,
  canvas: `${W}x${H}`,
  stages: stages.length,
  numberedStageSubnodes: stages.length * 5,
  toolFamilies: 6,
  namedToolsInLocalSpSnapshot: 27,
  registeredBoxes: boxes.size,
  ...stats,
}, null, 2));
