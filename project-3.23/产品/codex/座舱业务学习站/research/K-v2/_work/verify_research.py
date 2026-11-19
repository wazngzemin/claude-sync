import pathlib,json,re
root=pathlib.Path(__file__).resolve().parents[2];d=root/'K-v2';r=[json.loads(x) for x in (d/'_work/records.jsonl').read_text().splitlines()]
f=[e for b in r for e in b.get('facts',[])];ca=[e for b in r for e in b.get('cases',[])];co=[e for b in r for e in b.get('components',[])];cf=[e for b in r for e in b.get('conflicts',[])]
counts={'facts':len(f),'destinations-base':len(re.findall(r'^## KB-\d+', (d/'destinations-base.md').read_text(),re.M)),'sop-items':len(re.findall(r'^### SOP-\d+', (d/'sop-items.md').read_text(),re.M)),'cases':len(ca),'overlap':len(re.findall(r'^## OV-\d+', (d/'overlap.md').read_text(),re.M)),'boundaries':len(re.findall(r'^\| BD-\d+', (d/'overlap.md').read_text(),re.M)),'components':len(co),'conflicts':len(cf)}
errs=[];refs=0
for e in f+ca+co+cf:
 for m in re.finditer(r'((?:\.\./)*[\u4e00-\u9fffA-Za-z0-9_/-]+\.(?:md|txt)):L([\dL,\-]+)', e.get('source','').replace('对照','')):
  path=root/m[1]
  if not path.exists():errs.append(('文件不存在',m[0]));continue
  n=len(path.read_text().splitlines())
  for v in re.findall(r'\d+',m[2]):
   if int(v)<1 or int(v)>n:errs.append(('行号越界',m[0],n))
  refs+=1
raw={b['source'].split(':L')[0] for b in r if b['source'].startswith('chapters/K/raw/')}
assert len(raw)==13,raw
assert not errs,errs
assert all((d/(k+'.md')).exists() for k in ['facts','destinations-base','sop-items','cases','overlap','components'])
for k,total in [('facts',len(f)),('cases',len(ca)),('components',len(co))]:
 path=d/(k+'.md');text=path.read_text();head=f'共 {total} 条'+('事实与证据记录，另附 '+str(len(cf))+' 项资料冲突索引。' if k=='facts' else ('案例与设计/风险场景。' if k=='cases' else '部件或概念候选（未改动全站部件卡片）。'))
 if head not in text:path.write_text(text.replace('\n\n研究日期：','\n\n'+head+'\n\n研究日期：',1))
real=sum('真实' in e['title'].split(']')[0] for e in ca)
report=['# K 第1步研究验证','','- 13个raw原文全部登记；会议文字记录优先，纪要只作线索。','- 指定31个补充文件全覆盖，重复/空文件/部分副本分别登记；另读关联账号OnePage。','- 全部13张工作表只读遍历；8个既有章节已核对。',f'- 来源文件行号检查 {refs} 条，缺文件/越界 {len(errs)}（此自动检查只验证位置存在，内容支持另经研究复核）。','- 个别引用在复核时修正；真实工单与算法样例已分开；未定位的根因不补造。','- 未写章节正文、未修改HTML或component-cards.md、未启动浏览器。','','## 产出计数','']+[f'- {k}: {v}' for k,v in counts.items()]+['',f'案例标签：含“真实”{real}条，其余{len(ca)-real}条为设计、风险、测试设计或原文数据样例；真实项包含历史体验和机制缺陷，不全是已立工单事故。']
(d/'_work/verification.md').write_text('\n'.join(report)+'\n');(d/'_work/final-counts.json').write_text(json.dumps(counts,ensure_ascii=False,indent=2))
print(json.dumps(counts,ensure_ascii=False));print('真实标签',real,'其他',len(ca)-real,'来源文件行号检查',refs,'问题',errs)
print('冲突索引位置',next(i for i,l in enumerate((d/'facts.md').read_text().splitlines(),1) if '## 资料冲突清单（集中索引）'==l))
