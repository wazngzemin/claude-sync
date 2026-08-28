import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "outputs/01a00ece-74d6-7bc0-8908-98580aa0941b/【Director】动态示例-郝晓伟今日反馈-Jira核对修正版-20260817.xlsx";
const outputDir = "outputs/01a00ece-74d6-7bc0-8908-98580aa0941b";
const outputPath = `${outputDir}/【Director】动态示例-王泽民G2阀8条修复-20260824.xlsx`;
const previewDir = ".codex_spreadsheet_work/20260824_wang_issue_view/previews-final";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));
const sheet = workbook.worksheets.getItem("动态示例汇总表(SFT）");

sheet.getRange("B292").values = [["结合speaker_position、当前车型能力和智驾运行状态：仅主驾可操作；当前车型支持语音变道且智驾运行中时，调用auto_drive下发“向左变道”一次，若工具返回需要确认，只播报确认问题并等待；当前车型不支持语音变道时，直接说明不支持，不要错误回复“请按Pilot键激活辅助驾驶”。"]];
sheet.getRange("D292").values = [["PQCP-34049 / Meego 7366632009；修正旧规则：变道需先按企业×车型×环境做能力隔离"]];

sheet.getRange("B139").values = [["车外灯仅主驾可控制；主驾说“打开示廓灯”时，调用vehicle_basic_control下发“打开示廓灯”，按工具返回如实反馈。不要参考历史状态直接回复已打开，也不要只说话不调工具。"]];
sheet.getRange("D139").values = [["DNA-4437 / Meego 7365391969；补强车控工具调用与失败反馈"]];
sheet.getRange("B140").values = [["车外灯仅主驾可控制；主驾且车辆处于P挡时，调用vehicle_basic_control下发“关闭示廓灯”，按工具返回如实反馈；非P挡或非主驾时不执行。不要参考历史状态直接回复已关闭，也不要只说话不调工具。"]];
sheet.getRange("D140").values = [["DNA-4437 / Meego 7365391969；补齐空规则并加入车外灯安全边界"]];

for (let row = 532; row <= 539; row += 1) {
  sheet.getRange(`A${row}:I${row}`).copyFrom(sheet.getRange("A531:I531"), "all");
}

