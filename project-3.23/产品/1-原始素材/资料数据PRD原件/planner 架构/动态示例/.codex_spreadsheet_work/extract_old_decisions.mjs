import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const input = await FileBlob.load("/Users/bytedance/Downloads/未命名多维表格.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);
const values = sheet.getUsedRange().values;
const headers = values[0];
const col = (name) => headers.indexOf(name);
const wanted = ["query", "修复手段分类的备注", "Planner的铺垫话术", "Planner的总结话术", "Planner所有工具调用信息", "context构造思路 或 工具返回构造思路", "预期结果", "决策分析"];
for (let r = 1; r < values.length; r++) {
  if (values[r][col("修复手段")] === "动态示例") {
    const out = { row: r + 1 };
    for (const name of wanted) out[name] = values[r][col(name)];
    console.log(JSON.stringify(out, (_, v) => typeof v === "string" ? v.slice(0, 4500) : v));
  }
}
