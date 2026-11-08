from pathlib import Path
import json,re,copy,hashlib,sys

ROOT=Path(__file__).parent
HTML=ROOT.parents[2]/'HTML'/'01-进行中'
BASE=HTML/'豆包汽车-业务学习站-v31-工作副本.html'
OUT=HTML/'豆包汽车-业务学习站-v33.html'

def source(id,title,url,file,scope='正文已读取'):
    return dict(id='V33-'+id,title=title,url=url,localFile=file,readScope=scope)

sources=[
source('VOICE','语音基础体验 OnePager','https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc','voice-onepage.md'),
source('VOICEPRD','车内语音 PRD','https://bytedance.larkoffice.com/wiki/UIcgwzzo9iCQ2tkDz44cSjXXnBf','voice-prd.md'),
source('AIDV','豆包与 AIDV 链路','https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl','aidv-onepage.md'),
source('VAD','多级 VAD PRD','https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh','vad-prd.md'),
source('PREQUERY','多级 VAD 技术评审','https://bytedance.larkoffice.com/wiki/PJMUwwRCNiC2A8kjXCjcs4Bun7Y','prequery-design.md'),
source('LOCAL','AIVA 本地对话 PRD','https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg','local-dialog-prd.md'),
source('OFFLINE','离线 LLM 指令解析','https://bytedance.larkoffice.com/wiki/IkRFwEv2biq6igkvlMtcfOiNnjb','offline-fc-prd.md'),
source('VUI','AIVA 交互 PRD','https://bytedance.larkoffice.com/wiki/FBsrwA734iaFzZkrZExcHHBtn3d','aiva-vui-prd.md','全文已取回，阅读入口状态与卡片分流相关段落'),
source('DIRECTOR','Director PRD','https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g','director-prd.md','全文已取回，阅读输入输出、工具与弱网相关段落'),
source('DT-TALK','10 月 22 日 DT 宣讲文字记录','https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb','director-talk.md','逐字稿已读取；端侧 30B DT 见 00:48:43—00:49:27'),
source('MEET0825','8 月 25 日文字记录','https://bytedance.larkoffice.com/docx/W0vBdJ0fFoP4bPxcVk1cEgB8nhc','meeting-0825.md','读取模型讨论 00:53:30—00:53:59；未将整场标为已复核'),
source('H2','H2 工程双周报','https://bytedance.larkoffice.com/wiki/MvTIwiTZGif70SkNdtrcrM0lnsg','h2-engineering-partial-readable.md','部分正文，读取端侧 1.7B 语义优化相关段落'),
source('MODEL-PLAN','端侧模型规划','https://bytedance.larkoffice.com/docx/NDPZdBNZuoq1kqxw391cb0GVnzI','model-plan.md'),
source('PRODUCT','豆包汽车产品 OnePage','https://bytedance.larkoffice.com/docx/XNy1dc03QorjiOxnmC5cZy3fnhc','product-onepage.md','全文已取回，读取 AI Launcher 与 DT 相关段落'),
source('HMI','人机界面增改沟通方案','https://bytedance.larkoffice.com/docx/C4nidhPikoROtPxu6GLcTqIwnwh','hmi-launcher-partial-readable.md','部分正文，读取 AI Launcher 首页、推荐卡与技能入口'),
source('MEMORY','记忆系统 PRD','https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh','memory/context-new-prd.md','全文已取回，读取记忆形态、摘要、开关和身份相关段落'),
source('MEM-ONEPAGE','记忆 OnePage','https://bytedance.larkoffice.com/wiki/KAAMwb7vsiHpd0k7PVPctGfKnHf','memory/memory-onepage.md'),
source('MEM-DESIGN','记忆技术设计','https://bytedance.larkoffice.com/wiki/PdbRw6JTlisStKkRbXGczIWBnof','memory/memory-design.md','读取瞬时、短期、长期与归属相关定义'),
source('EVENT','事件 PRD','https://bytedance.larkoffice.com/wiki/Gt9qwfzlHiIKLgkWKCfcqYsYngg','memory/event-prd.md','读取人人对话与事件字段、用户场景'),
source('EVENT-REPORT','事件上报方案','https://bytedance.larkoffice.com/wiki/EmY6wc9dRi8h1lkOvFGcjUixnah','memory/event-report.md','读取端云分工、conv_001 事件定义'),
source('CONTEXT','Context 运行方案','https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg','memory/context-runtime.md','读取上下文组装与记忆消费段落'),
source('MEET1103','11 月 3 日文字记录','https://bytedance.larkoffice.com/docx/I8evd4smzoW6QmxV5Nac1ZV5nvb','memory/meeting-1103-transcript.md','逐字稿已读取；1.7B、函数扩容、人人对话与瞬时记忆'),
source('MEET1104','11 月 4 日文字记录','https://bytedance.larkoffice.com/docx/Mg0GdCg0EoCMGAxQI1sciXsTnEd','memory/meeting-1104-transcript.md','完整逐字稿；近期输入、摘要、补报、POI 与座椅方案'),
source('MEM-SYNC','豆包记忆和车机记忆打通方案','https://bytedance.larkoffice.com/wiki/Aj7AwwY5hifYvRkWxsxcR9cGnKb','memory-sync-source.md'),
source('POI-SYNC','POI 同步历史方案','https://bytedance.larkoffice.com/wiki/N2uLwZYAgisDSakvYx4ckplTnvh','memory/memory-poi-sync.md'),
]

