import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/工作簿1-动态示例处理-20260812/工作簿1-动态示例处理.xlsx";
const outputDir = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/工作簿1-最终修复归属-20260812";
const outputPath = `${outputDir}/工作簿1-最终修复归属.xlsx`;

const rows = [
  {
    no: 1, rawRow: 1, query: "导航时压低音乐", issue: "工具调用Fail", category: "动态示例主修", allowed: "是",
    why: "低频、明确、单点工具映射；该短语只需归一到导航多媒体降音，不依赖一组通用状态分支。",
    dynamic: "改写为“打开导航多媒体降音”，调用vehicle_system_settings；工具返回成功后再简短回复完成。",
    staticFix: "动态示例即可作为最终修复；回归确认不再调用media_basic_control。",
    acceptance: "Query进入召回前三；action_list.tool_name=vehicle_system_settings；改写Query=打开导航多媒体降音。",
    logId: "20260727150628F129A0D6C5441C1D5956",
  },
  {
    no: 2, rawRow: 144, query: "打开安全提醒播报", issue: "工具调用Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "导航播报开关的工具归属是可泛化规则，不是低频单点Bug；应统一导航播报类工具路由。",
    dynamic: "不录入动态示例。静态规则：将“安全提醒播报”归一为“导航提醒播报”，调用navi_basic_control。",
    staticFix: "修静态Prompt/静态示例中的导航播报工具映射；实际调用不能落到vehicle_system_settings。",
    acceptance: "同类导航路况、提醒、电子眼、红绿灯播报均按导航基础控制路由，不只修这一句。",
    logId: "202607271544141EB3C04EE22FB766AE89",
  },
  {
    no: 3, rawRow: 255, query: "打开车内电源", issue: "工具调用Fail", category: "能力边界/产品口径", allowed: "否",
    why: "原表写“没有打开车内电源功能”，但当前Prompt明确vehicle_system_settings支持车内电源，实际工具也返回“一键上下电，执行成功”，属于口径冲突。",
    dynamic: "不录入动态示例。先由产品/研发确认到底支持还是不支持；不能用动态示例掩盖冲突。",
    staticFix: "若支持：统一能力边界、测试预期和播报链路，调用vehicle_system_settings；若不支持：统一为明确拒答且不调用工具。",
    acceptance: "能力文档、测试表、Prompt、工具返回四者一致后再回归；不能同时保留支持和不支持两种结论。",
    logId: "20260727155756A2BE7C255D79B5EAC1A3",
  },
  {
    no: 4, rawRow: 382, query: "帮我打开座椅加热座椅按摩空调26度3挡风", issue: "工具调用Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "多意图拆分、中文数量短语和空调参数解析可以抽象成通用规则；不是单点低频Bug。",
    dynamic: "不录入动态示例。静态规则：将“3挡风”解析为风量3档，不额外推导吹脚模式；按目标拆分座椅加热、按摩、温度、风量。",
    staticFix: "补静态多意图拆分和“挡风/风量/吹脚”语义边界；不要因一个样例新增动态特例。",
    acceptance: "只生成4个目标动作：主驾加热、主驾按摩、温度26度、风量3档；不得生成吹脚模式。",
    logId: "20260727162927AE3786EB5D5C920D6618",
  },
  {
    no: 5, rawRow: 607, query: "打开天窗打开车窗播放音乐", issue: "工具调用Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "这是天窗能力边界、speaker_position定位、当前媒体与搜索播放区分的组合规则，能抽象到一组多意图场景。",
    dynamic: "不录入动态示例。静态规则：天窗不生成FC；车窗按speaker_position定位；“播放音乐”按当前媒体状态区分继续播放或搜索。",
    staticFix: "补静态组合意图示例和天窗不可控规则，不用一条动态Query覆盖所有组合。",
    acceptance: "不生成天窗动作；主驾说话时打开主驾车窗；媒体动作按当前状态选择正确工具。",
    logId: "2026072717260401169BE3C3CF8EFA8AE4",
  },
  {
    no: 6, rawRow: 860, query: "请关闭玻璃关闭天窗玻璃", issue: "工具返回内容改写Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "“玻璃”对应哪个车窗、说话人位置如何补全、天窗如何拒答，都是可泛化的车窗/天窗语义规则。",
    dynamic: "不录入动态示例。静态规则：结合speaker_position将未指明的“玻璃”定位为对应车窗；天窗为实体天窗，不生成工具动作。",
    staticFix: "修车窗位置解析和天窗能力边界；不能把未指明车窗一律扩展为全部车窗。",
    acceptance: "本例只关闭主驾车窗；不生成关闭所有车窗或天窗FC；话术明确天窗不能语音控制。",
    logId: "2026072717360384079F9519513FF84C8B",
  },
  {
    no: 7, rawRow: 1024, query: "我关闭后雾灯关闭后雾灯", issue: "工具返回内容改写Fail", category: "安全规则/端侧执行链路", allowed: "否",
    why: "非P挡禁止关闭车外灯是全局安全规则，必须在每次车外灯控制前校验档位；动态示例不能替代运行时安全闸门。",
    dynamic: "不录入动态示例。静态安全规则：非P挡不下发关闭后雾灯，并告知先停车挂P档；P挡才可调用vehicle_basic_control。重复表达只执行一次。",
    staticFix: "在Planner/车控执行链路增加档位安全拦截和重复FC去重，不能只依赖召回示例。",
    acceptance: "D/R/N挡零关闭后雾灯FC；P挡最多一次；拒绝时不播报“已关闭”。",
    logId: "20260727173723FCEF3F7D91CC68EA9E08",
  },
  {
    no: 8, rawRow: 1181, query: "他的座椅加热也高点吧", issue: "工具返回内容改写Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "“他的”指代上一轮座位、“高点”归一为3档，属于通用上下文指代和档位解析能力。",
    dynamic: "不录入动态示例。静态规则：沿用上一轮确认的二排左位置，将“高点”归一为座椅加热3档。",
    staticFix: "补上下文指代和座椅档位归一的静态示例；不要只修“他的座椅加热”这一句。",
    acceptance: "改写Query明确包含二排左、座椅加热、3档；不得只传“调高档”。",
    logId: "202607271810189BD1E07E8F4088FD7300",
  },
  {
    no: 9, rawRow: 1331, query: "车窗调低90%", issue: "工具返回内容改写Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "四个车窗位置、开度范围和“调低/调到/打开”的动作语义可统一抽象，属于车窗控制通用规则。",
    dynamic: "不录入动态示例。静态规则：结合speaker_position定位左后车窗，保留“调低90%”的方向语义；工具参数表达开度90%、position=左后、action=打开。",
    staticFix: "补车窗动作词和开度参数的统一规则；不要用动态示例单独修90%这个数字。",
    acceptance: "内部Query=左后车窗调低90%；位置不串位；不得把动作词改成无方向的“调到90%”。",
    logId: "20260727155655ADA684C7598128FDBDD9",
  },
  {
    no: 10, rawRow: 1442, query: "关闭后排新风", issue: "工具返回内容改写Fail", category: "能力边界/产品口径", allowed: "否",
    why: "当前能力边界明确后排空调跟随前排、无后排独立风量，后排风向也不能语音调节；这是能力边界，不是模型记忆某条Query。",
    dynamic: "不录入动态示例。应直接拒答“无法单独关闭后排新风”；用户要关闭全车空调时再处理整车空调。",
    staticFix: "在能力边界/静态Prompt中明确后排跟随和后排风向手动调节，禁止生成“关闭后排新风”FC。",
    acceptance: "本例不生成独立后排新风FC；不把后排新风改写成任意已有车控功能。",
    logId: "202607271915285F702558C76F6063D2D8",
  },
  {
    no: 11, rawRow: 1569, query: "暂停", issue: "工具调用Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "裸Query“暂停”是否指媒体，需要结合当前播放状态和历史上下文；这是通用歧义澄清规则。",
    dynamic: "不录入动态示例。无媒体上下文时先问“要暂停音乐、视频还是播客？”；明确当前媒体后才改写为“暂停当前媒体”调用media_basic_control。",
    staticFix: "补“暂停/继续/播放”与媒体状态的澄清规则，避免默认绑定暂停播放。",
    acceptance: "无播放上下文时不调用工具并追问；有明确媒体时才调用media_basic_control。",
    logId: "20260727192604C243857CE4000D13F724",
  },
  {
    no: 12, rawRow: 1712, query: "关闭尾门打开车窗", issue: "工具调用Fail", category: "静态Prompt/静态示例", allowed: "否",
    why: "尾门和车窗的多动作拆分、speaker_position定位、逐项工具反馈属于通用组合意图能力。",
    dynamic: "不录入动态示例。静态规则：关闭尾门、打开对应位置车窗分别生成vehicle_basic_control动作，按各自tool_feedback逐项播报。",
    staticFix: "补多动作拆分和部分成功/失败播报规则；不能用一个动态样例覆盖所有组合。",
    acceptance: "生成关闭尾门和打开主驾车窗两个动作；任一失败单独说明；不得声称尾门必须手动关闭。",
    logId: "20260728142752B35FB00FFD066775F2E8",
  },
  {
    no: 13, rawRow: 1825, query: "主驾调成休息关闭氛围灯", issue: "工具返回内容改写Fail", category: "安全规则/端侧执行链路", allowed: "否",
    why: "行驶中禁止主驾座椅移动是全局安全规则；氛围灯成功、座椅失败时还涉及多动作结果合并，不能靠单条动态示例保证。",
    dynamic: "不录入动态示例。行驶或非P挡时跳过主驾座椅移动，仍可单独关闭氛围灯；只有车速0且P挡才允许座椅动作。",
    staticFix: "在Planner/车控执行链路增加座椅移动安全拦截，并按动作逐项合并工具反馈；不能播报“都调好了”。",
    acceptance: "车速40km/h时不产生主驾座椅移动FC；氛围灯可单独成功；最终话术明确座椅未执行。",
    logId: "202607281445141A66D4ACB17F996A5EDD",
  },
];

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const oldNames = workbook.worksheets.items.map((sheet) => sheet.name);
for (const name of ["动态示例处理", "平台录入清单", "平台测试验收", "口径与证据", "处理总览", "最终归属明细", "动态示例录入", "非动态修复清单"]) {
  if (oldNames.includes(name)) workbook.worksheets.getItem(name).delete();
}

