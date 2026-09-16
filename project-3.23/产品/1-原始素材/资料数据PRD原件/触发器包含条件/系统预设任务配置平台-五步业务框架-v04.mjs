import fs from 'node:fs';

const C = {
  ink: '#173458', blue: '#1E63B6', pale: '#EDF4FF', line: '#8AA3C1',
  gray: '#F4F6F8', muted: '#52657B', green: '#EAF5EF', greenLine: '#579473',
  warm: '#FFF4E4', warmLine: '#D88932', purple: '#F3EEFF', purpleLine: '#8B70C9',
  red: '#FFF0F0', redLine: '#DB5C5C', white: '#FFFFFF'
};

const esc = (x) => String(x).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const out = [];

function rect(x, y, w, h, fill = C.white, stroke = C.line, r = 14, sw = 2) {
  out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
}

function text(x, y, lines, size = 20, weight = 400, color = C.ink, anchor = 'start', lh = 29) {
  out.push(`<text x="${x}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(line)}</tspan>`).join('')}</text>`);
}

function line(x1, y1, x2, y2, arrow = true, dash = false, color = C.line, width = 2.4) {
  out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${dash ? 'stroke-dasharray="7 6"' : ''} ${arrow ? 'marker-end="url(#arrow)"' : ''}/>`);
}

function step(x, y, w, h, n, title, where, lines, fill, stroke) {
  rect(x, y, w, h, fill, stroke, 14, 2);
  rect(x, y, w, 54, fill, 'none', 14, 0);
  text(x + 20, y + 35, [`${n}  ${title}`], 23, 700);
  rect(x + 18, y + 66, w - 36, 40, C.white, stroke, 9, 1.2);
  text(x + w / 2, y + 93, [`页面位置：${where}`], 17, 600, C.muted, 'middle');
  text(x + 20, y + 140, lines, 18, 400, C.ink, 'start', 27);
}

out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1900" height="1840" viewBox="0 0 1900 1840">`);
out.push(`<defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto"><path d="M0 0 L10 4 L0 8 z" fill="${C.line}"/></marker></defs>`);
out.push(`<rect width="1900" height="1840" fill="#FFFFFF"/>`);

text(56, 68, ['系统预设任务配置平台：五步业务框架与运行闭环'], 38, 700);
text(56, 112, ['评审只需沿着五步讲：平台配置“这类任务怎么做”，运行时由 Trigger、原业务和交互/执行模块按配置完成一次闭环。'], 22, 400, C.muted);

rect(56, 148, 1788, 72, C.red, C.redLine, 12, 1.8);
text(950, 192, ['已确认：Planner 不直接拉卡。无论端侧还是云端，卡片都由这项任务的原业务注册并发起。'], 24, 700, '#8C3434', 'middle');

const y = 268;
const w = 336;
const gap = 27;
const xs = [56, 56 + w + gap, 56 + (w + gap) * 2, 56 + (w + gap) * 3, 56 + (w + gap) * 4];

step(xs[0], y, w, 390, '1', '选任务与范围', '基础信息 / 发布范围', [
  '• 关联哪项预设任务',
  '• 真实启用状态从哪里读取',
  '• 端侧运行或云端运行',
  '• 渠道、车型、软件版本',
  '• 原业务及产品/研发 Owner',
  '',
  '决定：谁能使用、谁来承接'
], C.pale, C.blue);

step(xs[1], y, w, 390, '2', '配触发规则', '触发条件', [
  '• 哪个变化事件启动检查',
  '• 当前仍需满足哪些条件',
  '• AND / OR、阈值、持续时长',
  '• 数据时效、UNKNOWN 处理',
  '• 防抖和同一事件去重',
  '',
  '决定：什么时候产生业务事件'
], C.pale, C.blue);

step(xs[2], y, w, 390, '3', '选处理方式', '触发条件之后新增', [
  '• 直接执行 / 仅告知',
  '• 先询问 / 发起主动推荐',
  '• 业务事件名称与场景信息',
  '• 原业务标识和下游输入',
  '• 建议目标动作与结果分支',
  '',
  '决定：命中后把事件交给谁'
], C.warm, C.warmLine);

step(xs[3], y, w, 390, '4', '配交互与后续', '选择“先询问”后展开', [
  '• 卡片模板与注册业务',
  '• 正文、按钮、TTS',
  '• 点击回调与语音路线',
  '• 确认后的复核和动作顺序',
  '• 取消、关闭、超时、结果更新',
  '',
  '决定：每种用户结果怎么办'
], C.warm, C.warmLine);

step(xs[4], y, w, 390, '5', '设运行策略', '页面末尾 / 频控扩展', [
  '• 稳定时长、等待时长',
  '• 卡片和授权有效期',
  '• 总次数 / 上电 / 每日次数',
  '• 最小间隔、冷却、重新提醒',
  '• 任务关闭和条件失效的退出',
  '',
  '决定：何时停、何时能再来'
], C.green, C.greenLine);

for (let i = 0; i < 4; i += 1) line(xs[i] + w, y + 195, xs[i + 1], y + 195);

