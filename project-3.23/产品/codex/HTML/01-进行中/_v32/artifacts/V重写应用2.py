from pathlib import Path
import json, re, shutil, datetime
R=Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');P=R/'豆包汽车-业务学习站-v31-工作副本.html';A=R/'_v32/artifacts'
s=P.read_text(encoding='utf-8');orig=s;a=s.index('const DATA=')+len('const DATA=');d,n=json.JSONDecoder().raw_decode(s[a:]);old=json.loads(json.dumps(d))
md=(A/'V连续产品讲义.md').read_text(encoding='utf-8');parts=re.split(r'^## (.+)$',md,flags=re.M)
intro=[x.strip() for x in re.split(r'\n\n',parts[0])[1:] if x.strip()]
src={'v-listen':['VOICE-VOICEPRD','VOICE-AIVA-DISABLE','VOICE-DISABLE'],'v-hotwords':['VOICE-HOTWORD-OPT','VOICE-STREETWORD','VOICE-ONEPAGE','VOICE-VOICEPRD'],'v-text':['VOICE-ONEPAGE','VOICE-VOICEPRD','VOICE-LINK-MAP'],'v-interrupt':['VOICE-ONEPAGE','VOICE-INTERRUPT'],'v-pause':['VOICE-ONEPAGE','V-VERIFIED-VAD','VOICE-LINK-MAP'],'v-prequery':['VOICE-ONEPAGE','V-VERIFIED-PREQUERY'],'v-final':['VOICE-ONEPAGE','VOICE-VOICEPRD'],'v-version':['V-VERIFIED-VAD','V-VERIFIED-PREQUERY','VOICE-ONEPAGE'],'v-accept':['USER-CASE-VOICE','VOICE-V15-LECTURE','V-VERIFIED-ONEPAGE']}
new=[{'id':'VOICE-HOTWORD-OPT','title':'ASR 热词优化需求（分类上限与增强范围）','url':'https://bytedance.larkoffice.com/wiki/RiGMw5RQmiMk9lkdiuJcfgqWneh'},{'id':'VOICE-LINK-MAP','title':'豆包汽车语音链路详解 × 语音产品经理工作地图','url':'https://bytedance.larkoffice.com/docx/T9RAd5dcUoSBY3xbr5tcFvxonJg'},
{'id':'VOICE-STREETWORD','title':'导航地址街道信息纳入 ASR 个人热词需求','url':'https://bytedance.larkoffice.com/docx/Oh5md4iUmoeYNgxpw1RcfySLndb'}]
for x in new:
    if not any(y['id']==x['id'] for y in d['sources']):d['sources'].append(x)
lessons=[]
for i in range(1,len(parts),2):
    ident,title=parts[i].split('|',1);ps=[x.strip() for x in re.split(r'\n\n',parts[i+1]) if x.strip()]
    lessons.append({'id':ident,'title':title,'paragraphs':ps,'sourceIds':src[ident]})
