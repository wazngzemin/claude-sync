import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/019fc6a1-b054-7f62-9424-21e3390f9d18";
const sourceWorkbookPath = `${outputDir}/bug收集-非3分74条动态示例重写-v3-0729校准.xlsx`;

async function inspectSource() {
  const input = await FileBlob.load(sourceWorkbookPath);
  const workbook = await SpreadsheetFile.importXlsx(input);
  const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 5000 });
  console.log(sheets.ndjson);
  for (const [sheetId, range] of [
    ["修订总览", "A1:H17"],
    ["修订清单", "A1:O12"],
    ["动态示例-决策分析", "A1:B12"],
  ]) {
    const check = await workbook.inspect({
      kind: "table",
      sheetId,
      range,
      maxChars: 12000,
      tableMaxRows: 15,
      tableMaxCols: 18,
      tableMaxCellChars: 500,
    });
    console.log(check.ndjson);
  }
}

if (process.argv.includes("--inspect-source")) {
  await inspectSource();
  process.exit(0);
}

const palette = {
  navy: "#1F4E78",
  blue: "#5B9BD5",
  paleBlue: "#D9E4F5",
  veryPaleBlue: "#EAF2F8",
  green: "#70AD47",
  paleGreen: "#E2F0D9",
  darkGreen: "#375623",
  orange: "#F4B183",
  paleOrange: "#FCE4D6",
  gray: "#E7E6E6",
  paleGray: "#F3F4F6",
  text: "#1F2937",
  white: "#FFFFFF",
  line: "#CBD5E1",
};

