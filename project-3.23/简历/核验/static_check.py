from pathlib import Path
from html.parser import HTMLParser
import json,re,openpyxl
root=Path('/Users/bytedance/Desktop/3.23'); out=root/'简历'
h=(out/'简历-王泽民-具身智能产品经理.html').read_text(); audit=(out/'简历-来源对照.md').read_text(); data=json.loads((out/'核验/内容清单.json').read_text())
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.external=[];self.scripts=0;self.tags=[]
 def handle_starttag(self,t,a):
  a=dict(a);self.tags.append(t)
  if 'data-evidence' in a:self.ids.append(a['data-evidence'])
  if t=='script':self.scripts+=1
  for k in ['href','src']:
   if k in a:self.external.append(a[k])
p=Parser();p.feed(h)
missing=[]
for d in data:
 for path,loc in d['sources']:
  if '/' in path and not (root/path).exists():missing.append(path)
assert not missing,missing
assert all('| '+x+' |' in audit for x in p.ids)
assert p.scripts==0 and not p.external
assert '@media print' in h and '@page{size:A4' in h
assert 'padding:24px 16px 32px' in h and 'font-size:10.5pt' in h
assert 'larkoffice' not in h and 'feishu' not in h
names=['徐洋','施佳杰','钱玮','汪帅','张嘉锋','单如水','刘杨','徐燃','赵晓朝']
assert not any(n in h for n in names)
x=root/'产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/【Director】动态示例(for badcases修复）.xlsx'
w=openpyxl.load_workbook(x,read_only=True,data_only=True);s=w.worksheets[0]
rows=[{'row':i,'status':str(r[7]) if r[7] else '未标记'} for i,r in enumerate(s.iter_rows(values_only=True),1) if len(r)>2 and r[2]=='王泽民']
from collections import Counter
count=dict(Counter(r['status'] for r in rows));assert len(rows)==59 and count=={'0723实车复测pass':30,'0723实车复测Fail':7,'未标记':22},count
(out/'核验/数字复核.json').write_text(json.dumps({'file':str(x),'sheet':s.title,'count':len(rows),'status_counts':count,'rows':rows},ensure_ascii=False,indent=2))
result={'source_paths_exist':True,'all_resume_evidence_ids_mapped':True,'mapped_items':len(data),'html_scripts':p.scripts,'external_assets':p.external,'internal_links_in_resume':False,'colleague_names_in_resume':False,'A4_print_css':True,'print_body_pt':10.5,'mobile_side_padding_px':16,'browser_print_page_count':'未验证：浏览器启动被系统权限阻止','mobile_overflow':'未验证','console_errors':'未验证（HTML无脚本或外部资源）'}
(out/'核验/静态检查.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False))