sheet.getRange("A532:I539").values = [
  [
    "ICA已经激活了，向左变道",
    "对当前8295+PPD车型，语音变道不支持。用户说“向左变道”时，直接说明“当前车型暂不支持语音变道”，不调用auto_drive；不要因为ICA已激活就要求二次确认，也不要错误回复“请按Pilot键激活辅助驾驶”。",
    "王泽民",
    "PQCP-34049；预期为当前PPD版本不支持语音变道；评论显示同一时段出现“未激活”与“需二次确认”两类TTS，疑似历史/多轮结果干扰",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7366632009",
    "20260817102218603DA7C4B3FD814C20BC",
    null,
    null,
  ],
  [
    "后排座椅折叠我能手动调吗？",
    "用户问“后排座椅折叠能不能手动调”时，是问当前车型的配置和操作方式，按以下内容处理：1.保留“是否能手动调”的语义，调用vehicle_manual_qa查询；2.按当前车型车书返回回答，高配车型只能电动调节，没有手动拉带；3.禁止不查车书凭记忆回答，也不要把低配车型的手动拉带能力套到高配车型。",
    "王泽民",
    "PQCP-34371；评论确认Planner未调用车书工具；错误把低配手动拉带能力套到高配电动座椅",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7366606650",
    null,
    null,
    null,
  ],
  [
    "后排座椅中间能安装儿童座椅吗？",
    "用户问“后排中间能不能安装儿童座椅”时，是问当前车型的儿童约束系统适用性，按以下内容处理：1.调用vehicle_manual_qa查询当前车型车书；2.按车书返回回答，后排中间位置不能安装通用类儿童座椅；3.禁止不查车书凭通用经验回答，用户继续追问时也不要脱离车书结论反向改口。",
    "王泽民",
    "PQCP-34609；评论确认未走车书；原回答与当前车型汽车大师文档相反",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7366601339",
    null,
    null,
    null,
  ],
  [
    "空调双指滑动怎么用？",
    "用户问“空调双指滑动怎么用”时，是问当前车型是否支持该操作，调用vehicle_manual_qa查询车书并按返回回答；当前车型不支持双指滑动调节空调温度或风量时，直接说明没有该功能。禁止不查车书凭记忆编造“除R挡360界面外都可以双指调节”等操作方法。",
    "王泽民",
    "PQCP-34610；评论确认Planner未调用车书工具；错误生成了当前车型不存在的双指空调功能",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7366578852",
    null,
    null,
    null,
  ],
  [
    "ACC巡航时距大一点",
    "改写为“跟车时距调远一档”。结合speaker_position：仅主驾可操作；本轮每次都调用auto_drive，不参考历史上曾到过5档或上一轮工具结果直接回复已经最大。按本轮工具返回反馈成功、已到边界或失败。",
    "王泽民",
    "IS4PREIL-4094；11:38曾为最大时距，用户手动调小后11:39语音未再下发FC，说明历史状态错误压住本轮调用",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7366617808",
    "2026082111392564A3B8DE7F424AC1A413",
    null,
    null,
  ],
  [
    "打开哨兵模式",
    "“打开哨兵模式”是明确的车控指令，调用vehicle_basic_control下发“打开哨兵模式”，按工具返回如实反馈；不要参考历史状态直接回复已经开启，也不要只说话不调工具。",
    "王泽民",
    "DNA-2452；Jira原因分析为语音控制链路未正确下发FC，评论明确该次未调用车控工具；SFT方案处理",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7365505585",
    "202606281611239911374E2385C9E21F91",
    null,
    null,
  ],
  [
    "打开示廓灯；关闭示廓灯",
    "车外灯仅主驾可控制：打开示廓灯时，调用vehicle_basic_control下发“打开示廓灯”；关闭示廓灯时，仅主驾且车辆处于P挡才调用vehicle_basic_control下发“关闭示廓灯”，其他情况不执行。按工具返回如实反馈，不要参考历史状态直接回复已完成，也不要只说话不调工具。",
    "王泽民",
    "DNA-4437；当前Logid对应未调用车控工具；历史评论另有工具下发成功但HMI未变化，动态示例只修Planner调用与真实反馈，下游仍需修复",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7365391969",
    "20260818110224D71614F37E856E108411",
    null,
    null,
  ],
  [
    "打开发动机维修模式",
    "“打开发动机维修模式”是明确的车控指令，调用vehicle_basic_control下发“打开发动机维修模式”，按工具返回如实反馈；不要因为历史上执行失败或曾提示不支持就跳过本轮工具调用，也不要在工具未成功前回复已打开。",
    "王泽民",
    "DNA-4379；评论明确action_list为空；现有集成记录对实车/FC支持存在历史冲突，需保留端点验收，不能仅靠动态示例宣称闭环",
    "2026.08.24新增（Meego+Jira核对）",
    "https://meego.larkoffice.com/telematics/issue/detail/7364650262",
    null,
    null,
    null,
  ],
];

sheet.getRange("A532:I539").format.wrapText = true;
sheet.getRange("A532:I539").format.autofitRows();

const keyRanges = ["A136:E142", "A288:E295", "A528:I539"];
for (const range of keyRanges) {
  const check = await workbook.inspect({
    kind: "table",
    range: `'动态示例汇总表(SFT）'!${range}`,
    include: "values,formulas",
    tableMaxRows: 20,
    tableMaxCols: 10,
    maxChars: 24000,
  });
  console.log(JSON.stringify({ range, ndjson: check.ndjson }));
}

for (const id of ["7366632009", "7366606650", "7366601339", "7366578852", "7366617808", "7365505585", "7365391969", "7364650262"]) {
  const check = await workbook.inspect({
    kind: "match",
    searchTerm: id,
    options: { useRegex: false, maxResults: 20 },
    maxChars: 5000,
    summary: `${id} source link`,
  });
  console.log(JSON.stringify({ id, ndjson: check.ndjson }));
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
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 0.55, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName.replaceAll("/", "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
}
for (const range of keyRanges) {
  const preview = await workbook.render({ sheetName: "动态示例汇总表(SFT）", range, scale: 1.25, format: "png" });
  await fs.writeFile(`${previewDir}/${range.replace(":", "-")}.png`, new Uint8Array(await preview.arrayBuffer()));
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath }));