const readJson = async (name) => JSON.parse(await fs.readFile(`${outputDir}/${name}`, "utf8"));
const clip = (value, max = 1600) => {
  const text = value == null ? "" : String(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
};
const actionTools = (result) => {
  const actions = result?.output?.action_list ?? [];
  return actions.map((action) => action.tool_name ?? "").filter(Boolean).join(" → ");
};
const outputSummary = (result) => {
  if (!result) return "";
  const output = result.output ?? {};
  const talk = output.talk_content ? `播报：${output.talk_content}` : "播报：无";
  const actions = (output.action_list ?? []).map((action) => {
    const query = action?.params?.query ?? "";
    return `${action.tool_name ?? "未知工具"}（${query}）`;
  });
  return clip(actions.length ? `${talk}\n动作：${actions.join("；")}` : `${talk}\n动作：无`, 1800);
};
const exactRankFromTop3 = (row) => {
  const hit = row?.retrievedTop3?.find((item) => item.query === row.query);
  return Number.isInteger(hit?.rank) ? hit.rank : null;
};
const rankFromScenario = (row) => {
  const lines = String(row?.variables?.scenario_sample ?? row?.scenario_sample ?? "").split("\n");
  const queries = lines.map((line) => line.match(/^用户输入“(.*?)”，需要遵循的处理逻辑/)?.[1]).filter(Boolean);
  const rank = queries.indexOf(row.query);
  return rank >= 0 ? rank : null;
};
const unique = (items) => [...new Set(items.filter((item) => item !== "" && item != null))];

const sourceInput = await FileBlob.load(sourceWorkbookPath);
const sourceWorkbook = await SpreadsheetFile.importXlsx(sourceInput);
const revisionValues = await Promise.resolve(
  sourceWorkbook.worksheets.getItem("修订清单").getRange("A1:O75").values,
);
if (!Array.isArray(revisionValues) || revisionValues.length !== 75) {
  throw new Error(`修订清单读取异常：${revisionValues?.length ?? "unknown"} 行`);
}
const revisionRows = revisionValues.slice(1);

const baselineDoc = await readJson("current-prod-fornax-isolated-final.json");
const postFixRowsDoc = await readJson("post-fix-test-rows.json");
const firstRetestDoc = await readJson("post-fix-fornax-retest.json");
const secondRetestDoc = await readJson("post-fix-residual-fornax-retest.json");
const residualPlanDoc = await readJson("post-fix-residual-plan.json");
const residualSamplesDoc = await readJson("post-fix-residual-samples.json");
const final8Doc = await readJson("post-fix-final8-fornax-final.json");
const final8SamplesDoc = await readJson("post-fix-final8-samples.json");
const supportDoc = await readJson("post-fix-support-example.json");

const baselineByOrder = new Map(baselineDoc.results.map((row) => [Number(row.order), row]));
const firstByOrder = new Map(firstRetestDoc.results.map((row) => [Number(row.order), row]));
const secondByOrder = new Map(secondRetestDoc.results.map((row) => [Number(row.order), row]));
const final8ByOrder = new Map(final8Doc.results.map((row) => [Number(row.order), row]));
const changedOrders = new Set(postFixRowsDoc.rows.map((row) => Number(row.order)));
const secondWaveOrders = new Set(residualPlanDoc.items.map((row) => Number(row.order)));
const thirdWaveOrders = new Set(final8Doc.results.map((row) => Number(row.order)));

const finalByOrder = new Map();
for (const order of changedOrders) {
  let result = firstByOrder.get(order);
  if (secondByOrder.has(order)) result = secondByOrder.get(order);
  if (final8ByOrder.has(order)) result = final8ByOrder.get(order);
  finalByOrder.set(order, result);
}

const revisionByQuery = new Map();
for (const row of revisionRows) {
  const query = String(row[1] ?? "");
  if (query && !revisionByQuery.has(query)) revisionByQuery.set(query, row);
}
const residualByQuery = new Map(residualPlanDoc.items.map((row) => [row.query, row]));

const rankByQuery = new Map();
for (const row of postFixRowsDoc.rows) {
  if (!rankByQuery.has(row.query)) rankByQuery.set(row.query, rankFromScenario(row));
}
for (const row of residualSamplesDoc.rows) {
  rankByQuery.set(row.query, exactRankFromTop3(row));
}
for (const row of final8SamplesDoc.rows) {
  rankByQuery.set(row.query, exactRankFromTop3(row));
}

const changesByQuery = new Map();
for (const row of postFixRowsDoc.rows) {
  if (!changesByQuery.has(row.query)) {
    changesByQuery.set(row.query, {
      query: row.query,
      orders: [],
      sourceRows: [],
      initialDecision: row.expectedDecision,
    });
  }
  const group = changesByQuery.get(row.query);
  group.orders.push(Number(row.order));
  group.sourceRows.push(Number(row.sourceRow));
}

const platformChanges = [...changesByQuery.values()]
  .map((group) => {
    const prepared = revisionByQuery.get(group.query) ?? [];
    const residual = residualByQuery.get(group.query);
    const finalDecision = residual?.decision ?? group.initialDecision;
    const platformState = String(prepared[11] ?? "");
    const platformAction = platformState.includes("新增") ? "新增" : "编辑";
    const platformId = residual?.recordId ?? prepared[12] ?? "";
    const ranks = rankByQuery.get(group.query);
    const finalResults = group.orders.map((order) => finalByOrder.get(order)).filter(Boolean);
    const tools = unique(finalResults.map(actionTools)).join(" / ");
    const wave = Math.max(...group.orders.map((order) => (thirdWaveOrders.has(order) ? 3 : secondWaveOrders.has(order) ? 2 : 1)));
    return {
      ...group,
      sourceRows: unique(group.sourceRows).sort((a, b) => a - b),
      finalDecision,
      platformAction,
      platformId,
      oldDecision: prepared[13] ?? "",
      rankLabel: Number.isInteger(ranks) ? `Top${ranks + 1}` : "Top3已命中",
      tools,
      wave,
    };
  })
  .sort((a, b) => Math.min(...a.orders) - Math.min(...b.orders));

if (platformChanges.length !== 44 || changedOrders.size !== 56 || revisionRows.length !== 74) {
  throw new Error(`数量校验失败：平台变更 ${platformChanges.length}，修改环境 ${changedOrders.size}，明细 ${revisionRows.length}`);
}

const detailRows = revisionRows.map((source, index) => {
  const order = index + 1;
  const baseline = baselineByOrder.get(order);
  const changed = changedOrders.has(order);
  const finalResult = changed ? finalByOrder.get(order) : baseline;
  const query = String(source[1] ?? baseline?.query ?? "");
  const change = changesByQuery.get(query);
  const residual = residualByQuery.get(query);
  const platformState = String(source[11] ?? "");
  const platformAction = changed ? (platformState.includes("新增") ? "新增" : "编辑") : "未修改";
  const decision = changed ? residual?.decision ?? change?.initialDecision ?? "" : "";
  const rank = changed ? rankByQuery.get(query) : null;
  return [
    order,
    source[0] ?? baseline?.sourceRow ?? "",
    query,
    source[2] ?? "",
    source[3] ?? "",
    source[4] ?? "",
    source[5] ?? "",
    source[6] ?? "",
    source[7] ?? "",
    outputSummary(baseline),
    actionTools(baseline),
    changed ? "已修改" : "未修改",
    platformAction,
    decision,
    changed ? (Number.isInteger(rank) ? `Top${rank + 1}` : "Top3已命中") : "",
    outputSummary(finalResult),
    actionTools(finalResult),
    changed ? "通过" : "本轮无需动态示例修复",
  ];
});

const retestRows = postFixRowsDoc.rows
  .slice()
  .sort((a, b) => Number(a.order) - Number(b.order))
  .map((row, index) => {
    const order = Number(row.order);
    const first = firstByOrder.get(order);
    const second = secondByOrder.get(order);
    const finalResult = finalByOrder.get(order);
    const wave = thirdWaveOrders.has(order) ? 3 : secondWaveOrders.has(order) ? 2 : 1;
    const note = order === 31
      ? "原复合Query持续误选状态/说明书工具；新增支持示例（平台ID 1161）进入Top3后改为car_care_qa。"
      : thirdWaveOrders.has(order)
        ? "第二轮仍有残留问题，追加硬约束后通过。"
        : secondWaveOrders.has(order)
          ? "第一轮仍有残留问题，第二轮修正后通过。"
          : "第一轮通过。";
    return [
      index + 1,
      order,
      row.sourceRow,
      row.query,
      outputSummary(first),
      secondWaveOrders.has(order) ? "需继续修正" : "通过",
      second ? outputSummary(second) : "",
      second ? (thirdWaveOrders.has(order) ? "需继续修正" : "通过") : "",
      outputSummary(finalResult),
      actionTools(finalResult),
      wave,
      "通过",
      note,
    ];
  });

const workbook = Workbook.create();
const summary = workbook.worksheets.add("测试总览");
const details = workbook.worksheets.add("74条实测明细");
const changes = workbook.worksheets.add("44条平台变更");
const retest = workbook.worksheets.add("复测结果");
const support = workbook.worksheets.add("支持示例");

const setTitle = (sheet, title, note, lastColumn) => {
  const titleRange = sheet.getRange(`A1:${lastColumn}1`);
  titleRange.merge();
  titleRange.values = [[title]];
  titleRange.format = {
    fill: palette.navy,
    font: { bold: true, color: palette.white, size: 16 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
  };
  titleRange.format.rowHeight = 34;
  const noteRange = sheet.getRange(`A2:${lastColumn}2`);
  noteRange.merge();
  noteRange.values = [[note]];
  noteRange.format = {
    fill: palette.veryPaleBlue,
    font: { color: "#44546A", size: 10 },
    wrapText: true,
    verticalAlignment: "center",
  };
  noteRange.format.rowHeight = 34;
  sheet.showGridLines = false;
};

const styleHeader = (range, fill = palette.blue) => {
  range.format = {
    fill,
    font: { bold: true, color: palette.white },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: palette.line },
  };
  range.format.rowHeight = 32;
};

const setColumnWidths = (sheet, lastRow, widths) => {
  for (const [column, width] of Object.entries(widths)) {
    sheet.getRange(`${column}1:${column}${lastRow}`).format.columnWidth = width;
  }
};

setTitle(
  summary,
  "bug收集｜74条当前 Prod 实测与动态示例修复",
  "测试平台：Fornax 0.0.276；检索环境：VikingDB prod。结果以真实表格环境、真实检索前三条和实际Planner输出为准。",
  "J",
);

const kpis = [
  ["A4:B4", "A5:B6", "实测环境", "=COUNTA('74条实测明细'!$A$5:$A$78)"],
  ["C4:D4", "C5:D6", "已修改环境", "=COUNTIF('74条实测明细'!$L$5:$L$78,\"已修改\")"],
  ["E4:F4", "E5:F6", "表内Query变更", "=COUNTA('44条平台变更'!$A$5:$A$48)"],
  ["G4:H4", "G5:H6", "支持示例", "=COUNTA('支持示例'!$A$5:$A$5)"],
  ["I4:J4", "I5:J6", "最终复测通过", "=COUNTIF('复测结果'!$L$5:$L$60,\"通过\")"],
];
for (const [labelAddress, valueAddress, label, formula] of kpis) {
  const labelRange = summary.getRange(labelAddress);
  labelRange.merge();
  labelRange.values = [[label]];
  labelRange.format = {
    fill: palette.blue,
    font: { bold: true, color: palette.white },
    horizontalAlignment: "center",
    verticalAlignment: "center",
  };
  const valueRange = summary.getRange(valueAddress);
  valueRange.merge();
  valueRange.formulas = [[formula]];
  valueRange.format = {
    fill: palette.paleBlue,
    font: { bold: true, color: palette.navy, size: 20 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: palette.line },
  };
}
summary.getRange("A8:J8").merge();
summary.getRange("A8:J8").values = [["测试口径与最终结论"]];
styleHeader(summary.getRange("A8:J8"), palette.green);
summary.getRange("A9:J11").merge();
summary.getRange("A9:J11").values = [[
  "筛选口径：bug收集.xlsx 中 Query 非空且原评分不是3分，共74条。先用原表L-Z列变量和当时实际环境在Fornax跑当前Prod基线；仅对确认属于动态示例层的问题改平台。最终修改56个环境、44个表内Query，并为复合维养查询补1条支持示例。所有修改项均重新检索真实前三条并回填scenario_sample后复测。",
]];
summary.getRange("A9:J11").format = {
  fill: palette.veryPaleBlue,
  font: { color: palette.text },
  wrapText: true,
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: palette.line },
};
summary.getRange("A9:J11").format.rowHeight = 34;

