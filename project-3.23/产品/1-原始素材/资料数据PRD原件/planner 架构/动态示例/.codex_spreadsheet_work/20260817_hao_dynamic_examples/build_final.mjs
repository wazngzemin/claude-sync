import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "【Director】动态示例(for badcases修复）.xlsx";
const outputDir = "outputs/01a00ece-74d6-7bc0-8908-98580aa0941b";
const outputPath = `${outputDir}/【Director】动态示例-郝晓伟今日反馈修复-20260817.xlsx`;
const previewDir = ".codex_spreadsheet_work/20260817_hao_dynamic_examples/previews-after";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));
const sheet = workbook.worksheets.getItem("动态示例汇总表(SFT）");

const heatDecision = "用户只表达热时，不要固定改成制冷。先结合当前月份/季节及<车端状态信息>中的空调开关、温度、风量、座椅加热状态判断：冬季优先排查空调温度过高或座椅加热档位过高，优先调低温度、降低或关闭座椅加热，不要随意切换成制冷模式；夏季再根据当前空调状态优先调低温度或加大风量。关键状态未上报/为空/异常时，先调用vehicle_status_search查询，再调用vehicle_basic_control执行。若使用最低温度、最大风量等短时强操作，再用goal_list_update创建几分钟后回调至舒适温度的目标。";

sheet.getRange("B383").values = [[heatDecision]];
sheet.getRange("B384").values = [[heatDecision]];
sheet.getRange("B402").values = [[heatDecision]];

for (let row = 522; row <= 527; row += 1) {
  sheet.getRange(`A${row}:I${row}`).copyFrom(sheet.getRange("A521:I521"), "all");
}

sheet.getRange("A522:I527").values = [
  [
    "看一下我手里拿的什么？",
    "这是车内视觉问答，必须先调用visual_qa识别用户手里的物品；只根据tool_feedback回答，不得凭空猜测。若工具未看清、无结果或置信不足，明确说明没看清，并引导用户把物品移到摄像头可见范围后重试。",
    "王泽民",
    "郝晓伟 2026.08.17反馈；PQCP-32735",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
  [
    "车里太暗了，想透点光",
    "用户表达想透光时，语义必须改写为“打开遮阳帘”，调用vehicle_basic_control执行；不得把“透光”反向理解为关闭遮阳帘。",
    "王泽民",
    "郝晓伟 2026.08.17反馈",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
  [
    "太阳太晒了，帮我遮一下",
    "用户表达想遮光时，语义必须改写为“关闭遮阳帘”，调用vehicle_basic_control执行；不得把“遮光”反向理解为打开遮阳帘。",
    "王泽民",
    "郝晓伟 2026.08.17反馈",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
  [
    "帮我查下胎压多少 / 胎压正常吗",
    "优先读取<车端状态信息>中的四轮胎压并按真实状态回答：四轮数值完整时，逐轮或概括播报实际胎压并指出端状态已标记的异常，不得编造数值；未上报、缺失或异常时，调用vehicle_status_search查询胎压，再严格依据tool_feedback回答。",
    "王泽民",
    "郝晓伟 2026.08.17反馈；PQCP-33098",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
  [
    "我有点冷 / 车里好冷",
    "用户只表达冷时，不要固定开启加热。先结合当前月份/季节及<车端状态信息>中的空调开关、温度、风量、座椅加热、方向盘加热状态判断：夏季优先排查空调温度过低或风量过高，优先调高温度或降低风量；座椅加热和方向盘加热谨慎使用，仅在状态与诉求明确匹配时使用。冬季再按实际状态选择升温或加热。关键状态未上报/为空/异常时，先调用vehicle_status_search查询，再调用vehicle_basic_control执行。",
    "王泽民",
    "郝晓伟 2026.08.17反馈",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
  [
    "我有点热 / 车里好热",
    heatDecision,
    "王泽民",
    "郝晓伟 2026.08.17反馈",
    "2026.08.17新增",
    null,
    null,
    null,
    null,
  ],
];

sheet.getRange("A522:I527").format.wrapText = true;
sheet.getRange("A522:I527").format.autofitRows();

const keyRanges = ["A380:E385", "A400:E403", "A518:I527"];
for (const range of keyRanges) {
  const check = await workbook.inspect({
    kind: "table",
    range: `'动态示例汇总表(SFT）'!${range}`,
    include: "values,formulas",
    tableMaxRows: 20,
    tableMaxCols: 10,
    maxChars: 15000,
  });
  console.log(JSON.stringify({ range, ndjson: check.ndjson }));
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
