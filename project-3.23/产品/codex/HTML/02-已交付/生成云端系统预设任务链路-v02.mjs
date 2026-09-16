import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { marked } = require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked');
const sharp = require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const base = '/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付';
const svgPath = `${base}/云端系统预设任务-会后修正版完整链路-v02.svg`;
const pngPath = `${base}/云端系统预设任务-会后修正版完整链路-v02.png`;
const mdPath = `${base}/云端系统预设任务-会后修正版链路与行动手册-v02.md`;
const htmlPath = `${base}/云端系统预设任务-会后修正版链路与行动手册-v02.html`;

const W = 1900;
const H = 2480;
const colors = {
  cfg: ['#20180b', '#fbbf24'],
  task: ['#082f49', '#22d3ee'],
  biz: ['#2e1065', '#a78bfa'],
  vehicle: ['#052e2b', '#34d399'],
  decision: ['#422006', '#fb923c'],
  stop: ['#1e293b', '#94a3b8'],
  pending: ['#4c0519', '#fb7185'],
};

const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[ch]));
const arrows = [];
const shapes = [];

function line(points, label = '', color = '#64748b', dashed = false) {
  const pts = points.map(([x, y]) => `${x},${y}`).join(' ');
  arrows.push(`<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" ${dashed ? 'stroke-dasharray="7 6"' : ''} marker-end="url(#arrow)"/>`);
  if (label) {
    const mid = points[Math.floor(points.length / 2)];
    arrows.push(`<text x="${mid[0] + 8}" y="${mid[1] - 8}" class="edge-label">${esc(label)}</text>`);
  }
}

function textLines(cx, y, lines, options = {}) {
  const { size = 15, gap = 22, color = '#f8fafc', firstBold = true } = options;
  const start = y - ((lines.length - 1) * gap) / 2;
  return `<text x="${cx}" y="${start}" text-anchor="middle" fill="${color}" font-size="${size}">${lines.map((value, index) => `<tspan x="${cx}" dy="${index === 0 ? 0 : gap}" ${index === 0 && firstBold ? 'font-weight="700"' : ''}>${esc(value)}</tspan>`).join('')}</text>`;
}

function box(x, y, w, h, lines, type = 'task', dashed = false) {
  const [fill, stroke] = colors[type];
  shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#0f172a"/>`);
  shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" fill-opacity="0.92" stroke="${stroke}" stroke-width="2" ${dashed ? 'stroke-dasharray="8 6"' : ''}/>`);
  shapes.push(textLines(x + w / 2, y + h / 2 + 2, lines, { size: lines.length >= 4 ? 13 : 14.5, gap: lines.length >= 4 ? 20 : 23 }));
}

function diamond(cx, cy, w, h, lines) {
  const [fill, stroke] = colors.decision;
  const points = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
  shapes.push(`<polygon points="${points}" fill="#0f172a"/>`);
  shapes.push(`<polygon points="${points}" fill="${fill}" fill-opacity="0.95" stroke="${stroke}" stroke-width="2"/>`);
  shapes.push(textLines(cx, cy + 2, lines, { size: 13.5, gap: 20 }));
}

function band(y, h, title, subtitle) {
  shapes.push(`<rect x="28" y="${y}" width="1844" height="${h}" rx="16" fill="#0f172a" fill-opacity="0.88" stroke="#334155" stroke-width="1.5"/>`);
  shapes.push(`<text x="52" y="${y + 30}" fill="#f8fafc" font-size="18" font-weight="700">${esc(title)}</text>`);
  shapes.push(`<text x="52" y="${y + 54}" fill="#94a3b8" font-size="12.5">${esc(subtitle)}</text>`);
}

// Background bands.
band(150, 340, '一、上线前：定义、校验、发布', '产品配置完整任务；缺能力、接口或 Owner 时阻止发布');
band(510, 270, '二、用户许可：目录、界面、真实状态分开', 'Task Service 提供目录；任务中心提供入口；真实开关按 VIN 保存');
band(800, 300, '三、Cloud Trigger：只判断何时产生一次业务事件', '硬条件、数据时效、去重和频控通过后交出 run_event');
band(1120, 330, '四、任务业务与识别：决定是否值得询问', 'DT/VQA 只返回识别结果；任务业务校验并决定是否出卡');
band(1470, 420, '五、即时交互：业务拉卡，卡片返回交互事实', '固定点击/可见即可说与泛化语音分路，最终回到同一 run_event');
band(1910, 350, '六、端侧执行与真实结果：复核不能删除', '用户确认后重新检查最新车况；最终看车辆真实状态');