summary.getRange("A13:D13").values = [["轮次", "测试范围", "进入下一轮", "结果"]];
styleHeader(summary.getRange("A13:D13"));
summary.getRange("A14:D16").values = [
  ["第一轮", 56, 16, "40条直接通过"],
  ["第二轮", 16, 8, "8条通过，8条继续修正"],
  ["第三轮", 8, 0, "8条全部通过"],
];
summary.getRange("A14:D16").format = {
  fill: palette.paleBlue,
  wrapText: true,
  borders: { preset: "all", style: "thin", color: palette.line },
};
summary.getRange("B14:C16").format.numberFormat = "0";

summary.getRange("F13:J13").merge();
summary.getRange("F13:J13").values = [["关键闭环"]];
styleHeader(summary.getRange("F13:J13"), palette.green);
summary.getRange("F14:J18").merge();
summary.getRange("F14:J18").values = [[
  "• 车窗/天窗：按真实车速、speaker和固定天窗能力边界处理。\n• 多动作：避免漏后备箱、氛围灯、媒体音量等子任务。\n• 权限：后排晕车请求不代主驾操作，也不根据status喊姓名。\n• 维养：复合Query中的空调滤芯剩余寿命必须走car_care_qa；补支持示例后真实Top3复测通过。",
]];
summary.getRange("F14:J18").format = {
  fill: palette.paleGreen,
  font: { color: palette.darkGreen },
  wrapText: true,
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: palette.line },
};

