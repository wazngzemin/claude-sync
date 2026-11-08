import json
from pathlib import Path

project=Path(__file__).resolve().parents[3]
root=Path(__file__).resolve().parent
baseline=json.loads((project/'research/case-rewrite-20261029/baseline-data.json').read_text())
patch=json.loads((project/'content/case-support-20261029.json').read_text())
by_url={}
for source in baseline['sources']+patch['sources']:
    by_url.setdefault(source['url'].split('#')[0].split('?')[0],[]).append(source)

read_docs={}
for file in ('reads-1.json','reads-2.json','reads-3.json','reads-4.json','reads-5.json'):
    for key,value in json.loads((root/file).read_text()).items():
        if isinstance(value,dict) and isinstance(value.get('content'),list):
            value=json.loads(value['content'][0]['text'])
        url=value.get('source_url')
        if not url and key=='memoryreview':url='https://bytedance.larkoffice.com/docx/Se8jdNrxSob93XxLowzck351n9c'
        if not url and key=='event-template':url='https://bytedance.larkoffice.com/wiki/ImOlwJf0ViKogAk5IjVcIAjsnnc'
        body=value.get('content',{})
        if isinstance(body,dict):body=body.get('content','')
        if not isinstance(body,str):body=''
        state='partial' if value.get('truncated') or value.get('status')!='success' else 'full_text'
        known=by_url.get((url or '').split('#')[0].split('?')[0],[])
        read_docs[key]={
            'key':key,'url':url,'sourceIds':[s['id'] for s in known],
            'title':known[0]['title'] if known else (body.splitlines() or [key])[0].lstrip('# '),
            'responseStatus':value.get('status'),'readCoverage':state,'textCharacters':len(body),
            'responseFile':str((root/file).relative_to(project)),
            'bodyFile':str((root/(key+'.plain')).relative_to(project)),
            'use':'正文依据' if state=='full_text' else '只记录已返回范围；不据此声称全文已读'
        }

core={
'P':['P','preset','preset-card','event-trigger','task-island'],
'L':['L','preset','preset-card','P','task-island'],
'H':['H','silent-server','phud','P','preset'],
'U':['U','task-island','preset','preset-card','P'],
'K':['memory-talk','memory-prd','memory-profile','memory-poi','memory-identity'],
'EV':['event-prd','event-tech','event-trigger','event-transcript','clienttrace'],
'EL':['event-prd','event-tech','event-trigger','event-transcript','clienttrace','memory-prd','memory-identity'],
'SE':['expert-transcript','expert-plan','dynamic-retrieval','dynamic-prd','eval-framework']
}
decisions={
'P':['儿童锁为开启儿童锁，不是解锁；触发、条件、建议、确认、执行分别记录。','工作流判断保留通过、不通过、无结果；静默文字与带交互卡的出口不同。','新平台静默正文为一行，无标题、按钮和 TTS；PHUD 联动与排队范围未定。'],
'L':['持续感知控制反馈与画面数据分开回流；临时视觉问答与持续观察各有资源生命周期。','本地业务负责建议卡、确认与车控；本地闭环能力以已接入车型为边界。','围栏、定时和持久任务有不同交付优先级，不能概括为所有云端任务离线都能执行。'],
'H':['旧静默卡是固定标题与正文，新平台是单行正文；两个方案不能拼成一个接口。','静默信息不等待确认，也不替用户授权车控；PHUD 独立配置资源和显示。','去重、优先级、失效分别说明，未定时间不写成统一指标。'],
'U':['即时卡、任务岛、任务中心按用途展示；界面消失不等于任务取消。','推送更新与查询恢复分开，重连恢复状态不重放车控或已播内容。','任务中心管理受对应任务与项目权限约束。'],
'K':['10 月 28 日宣讲：普通生成异步，行为画像已实现未使用，语音删除仍开发。','乘客 OEM 账号边界、VehicleUserID、VolcAccountID 与座位分别解释。','近期对话、摘要、情景记忆、语义记忆及画像分开；先查泳馆再查餐厅。','记忆开关、聊天清空、长期记忆删除区分；POI 单向同步与后续方向分开。','500 ms 为召回目标，不写成已验证线上结果。'],
'EV':['端状态当前值与事件变化分开；无操作来源不能写成用户手动操作。','Trigger 事件时间为匹配时间，不能冒充原始信号变化时间。','Context、UP、Memory、订阅业务与特定 event 唤起分开。','误打断恢复按已有临时方案描述，统一调度另按项目接入；不重放已执行工具。'],
'EL':['业务事件与客户端排障日志按用途查询；固定 request_id/log_id 用于关联，params 最多 8 KB。','日志存在不证明进入当轮模型输入；按第一次偏离定位。','事件、入库和触发匹配时间分开，人物按发生时关联；不能用现在乘客补过去身份。','Context 10 分钟 30 条为讨论参数，静态 Advisor 20 分钟未定条数；不写成各模块统一窗口。'],
'SE':['先读 9 月 9 日专家知识逐字稿，用户给的 AI 纪要只用于追原始链接。','记忆、单点示例、静态原则、长期专家任务分开；用户教一次不等于模型已训练。','知识增删编号、取正文、注入 knowledge 与 Director 采用逐步解释。','车型/环境/场景域先筛后检索属二期方案；无条目不能用其他项目内容补位。','personal_skill_record 更新语义存在字段与 tips 差异，不能承诺生产端已完整可用。','Reflector Test MVP 不等于当前量产自动学习闭环；模拟输入与实车验证范围分开。']
}
search=json.loads((root/'search-retry.json').read_text())
modules=[]
for item in search:
    result=json.loads(item['result']) if isinstance(item['result'],str) else item['result']
    module=item['module']
    page=next(x for x in patch['pages'] if x['id']==module)
    extra=[]
    if module=='K':
        extra=[{'sourceIds':['MEM26-TEST'],'path':'research/memory-evolution-20261028/memory-clean-test.md','readCoverage':'prior_full_text','used':'生成接口的处理中/成功状态、测试隔离'},
               {'sourceIds':['COV-MEM-PHONE','COV-MEM-PHONE-BEAN','COV-MEM-FU-PHONE'],'path':'research/coverage-expansion/memory/','readCoverage':'prior_full_text','used':'手车互联对象、登录与任务边界；不声称全量记忆同步'}]
    if module=='EV':extra=[{'sourceIds':['NEW-EVENT-QUERY'],'path':'research/memory-evolution-20261028/library-read-event-query.json','readCoverage':'full_text','used':'误打断临时恢复路径与原请求缓存'}]
    if module=='SE':extra=[{'sourceIds':['DYNAMIC-EXAMPLE'],'path':'research/lecture-rewrite-20261029/dynamic-guide.md','readCoverage':'full_text','used':'动态示例维护、实际注入核对与 personal_skill_record 契约差异'},
                         {'sourceIds':['SE-RELEASE0514'],'path':'research/evolution/','readCoverage':'prior_full_text','used':'Reflector 历史 Test MVP，仅标明历史范围'}]
    modules.append({'id':module,'query':item['query'],'search':{
        'responseFile':'research/case-rewrite-20261029/support/search-retry.json',
        'scanMode':result.get('scan_mode'),'scanComplete':result.get('scan_complete'),
        'pagesScanned':result.get('pages_scanned'),'reportedTotal':result.get('reported_total'),
        'uniqueHits':result.get('unique_hits'),
        'inventoryStatus':'metadata_only，分页检索返回的候选不是已读正文'},
        'fullTextSources':[read_docs[k] for k in core[module]],'additionalArchivedSources':extra,
        'partialSources':[read_docs['memoryreview']] if module=='K' else ([read_docs['event-template']] if module in ('EV','EL') else []),
        'usedDecisions':decisions[module],
        'lessonIds':[x['id'] for x in page['teaching']['lessons']],
        'unreadBoundary':'完整检索命中中的其他项目、重复副本、自动生成学习材料与非直接相关资料仅保留候选元数据；未宣称逐篇全文已读。'
    })

