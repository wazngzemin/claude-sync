import json,pathlib
patches={
'下面讲输入管理首期方案：':'输入管理首期方案接入以下几类信息。',
'决定怎样回答：':'决定怎样回答。',
'失败也要给出足够具体的结果：':'失败也要给出具体结果。',
'最终采用的目标与结果：':'最终采用的目标与结果，包括',
'两条分支都围绕同一个变化：':'两条分支都按同一项调整推进，',
'另一些历史项目采用回复提取方案：':'另一些历史项目采用回复提取方案。',
'这次请求以用户实际获得的结果结束：':'这次请求在用户获得实际结果后结束。',
'这条路径有一个时序缺口：':'',
'两种形式一起送往 ep7：':'两种形式一起送往 ep7。',
'先把用户那次操作放进时间线：':'先按时间还原用户那次操作，确认',
'lg2 将它变为可观察事实：':'lg2 再确定需要记录的事实，包括',
'用户真正要保留的是':'用户需要的是',
'人格稳定、情绪共情等高阶维度属于后续能力建设，不能替代基础任务的正确性。':'人格稳定、情绪共情等高阶维度仍在后续方案中，基础任务是否正确另行评测。'
}
changes=[]
def walk(x,file,path=[]):
 if isinstance(x,dict):return {k:walk(v,file,path+[k]) for k,v in x.items()}
 if isinstance(x,list):return [walk(v,file,path+[i]) for i,v in enumerate(x)]
 if isinstance(x,str):
  y=x
  for a,b in patches.items():y=y.replace(a,b)
  if x!=y:changes.append({'file':str(file),'path':path,'before':x,'after':y})
  return y
 return x
for p in pathlib.Path('content').glob('lecture-*-20261029.json'):
 x=json.loads(p.read_text());y=walk(x,p)
 if x!=y:p.write_text(json.dumps(y,ensure_ascii=False,indent=2)+'\n')
pathlib.Path('research/lecture-rewrite-20261029/prose-polish-applied.json').write_text(json.dumps({'applied':changes},ensure_ascii=False,indent=2))
print('Prose edits',len(changes))