const navy = "#1F4E78";
const blue = "#5B9BD5";
const green = "#70AD47";
const lightBlue = "#EAF2F8";
const amber = "#FFF2CC";
const red = "#FCE4D6";
const font = { typeface: "宋体", fontSize: 10, color: "#1F2937" };

function titleBlock(sheet, titleRange, subtitleRange, title, subtitle) {
  sheet.showGridLines = false;
  sheet.getRange(titleRange).merge();
  sheet.getRange(titleRange.split(":")[0]).values = [[title]];
  sheet.getRange(titleRange).format = { fill: navy, font: { ...font, fontSize: 15, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
  sheet.getRange(subtitleRange).merge();
  sheet.getRange(subtitleRange.split(":")[0]).values = [[subtitle]];
  sheet.getRange(subtitleRange).format = { fill: lightBlue, font: { ...font, color: "#334155" }, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true };
  sheet.getRange(titleRange).format.rowHeight = 32;
  sheet.getRange(subtitleRange).format.rowHeight = 48;
}

const summary = workbook.worksheets.add("处理总览");
titleBlock(summary, "A1:H1", "A2:H2", "工作簿1：最终修复归属重新分类", "结论：13条中只有1条适合动态示例主修；8条应修静态Prompt/静态示例；2条是能力边界/产品口径；2条是安全规则/端侧执行链路。不能把后12条直接发布为动态示例。\n原始数据和原始 Sheet1 保留不变。");
summary.getRange("A4:B4").values = [["最终修复归属", "数量"]];
summary.getRange("A5:A9").values = [["独立案例总数"], ["动态示例主修"], ["静态Prompt/静态示例"], ["能力边界/产品口径"], ["安全规则/端侧执行链路"]];
summary.getRange("B5:B9").formulas = [
  ["=COUNTA('最终归属明细'!A5:A17)"],
  ["=COUNTIF('最终归属明细'!D5:D17,\"动态示例主修\")"],
  ["=COUNTIF('最终归属明细'!D5:D17,\"静态Prompt/静态示例\")"],
  ["=COUNTIF('最终归属明细'!D5:D17,\"能力边界/产品口径\")"],
  ["=COUNTIF('最终归属明细'!D5:D17,\"安全规则/端侧执行链路\")"],
];
summary.getRange("D4:H4").merge();
summary.getRange("D4").values = [["动态示例最终录入范围"]];
summary.getRange("D5:H7").merge(true);
summary.getRange("D5").values = [["允许录入：仅第1条“导航时压低音乐”。"]];
summary.getRange("D6").values = [["不允许录入：第2-13条，分别归入静态规则、能力口径或安全/端侧链路。"]];
summary.getRange("D7").values = [["动态示例的作用是补低频单点工具映射，不替代通用规则、能力边界和运行时安全拦截。"]];
summary.getRange("A4:B4").format = { fill: blue, font: { ...font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
summary.getRange("A5:B9").format = { font: { ...font, fontSize: 12 }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#D9E2F3" } };
summary.getRange("D4:H4").format = { fill: green, font: { ...font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
summary.getRange("D5:H7").format = { fill: lightBlue, font, horizontalAlignment: "left", verticalAlignment: "center", wrapText: true, borders: { preset: "outside", style: "thin", color: "#D9E2F3" } };
summary.getRange("A4:B4").format.rowHeight = 30;
summary.getRange("A5:B9").format.rowHeight = 32;
summary.getRange("D4:H4").format.rowHeight = 30;
summary.getRange("D5:H7").format.rowHeight = 54;
summary.getRange("A5:A9").format.columnWidth = 26;
summary.getRange("B5:B9").format.columnWidth = 14;
summary.getRange("D5:H7").format.columnWidth = 30;
summary.freezePanes.freezeRows(4);

const detail = workbook.worksheets.add("最终归属明细");
titleBlock(detail, "A1:K1", "A2:K2", "13条案例最终修复归属明细", "D列是最终判断；E列明确是否允许进入动态示例平台；F列是平台/静态规则口径。只允许 E=是 的案例进入动态示例平台。红色行需要先做能力或安全处理。");
detail.getRange("A4:K4").values = [["序号", "原表行", "Query", "最终修复归属", "允许动态录入", "判断依据", "动态示例/正确规则", "静态Prompt或研发修改", "验收标准", "原表问题", "log_id"]];
detail.getRange("A5:K17").values = rows.map((r) => [r.no, r.rawRow, r.query, r.category, r.allowed, r.why, r.dynamic, r.staticFix, r.acceptance, r.issue, r.logId]);
detail.getRange("A4:K4").format = { fill: blue, font: { ...font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#D9E2F3" } };
detail.getRange("A5:K17").format = { font, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
detail.getRange("A5:B17").format.horizontalAlignment = "center";
detail.getRange("D5:E17").format.horizontalAlignment = "center";
detail.getRange("A5:K17").format.rowHeight = 118;
detail.getRange("A5:K5").format.fill = amber;
for (const r of [7, 11, 17]) detail.getRange(`A${r}:K${r}`).format.fill = r === 7 ? red : amber;
detail.getRange("A4:K4").format.rowHeight = 34;
detail.getRange("A5:A17").format.columnWidth = 7;
detail.getRange("B5:B17").format.columnWidth = 10;
detail.getRange("C5:C17").format.columnWidth = 36;
detail.getRange("D5:E17").format.columnWidth = 24;
detail.getRange("F5:F17").format.columnWidth = 52;
detail.getRange("G5:G17").format.columnWidth = 80;
detail.getRange("H5:H17").format.columnWidth = 58;
detail.getRange("I5:I17").format.columnWidth = 56;
detail.getRange("J5:J17").format.columnWidth = 20;
detail.getRange("K5:K17").format.columnWidth = 28;
detail.freezePanes.freezeRows(4);
const detailTable = detail.tables.add("A4:K17", true, "Workbook1FinalOwnership");
detailTable.style = "TableStyleMedium2";

const dynamic = workbook.worksheets.add("动态示例录入");
titleBlock(dynamic, "A1:E1", "A2:E2", "允许进入动态示例平台的内容", "严格筛选后只保留1条。平台录入只复制 Query 和决策分析两列；其余案例不要因为有“正确写法”就录入动态示例。");
dynamic.getRange("A4:E4").values = [["序号", "Query", "决策分析（复制此列）", "为什么属于动态示例", "录入后验收"]];
dynamic.getRange("A5:E5").values = [[rows[0].no, rows[0].query, rows[0].dynamic, rows[0].why, rows[0].acceptance]];
dynamic.getRange("A4:E4").format = { fill: green, font: { ...font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
dynamic.getRange("A5:E5").format = { fill: amber, font, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { preset: "outside", style: "thin", color: "#D9E2F3" } };
dynamic.getRange("A5:A5").format.horizontalAlignment = "center";
dynamic.getRange("A4:E4").format.rowHeight = 32;
dynamic.getRange("A5:E5").format.rowHeight = 120;
dynamic.getRange("A5:A5").format.columnWidth = 7;
dynamic.getRange("B5:B5").format.columnWidth = 34;
dynamic.getRange("C5:C5").format.columnWidth = 94;
dynamic.getRange("D5:D5").format.columnWidth = 58;
dynamic.getRange("E5:E5").format.columnWidth = 56;
dynamic.freezePanes.freezeRows(4);
const dynamicTable = dynamic.tables.add("A4:E5", true, "Workbook1DynamicOnly");
dynamicTable.style = "TableStyleMedium4";

const nonDynamic = workbook.worksheets.add("非动态修复清单");
titleBlock(nonDynamic, "A1:F1", "A2:F2", "不应通过动态示例解决的12条", "这些案例保留在表中用于定位修复责任，但平台录入列统一标记为“否”。请按最终修复归属处理，不要把整页复制到动态示例后台。");
nonDynamic.getRange("A4:F4").values = [["序号", "Query", "最终修复归属", "为什么不是动态示例", "正确修复方向", "是否录入"]];
nonDynamic.getRange("A5:F16").values = rows.slice(1).map((r) => [r.no, r.query, r.category, r.why, r.staticFix, r.allowed]);
nonDynamic.getRange("A4:F4").format = { fill: blue, font: { ...font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
nonDynamic.getRange("A5:F16").format = { font, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
nonDynamic.getRange("A5:A16").format.horizontalAlignment = "center";
nonDynamic.getRange("C5:C16").format.horizontalAlignment = "center";
nonDynamic.getRange("F5:F16").format.horizontalAlignment = "center";
nonDynamic.getRange("A5:F16").format.rowHeight = 96;
nonDynamic.getRange("A4:F4").format.rowHeight = 32;
nonDynamic.getRange("A5:A16").format.columnWidth = 7;
nonDynamic.getRange("B5:B16").format.columnWidth = 36;
nonDynamic.getRange("C5:C16").format.columnWidth = 25;
nonDynamic.getRange("D5:D16").format.columnWidth = 58;
nonDynamic.getRange("E5:E16").format.columnWidth = 70;
nonDynamic.getRange("F5:F16").format.columnWidth = 10;
nonDynamic.freezePanes.freezeRows(4);
const nonDynamicTable = nonDynamic.tables.add("A4:F16", true, "Workbook1NonDynamicCases");
nonDynamicTable.style = "TableStyleMedium2";

const test = workbook.worksheets.add("平台测试验收");
titleBlock(test, "A1:F1", "A2:F2", "重新分类后的测试步骤", "先只测试动态示例录入页的第1条；其余12条按归属去静态Prompt、能力边界或研发安全链路验证，不要用“召回前三”作为它们的唯一验收标准。");
test.getRange("A4:F4").values = [["步骤", "对象", "操作", "适用案例", "通过标准", "失败时归属"]];
test.getRange("A5:F11").values = [
  [1, "动态示例后台", "只录入动态示例录入页第1条 Query+决策分析。", "第1条", "保存成功且内容可检索。", "召回或动态示例内容问题"],
  [2, "VikingDB", "输入“导航时压低音乐”，确认目标示例进入前三。", "第1条", "目标示例排名前三，且没有错误工具示例顶掉。", "动态示例Query/去重问题"],
  [3, "Fornax", "scenario_sample粘贴VikingDB实际前三条；按对应环境测试第1条。", "第1条", "tool_name=vehicle_system_settings，改写Query正确。", "召回、SP决策或工具路由"],
  [4, "静态Prompt/静态示例", "验证导航播报、车窗语义、组合拆分、暂停澄清等同类Query。", "第2、4-6、8-9、11-12条", "同类表达都能遵循规则，不只命中某一条原话。", "静态Prompt/静态示例"],
  [5, "能力边界/产品口径", "确认车内电源和后排新风的最终支持口径，并同步表、Prompt、工具预期。", "第3、10条", "四处口径一致后再回归。", "产品/研发能力边界"],
  [6, "安全/端侧链路", "在D/R/N/P挡分别测试后雾灯和主驾座椅动作，检查多动作部分成功播报。", "第7、13条", "非P挡零危险FC；失败动作不播报成功。", "Planner/车控执行链路"],
  [7, "生产发布", "只发布第1条动态示例；其余按最终归属进入对应修复流程。", "全部13条", "动态、静态、能力、安全四类验收分别通过。", "不直接把后12条发布为动态示例"],
];
test.getRange("A4:F4").format = { fill: green, font: { ...font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
test.getRange("A5:F11").format = { font, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
test.getRange("A5:A11").format.horizontalAlignment = "center";
test.getRange("A5:F11").format.rowHeight = 78;
test.getRange("A4:F4").format.rowHeight = 32;
test.getRange("A5:A11").format.columnWidth = 8;
test.getRange("B5:B11").format.columnWidth = 24;
test.getRange("C5:C11").format.columnWidth = 64;
test.getRange("D5:D11").format.columnWidth = 34;
test.getRange("E5:E11").format.columnWidth = 48;
test.getRange("F5:F11").format.columnWidth = 32;
test.freezePanes.freezeRows(4);
const testTable = test.tables.add("A4:F11", true, "Workbook1ReclassifiedTests");
testTable.style = "TableStyleMedium4";

const evidence = workbook.worksheets.add("口径与证据");
titleBlock(evidence, "A1:D1", "A2:D2", "重新分类的判断口径", "动态示例只解决低频、简单、明确、无法抽象的单点Bug；能提炼为通用规则的，归入静态Prompt/静态示例；能力冲突和安全边界不通过动态示例兜底。");
evidence.getRange("A4:D4").values = [["来源", "关键口径", "本次使用方式", "文件路径"]];
evidence.getRange("A5:D8").values = [
  ["动态示例解Bug指南", "动态示例解决低频且无法归类抽象的单点Bug；正文只写Query+执行答案。", "第1条符合；第2-13条均可抽象或属于能力/安全问题。", "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/动态示例解bug指南.html"],
  ["当前System Prompt", "vehicle_basic_control控制车窗、座椅、前后备箱；vehicle_system_settings包含车内电源；navi_basic_control包含导航播报；media_basic_control负责媒体控制。", "用于核对工具名和第3条能力冲突。", "/Users/bytedance/.codex/attachments/ae13df15-583f-4f2d-9feb-066c8c1231bf/pasted-text.txt"],
  ["能力边界", "车窗四位置独立；天窗不支持控制；后排空调跟随前排、后排风向不能语音；非P挡禁止主驾座椅移动和关闭车外灯。", "第3、10归能力；第7、13归安全/端侧，不归动态。", "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/上汽DNA-AI汽车能力边界车辆设备Know how更新（0729）.html"],
  ["原始工作簿", "13个独立案例，原始日志分布在Sheet1第1-1927行。", "所有分类均保留原表起始行和log_id，便于回溯。", "/Users/bytedance/Downloads/yx-files/工作簿1.xlsx"],
];
evidence.getRange("A4:D4").format = { fill: blue, font: { ...font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
evidence.getRange("A5:D8").format = { font, horizontalAlignment: "left", verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } } };
evidence.getRange("A5:D8").format.rowHeight = 92;
evidence.getRange("A4:D4").format.rowHeight = 32;
evidence.getRange("A5:A8").format.columnWidth = 24;
evidence.getRange("B5:B8").format.columnWidth = 68;
evidence.getRange("C5:C8").format.columnWidth = 58;
evidence.getRange("D5:D8").format.columnWidth = 72;
evidence.freezePanes.freezeRows(4);
const evidenceTable = evidence.tables.add("A4:D8", true, "Workbook1ReclassificationEvidence");
evidenceTable.style = "TableStyleMedium2";

await fs.mkdir(outputDir, { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
for (const [sheetName, range, name] of [
  ["处理总览", "A1:H9", "处理总览.png"],
  ["最终归属明细", "A1:K10", "最终归属明细.png"],
  ["动态示例录入", "A1:E5", "动态示例录入.png"],
  ["非动态修复清单", "A1:F16", "非动态修复清单.png"],
  ["平台测试验收", "A1:F11", "平台测试验收.png"],
  ["口径与证据", "A1:D8", "口径与证据.png"],
]) {
  const blob = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${name}`, new Uint8Array(await blob.arrayBuffer()));
}
const scan = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
const check = await workbook.inspect({ kind: "table", sheetId: "处理总览", range: "A4:H9", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 8, tableMaxCellChars: 240 });
await fs.writeFile(`${outputPath}.inspect.ndjson`, check.ndjson + "\n" + scan.ndjson);
console.log(JSON.stringify({ outputPath, sheets: workbook.worksheets.items.map((s) => s.name), errorScan: scan.ndjson }));