def parse():
    text=(ROOT/'V-lecture.md').read_text()
    text=text.replace('原始近期事件/输入的设计概念；恢复路径见后文','原始近期事件/输入的设计概念；新输入怎样补齐见后文').replace('存在历史停用与新改造，不另造统一存活时长','旧 PRD 标为当时未使用；新方案在补齐输入，未定义统一存活时长')
    text=text.replace('停止记录、生成记忆，并冻结已有记忆。','停止记录、生成记忆，并冻结已有记忆：保留内容，但暂停召回使用。')
    (ROOT/'V-lecture.md').write_text(text)
    sections=[];intro=[];title='';current=None
    paragraphs=re.split(r'\n\s*\n',text.strip())
    for part in paragraphs:
        if part.startswith('# '): title=part[2:].strip();continue
        if part.startswith('## '):
            m=re.fullmatch(r'## (.+) \{#([\w-]+)\}',part)
            assert m,part
            current=dict(id=m[2],title=m[1],blocks=[],sourceIds=[]);sections.append(current);continue
        if current is None:intro.append(part);continue
        if part.startswith('<!-- sources:'):
            current['sourceIds']=part.removeprefix('<!-- sources:').removesuffix(' -->').split(',');continue
        if part.startswith('<!-- diagram:'):
            current['blocks'].append(dict(type='diagram',key=part.removeprefix('<!-- diagram:').removesuffix(' -->')));continue
        if part=='<!-- original-diagram -->':current['blocks'].append(dict(type='original'));continue
        if part.startswith('|'):
            rows=[[c.strip() for c in row.strip().strip('|').split('|')] for row in part.splitlines()]
            current['blocks'].append(dict(type='table',headers=rows[0],rows=rows[2:]));continue
        assert not part.startswith('<!--'),part
        current['blocks'].append(dict(type='p',text=part))
    known={s['id'] for s in sources}
    for section in sections:
        assert set(section['sourceIds'])<=known,section['sourceIds']
        section['paragraphs']=[b['text'] if b['type']=='p' else '；'.join('：'.join(r) for r in [b['headers']]+b['rows']) for b in section['blocks'] if b['type'] in ('p','table')]
    return title,intro,sections

