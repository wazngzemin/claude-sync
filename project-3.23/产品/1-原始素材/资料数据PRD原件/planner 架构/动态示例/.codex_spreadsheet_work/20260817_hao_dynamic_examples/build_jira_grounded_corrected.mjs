import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "【Director】动态示例(for badcases修复）.xlsx";
const outputDir = "outputs/01a00ece-74d6-7bc0-8908-98580aa0941b";
const outputPath = `${outputDir}/【Director】动态示例-郝晓伟今日反馈-Jira核对修正版-20260817.xlsx`;
const previewDir = ".codex_spreadsheet_work/20260817_hao_dynamic_examples/previews-jira-corrected";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));
const sheet = workbook.worksheets.getItem("动态示例汇总表(SFT）");

const heatDecision = "用户只表达热时，不要固定切换为制冷模式。先结合当前季节及<车端状态信息>中的空调开关、温度、风量、座椅加热状态判断：冬季优先排查空调温度过高或座椅加热档位过高，优先调低温度、降低或关闭座椅加热，不要随意切成制冷；夏季再根据当前状态调低温度或适度加大风量。关键状态未上报、为空或异常时，先调用vehicle_status_search查询，再调用vehicle_basic_control执行。";

const sunDecision = "先区分用户是在表达“遮光”还是“热”：明确想遮光、阳光刺眼时，语义统一为“关闭遮阳帘”；明确表达车内热时，按季节和当前空调/座椅加热状态处理，不要把所有“晒”都直接改成制冷。遮阳帘控制需结合位置：仅后排遮阳帘支持语音控制，调用vehicle_basic_control；前排遮阳帘需手动操作。";

const intelligentDriveRule = "智能驾驶控制类指令必须以本轮用户明确指令为准，每轮都调用auto_drive；不得参考或继承历史对话、上一轮工具结果、记忆或旧状态而跳过工具、直接回复已设置/不能设置，也不得因此前执行失败、参数越界或被拒绝而停止本轮调用。仅可读取speaker_position做操作权限校验：主驾提出则调用auto_drive，非主驾提出则告知仅主驾可操作、不执行。工具失败、越界或不支持时，只依据本轮tool_feedback如实反馈，不得编造成功。";

sheet.getRange("B211").values = [[`将本轮需求改写为“跟车时距调远一档”。${intelligentDriveRule}`]];
sheet.getRange("D211").values = [["王泽民2026.08.17修订：跟车距离每轮强制调用工具，禁止沿用历史上下文"]];
sheet.getRange("B292").values = [[`将本轮指令原样作为“向左变道”执行。${intelligentDriveRule}`]];
sheet.getRange("D292").values = [["王泽民2026.08.17修订：变道每轮强制调用工具，禁止沿用历史上下文"]];
for (const row of [293, 295]) {
  sheet.getRange(`B${row}`).values = [[`将本轮需求理解为巡航车速相对调高，并调用auto_drive执行。${intelligentDriveRule}`]];
  sheet.getRange(`D${row}`).values = [["王泽民2026.08.17修订：巡航车速每轮强制调用工具，禁止沿用历史上下文"]];
}
sheet.getRange("B433").values = [[`巡航速度支持范围为30~130km/h且仅支持5的整数倍；本轮83km/h需就近改写为80km/h后调用auto_drive。${intelligentDriveRule}`]];
sheet.getRange("D433").values = [["王泽民2026.08.17修订：参数归一后仍必须调用工具，不得只澄清或沿用历史结果"]];
sheet.getRange("B436").values = [[`本轮明确目标为跟车距离2档（支持范围1~5档），主驾提出时直接调用auto_drive。${intelligentDriveRule}`]];
sheet.getRange("D436").values = [["王泽民2026.08.17修订：跟车距离每轮强制调用工具，禁止沿用历史上下文"]];

sheet.getRange("B2").values = [["这是用户本轮明确的执行指令，必须调用vehicle_basic_control执行“打开加油小门”，不能因记忆或约30秒更新一次的旧端状态显示“已打开”就跳过工具并直接回复已打开。工具返回失败或端状态仍未更新时，如实告知执行结果，不得虚假确认成功。"]];
sheet.getRange("D2").values = [["PQCP-29468；表格详细说明：端状态与记忆冲突；短期动态示例，长期需提高端状态实时性"]];