// Arrows are created before boxes to keep them visually behind components.
// Stage 1.
line([[300, 300], [350, 300]]);
line([[630, 300], [680, 300]]);
line([[940, 300], [990, 300]], '通过');
line([[1270, 300], [1320, 300]]);
line([[810, 365], [810, 405]], '不通过', '#fb7185');
line([[1600, 355], [1785, 355], [1785, 585], [320, 585]], '任务目录');

// Stage 2.
line([[320, 650], [390, 650]]);
line([[670, 650], [740, 650]]);
line([[1400, 585], [1400, 620], [670, 620]], '默认策略约束', '#fb7185', true);
line([[1020, 650], [1785, 650], [1785, 875], [310, 875]], '真实状态');

// Stage 3.
line([[310, 950], [360, 950]]);
line([[680, 950], [730, 950]]);
line([[970, 950], [1020, 950]], '是');
line([[850, 1015], [850, 1050]], '否', '#94a3b8');
line([[1320, 950], [1785, 950], [1785, 1195], [300, 1195]], '一次业务事件');

// Stage 4.
line([[300, 1280], [350, 1280]]);
line([[650, 1280], [700, 1280]]);
line([[1000, 1280], [1050, 1280]]);
line([[1320, 1280], [1370, 1280]]);
line([[1570, 1345], [1570, 1385]], '否', '#94a3b8');
line([[1570, 1215], [1785, 1215], [1785, 1555], [300, 1555]], '是：进入询问');

// Stage 5.
line([[300, 1615], [350, 1615]]);
line([[650, 1615], [700, 1615]]);
line([[940, 1615], [990, 1555]], '点击/固定词');
line([[940, 1615], [990, 1710]], '泛化语音');
line([[1270, 1555], [1330, 1630]]);
line([[1270, 1710], [1330, 1630]]);
line([[820, 1680], [820, 1810], [1560, 1810]], '展示失败', '#94a3b8');
line([[1470, 1695], [1470, 1810], [1560, 1810]], '否', '#94a3b8');
line([[1470, 1565], [1785, 1565], [1785, 1985], [270, 1985]], '是：有效确认');

// Stage 6.
line([[270, 2070], [310, 2070]]);
line([[610, 2070], [660, 2070]]);
line([[900, 2070], [950, 2070]], '是');
line([[1230, 2070], [1280, 2070]]);
line([[1530, 2070], [1580, 2070]]);
line([[780, 2135], [780, 2190]], '否', '#94a3b8');
line([[1060, 2220], [1730, 2220], [1730, 2130]], '返回复核结果', '#94a3b8');

// Stage 1 nodes.
box(50, 245, 250, 110, ['01 产品定义', '价值、范围、规则', '交互、动作、验收'], 'cfg');
box(350, 235, 280, 130, ['02 配置平台', '任务关联、硬条件', '识别、卡片、动作', '频控与失败策略'], 'cfg');
diamond(810, 300, 260, 130, ['03 完整性检查', '能力、接口、Owner', '是否齐全？']);
box(990, 245, 280, 110, ['04 发布两类内容', '运行规则 → Trigger/业务', '目录信息 → Task Service'], 'cfg');
box(1320, 235, 280, 120, ['05 Task Service', '聚合任务目录', '统一提供给任务中心', '不做业务编排'], 'task');
box(680, 405, 260, 60, ['阻止发布：返回缺口'], 'stop');

// Stage 2 nodes.
box(50, 600, 270, 100, ['06 任务中心', '上电/刷新获取目录', '展示任务说明'], 'task');
box(390, 600, 280, 100, ['07 用户开启/关闭', '长期许可', '不等于本次开盖确认'], 'task');
box(740, 585, 280, 130, ['08 任务状态承接服务', '按 VIN 持久化、回显', '重启/离线恢复', 'P0 Owner TBD'], 'pending', true);
box(1140, 590, 260, 100, ['产品策略待会签', '默认开启还是关闭', '首次告知与授权'], 'pending', true);

