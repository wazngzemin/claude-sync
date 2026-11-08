#!/usr/bin/env python3
"""用法: python3 check.py [章节H1关键词 ...]
拉取副本最新全文，按章节统计：孤立节点编号、研发词黑名单、H2 结构、画板数。不传参数=全文。"""
import json,re,sys,subprocess
DOC='CYRndDwjDo7TvRxTshac5QWxnAg'
raw=subprocess.run(['lark-cli','docs','+fetch','--doc',DOC,'--detail','with-ids'],capture_output=True,text=True).stdout
c=json.loads(raw)['data']['document']['content']
BL=['Redis','request_id','RoundID','pre_query','AIDV','Kitex','MCP','Frontier','SSE','HTTP','Handler','VehicleControlAgent','BeforeRequest','AfterResponse','Orin','NPU','token','docx','Virtual Display','RPC','gRPC','QoS','TTL','JSON','SDK','API','OpenAPI','ByteScheduler','gocron','VikingDB','method=','channel_app_id','encrypted_doubao_uid','tts_content','mastagent','set_hvac','Seed-2.0','doubao-1.5','UI-Tars']
WATCH=['接口','服务端','技术方案']
H2_STD=['这张图怎么讲','这一块我要讲清楚的产品规则','评审时我要问清什么','验收口径','原文入口']
ID=r'(?<![A-Za-z0-9])((?:N\d{1,2}-\d{2})|(?:[VRMCDEOIWFKTGLSPAHBU]\d{1,2})|(?:[VRMCDEOIWFKTGLSPAHBU]P\d)|(?:[A-Z]{1,2}Q\d))(?![A-Za-z0-9\-])'
parts=re.split(r'(<h1 id="[^"]+"[^>]*>.*?</h1>)',c)
keys=sys.argv[1:]
tot_orph=tot_bl=0
for i in range(1,len(parts),2):
    title=re.sub('<[^>]+>','',parts[i]); body=parts[i+1]
    if keys and not any(k in title for k in keys): continue
    # strip whiteboards and links
    b=re.sub(r'<whiteboard[^>]*>.*?</whiteboard>','',body,flags=re.S)
    text=re.sub(r'<a [^>]*>.*?</a>','',b,flags=re.S)
    text=re.sub('<[^>]+>','\n',text)
    orph=0; samples=[]
    for m in re.finditer(ID,text):
        after=text[m.end():m.end()+2]
        if after[:1] in '（(': continue
        orph+=1
        if len(samples)<4: samples.append(text[max(0,m.start()-8):m.end()+6].replace('\n',' '))
    bl={k:text.count(k) for k in BL if text.count(k)}
    watch={k:text.count(k) for k in WATCH if text.count(k)}
    h2=[re.sub('<[^>]+>','',x) for x in re.findall(r'<h2[^>]*>(.*?)</h2>',body)]
    h3=len(re.findall(r'<h3',body))
    wb=len(re.findall(r'<whiteboard',body))
    tot_orph+=orph; tot_bl+=sum(bl.values())
    print(f'## {title[:30]} | 孤立编号={orph} 研发词={sum(bl.values())} 画板={wb} H3={h3}')
    if bl: print('   研发词:',bl)
    if watch: print('   需人工检查:',watch)
    print('   H2:',h2, '| 结构标准' if h2 and all(any(s in x for s in H2_STD) for x in h2) else '| 结构未统一')
    if samples: print('   孤立示例:',samples)
print(f'TOTAL 孤立编号={tot_orph} 研发词={tot_bl}')