sheet.getRange("B366").values = [["用户想透光时，语义统一改写为“打开遮阳帘”。结合用户明确位置和speaker_position判断：仅后排遮阳帘支持语音控制，调用vehicle_basic_control执行“打开后排遮阳帘”；前排遮阳帘需手动拉动，不调用工具。"]];
sheet.getRange("D366").values = [["郝晓伟2026.08.17补充：透光=打开遮阳帘"]];
sheet.getRange("B367").values = [["用户想遮光时，语义统一改写为“关闭遮阳帘”。结合用户明确位置和speaker_position判断：仅后排遮阳帘支持语音控制，调用vehicle_basic_control执行“关闭后排遮阳帘”；前排遮阳帘需手动拉动，不调用工具。"]];
sheet.getRange("D367").values = [["郝晓伟2026.08.17补充：遮光=关闭遮阳帘"]];

for (const row of [383, 384, 402]) {
  sheet.getRange(`B${row}`).values = [[heatDecision]];
  const oldNote = sheet.getRange(`D${row}`).values?.[0]?.[0] ?? "";
  sheet.getRange(`D${row}`).values = [[`${oldNote}${oldNote ? "；" : ""}郝晓伟2026.08.17季节化修订`]];
}
sheet.getRange("B403").values = [[sunDecision]];
sheet.getRange("D403").values = [["郝晓伟2026.08.17修订：区分遮光与热"]];
sheet.getRange("B457").values = [[sunDecision]];
sheet.getRange("D457").values = [["郝晓伟2026.08.17修订：与现有“好晒啊”示例对齐，避免冲突"]];

for (let row = 522; row <= 531; row += 1) {
  sheet.getRange(`A${row}:I${row}`).copyFrom(sheet.getRange("A521:I521"), "all");
}

