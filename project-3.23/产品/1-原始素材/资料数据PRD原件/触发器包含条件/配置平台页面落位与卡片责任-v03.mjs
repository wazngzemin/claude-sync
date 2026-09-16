import fs from 'node:fs';

const C = {
  ink: '#173458', blue: '#1E63B6', pale: '#EDF4FF', line: '#8AA3C1',
  gray: '#F4F6F8', muted: '#52657B', green: '#EAF5EF', greenLine: '#579473',
  warm: '#FFF4E4', warmLine: '#D88932', purple: '#F3EEFF', purpleLine: '#8B70C9',
  red: '#FFF0F0', redLine: '#DB5C5C', white: '#FFFFFF'
};

const esc = (x) => String(x).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function canvas(width, height) {
  const s = [];
  s.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
  s.push(`<defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 4 L0 8 z" fill="${C.line}"/></marker></defs>`);
  s.push(`<rect width="100%" height="100%" fill="#FFFFFF"/>`);
  return s;
}

function rect(s, x, y, w, h, fill = C.gray, stroke = 'none', r = 14, sw = 2) {
  s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
}

function text(s, x, y, lines, size = 22, weight = 400, color = C.ink, anchor = 'start', lh = 31) {
  s.push(`<text x="${x}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(line)}</tspan>`).join('')}</text>`);
}

function poly(s, points, arrow = true, dash = false, color = C.line, width = 2.4) {
  s.push(`<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${width}" ${arrow ? 'marker-end="url(#arrow)"' : ''} ${dash ? 'stroke-dasharray="7 6"' : ''}/>`);
}

function pill(s, x, y, label, fill, stroke, color = C.ink) {
  const w = 24 + label.length * 18;
  rect(s, x, y, w, 38, fill, stroke, 19, 1.5);
  text(s, x + w / 2, y + 26, [label], 18, 600, color, 'middle');
  return w;
}

function card(s, x, y, w, h, number, title, owner, lines, fill = C.pale, stroke = C.blue) {
  rect(s, x, y, w, h, fill, stroke, 14, 2);
  rect(s, x, y, w, 54, fill, 'none', 14, 0);
  text(s, x + 20, y + 35, [`${number}  ${title}`], 24, 700);
  if (owner) pill(s, x + w - 20 - (24 + owner.length * 18), y + 9, owner, C.white, stroke, C.muted);
  text(s, x + 20, y + 88, lines, 20, 400, C.ink, 'start', 29);
}

function finish(s) { s.push('</svg>'); return s.join('\n'); }