def build():
    raw=BASE.read_text();d=json.loads(re.search(r'<script>\s*const DATA=([\s\S]*?);\s*</script>',raw)[1]);old=copy.deepcopy(d)
    title,intro,sections=parse()
    v=next(p for p in d['pages'] if p['id']=='V')
    v['title']=title;v['shortTitle']='语音输入与业务交接'
    v['summary']='用泳馆附近找餐厅的同一个请求，讲清热词、ASR 与判停、预请求、端云模型、记忆和结果回流。'
    v['voiceEdition']=dict(version=33,intro=intro,sections=sections)
    v['teaching']=dict(intro=intro,lessons=sections,guides={},closing=[],sourceIds=[s['id'] for s in sources])
    v['sections']=[dict(id=s['id'],title=s['title'],paragraphs=s['paragraphs'],sourceIds=s['sourceIds']) for s in sections]
    v['sourceIds']=[s['id'] for s in sources]
    # Keep the original graph and node identities; replace only V explanations with relevant lecture paragraphs.
    byid={s['id']:s for s in sections}
    node_sections={'V13':('v-listen',[0,1,5]),'V1':('v-listen',[4]),'V14':('v-listen',[2]),'V15':('v-listen',[3]),'V16':('v-hotwords',list(range(len(byid['v-hotwords']['paragraphs'])))),'V17':('v-place',[0,1,2]),'V2':('v-asr-vad',[0,1]),'V3':('v-asr-vad',[0,3]),'V4':('v-asr-vad',[1,2,3]),'V5':('v-prepare',[0,1,2]),'V6':('v-prepare',[0,1,2,3]),'V7':('v-asr-vad',[2,3,4,5,6]),'V8':('v-asr-vad',[5,6]),'V9':('v-prepare',[4,5,6,7]),'V10':('v-asr-vad',[7,8]),'V11':('v-prepare',[6,7,8]),'V12':('v-place',[2,3,4]),'V18':('v-original-guide',[4])}
    for nid,(sid,indices) in node_sections.items():
        s=byid[sid];ps=s['paragraphs']
        v['nodeExplanations'][nid]=dict(paragraphs=[ps[i] for i in indices if i<len(ps)],sourceIds=s['sourceIds'])
    # Node popups must not turn tables into a long unstructured string or inherit a mismatched old explanation.
    v['nodeExplanations']['V13']['paragraphs']=[byid['v-listen']['paragraphs'][i] for i in [0,1,6]]
    v['nodeExplanations']['V17']={'paragraphs':[byid['v-listen']['paragraphs'][5]],'sourceIds':['V33-VOICEPRD','V33-LOCAL']}
    v['nodeExplanations']['V16']['paragraphs']=[byid['v-hotwords']['paragraphs'][i] for i in [0,1,2,5,6,7,8]]
    v['nodeExplanations']['V16']['paragraphs'].insert(3,'热词来源包括已授权的联系人与当前人员名称、导航目的地和途经点、播放内容、当前页面可说词、车型专有词。近期对话和当前位置也可以提供识别背景。各类支持数量与本次实际注入数量需要分别看；完整分类表见本章热词讲解。')
    v['nodeExplanations']['V9']['paragraphs']=[byid['v-prepare']['paragraphs'][i] for i in [3,6,7]]
    v['nodeExplanations']['V7']['paragraphs']=[byid['v-asr-vad']['paragraphs'][i] for i in [2,3,5,6]]
    v['mainline']=[];v['concepts']=[];v.pop('feynman',None)
    d['sources'] += [{k:v for k,v in s.items() if k not in ('localFile',)} for s in sources]
    d['diagrams'].update(json.loads((ROOT/'voice-diagrams.json').read_text()))
    d['meta'].update(version='v33-v-lesson',asOf='2026-11-05',teachingEditedAt='v33-V-20261105',previousVersion='v31-工作副本（内部 v32 修订）',refinement='仅 V 章重写为连续业务讲解，增加 4 张信息交接图；保留其他章节及原始图。',validation='完成教学与记忆事实独立审稿；离线检查详见本轮验证文件，未进行浏览器视觉验收。')
    assert [x for x in d['pages'] if x['id']!='V']==[x for x in old['pages'] if x['id']!='V']
    assert d['base']==old['base'] and d['originalSvg']==old['originalSvg']
    app=re.search(r'</script>\s*<script>([\s\S]*?)</script>\s*</body>',raw)[1]
    addon=(ROOT/'voice-renderer.js').read_text()
    app=app.replace(' function renderModule(id) {',addon+'\n function renderModule(id) {',1)
    app=app.replace('  if(page.articleReading)return renderArticleModule(page,module);','  if(page.voiceEdition)return renderVoiceEdition(page,module);\n  if(page.articleReading)return renderArticleModule(page,module);') if '  if(page.articleReading)' in app else app.replace(' if(page.articleReading)return renderArticleModule(page,module);',' if(page.voiceEdition)return renderVoiceEdition(page,module);\n if(page.articleReading)return renderArticleModule(page,module);')
    assert 'if(page.voiceEdition)' in app
    app=app.replace('const readableWidth = Math.max(fitWidth, intrinsicWidth * (options.svg === DATA.originalSvg ? .68 : 1));','const readableWidth = options.voiceLesson ? Math.max(fitWidth,760) : Math.max(fitWidth, intrinsicWidth * (options.svg === DATA.originalSvg ? .68 : 1));')
    # Plain local document defaults to the revised V chapter; existing hash routes remain available.
    app=app.replace(" const $ = (selector, root = document)"," if(!location.hash)history.replaceState(null,'','#module/V');\n const $ = (selector, root = document)",1)
    prefix=raw[:raw.index('<script>\nconst DATA=')] if '<script>\nconst DATA=' in raw else raw[:re.search(r'<script>\s*const DATA=',raw).start()]
    prefix=prefix.replace('</style>',(ROOT/'voice-style.css').read_text()+'\n</style>',1)
    payload=json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    result=prefix+'<script>\nconst DATA='+payload+';\n</script>\n<script>'+app+'</script>\n</body>\n</html>'
    (ROOT/'candidate-data.json').write_text(json.dumps(d,ensure_ascii=False))
    (ROOT/'candidate-app.js').write_text(app)
    (ROOT/'source-register.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2))
    (ROOT/'candidate.prefix').write_text(prefix)
    (ROOT/'baseline-integrity.json').write_text(json.dumps(dict(path=str(BASE),sha256=hashlib.sha256(BASE.read_bytes()).hexdigest(),otherPages=len(d['pages'])-1,originalNodes=sum(len(m['nodes']) for m in d['base']['modules']),originalEdges=len(d['base']['edges'])),ensure_ascii=False,indent=2))
    if '--publish' in sys.argv:
        with OUT.open('x') as f:f.write(result)
        print(OUT)
    else: print('Prepared candidate data and app; HTML is not yet written.')
    return result

if __name__=='__main__':build()
