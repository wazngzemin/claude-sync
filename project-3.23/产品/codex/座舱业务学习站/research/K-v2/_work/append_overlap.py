import json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1];batch=json.loads(Path(sys.argv[1]).read_text());records=root/'_work/overlap-records.jsonl'
with records.open('a') as f:f.write(json.dumps(batch,ensure_ascii=False)+'\n')
allrows=[(r,x) for r in map(json.loads,records.read_text().splitlines()) for x in r['items']]
out=['# K 章与既有章节的分工研究','','逐章核对已写正文。每一条列出已讲点、所在章/编号段及原文件行号，并说明 K 应深入的层；回指代表保留连续关系，不照搬前章长例。来源路径相对于座舱业务学习站/research/。下列版本的数字或现状可能与 K 新材料不同，遇到冲突回原文核对，不以已写正文代替新证据。','',f'已登记 {len(allrows)} 条。','']
for i,(r,x) in enumerate(allrows,1):out.extend([f'## OV-{i:03d} {r["chapter"]}｜{x[0]}',f'- 已经讲过：{x[1]}',f'- K 应讲深/回指边界：{x[2]}',f'- 位置：{r["source"]}:L{x[3]}',''])
(root/'overlap.md').write_text('\n'.join(out)+'\n');print('overlap append',batch['chapter'],len(batch['items']))