// Figure 1: where every configuration belongs on the current platform.
{
  const s = canvas(1900, 1780);
  text(s, 56, 70, ['系统预设任务配置平台：页面落位与完整配置链路'], 39, 700);
  text(s, 56, 115, ['基于现有“场景详情页”扩展；灰色是平台已有，蓝色/橙色是本期需要新增或补齐。'], 23, 400, C.muted);

  pill(s, 56, 155, '现状', C.gray, C.line);
  text(s, 148, 181, ['当前页面已经能配置什么'], 25, 700);

  card(s, 56, 220, 540, 192, 'A', '基础信息与发布范围', '现有', [
    '场景名称、优先级',
    '渠道、指定车辆、车型、软件版本',
    '作用：决定这条规则发布给谁'
  ], C.gray, C.line);
  card(s, 630, 220, 540, 192, 'B', '触发条件', '现有', [
    '条件组、且/或关系',
    '能力类型 → 信号 → 字段 → 运算符 → 值',
    '作用：决定什么变化后开始检查'
  ], C.gray, C.line);
  card(s, 1204, 220, 640, 192, 'C', '动作与基础频控', '现有', [
    '自定义回调、回调地址、下游输入',
    '总次数、上电周期次数、每日次数、最小间隔',
    '缺口：只能“回调”，不能描述完整交互闭环'
  ], C.gray, C.line);

  poly(s, '950,430 950,476');
  pill(s, 56, 466, '本期改造', C.warm, C.warmLine);
  text(s, 184, 493, ['在同一“场景详情页”新增四个配置区'], 27, 700);

  card(s, 56, 530, 820, 248, '1', '任务关联与运行位置', '产品/任务业务填写', [
    '关联哪项系统预设任务；读取哪一个“真实启用状态”',
    '选择端侧运行或云端运行；填写任务业务负责人/承接业务',
    '联动：任务关闭后，不再生成新事件；未消费的询问失效',
    '产出给：端侧 Trigger 或 Cloud Trigger'
  ]);
  card(s, 924, 530, 920, 248, '2', '命中后的处理编排', '触发器产品 + 业务方', [
    '处理方式：直接执行 / 仅告知 / 先询问 / 发起主动推荐',
    '填写业务事件名称、承接业务、目标动作与动作顺序',
    '若选择“先询问”，必须进入下方“卡片注册与交互”配置',
    '产出给：触发器命中后调用的原业务；不是直接给 Planner'
  ]);

  card(s, 56, 818, 820, 366, '3', '卡片注册与交互', '新增核心配置区', [
    '谁注册：必须选择“卡片注册业务方”并填写业务场景标识',
    '展示什么：模板、标题、正文、按钮文案及按钮业务含义',
    '怎么播：TTS开关、内容、播报时机、禁语音时的降级',
    '怎么回答：点击回调到原业务；语音选择本地或云端路线',
    '本地路线：可见即可说，把语音命中转换为同一按钮点击',
    '云端路线：卡片展示后注册上下文/动态选择能力给 Planner',
    '生命周期：等待时长、卡片有效期、关闭/过期/撤销处理',
    '关键边界：Planner不创建、不拉起、不持有卡片'
  ], C.warm, C.warmLine);
  card(s, 924, 818, 920, 366, '4', '执行、结果与退出策略', '任务业务填写', [
    '确认后动作：先复核哪些最新条件，再调用哪个动作',
    '成功标准：读取哪个真实车辆状态，达到什么值才算成功',
    '结果分支：成功 / 失败 / 暂无法确认时分别展示和处理什么',
    '重复控制：去重口径、拒绝后的冷却、再次提醒时机',
    '失效条件：任务关闭、车况变化、卡片过期、结果过期',
    '退出动作：结束本次、撤卡、停止播报；不默认反向车控',
    '产出给：原业务、执行层和卡片结果更新能力'
  ], C.pale, C.blue);

  rect(s, 56, 1222, 1788, 192, C.purple, C.purpleLine, 14, 2);
  text(s, 78, 1262, ['独立建设：原子能力管理页（不是把所有字段硬写进每个场景）'], 27, 700);
  text(s, 78, 1304, [
    '能力提供方登记：能力名称、用途、字段/枚举/单位、数据来源、端侧/云端、车型/版本、提供方、当前接入状态。',
    '场景详情页只“引用”已接入能力。选定渠道、车型、版本和端云位置后，平台自动筛掉不适配能力。',
    '页面没有可选项时，提示“缺少哪项能力、由谁接入”；不得把“下拉框里没有”误判成底层一定没有能力。'
  ], 21, 400, C.ink, 'start', 31);

  text(s, 56, 1480, ['保存以后，配置怎样进入运行链路'], 28, 700);
  const xs = [56, 356, 656, 956, 1256, 1556];
  const items = [
    ['① 配置人员', '填写完整任务'],
    ['② 平台校验', '能力/分支/责任人'],
    ['③ 发布', '按范围生成配置'],
    ['④ Trigger', '读取状态并判断'],
    ['⑤ 原业务', '接事件并注册卡片'],
    ['⑥ 交互/执行', '收答复并完成闭环']
  ];
  items.forEach((it, i) => {
    rect(s, xs[i], 1520, 250, 112, i < 3 ? C.pale : (i === 4 ? C.warm : C.green), i === 4 ? C.warmLine : C.line, 12, 1.8);
    text(s, xs[i] + 18, 1557, [it[0]], 22, 700);
    text(s, xs[i] + 18, 1594, [it[1]], 19, 400, C.muted);
    if (i < items.length - 1) poly(s, `${xs[i] + 250},1577 ${xs[i + 1]},1577`);
  });
  rect(s, 56, 1666, 1788, 70, C.red, C.redLine, 12, 1.8);
  text(s, 950, 1710, ['发布门禁：未选业务承接方、需询问但未注册卡片、无取消/超时分支、无真实结果判定时，一律不允许发布。'], 23, 650, '#8C3434', 'middle');
  fs.writeFileSync(new URL('./系统预设任务配置平台-页面落位-v03.svg', import.meta.url), finish(s));
}