rect(56, 706, 1788, 208, C.purple, C.purpleLine, 14, 2);
text(78, 748, ['横向支撑：原子能力目录（场景页只能引用已接入能力）'], 27, 700);
text(78, 792, [
  '输入/状态：任务开关、档位、车速、驾驶模式   ｜   感知：天气、路面、儿童/宠物、充电设备',
  '交互：即时交互卡、TTS、可见即可说、云端泛化语音   ｜   动作/回读：车控动作、真实车辆状态',
  '每项登记：字段/枚举/单位、数据来源、端云位置、车型/版本、Owner、异常结果、接入状态。'
], 20, 400, C.ink, 'start', 31);
rect(1435, 742, 374, 132, C.white, C.purpleLine, 11, 1.5);
text(1622, 779, ['发布门禁'], 22, 700, C.purpleLine, 'middle');
text(1622, 814, ['缺能力、缺责任人、缺分支', '或缺真实结果判定 → 不发布'], 18, 500, C.ink, 'middle', 28);

text(56, 984, ['配置发布后，一次真实业务怎样跑'], 29, 700);
const nodes = [
  {x:56, w:248, title:'① 平台发布', lines:['保存完整任务规格', '不直接拉卡'], fill:C.pale, stroke:C.blue},
  {x:344, w:248, title:'② Trigger', lines:['读任务状态与数据', '命中后发业务事件'], fill:C.pale, stroke:C.blue},
  {x:632, w:280, title:'③ 任务原业务', lines:['读取处理/卡片配置', '注册并发起卡片'], fill:C.warm, stroke:C.warmLine},
  {x:952, w:248, title:'④ 即时交互卡', lines:['排队、真正展示', '返回点击/关闭/超时'], fill:C.pale, stroke:C.blue},
  {x:1240, w:276, title:'⑤ 原业务执行', lines:['消费确认并重检', '车控与真实状态回读'], fill:C.green, stroke:C.greenLine},
  {x:1556, w:288, title:'⑥ 结果收口', lines:['更新/关闭卡片', '冷却后等待下一次'], fill:C.green, stroke:C.greenLine}
];
nodes.forEach((n, i) => {
  rect(n.x, 1030, n.w, 150, n.fill, n.stroke, 13, 2);
  text(n.x + 18, 1069, [n.title], 22, 700);
  text(n.x + 18, 1110, n.lines, 18, 400, C.ink, 'start', 28);
  if (i < nodes.length - 1) line(n.x + n.w, 1105, nodes[i + 1].x, 1105);
});

rect(56, 1235, 870, 424, '#FBFCFE', C.blue, 14, 2);
text(80, 1278, ['端侧询问：天气/路况保护'], 27, 700);
text(80, 1323, [
  '1. Trigger 读任务开关、本地车况和 VLM 结果并判断。',
  '2. 命中后把“路面湿滑建议”事件交给天气保护原业务。',
  '3. 原业务引用配置，注册卡片、按钮、TTS、回调和可见即可说。',
  '4. 点击与本地语音都回到同一个原业务确认分支，不经过 Planner。',
  '5. 原业务重检车况、调用车控、读真实状态并更新卡片。',
  '',
  '平台配置：任务、规则、处理方式、卡片规格、动作和运行策略。',
  '业务研发：运行时注册卡片、消费结果、执行并收口。'
], 20, 400, C.ink, 'start', 36);

rect(974, 1235, 870, 424, '#FCFAFF', C.purpleLine, 14, 2);
text(998, 1278, ['云端询问：主动推荐 / DT 后询问'], 27, 700);
text(998, 1323, [
  '1. Cloud Trigger 判断任务状态和云端可用硬条件。',
  '2. Advisor / DT / VQA 按需补充判断，把明确建议交给原业务。',
  '3. 原业务读取配置，注册并发起卡片；Planner 不拉卡。',
  '4. 卡片真正展示且选择“云端泛化语音”后，才注册上下文给 Planner。',
  '5. Planner 只返回确认/拒绝等语义；原业务决定是否继续。',
  '6. 端侧最终重检、执行和回读，原业务更新卡片并注销上下文。',
  '',
  '点击默认回原业务；旧链路必须模拟 Query 时需显式标注为兼容路线。'
], 20, 400, C.ink, 'start', 36);

rect(56, 1705, 1788, 84, C.red, C.redLine, 12, 1.8);
text(950, 1741, ['一句话讲图：平台决定“这类任务怎么做”；Trigger 决定“现在是否命中”；原业务负责“拉卡、消费结果和执行”；'], 21, 650, '#8C3434', 'middle');
text(950, 1772, ['即时交互卡负责“展示与回传”；Planner 只在云端语音路线里理解“用户是什么意思”。'], 21, 650, '#8C3434', 'middle');

out.push('</svg>');
fs.writeFileSync(new URL('./系统预设任务配置平台-五步业务框架-v04.svg', import.meta.url), out.join('\n'));
console.log('created 系统预设任务配置平台-五步业务框架-v04.svg');
