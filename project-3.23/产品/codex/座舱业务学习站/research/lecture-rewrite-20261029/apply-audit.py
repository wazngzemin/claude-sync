import json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[2]
report=pathlib.Path(sys.argv[1]); report=report if report.is_absolute() else root/report
audit=json.loads(report.read_text()); opened={}; applied=[]
for f in audit['findings']:
 path=root/f['file'];data=opened.setdefault(path,json.loads(path.read_text()))
 if f['path'][0] in data:obj=data
 elif f.get('pageId'):obj=next(x for x in data['pages'] if x['id']==f['pageId'])
 elif f.get('toolId'):obj=next(x for x in data['tools'] if x['id']==f['toolId'])
 elif f.get('walkthroughId'):obj=next(x for x in data['walkthroughs'] if x['id']==f['walkthroughId'])
 else:obj=data
 for k in f['path'][:-1]:obj=obj[k]
 k=f['path'][-1];old=obj[k]
 assert type(old)==type(f['replaceWith']),f
 obj[k]=f['replaceWith']
 applied.append({'file':f['file'],'object':f.get('pageId',f.get('toolId',f.get('walkthroughId'))),'path':f['path'],'severity':f['severity'],'before':old,'after':f['replaceWith']})
for path,data in opened.items():path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
report.with_name(report.stem+'-applied.json').write_text(json.dumps({'applied':applied},ensure_ascii=False,indent=2))
print(json.dumps({'applied':len(applied),'files':[str(p.relative_to(root)) for p in opened]},ensure_ascii=False))