// Figure 2: business owns the card; Planner only interprets generalized cloud speech.
{
  const s = canvas(1900, 1810);
  text(s, 56, 70, ['即时交互卡责任与端云运行链路'], 39, 700);
  text(s, 56, 115, ['共同原则：Trigger 只判断并发出业务事件；原业务负责注册、拉起、消费和更新卡片。'], 23, 400, C.muted);
  rect(s, 56, 150, 1788, 78, C.red, C.redLine, 12, 2);
  text(s, 950, 198, ['已确认：Planner 不直接拉起卡片。只有业务先把卡片真正展示后，云端泛化语音才按需交给 Planner 理解。'], 25, 700, '#8C3434', 'middle');

  // common start
  text(s, 56, 292, ['共同起点'], 27, 700);
  const common = [
    [56, 326, 380, 142, '任务中心 / 任务业务', ['保存真实启用状态', '关闭后停止后续新触发']],
    [486, 326, 380, 142, 'Trigger', ['读取任务状态 + 场景数据', '条件满足后只发业务事件']],
    [916, 326, 430, 142, '原业务', ['收到事件并判断处理方式', '需要询问时创建卡片实例']],
    [1396, 326, 448, 142, '即时交互卡 / VUI', ['校验、排队、真正展示', '返回展示成功或失败']]
  ];
  common.forEach((n, i) => {
    rect(s, n[0], n[1], n[2], n[3], i === 2 ? C.warm : C.pale, i === 2 ? C.warmLine : C.blue, 14, 2);
    text(s, n[0] + 20, n[1] + 40, [n[4]], 24, 700);
    text(s, n[0] + 20, n[1] + 82, n[5], 20, 400, C.ink, 'start', 29);
    if (i < common.length - 1) poly(s, `${n[0] + n[2]},397 ${common[i + 1][0]},397`);
  });
  text(s, 679, 382, ['任务状态/数据'], 17, 500, C.muted, 'middle');
  text(s, 1119, 382, ['业务事件'], 17, 500, C.muted, 'middle');
  text(s, 1371, 382, ['注册并拉卡'], 17, 500, C.warmLine, 'middle');

  // Edge lane
  rect(s, 56, 535, 1788, 520, '#FBFCFE', C.line, 16, 2);
  pill(s, 80, 558, '端侧任务', C.green, C.greenLine);
  text(s, 208, 585, ['例：天气/路况保护；不经过 Planner'], 24, 700);
  card(s, 80, 626, 380, 174, 'E1', '端侧业务注册卡片', '', [
    '文案、确认/取消按钮、TTS',
    '业务回调、有效期',
    '注册“可见即可说”按钮表达'
  ], C.warm, C.warmLine);
  card(s, 512, 626, 380, 174, 'E2', '卡片真正展示', '', [
    'VUI返回展示结果',
    '展示后才开始等待用户回答',
    '语音禁用时仍可手动点击'
  ], C.pale, C.blue);
  card(s, 944, 626, 390, 174, 'E3', '点击 / 本地语音', '', [
    '点击：走原按钮回调',
    '语音：可见即可说命中按钮',
    '两种方式产出同一业务选择'
  ], C.green, C.greenLine);
  card(s, 1386, 626, 434, 174, 'E4', '原业务执行闭环', '', [
    '确认有效 → 重新检查车况',
    '调用赛力斯车控',
    '读真实状态并更新/关闭卡片'
  ], C.pale, C.blue);
  [460, 892, 1334].forEach((x) => poly(s, `${x},713 ${x + 52},713`));
  rect(s, 80, 835, 1740, 170, C.gray, 'none', 12, 0);
  text(s, 102, 875, ['端侧注册时，业务方必须给卡片什么'], 23, 700);
  text(s, 102, 915, [
    '① 这是哪项任务、哪一次触发；② 卡片标题/正文；③ 按钮与标准含义；④ TTS；⑤ 点击回到哪个业务；',
    '⑥ 可见即可说支持哪些按钮表达；⑦ 多久失效；⑧ 成功/失败后怎样更新。关闭、拒绝、超时均不执行。'
  ], 20, 400, C.ink, 'start', 31);

  // Cloud lane
  rect(s, 56, 1100, 1788, 626, '#FCFAFF', C.purpleLine, 16, 2);
  pill(s, 80, 1123, '云端任务', C.purple, C.purpleLine);
  text(s, 208, 1150, ['例：主动推荐/DT判断后的询问；业务仍然先注册卡片'], 24, 700);
  card(s, 80, 1192, 360, 178, 'C1', '云端得到明确建议', '', [
    'Cloud Trigger / Advisor / DT',
    '产出业务建议和上下文',
    '交给原业务，不直接拉卡'
  ], C.purple, C.purpleLine);
  card(s, 488, 1192, 390, 178, 'C2', '原业务注册并拉卡', '', [
    '注册卡片、按钮、TTS、回调',
    '选择点击路线与语音路线',
    '把当前建议绑定到这张卡'
  ], C.warm, C.warmLine);
  card(s, 926, 1192, 370, 178, 'C3', 'VUI真正展示', '', [
    '卡片展示后返回结果',
    '此时才允许注册云端语音上下文',
    '过期/撤卡同步清理'
  ], C.pale, C.blue);
  card(s, 1344, 1192, 476, 178, 'C4', '用户回答回到原业务', '', [
    '点击：按所选点击路线返回',
    '语音：Planner理解后返回标准选择',
    '原业务决定执行、拒绝或继续问'
  ], C.purple, C.purpleLine);
  [440, 878, 1296].forEach((x) => poly(s, `${x},1281 ${x + 48},1281`));

  rect(s, 80, 1410, 830, 260, C.green, C.greenLine, 12, 1.8);
  text(s, 104, 1450, ['云端语音路线：Planner做什么'], 24, 700);
  text(s, 104, 1492, [
    '1. 前提：卡片已展示，业务注册了卡片上下文/动态选择能力。',
    '2. 用户说“好的”“先不用”等泛化表达时，Planner结合当前卡片理解。',
    '3. Planner返回“确认/拒绝/其他诉求”等结果或调用已注册选择能力。',
    '4. 卡片消失后注销上下文，不能让旧回答消费旧卡片。',
    'Planner不负责：创建卡片、决定卡片文案、调用车控、判断最终成功。'
  ], 20, 400, C.ink, 'start', 31);

  rect(s, 946, 1410, 874, 260, C.gray, C.line, 12, 1.8);
  text(s, 970, 1450, ['云端点击路线：配置时必须二选一'], 24, 700);
  text(s, 970, 1492, [
    'A. 直接业务回调：按钮直接把标准选择返回原业务（目标方式）。',
    'B. 兼容模拟 Query：若现有静态 Advisor 暂无点击直达接口，按钮把约定',
    '   Query 送到云端，再由 Planner 转成业务选择（仅兼容场景，不默认）。',
    '平台必须明确展示当前选了哪条路线，不能由研发运行时猜测。',
    '无论哪条路线，最后都由原业务重新检查、执行、回读并更新卡片。'
  ], 20, 400, C.ink, 'start', 31);

  rect(s, 56, 1748, 1788, 42, C.red, C.redLine, 10, 1.6);
  text(s, 950, 1776, ['责任判断口诀：谁拥有这项任务，谁就注册卡片并消费结果；Trigger负责“何时发生”，Planner只在选定云端语义路线时负责“用户是什么意思”。'], 20, 650, '#8C3434', 'middle');
  fs.writeFileSync(new URL('./系统预设任务-卡片注册与端云链路-v03.svg', import.meta.url), finish(s));
}

console.log('created v03 diagrams');
