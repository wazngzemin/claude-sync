import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "/Users/bytedance/Downloads/bug收集.xlsx";
const input = await FileBlob.load(sourcePath);
const workbook = await SpreadsheetFile.importXlsx(input);

const previews = [
  ["source-query-env.png", "A1:L1"],
  ["source-score-evidence.png", "CB1:CE1"],
];

for (const [fileName, range] of previews) {
  const image = await workbook.render({
    sheetName: "Sheet1",
    range,
    format: "png",
    scale: 1,
    headers: true,
  });
  await fs.writeFile(new URL(`./${fileName}`, import.meta.url), new Uint8Array(await image.arrayBuffer()));
  console.log(`${fileName}|${range}`);
}