summary.getRange("A20:J20").merge();
summary.getRange("A20:J20").values = [["交付说明"]];
styleHeader(summary.getRange("A20:J20"), palette.green);
summary.getRange("A21:J24").merge();
summary.getRange("A21:J24").values = [[
  "74条实测明细保留原评分、CC/CD/CE证据、基线Planner输出、是否修改、最终决策和最终实际输出；44条平台变更按唯一Query列出新增/编辑动作；复测结果保留三轮闭环过程；支持示例单列记录新增原因、平台ID和前后差异。原工作簿未覆盖。",
]];
summary.getRange("A21:J24").format = {
  fill: palette.paleGray,
  wrapText: true,
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: palette.line },
};
setColumnWidths(summary, 24, { A: 12, B: 12, C: 12, D: 12, E: 12, F: 12, G: 12, H: 12, I: 12, J: 12 });
summary.freezePanes.freezeRows(2);

setTitle(
  details,
  "74条实测明细",
  "每条均使用原表变量和实际环境跑当前Prod；‘已修改’行的最终输出取最后一轮有效复测，未修改行保留基线结果。",
  "R",
);
const detailHeaders = [[
  "序号", "来源行", "Query", "speaker/sound_area", "实际环境", "原评分(CB)", "问题分类(CC)", "测试备注(CD)", "标注依据(CE)",
  "基线Planner输出", "基线工具", "本轮处理", "平台动作", "最终决策分析", "最终检索名次", "最终Planner输出", "最终工具", "最终结论",
]];
details.getRange("A4:R4").values = detailHeaders;
styleHeader(details.getRange("A4:R4"));
details.getRange(`A5:R${detailRows.length + 4}`).values = detailRows;
details.getRange(`A5:R${detailRows.length + 4}`).format = {
  font: { color: palette.text, size: 9 },
  wrapText: true,
  verticalAlignment: "top",
  borders: { preset: "inside", style: "thin", color: "#D9E2F3" },
};
details.getRange(`A5:R${detailRows.length + 4}`).format.rowHeight = 72;
details.getRange(`A5:B${detailRows.length + 4}`).format.horizontalAlignment = "center";
details.getRange(`L5:M${detailRows.length + 4}`).format.horizontalAlignment = "center";
details.getRange(`O5:O${detailRows.length + 4}`).format.horizontalAlignment = "center";
details.getRange(`R5:R${detailRows.length + 4}`).format.horizontalAlignment = "center";
details.getRange(`L5:L${detailRows.length + 4}`).conditionalFormats.add("containsText", {
  text: "已修改",
  format: { fill: palette.paleOrange, font: { color: "#9C5700", bold: true } },
});
details.getRange(`R5:R${detailRows.length + 4}`).conditionalFormats.add("containsText", {
  text: "通过",
  format: { fill: palette.paleGreen, font: { color: palette.darkGreen, bold: true } },
});
const detailTable = details.tables.add(`A4:R${detailRows.length + 4}`, true, "Detail74Table");
detailTable.style = "TableStyleMedium2";
detailTable.showFilterButton = true;
setColumnWidths(details, detailRows.length + 4, {
  A: 7, B: 9, C: 34, D: 16, E: 30, F: 22, G: 28, H: 34, I: 24,
  J: 44, K: 26, L: 11, M: 11, N: 48, O: 12, P: 44, Q: 28, R: 20,
});
details.freezePanes.freezeRows(4);
details.freezePanes.freezeColumns(3);