// Stage 3 nodes.
box(50, 895, 260, 110, ['09 Cloud Trigger', '读真实任务状态', '读规则和上行车况'], 'task');
box(360, 880, 320, 140, ['10 充电例硬条件', '进入 P 挡、任务开启', '主动服务开关、SOC', '口盖关闭、数据有效'], 'task');
diamond(850, 950, 240, 130, ['11 条件满足', '本次未处理？']);
box(1020, 880, 300, 140, ['12 创建一次业务事件', 'task、VIN、run_event', '停车关联、状态快照', '原因、时间和有效期'], 'task');
box(720, 1045, 260, 45, ['否：继续等待，不调用模型'], 'stop');

// Stage 4 nodes.
box(50, 1225, 250, 110, ['13 任务业务接事件', '持有本次状态', '业务研发 P0 TBD'], 'biz');
box(350, 1220, 300, 120, ['14 Advisor / DT', '按会签通道发起判断', 'Query 不包含开盖授权'], 'biz');
box(700, 1220, 300, 120, ['15 端侧视觉 / VQA', '返回 FOUND 等四类结果', '携带时间与事件关联'], 'biz');
box(1050, 1215, 270, 130, ['16 结果回任务业务', '实际回传接口', 'P0 待确认'], 'pending', true);
diamond(1570, 1280, 300, 130, ['17 业务校验', 'FOUND、同次、未过期', '任务仍开启？']);
box(1430, 1385, 280, 45, ['否：结束，不出卡、不车控'], 'stop');

// Stage 5 nodes.
box(50, 1555, 250, 120, ['18 任务业务拉卡', '文案、按钮、TTS', '回调、有效期、run_event'], 'biz');
box(350, 1550, 300, 130, ['19 即时交互卡 / VUI', '校验、排队、真正展示', '返回展示结果', '徐洋/姜锋确认'], 'biz');
diamond(820, 1615, 240, 130, ['20 真正展示', '询问仍有效？']);
box(990, 1500, 280, 110, ['21A 点击 / 可见即可说', '映射 CONFIRM/REJECT', '返回任务业务'], 'biz');
box(990, 1655, 280, 110, ['21B 泛化语音', '卡片上下文 → Planner', 'Planner 不拉卡'], 'biz');
diamond(1470, 1630, 280, 130, ['22 业务只消费一次', '当前、明确、有效', '且未消费？']);
box(1530, 1780, 300, 60, ['否：拒绝/关闭/超时/旧回答'], 'stop');

// Stage 6 nodes.
box(40, 2020, 230, 100, ['23 业务下发执行', 'run_event、确认', '动作和有效期'], 'vehicle');
box(310, 2010, 300, 120, ['24 端侧执行前复核', '任务、停车、P挡、口盖', '确认有效、未重复', 'Owner P0 TBD'], 'pending', true);
diamond(780, 2070, 240, 130, ['25 仍允许', '且仍需执行？']);
box(950, 2020, 280, 100, ['26 赛力斯车控', '请求打开充电口盖', 'ACK ≠ 已打开'], 'vehicle');
box(1280, 2020, 250, 100, ['27 真实状态回读', 'SUCCESS / FAILED', '/ UNKNOWN'], 'vehicle');
box(1580, 2010, 260, 120, ['28 业务收口', '更新卡片和记录', '冷却后等待下一次'], 'vehicle');
box(650, 2190, 410, 60, ['不执行/无需重复：返回原因，同样收口'], 'stop');