v=next(x for x in d['pages'] if x['id']=='V')
guide={'title':'读图顺序：先看两条轨怎样并跑，再看汇合点','paragraphs':[
'先读 V13→V1→V14→V15。这一段回答三个问题：这一轮能不能听、声音清不清楚、话来自哪一座。图上画成串行，是为了说明各自职责；实际运行时声学处理和识别可以重叠，不必互相等待。',
'V16 挂在识别支路旁边，从云端拿本轮有效热词，交给 V2 选字。注入发生在这个节点之前，不等用户停顿，也不等预请求。V17 决定这轮采用在线还是离线文字、要不要逐字上屏；它只决定显示哪份字，不授予执行权。',
'V4 与 V2 共用同一段音频。V2 出 partial，V4 计停顿。V5 到 300 毫秒只负责触发 V6，V3 把当时的文字交给 V6；条件齐了才发得出，发了也不算办完。',
'V7 在 600 毫秒让本段音频收尾，交给 V8 出 final。V9 把 final 和 V6 留下的一份准备对齐：request_id 相同、文字完全一致、模块支持，三条都满足才复用；任何一条不满足，走 V11 按最终文字重算，再到 V12 汇合。',
'V10 是语义判停，判断声音停了意思是否说全；它的完整性定义和门控顺序还没有定稿。V18 处理识别失败，无音频、空结果、超时分开计数，不能拿过程文字顶上。V12 交出去的是文字、音区和编号，地址和动作都在后面。'],
'nodeIds':['V13','V1','V14','V15','V16','V17','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12','V18'],
'sourceIds':['VOICE-ONEPAGE','V-VERIFIED-ONEPAGE','V-VERIFIED-VAD','V-VERIFIED-PREQUERY']}
nodes=[x['id'] for x in next(m for m in d['base']['modules'] if m['id']=='V')['nodes']]
exp={}
for nid in nodes:
    hit=[p for l in lessons for p in l['paragraphs'] if re.search(r'(?<![A-Za-z0-9])'+nid+r'(?![0-9])',p)]
    if not hit:
        hit=[p for l in lessons if l['id'] in ('v-listen','v-text') for p in l['paragraphs']][:2]
    exp[nid]={'paragraphs':hit[:4],'sourceIds':['VOICE-ONEPAGE','VOICE-VOICEPRD','V-VERIFIED-VAD']}
assert set(src)=={l['id'] for l in lessons}
v['teaching']={'intro':intro,'lessons':lessons,'guides':{'base':guide},'closing':[],'sourceIds':list(dict.fromkeys(x for l in lessons for x in l['sourceIds']))}
v['sections']=[{'id':l['id'],'title':l['title'],'paragraphs':l['paragraphs'],'sourceIds':l['sourceIds'],'teachingTarget':l['id']} for l in lessons]
v['nodeExplanations']=exp;v['sourceIds']=v['teaching']['sourceIds'];v['articleReading']=True
v['evidenceGaps']=['Hard VAD 生效值：OnePager 写 600，待评审的 VAD PRD 写 500，需向算法确认。','语义完整性定义、门控顺序、最长等待时间尚未定稿。','Context 在预请求中的来源范围与失效规则、预请求在途等待策略未统一。','热词冷热处理权重与淘汰算法所在文档无权限。']
v['converted']=False;v['mainline']=[];v['concepts']=[];v.pop('feynman',None);v.pop('bridge',None)
al={'V-L1':'v-listen','V-L2':'v-hotwords','V-L3':'v-pause','V-L4':'v-final','concepts':'v-hotwords','raw-notes':'v-listen','teach-back':'v-accept','learn-v-situation':'v-listen','V-detail-1':'v-listen'}
v['legacyChapterTargets']={**v.get('legacyChapterTargets',{}),**al}
assert s.count(" if(page.articleReading)return renderArticleModule(page,module);")==1
d2=json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('</script','<\\/script')
s2=s[:a]+d2+s[a+n:]
assert old['base']==d['base'] and old['originalSvg']==d['originalSvg'] and old['diagrams']==d['diagrams'] and old['overviewSvg']==d['overviewSvg']
assert all(x==next(y for y in old['pages'] if y['id']==x['id']) for x in d['pages'] if x['id']!='V')
assert P.read_text(encoding='utf-8')==orig
bk=R/'_backup'/('学习站-V去废话前-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.html');shutil.copy2(P,bk);P.write_text(s2,encoding='utf-8')
rep={'lessons':len(lessons),'paras':sum(len(l['paragraphs']) for l in lessons),'chars':sum(len(p) for l in lessons for p in l['paragraphs']),'backup':str(bk),'otherPagesUnchanged':True,'svgUnchanged':True}
(A/'V写入记录-去废话版.json').write_text(json.dumps(rep,ensure_ascii=False,indent=2));print(json.dumps(rep,ensure_ascii=False))
