import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/bytedance/Downloads/yx-files/工作簿1.xlsx";
const outputDir = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/工作簿1-动态示例处理-20260812";
const outputPath = `${outputDir}/工作簿1-动态示例处理.xlsx`;

const records = [
  {
    no: 1, rawRow: 1, query: "导航时压低音乐", issue: "工具调用Fail", layer: "动态示例主修",
    decision: "改写为“打开导航多媒体降音”，调用vehicle_system_settings；工具返回成功后再简短回复完成。",
    evidence: "实际调用了media_basic_control，表内预期工具为vehicle_system_settings。",
    root: "低频功能的工具归属和改写词未固化。",
    acceptance: "action_list.tool_name=vehicle_system_settings；query=打开导航多媒体降音；不调用media_basic_control。",
    logId: "20260727150628F129A0D6C5441C1D5956",
  },
  {
    no: 2, rawRow: 144, query: "打开安全提醒播报", issue: "工具调用Fail", layer: "动态示例主修",
    decision: "改写为“打开导航提醒播报”，调用navi_basic_control；工具返回成功后再回复完成。",
    evidence: "实际调用了vehicle_system_settings并命中“导航提醒播报开关”，表内预期工具为navi_basic_control。",
    root: "导航提醒播报属于导航基础控制，不能路由到系统设置。",
    acceptance: "action_list.tool_name=navi_basic_control；query=打开导航提醒播报；工具反馈后不重复下发。",
    logId: "202607271544141EB3C04EE22FB766AE89",
  },
  {
    no: 3, rawRow: 255, query: "打开车内电源", issue: "工具调用Fail", layer: "动态示例+口径确认",
    decision: "当前Prompt已明确vehicle_system_settings支持车内电源控制：无需改写，调用vehicle_system_settings打开车内电源，并按工具返回反馈。表内“超出能力边界”与当前Prompt冲突，统一口径前不发布拒答示例。",
    evidence: "实际已调用vehicle_system_settings，函数为“一键上下电”，工具返回执行成功；表内却写“没有打开车内电源功能”。",
    root: "能力边界与当前Prompt/工具实际能力不一致，且工具成功后的播报链路需要复核。",
    acceptance: "先确认产品口径；若确认支持，则tool_name=vehicle_system_settings且按tool_feedback播报；若确认不支持，则不调用工具并明确拒答，不能两种口径并存。",
    logId: "20260727155756A2BE7C255D79B5EAC1A3",
  },
  {
    no: 4, rawRow: 382, query: "帮我打开座椅加热座椅按摩空调26度3挡风", issue: "工具调用Fail", layer: "动态示例主修",
    decision: "拆分并行：结合speaker_position改写为“打开主驾座椅加热”“打开主驾座椅按摩”“空调温度调到26度”“空调风量调到3档”，均调用vehicle_basic_control；“3挡风”只表示风量3档，不新增吹脚模式。",
    evidence: "实际额外生成了“空调吹风模式调成吹脚”，表内明确指出用户没有要求吹脚。",
    root: "把“3挡风”错误理解成“吹脚模式+风量3档”。",
    acceptance: "只生成4个目标动作；不得出现吹脚/吹风模式；五个动作之外不增加空调模式。",
    logId: "20260727162927AE3786EB5D5C920D6618",
  },
  {
    no: 5, rawRow: 607, query: "打开天窗打开车窗播放音乐", issue: "工具调用Fail", layer: "动态示例主修",
    decision: "拆分处理：天窗为实体天窗，不调用工具并告知无法语音控制；结合speaker_position将“打开车窗”改写为“打开主驾车窗”，调用vehicle_basic_control；“播放音乐”作为当前媒体控制调用media_basic_control，不调用music_search。",
    evidence: "实际调用了music_search和vehicle_basic_control；表内预期音乐动作使用media_basic_control，天窗只需说明不可控制。",
    root: "未区分“播放当前媒体”和“搜索新音乐”，并将不支持的天窗意图混入执行结果。",
    acceptance: "action_list包含media_basic_control+vehicle_basic_control；不生成天窗工具动作；主驾车窗定位正确。",
    logId: "2026072717260401169BE3C3CF8EFA8AE4",
  },
  {
    no: 6, rawRow: 860, query: "请关闭玻璃关闭天窗玻璃", issue: "工具返回内容改写Fail", layer: "动态示例主修",
    decision: "结合speaker_position，第一段“关闭玻璃”改写为“关闭主驾车窗”，调用vehicle_basic_control；“关闭天窗玻璃”按实体天窗处理，告知通过车顶物理方式操作，不调用工具；不要把“玻璃”泛化为关闭所有车窗。",
    evidence: "实际改写为“关闭所有车窗”；表内预期为关闭主驾车窗，且天窗不可语音控制。",
    root: "未利用说话人位置确定未指明车窗，且把天窗实体误当作可执行车窗动作。",
    acceptance: "仅生成关闭主驾车窗动作；不生成关闭所有车窗或天窗动作；播报中明确天窗处理方式。",
    logId: "2026072717360384079F9519513FF84C8B",
  },
  {
    no: 7, rawRow: 1024, query: "我关闭后雾灯关闭后雾灯", issue: "工具返回内容改写Fail", layer: "动态示例+安全规则",
    decision: "结合车端档位：非P挡时关闭后雾灯禁止下发vehicle_basic_control，告知需先停车挂P档；仅P挡时改写为“关闭后雾灯”，调用vehicle_basic_control。重复表达只执行一次。",
    evidence: "实际在非P挡/行驶环境下仍下发了关闭后雾灯；表内要求关闭车外灯时非P挡绝对禁止执行。",
    root: "安全规则已有文字但执行前未读取/校验档位，且重复Query未做去重。",
    acceptance: "D/R/N挡不下发任何车外灯关闭FC；P挡只下发一次；拒绝播报不得说“已关闭”。",
    logId: "20260727173723FCEF3F7D91CC68EA9E08",
  },
  {
    no: 8, rawRow: 1181, query: "他的座椅加热也高点吧", issue: "工具返回内容改写Fail", layer: "动态示例主修",
    decision: "结合上一轮对话将“他的”定位为二排左，且“高点”表示最高档：改写为“二排左座椅加热调到3档”，调用vehicle_basic_control；不得只写“调高档”。",
    evidence: "实际改写为“二排左座椅加热调高档”；表内预期为二排左座椅加热3档。",
    root: "省略表达“高点”未归一到座椅加热3档，导致工具参数不够精确。",
    acceptance: "query包含二排左、座椅加热、3档；不得使用high/调高档替代明确档位。",
    logId: "202607271810189BD1E07E8F4088FD7300",
  },
  {
    no: 9, rawRow: 1331, query: "车窗调低90%", issue: "工具返回内容改写Fail", layer: "动态示例主修",
    decision: "结合speaker_position定位为左后车窗，改写为“左后车窗调低90%”，调用vehicle_basic_control；保留“调低”语义，不改写为“调到90%”或“打开90%”。",
    evidence: "实际改写为“左后车窗调到90%”；表内预期改写为“左后车窗调低90%”。",
    root: "车窗开度动作词被统一成“调到/打开”，未保留原Query的下降方向。",
    acceptance: "内部query=左后车窗调低90%；工具参数仍应表达开度90%、position=左后、action=打开；播报不说成关窗。",
    logId: "20260727155655ADA684C7598128FDBDD9",
  },
  {
    no: 10, rawRow: 1442, query: "关闭后排新风", issue: "工具返回内容改写Fail", layer: "动态示例主修（能力拒答）",
    decision: "后排空调跟随前排，后排没有独立新风开关，且后排风向不能语音调节：直接告知无法单独关闭后排新风；如用户要停止全车送风，再改为关闭整车空调或切换内循环并确认，不调用vehicle_basic_control执行“关闭后排新风”。",
    evidence: "表内明确标为超出能力范围；当前能力边界写明无后排独立风量、后排风向只能手动调节。",
    root: "把不存在的后排独立控制项当成普通车控动作执行。",
    acceptance: "不得生成“关闭后排新风”FC；必须说明后排跟随/手动边界；用户明确关闭整车空调时才执行对应动作。",
    logId: "202607271915285F702558C76F6063D2D8",
  },
  {
    no: 11, rawRow: 1569, query: "暂停", issue: "工具调用Fail", layer: "动态示例主修",
    decision: "当前没有历史媒体动作、env_info也没有正在播放信息时，“暂停”意图不明确，先询问“要暂停音乐、视频还是播客？”不调用工具；只有当前状态明确存在正在播放的媒体时，才改写为“暂停当前媒体”，调用media_basic_control。",
    evidence: "实际直接改写为“暂停播放”并调用media_basic_control；表内要求无上下文时先澄清。",
    root: "把泛化的“暂停”擅自绑定为媒体暂停，未使用当前状态和历史上下文判断。",
    acceptance: "无播放上下文时action_list为空并追问；有明确当前媒体时才调用media_basic_control；不得默认暂停播放。",
    logId: "20260727192604C243857CE4000D13F724",
  },
  {
    no: 12, rawRow: 1712, query: "关闭尾门打开车窗", issue: "工具调用Fail", layer: "动态示例主修",
    decision: "拆分并行：调用vehicle_basic_control关闭尾门；结合speaker_position将“打开车窗”改写为“打开主驾车窗”，同样调用vehicle_basic_control。两动作均以工具实际返回结果播报，不得声称尾门需手动关闭。",
    evidence: "实际只调用了打开车窗，并回复尾门需要手动关闭；表内预期尾门支持vehicle_basic_control语音控制。",
    root: "多意图拆分时错误把尾门识别成不可语音控制，且未按工具反馈逐项汇报。",
    acceptance: "action_list包含关闭尾门和打开主驾车窗两个动作；任一失败都要单独说明；成功后不说“尾门需手动”。",
    logId: "20260728142752B35FB00FFD066775F2E8",
  },
  {
    no: 13, rawRow: 1825, query: "主驾调成休息关闭氛围灯", issue: "工具返回内容改写Fail", layer: "动态示例+安全规则",
    decision: "结合车速/档位执行：车辆行驶或非P挡时，跳过主驾座椅移动并告知行驶中不支持调节；仍可调用ambient_light_control关闭氛围灯，不能播报“都调好了”。仅车速0且P挡时，才调用vehicle_basic_control把主驾座椅调到休息位置，并与关闭氛围灯分别按工具结果反馈。",
    evidence: "实际在车速40km/h环境下仍下发主驾座椅靠背向后调到休息角度，并播报全部完成；表内要求行驶中不支持座椅调节。",
    root: "多动作中未对座椅移动做行驶安全拦截，且部分动作成功后错误合并成全部成功。",
    acceptance: "行驶中不产生主驾座椅移动FC；氛围灯可单独成功；播报明确跳过原因，不说“都调好了”。",
    logId: "202607281445141A66D4ACB17F996A5EDD",
  },
];

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheetNames = workbook.worksheets.items.map((s) => s.name);
for (const name of ["动态示例处理", "平台录入清单", "平台测试验收", "口径与证据"]) {
  if (sheetNames.includes(name)) workbook.worksheets.getItem(name).delete();
}