// Header and footer.
shapes.push(`<circle cx="48" cy="46" r="7" fill="#34d399"><animate attributeName="opacity" values="1;.35;1" dur="2s" repeatCount="indefinite"/></circle>`);
shapes.push(`<text x="68" y="55" fill="#f8fafc" font-size="30" font-weight="700">云端系统预设任务｜会后修正版完整链路</text>`);
shapes.push(`<text x="48" y="88" fill="#94a3b8" font-size="15">以识别充电设备后打开充电口盖为例 · 目标闭环，不冒充现状 · 红色虚线项需专项拍板</text>`);
shapes.push(`<rect x="28" y="2290" width="1844" height="120" rx="14" fill="#0f172a" stroke="#334155"/>`);
shapes.push(`<text x="950" y="2330" text-anchor="middle" fill="#f8fafc" font-size="20" font-weight="700">配置发布 ≠ 用户开启 ≠ Trigger 命中 ≠ 识别成功 ≠ 卡片展示 ≠ 用户确认 ≠ 车辆真实完成</text>`);
shapes.push(`<text x="950" y="2365" text-anchor="middle" fill="#94a3b8" font-size="14">硬边界：Trigger 只发事件；DT/VQA 只给结果；业务拉卡并闭环；Planner 只按需理解卡片后的泛化语音；端侧做最终复核</text>`);
shapes.push(`<text x="950" y="2395" text-anchor="middle" fill="#64748b" font-size="12">依据 2026-09-14 外审逐字稿及会后产品边界校正 · V02</text>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="云端系统预设任务会后修正版完整链路">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.5"/></pattern>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#64748b"/></marker>
  </defs>
  <style>text{font-family:'JetBrains Mono','PingFang SC','Microsoft YaHei',monospace}.edge-label{fill:#cbd5e1;font-size:12px;paint-order:stroke;stroke:#020617;stroke-width:4px}</style>
  <rect width="${W}" height="${H}" fill="#020617"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  ${arrows.join('\n')}
  ${shapes.join('\n')}
</svg>`;

fs.writeFileSync(svgPath, svg);

const md = fs.readFileSync(mdPath, 'utf8');
const body = marked.parse(md)
  .replace(/<p><img[^>]+云端系统预设任务会后修正版完整链路[^>]*><\/p>/, `<div class="diagram">${svg}</div>`);

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>云端系统预设任务｜会后修正版链路与行动手册 V02</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{color-scheme:dark;--bg:#020617;--panel:#0f172a;--line:#334155;--text:#e2e8f0;--muted:#94a3b8;--accent:#22d3ee;--violet:#a78bfa;--rose:#fb7185}
    *{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 20% 0,#0f2741 0,transparent 32%),var(--bg);color:var(--text);font-family:'JetBrains Mono','PingFang SC','Microsoft YaHei',monospace;line-height:1.72}
    main{max-width:1500px;margin:auto;padding:44px 32px 90px}h1{font-size:34px;line-height:1.3;margin:0 0 18px;color:#fff}h2{margin-top:58px;padding-top:18px;border-top:1px solid var(--line);font-size:25px;color:#fff}h3{margin-top:34px;font-size:19px;color:#c4b5fd}p,li{font-size:15px}blockquote{margin:20px 0;padding:12px 18px;border-left:3px solid var(--accent);background:#0b2236;color:#dbeafe}code{background:#172033;padding:2px 5px;border-radius:4px;color:#bae6fd}a{color:#67e8f9}table{width:100%;border-collapse:collapse;margin:20px 0 30px;background:rgba(15,23,42,.76);font-size:13px}th,td{border:1px solid var(--line);padding:11px 12px;vertical-align:top}th{color:#fff;background:#172033;text-align:left;position:sticky;top:0}tr:nth-child(even) td{background:rgba(30,41,59,.34)}.diagram{margin:26px calc(50% - 50vw);padding:24px 2vw;background:#020617;border-top:1px solid #1e293b;border-bottom:1px solid #1e293b;overflow:auto}.diagram svg{display:block;width:min(100%,1900px);height:auto;margin:auto;min-width:1100px}hr{border:0;border-top:1px solid var(--line)}strong{color:#fff}@media(max-width:800px){main{padding:24px 18px}h1{font-size:27px}.diagram svg{min-width:1400px}table{display:block;overflow:auto}}
  </style>
</head>
<body><main>${body}</main></body>
</html>`;

fs.writeFileSync(htmlPath, html);
await sharp(Buffer.from(svg)).png().toFile(pngPath);
console.log(JSON.stringify({ svgPath, pngPath, htmlPath, svgBytes: Buffer.byteLength(svg), htmlBytes: Buffer.byteLength(html) }, null, 2));