sheet.getRange("A522:I531").values = [
  [
    "看一下我手里拿的什么？",
    "这是本轮车内视觉问答，必须重新调用visual_qa获取当前画面；不得复用上一轮图片或上一轮识别结论。只依据本轮tool_feedback回答；未看清、无结果或置信不足时，明确说明没看清，并引导用户把物品移到摄像头可见范围后重试。",
    "王泽民",
    "PQCP-32735；表格原因分类：模型能力；Jira确认13:46:23—13:46:33未收到取图指令",
    "2026.08.17新增（Jira核对）",
    "http://jira.z-onesoftware.com:8080/browse/PQCP-32735",
    "20260810134623A62E29C3BE784F25EA02",
    null,
    null,
  ],
  [
    "现在胎压多少",
    "优先读取<车端状态信息>中的四轮当前胎压并严格按最新数值回答，不得复用历史数值或编造：数据完整时逐轮播报；缺失、未上报或异常时调用vehicle_status_search查询胎压，再依据tool_feedback回答。Jira中右前最新上报为约1.96—1.98bar，而错误播报为2.84bar，说明回答必须以当前context为准。",
    "王泽民",
    "PQCP-31036；表格原因分类：云端逻辑；Jira显示端状态上报正确但回答未使用最新context",
    "2026.08.17新增（Jira核对）",
    "http://jira.z-onesoftware.com:8080/browse/PQCP-31036",
    null,
    null,
    null,
  ],
  [
    "打开通讯录",
    "这是明确的当前执行指令，不是问答。结合speaker_position和蓝牙连接状态：主驾且蓝牙已连接时，必须调用vehicle_communication执行“打开通讯录”；即使用户刚刚手动关闭过页面，本轮明确指令仍优先，不能参考历史上下文跳过工具并直接回复已打开。蓝牙未连接时提醒先连接；非主驾提出时说明仅主驾可执行。",
    "王泽民",
    "IS4PREIL-3132；表格原因分类：记忆模块；短期动态示例修复，长期依赖页面事件上报",
    "2026.08.17新增（Jira核对）",
    "http://jira.z-onesoftware.com:8080/browse/IS4PREIL-3132",
    null,
    null,
    null,
  ],
  [
    "我现在在哪",
    "当前位置属于高时效状态，必须使用本轮最新上报的当前车辆位置/导航位置字段回答；不得复用历史回复、上一次地址、目的地或收藏地址。若最新位置字段缺失、未上报或时间明显过旧，明确说明暂时无法获取精确位置，不得猜测。",
    "王泽民",
    "IS4PREIL-3709；表格原因分类：模型能力、详细说明：导航信息反馈错误；Jira显示端状态已更新但回答复用上一地址",
    "2026.08.17新增（Jira核对）",
    "http://jira.z-onesoftware.com:8080/browse/IS4PREIL-3709",
    "2026080313552454F61A4D1A5AD6E4A28F",
    null,
    null,
  ],
  [
    "后排投资人说有点冷",
    "结合后排乘员语义处理，“投资人”可能是ASR对“有人”的误识别。用户表达冷时先看季节和当前空调温度、风量：夏季优先排查温度过低或风量过高，优先调高对应分区温度或降低风量，不要直接开启后排座椅加热；冬季再结合位置和端状态选择升温。座椅加热、方向盘加热仅在位置与诉求明确匹配时谨慎使用。状态缺失时先调用vehicle_status_search，再调用vehicle_basic_control执行。",
    "王泽民",
    "郝晓伟2026.08.17群内badcase；动态示例只修复动作决策，ASR误识别仍需ASR链路处理",
    "2026.08.17新增（Jira核对）",
    null,
    null,
    null,
    null,
  ],
  [
    "车里太暗了，想透点光",
    "用户想透光时，语义必须改写为“打开遮阳帘”，不得反向理解为关闭。结合用户明确位置和speaker_position：仅后排遮阳帘支持语音控制，调用vehicle_basic_control执行“打开后排遮阳帘”；前排遮阳帘需手动操作。",
    "王泽民",
    "郝晓伟2026.08.17反馈：透光=打开遮阳帘",
    "2026.08.17新增（Jira核对）",
    null,
    null,
    null,
    null,
  ],
  [
    "太阳太晒了，帮我遮一下",
    "用户明确想遮光时，语义必须改写为“关闭遮阳帘”，不得反向理解为打开。结合用户明确位置和speaker_position：仅后排遮阳帘支持语音控制，调用vehicle_basic_control执行“关闭后排遮阳帘”；前排遮阳帘需手动操作。若用户表达的是车内热而非遮光，则按季节与当前空调/座椅加热状态处理。",
    "王泽民",
    "郝晓伟2026.08.17反馈：遮光=关闭遮阳帘",
    "2026.08.17新增（Jira核对）",
    null,
    null,
    null,
    null,
  ],
  [
    "帮我向右变道",
    `将本轮指令原样作为“向右变道”执行。${intelligentDriveRule}`,
    "王泽民",
    "王泽民2026.08.17补充：智能驾驶控制必须每轮调用auto_drive，禁止参考历史上下文跳过工具",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
  [
    "跟车距离调近一档",
    `将本轮需求改写为“跟车时距调近一档”。${intelligentDriveRule}`,
    "王泽民",
    "王泽民2026.08.17补充：智能驾驶控制必须每轮调用auto_drive，禁止参考历史上下文跳过工具",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
  [
    "把巡航车速调到100",
    `本轮目标巡航车速为100km/h，在30~130km/h且为5的整数倍的可调范围内，主驾提出时直接调用auto_drive。${intelligentDriveRule}`,
    "王泽民",
    "王泽民2026.08.17补充：智能驾驶控制必须每轮调用auto_drive，禁止参考历史上下文跳过工具",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
];

sheet.getRange("A522:I531").format.wrapText = true;
sheet.getRange("A522:I531").format.autofitRows();

const keyRanges = ["A1:F4", "A205:E211", "A288:E295", "A428:E436", "A518:I531"];
for (const range of keyRanges) {
  const check = await workbook.inspect({
    kind: "table",
    range: `'动态示例汇总表(SFT）'!${range}`,
    include: "values,formulas",
    tableMaxRows: 20,
    tableMaxCols: 10,
    maxChars: 18000,
  });
  console.log(JSON.stringify({ range, ndjson: check.ndjson }));
}

for (const term of ["打开加油小门", "胎压", "打开通讯录", "我现在在哪", "向右变道", "跟车距离调近一档", "把巡航车速调到100"]) {
  const check = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 50 },
    maxChars: 10000,
    summary: `${term} final matches`,
  });
  console.log(JSON.stringify({ term, ndjson: check.ndjson }));
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  maxChars: 7000,
  summary: "final formula error scan",
});
console.log(JSON.stringify({ formulaErrors: errors.ndjson }));

await fs.mkdir(previewDir, { recursive: true });
for (const sheetName of ["动态示例汇总表(SFT）", "Sheet3"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 0.7, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName.replaceAll("/", "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
}
for (const range of keyRanges) {
  const preview = await workbook.render({ sheetName: "动态示例汇总表(SFT）", range, scale: 1.5, format: "png" });
  await fs.writeFile(`${previewDir}/${range.replace(":", "-")}.png`, new Uint8Array(await preview.arrayBuffer()));
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath }));
