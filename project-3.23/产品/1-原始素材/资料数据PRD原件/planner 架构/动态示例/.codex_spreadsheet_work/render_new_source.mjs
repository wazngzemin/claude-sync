import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load("/Users/bytedance/Downloads/yx-files/工作簿1.xlsx"));
for (const [range,name] of [["A1:AH20","new-source-top.png"],["A1320:AH1345","new-source-window.png"],["A1705:AH1730","new-source-tailgate.png"]]) {
  const blob = await wb.render({sheetName:"Sheet1",range,scale:1,format:"png"});
  await fs.writeFile(`/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/.codex_spreadsheet_work/${name}`,new Uint8Array(await blob.arrayBuffer()));
}
