import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/019fc6a1-b054-7f62-9424-21e3390f9d18";
const outputPath = outputDir + "/工作簿1-全部114条动态示例.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
for (const [sheetName, range, fileName] of [
  ["动态示例-决策分析", "A50:B62", "全部114条动态示例-middle-preview.png"],
  ["动态示例-决策分析", "A106:B118", "全部114条动态示例-bottom-preview.png"],
  ["动态示例-复核", "A107:H118", "全部114条动态示例-复核-bottom-preview.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(outputDir + "/" + fileName, new Uint8Array(await preview.arrayBuffer()));
}
console.log("rendered");