const navy = "#1F4E78";
const blue = "#5B9BD5";
const lightBlue = "#EAF2F8";
const green = "#70AD47";
const amber = "#FFF2CC";
const red = "#FCE4D6";
const bodyFont = { typeface: "宋体", fontSize: 10, color: "#1F2937" };

function titleBlock(sheet, range, title, subtitle) {
  sheet.showGridLines = false;
  sheet.getRange(range.title).merge();
  sheet.getRange(range.title.split(":")[0]).values = [[title]];
  sheet.getRange(range.title).format = { fill: navy, font: { ...bodyFont, fontSize: 15, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
  sheet.getRange(range.subtitle).merge();
  sheet.getRange(range.subtitle.split(":")[0]).values = [[subtitle]];
  sheet.getRange(range.subtitle).format = { fill: lightBlue, font: { ...bodyFont, fontSize: 10, color: "#334155" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true };
  sheet.getRange(range.title).format.rowHeight = 32;
  sheet.getRange(range.subtitle).format.rowHeight = 44;
}

const audit = workbook.worksheets.add("动态示例处理");
titleBlock(audit, { title: "A1:J1", subtitle: "A2:J2" }, "工作簿1：13条动态示例处理结果", "保留原始 Sheet1 不改；本表逐条对照原始 Query、实际工具/播报和表内预期，给出可复制决策分析与验收标准。红色行表示需先统一能力口径或必须保留安全拦截。\n来源：/Users/bytedance/Downloads/yx-files/工作簿1.xlsx");
audit.getRange("A4:J4").values = [["序号", "原表起始行", "原始Query", "原表问题类型", "处理层级", "平台录入决策分析", "实际证据", "根因/注意事项", "验收标准", "log_id"]];
audit.getRange("A5:J17").values = records.map((r) => [r.no, r.rawRow, r.query, r.issue, r.layer, r.decision, r.evidence, r.root, r.acceptance, r.logId]);
audit.getRange("A4:J4").format = { fill: blue, font: { ...bodyFont, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D9E2F3" } };
audit.getRange("A5:J17").format = { font: bodyFont, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
audit.getRange("A5:A17").format.horizontalAlignment = "center";
audit.getRange("B5:B17").format.horizontalAlignment = "center";
audit.getRange("A5:J17").format.rowHeight = 108;
for (const row of [7, 11, 17]) audit.getRange(`A${row}:J${row}`).format.fill = amber;
audit.getRange("A7:J7").format.fill = red;
audit.getRange("A4:J4").format.rowHeight = 32;
audit.getRange("A5:A17").format.columnWidth = 7;
audit.getRange("B5:B17").format.columnWidth = 11;
audit.getRange("C5:C17").format.columnWidth = 38;
audit.getRange("D5:E17").format.columnWidth = 20;
audit.getRange("F5:F17").format.columnWidth = 92;
audit.getRange("G5:H17").format.columnWidth = 58;
audit.getRange("I5:I17").format.columnWidth = 58;
audit.getRange("J5:J17").format.columnWidth = 29;
audit.freezePanes.freezeRows(4);
const auditTable = audit.tables.add("A4:J17", true, "Workbook1DynamicAudit");
auditTable.style = "TableStyleMedium2";

const platform = workbook.worksheets.add("平台录入清单");
titleBlock(platform, { title: "A1:F1", subtitle: "A2:F2" }, "可复制到动态示例平台的13条 Query + 决策分析", "只复制 A/B 两列的正文。C-F 用于录入前检查：其中第3条为当前Prompt与原表能力口径冲突，第7/13条必须保留安全状态判断。动态示例本身只写 Query + 执行答案，不填完整 input/output。");
platform.getRange("A4:F4").values = [["序号", "Query", "决策分析（复制此列）", "平台状态", "工具/动作要点", "备注"]];
const platformRows = records.map((r) => {
  const status = r.no === 3 ? "待能力口径确认" : (r.no === 7 || r.no === 13 ? "录入后重点回归" : "可录入");
  const tool = r.no === 1 ? "vehicle_system_settings" : r.no === 2 ? "navi_basic_control" : r.no === 3 ? "vehicle_system_settings（先统一能力口径）" : r.no === 5 ? "media_basic_control + vehicle_basic_control" : r.no === 7 ? "vehicle_basic_control（仅P挡）" : r.no === 10 ? "不调用工具（能力拒答）" : r.no === 13 ? "ambient_light_control；座椅动作受安全条件" : r.no === 11 ? "无上下文不调用；有媒体再media_basic_control" : "vehicle_basic_control";
  const note = r.no === 3 ? "当前Prompt明示支持，原表写不支持；先统一口径" : r.no === 10 ? "能力拒答，不生成“关闭后排新风”FC" : r.no === 7 || r.no === 13 ? "安全边界优先，失败动作不能播报成功" : "";
  return [r.no, r.query, r.decision, status, tool, note];
});
platform.getRange("A5:F17").values = platformRows;
platform.getRange("A4:F4").format = { fill: green, font: { ...bodyFont, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D9EAD3" } };
platform.getRange("A5:F17").format = { font: bodyFont, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
platform.getRange("A5:A17").format.horizontalAlignment = "center";
platform.getRange("A5:F17").format.rowHeight = 112;
platform.getRange("A7:F7").format.fill = red;
platform.getRange("A11:F11").format.fill = amber;
platform.getRange("A17:F17").format.fill = amber;
platform.getRange("A4:F4").format.rowHeight = 32;
platform.getRange("A5:A17").format.columnWidth = 7;
platform.getRange("B5:B17").format.columnWidth = 36;
platform.getRange("C5:C17").format.columnWidth = 104;
platform.getRange("D5:D17").format.columnWidth = 18;
platform.getRange("E5:E17").format.columnWidth = 38;
platform.getRange("F5:F17").format.columnWidth = 35;
platform.freezePanes.freezeRows(4);
const platformTable = platform.tables.add("A4:F17", true, "Workbook1PlatformEntries");
platformTable.style = "TableStyleMedium4";

const test = workbook.worksheets.add("平台测试验收");
titleBlock(test, { title: "A1:F1", subtitle: "A2:F2" }, "平台录入与回归测试步骤", "按顺序验证：动态示例是否进召回前三、Fornax变量是否使用真实前三条 scenario_sample、以及工具/安全边界/最终播报是否一致。每条 Query 单独测试，不能只看模型文字。 ");
test.getRange("A4:F4").values = [["步骤", "平台/位置", "操作", "本表对应内容", "通过标准", "失败时处理"]];
const testRows = [
  [1, "动态示例后台", "录入平台录入清单 A/B 两列；第3条先不提交生产，等能力口径确认。", "13条 Query + 决策分析", "保存成功，Query 与决策分析完整可检索。", "检查是否误把证据/备注粘进决策分析。"],
  [2, "VikingDB 检索测试", "逐条输入原始 Query，查看返回结果；只取排名前3条完整示例。", "13条原始Query", "目标示例进入前三，且没有被相似错误示例顶掉。", "调整Query表达或去重，再重新检索。"],
  [3, "Fornax 变量", "按当前测试表的环境、speaker_position、对话历史、车端状态填写变量；scenario_sample 粘贴 VikingDB 实际前三条。", "原表 N/U/AB-AC 等真实上下文", "变量值与本次案例一致，不能用我推测的状态替代原始状态。", "回到源表核对行号、说话人、档位、车速和历史对话。"],
  [4, "Fornax Query 回归", "逐条输入原始 Query，记录 action_list、内部改写、tool_name、tool_feedback、talk_content。", "13条 Query", "内部 Query、工具名、参数和播报符合平台录入决策分析。", "先判断是召回未命中、SP决策错误、工具错误还是播报错误。"],
  [5, "车窗专项", "用左后 speaker_position 测“车窗调低90%”；用主驾测“关闭玻璃”；分别设置行驶状态和P挡。", "第6、9、13条", "车窗位置不串位；调低90%保留方向语义；行驶中不调主驾座椅。", "检查speaker_position、车速/档位是否真的注入env_info。"],
  [6, "能力/拒答专项", "测试天窗、后排新风和车内电源三类边界。", "第3、5、6、10条", "天窗不生成FC；后排新风不生成独立关闭FC；车内电源按最终统一口径处理。", "更新能力边界或工具映射后再测，不能靠文案掩盖冲突。"],
  [7, "工具反馈专项", "模拟工具成功、失败、部分成功三种返回，检查是否逐项反馈。", "第2、3、12、13条", "工具失败不播报成功；多动作只播报成功动作，失败动作单独说明。", "检查tool_feedback是否完整传入下一轮。"],
  [8, "生产发布前", "只发布通过回归的条目；第3条需产品/研发确认后再决定是否发布。", "平台录入状态 + 测试记录", "Viking前三、Fornax回归、工具FC、实际状态、最终话术全部通过。", "保留失败记录，不直接确认生产提交。"],
];
test.getRange("A5:F12").values = testRows;
test.getRange("A4:F4").format = { fill: blue, font: { ...bodyFont, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
test.getRange("A5:F12").format = { font: bodyFont, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
test.getRange("A5:A12").format.horizontalAlignment = "center";
test.getRange("A5:F12").format.rowHeight = 84;
test.getRange("A4:F4").format.rowHeight = 32;
test.getRange("A5:A12").format.columnWidth = 8;
test.getRange("B5:B12").format.columnWidth = 20;
test.getRange("C5:C12").format.columnWidth = 58;
test.getRange("D5:D12").format.columnWidth = 34;
test.getRange("E5:E12").format.columnWidth = 52;
test.getRange("F5:F12").format.columnWidth = 45;
test.freezePanes.freezeRows(4);
const testTable = test.tables.add("A4:F12", true, "Workbook1PlatformTestSteps");
testTable.style = "TableStyleMedium2";

const evidence = workbook.worksheets.add("口径与证据");
titleBlock(evidence, { title: "A1:D1", subtitle: "A2:D2" }, "本表处理口径与证据边界", "只记录本次分析真正使用的来源和冲突，不把推测写成已确认事实。动态示例适合低频、清晰、单点Query与执行答案；安全规则和可泛化规则仍应同步修订静态Prompt/能力边界。 ");
evidence.getRange("A4:D4").values = [["来源", "关键内容", "对本表的影响", "路径/备注"]];
evidence.getRange("A5:D10").values = [
  ["原始测试表", "Sheet1 共13个独立案例，原始日志分布在1-1927行。", "保留原表；处理结果按原表起始行回溯。", inputPath],
  ["动态示例解bug指南", "动态示例只写Query+执行答案；用于低频且无法抽象的单点Bug。", "平台录入清单只保留Query和决策分析，不复制整段日志。", "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/动态示例解bug指南.html"],
  ["当前System Prompt", "vehicle_basic_control控制车窗、座椅、前后备箱等；vehicle_system_settings明确包含车内电源；navi_basic_control包含导航提醒播报；media_basic_control用于媒体控制。", "工具名按当前Prompt写入；不沿用旧工具名。", "/Users/bytedance/.codex/attachments/ae13df15-583f-4f2d-9feb-066c8c1231bf/pasted-text.txt"],
  ["能力边界", "车窗支持四个位置独立调节；天窗不支持控制；后排空调跟随前排、后排风向不能语音调节；非P挡禁止主驾座椅移动；非P挡禁止关闭车外灯。", "第5-7、9-10、13条必须保留边界和安全条件。", "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/上汽DNA-AI汽车能力边界车辆设备Know how更新（0729）.html"],
  ["明确冲突", "第3条原表写“没有打开车内电源功能”，但实际vehicle_system_settings返回“一键上下电，执行成功”，当前Prompt也明示车内电源控制。", "第3条不能直接发布拒答型动态示例；先由产品/研发统一支持或不支持。", "工作簿1 Sheet1 第255行；当前Prompt工具说明"],
  ["本轮未做的事情", "未修改原始下载表，未写入动态示例生产后台，未提交生产发布。", "交付的是可审核、可复制、可回归的结果工作簿。", "需用户确认后再做平台录入/提交"],
];
evidence.getRange("A4:D4").format = { fill: green, font: { ...bodyFont, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
evidence.getRange("A5:D10").format = { font: bodyFont, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
evidence.getRange("A5:D10").format.rowHeight = 92;
evidence.getRange("A4:D4").format.rowHeight = 32;
evidence.getRange("A5:A10").format.columnWidth = 20;
evidence.getRange("B5:B10").format.columnWidth = 70;
evidence.getRange("C5:C10").format.columnWidth = 55;
evidence.getRange("D5:D10").format.columnWidth = 72;
evidence.freezePanes.freezeRows(4);
const evidenceTable = evidence.tables.add("A4:D10", true, "Workbook1EvidenceAndScope");
evidenceTable.style = "TableStyleMedium4";

const summary = workbook.worksheets.add("处理总览");
titleBlock(summary, { title: "A1:H1", subtitle: "A2:H2" }, "工作簿1动态示例处理总览", "结论：13条都已给出逐条处理方案；10条可直接录入，2条必须把安全条件写进示例并重点回归，1条先统一能力边界再发布。 ");
summary.getRange("A4:B4").values = [["指标", "数量"]];
summary.getRange("A5:A8").values = [["独立案例总数"], ["可直接录入"], ["安全条件重点回归"], ["能力口径待确认"]];
summary.getRange("B5:B8").formulas = [["=COUNTA('动态示例处理'!A5:A17)"], ["=B5-B7-B8"], ["=COUNTIF('动态示例处理'!E5:E17,\"动态示例+安全规则\")"], ["=COUNTIF('动态示例处理'!E5:E17,\"动态示例+口径确认\")"]];
summary.getRange("D4:H4").merge();
summary.getRange("D4").values = [["本次最需要注意的三类问题"]];
summary.getRange("D5:H7").merge(true);
summary.getRange("D5").values = [["1. 车窗：位置由speaker_position确定，\"调低90%\"保留方向语义，不能一律改成\"调到/打开\"。"]];
summary.getRange("D6").values = [["2. 安全：非P挡不关闭后雾灯，不移动主驾座椅；多动作部分成功时不能播报全部完成。"]];
summary.getRange("D7").values = [["3. 能力：天窗、后排新风和车内电源分别按当前能力口径处理；车内电源存在原表与当前Prompt冲突。"]];
summary.getRange("A4:B4").format = { fill: blue, font: { ...bodyFont, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
summary.getRange("A5:B8").format = { font: { ...bodyFont, fontSize: 12 }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#D9E2F3" } };
summary.getRange("D4:H4").format = { fill: green, font: { ...bodyFont, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
summary.getRange("D5:H7").format = { fill: lightBlue, font: bodyFont, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, borders: { preset: "outside", style: "thin", color: "#D9E2F3" } };
summary.getRange("A4:B4").format.rowHeight = 30;
summary.getRange("A5:B8").format.rowHeight = 32;
summary.getRange("D4:H4").format.rowHeight = 30;
summary.getRange("D5:H7").format.rowHeight = 54;
summary.getRange("A5:A8").format.columnWidth = 24;
summary.getRange("B5:B8").format.columnWidth = 14;
summary.getRange("D5:H7").format.columnWidth = 28;
summary.freezePanes.freezeRows(4);

const errorScan = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
const output = await SpreadsheetFile.exportXlsx(workbook);
await fs.mkdir(outputDir, { recursive: true });
await output.save(outputPath);

for (const [sheetName, range, name] of [
  ["处理总览", "A1:H8", "处理总览.png"],
  ["平台录入清单", "A1:F17", "平台录入清单.png"],
  ["动态示例处理", "A1:J10", "动态示例处理.png"],
  ["平台测试验收", "A1:F12", "平台测试验收.png"],
  ["口径与证据", "A1:D10", "口径与证据.png"],
]) {
  const blob = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${name}`, new Uint8Array(await blob.arrayBuffer()));
}

const check = await workbook.inspect({ kind: "table", sheetId: "动态示例处理", range: "A4:J17", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 10, tableMaxCellChars: 180 });
await fs.writeFile(`${outputPath}.inspect.ndjson`, check.ndjson + "\n" + errorScan.ndjson);
console.log(JSON.stringify({ outputPath, cases: records.length, sheets: workbook.worksheets.items.map((s) => s.name), formulaErrors: errorScan.ndjson }));