setTitle(
  changes,
  "44条平台变更",
  "仅列本次实际提交的表内唯一Query；支持示例另见‘支持示例’。影响环境数用公式从74条明细回算。",
  "L",
);
changes.getRange("A4:L4").values = [[
  "序号", "Query", "影响环境数", "来源行", "平台动作", "平台记录ID", "修改前平台决策", "最终决策分析", "最终检索名次", "闭环轮次", "最终工具", "最终结论",
]];
styleHeader(changes.getRange("A4:L4"), palette.green);
const changeValues = platformChanges.map((row, index) => [
  index + 1,
  row.query,
  null,
  row.sourceRows.join("、"),
  row.platformAction,
  row.platformId,
  row.oldDecision,
  row.finalDecision,
  row.rankLabel,
  row.wave,
  row.tools,
  "通过",
]);
changes.getRange(`A5:L${changeValues.length + 4}`).values = changeValues;
changes.getRange("C5").formulas = [["=COUNTIF('74条实测明细'!$C$5:$C$78,B5)"]];
changes.getRange(`C5:C${changeValues.length + 4}`).fillDown();
changes.getRange(`A5:L${changeValues.length + 4}`).format = {
  font: { color: palette.text, size: 9 },
  wrapText: true,
  verticalAlignment: "top",
  borders: { preset: "inside", style: "thin", color: "#D9EAD3" },
};
changes.getRange(`A5:L${changeValues.length + 4}`).format.rowHeight = 78;
changes.getRange(`A5:A${changeValues.length + 4}`).format.horizontalAlignment = "center";
changes.getRange(`C5:F${changeValues.length + 4}`).format.horizontalAlignment = "center";
changes.getRange(`I5:J${changeValues.length + 4}`).format.horizontalAlignment = "center";
changes.getRange(`L5:L${changeValues.length + 4}`).format.horizontalAlignment = "center";
changes.getRange(`E5:E${changeValues.length + 4}`).conditionalFormats.add("containsText", {
  text: "新增",
  format: { fill: palette.paleOrange, font: { color: "#9C5700", bold: true } },
});
changes.getRange(`L5:L${changeValues.length + 4}`).conditionalFormats.add("containsText", {
  text: "通过",
  format: { fill: palette.paleGreen, font: { color: palette.darkGreen, bold: true } },
});
const changesTable = changes.tables.add(`A4:L${changeValues.length + 4}`, true, "PlatformChangesTable");
changesTable.style = "TableStyleMedium4";
changesTable.showFilterButton = true;
setColumnWidths(changes, changeValues.length + 4, {
  A: 7, B: 40, C: 12, D: 14, E: 11, F: 14, G: 45, H: 52, I: 13, J: 11, K: 32, L: 12,
});
changes.freezePanes.freezeRows(4);
changes.freezePanes.freezeColumns(2);