report={
    'date':'2026-10-29','group':'support','modules':modules,
    'statusDefinitions':{'full_text':'连接器返回完整正文，本轮按相关业务段落核读；会议使用文字记录。','prior_full_text':'此前研究已保存完整正文，本轮沿具体决策回查复用。','partial':'连接器返回截断内容或表格范围不完整，不作为完整文档阅读完成。','metadata_only':'搜索标题、链接及摘要，仅用于发现资料。'},
    'searchLimit':'8 次模块检索已由工具完成分页；元数据命中量与全知识库正文阅读量不能等同。',
    'meetingVerification':{'expertDiscussion':'BLgJd0WUeohjoVxTiqlcigpinch 的 AI 纪要已追至 V85Udy3G5oQLnHxw3Mqc6LZEnHe 逐字稿；讨论观点不写成上线。','memoryTalk':'10 月 28 日记忆宣讲使用 Ytzbd2OoNoMk0xxi099c1t9CnHh 文字记录；8 月 19 日长评审两次返回 partial，不声称该长评审全文已读。','eventReview':'使用 SQvXdTStNoWcP8xC4CUc1IkQnbg 文字记录；临时方案与长期输入管理接入分开。'},
    'unresolved':[{'document':'8 月 19 日产品需求内审','status':'partial','impact':'不以未返回部分补充事实；记忆采用 10 月 28 日宣讲与现行 PRD 的可核对内容。'},{'document':'事件定义/模板表','status':'partial','impact':'不声称覆盖全部事件枚举；本章只使用 PRD 与技术方案明确的事件字段和实例。'}],
    'sourceValidation':{'unregisteredIds':[],'newSourceIds':[],'note':'本补丁所有来源 ID 已在 v27 基线来源注册表存在，未制造重复 ID。'},
    'originalDiagramUpdates':['K02 身份范围','K12 删除重复段并区分页面和召回','H03 新旧静默文字约定']
}
(root/'coverage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('coverage:',len(modules),'modules;',len(read_docs),'retrieved document records')
