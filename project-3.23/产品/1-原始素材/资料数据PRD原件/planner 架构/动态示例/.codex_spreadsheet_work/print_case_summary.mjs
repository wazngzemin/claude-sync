import fs from "node:fs/promises";
const cases = JSON.parse(await fs.readFile("/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/.codex_spreadsheet_work/case_blocks.json","utf8"));
function col(n){let s="";n++;while(n){let r=(n-1)%26;s=String.fromCharCode(65+r)+s;n=Math.floor((n-1)/26);}return s;}
for(const item of cases){
 console.log(`\n===== CASE ${item.case} | rows ${item.startRow}-${item.endRow} | ${item.query} | ${item.issue} =====`);
 for(const idx of [0,1,5,6,13,14,15,16,17,19,20,21,22,23,24,29,30,31,32,33]){
  const cells=item.byCol[col(idx)];
  if(cells?.length) console.log(`${col(idx)}: ${cells.map(x=>`[${x.row}] ${x.text.replaceAll("\n"," ").slice(0,900)}`).join(" || ")}`);
 }
}