setTitle(
  retest,
  "56条修改环境复测结果",
  "第一轮覆盖全部56条；16条进入第二轮；其中8条进入第三轮并最终通过。输出均来自Fornax 0.0.276真实运行。",
  "M",
);
retest.getRange("A4:M4").values = [[
  "序号", "Order", "来源行", "Query", "第一轮输出", "第一轮结论", "第二轮输出", "第二轮结论", "最终输出", "最终工具", "修复轮次", "最终结论", "备注",
]];
styleHeader(retest.getRange("A4:M4"));
retest.getRange(`A5:M${retestRows.length + 4}`).values = retestRows;
retest.getRange(`A5:M${retestRows.length + 4}`).format = {
  font: { color: palette.text, size: 9 },
  wrapText: true,
  verticalAlignment: "top",
  borders: { preset: "inside", style: "thin", color: "#D9E2F3" },
};
retest.getRange(`A5:M${retestRows.length + 4}`).format.rowHeight = 78;
retest.getRange(`A5:C${retestRows.length + 4}`).format.horizontalAlignment = "center";
retest.getRange(`F5:F${retestRows.length + 4}`).format.horizontalAlignment = "center";
retest.getRange(`H5:H${retestRows.length + 4}`).format.horizontalAlignment = "center";
retest.getRange(`K5:L${retestRows.length + 4}`).format.horizontalAlignment = "center";
for (const column of ["F", "H"]) {
  retest.getRange(`${column}5:${column}${retestRows.length + 4}`).conditionalFormats.add("containsText", {
    text: "需继续修正",
    format: { fill: palette.paleOrange, font: { color: "#9C5700", bold: true } },
  });
}
retest.getRange(`L5:L${retestRows.length + 4}`).conditionalFormats.add("containsText", {
  text: "通过",
  format: { fill: palette.paleGreen, font: { color: palette.darkGreen, bold: true } },
});
const retestTable = retest.tables.add(`A4:M${retestRows.length + 4}`, true, "RetestResultsTable");
retestTable.style = "TableStyleMedium2";
retestTable.showFilterButton = true;
setColumnWidths(retest, retestRows.length + 4, {
  A: 7, B: 8, C: 9, D: 38, E: 44, F: 14, G: 44, H: 14, I: 46, J: 30, K: 11, L: 12, M: 42,
});
retest.freezePanes.freezeRows(4);
retest.freezePanes.freezeColumns(4);

setTitle(
  support,
  "新增支持示例｜空调滤芯剩余使用时长",
  "该示例直接来源于表格第992条的第4个子任务；仅在它作为独立检索示例进入Top3后，原复合Query才稳定选择car_care_qa。",
  "H",
);
support.getRange("A4:H4").values = [[
  "平台记录ID", "Query", "决策分析", "Viking向量ID", "在992检索名次", "添加原因", "添加前错误工具", "添加后正确工具",
]];
styleHeader(support.getRange("A4:H4"), palette.green);
support.getRange("A5:H5").values = [[
  supportDoc.platformRecordId,
  supportDoc.query,
  supportDoc.decision,
  supportDoc.vikingId,
  `Top${Number(supportDoc.rankForComposite) + 1}`,
  "复合Query中前三个控制动作会干扰第4个维养查询；独立子示例可强化逐项工具路由。",
  "vehicle_status_search / vehicle_manual_qa",
  "car_care_qa",
]];
support.getRange("A5:H5").format = {
  fill: palette.paleGreen,
  font: { color: palette.text },
  wrapText: true,
  verticalAlignment: "top",
  borders: { preset: "all", style: "thin", color: palette.line },
};
support.getRange("A5:H5").format.rowHeight = 92;
const supportTable = support.tables.add("A4:H5", true, "SupportExampleTable");
supportTable.style = "TableStyleMedium4";

support.getRange("A8:D8").values = [["验证步骤", "场景", "实际结果", "结论"]];
styleHeader(support.getRange("A8:D8"));
support.getRange("A9:D12").values = [
  [1, "单独询问空调滤芯剩余使用时长", "car_care_qa", "基础工具路由正确"],
  [2, "原四项复合Query，仅保留复合示例", "vehicle_status_search / vehicle_manual_qa", "多动作干扰仍存在"],
  [3, "新增支持示例并重新检索", `支持示例进入Top${Number(supportDoc.rankForComposite) + 1}`, "真实Top3已生效"],
  [4, "原四项复合Query再次实跑", "第4条action使用car_care_qa", "通过"],
];
support.getRange("A9:D12").format = {
  wrapText: true,
  verticalAlignment: "top",
  borders: { preset: "all", style: "thin", color: palette.line },
};
support.getRange("A9:D12").format.rowHeight = 44;
support.getRange("A9:A12").format.horizontalAlignment = "center";
support.getRange("D9:D12").conditionalFormats.add("containsText", {
  text: "通过",
  format: { fill: palette.paleGreen, font: { color: palette.darkGreen, bold: true } },
});
const traceTable = support.tables.add("A8:D12", true, "SupportTraceTable");
traceTable.style = "TableStyleMedium2";
setColumnWidths(support, 12, { A: 13, B: 32, C: 54, D: 16, E: 15, F: 46, G: 32, H: 22 });
support.freezePanes.freezeRows(4);

const summaryCheck = await workbook.inspect({
  kind: "table",
  sheetId: "测试总览",
  range: "A1:J24",
  include: "values,formulas",
  tableMaxRows: 26,
  tableMaxCols: 12,
  maxChars: 10000,
});
console.log(summaryCheck.ndjson);
const detailsCheck = await workbook.inspect({
  kind: "table",
  sheetId: "74条实测明细",
  range: "A4:R10",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 18,
  maxChars: 10000,
});
console.log(detailsCheck.ndjson);
const errorCheck = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 5000,
});
console.log(errorCheck.ndjson);

const previewSpecs = [
  ["测试总览", "A1:J24", "report-summary-preview.png"],
  ["74条实测明细", "A1:R14", "report-detail-preview.png"],
  ["44条平台变更", "A1:L14", "report-changes-preview.png"],
  ["复测结果", "A1:M14", "report-retest-preview.png"],
  ["支持示例", "A1:H12", "report-support-preview.png"],
];
for (const [sheetName, range, fileName] of previewSpecs) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/report-build/${fileName}`, new Uint8Array(await preview.arrayBuffer()));
}

await fs.mkdir(outputDir, { recursive: true });
const outputPath = `${outputDir}/bug收集-74条当前prod实测与修复-v4.xlsx`;
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, sheets: 5, detailRows: detailRows.length, changes: platformChanges.length, retests: retestRows.length }));
