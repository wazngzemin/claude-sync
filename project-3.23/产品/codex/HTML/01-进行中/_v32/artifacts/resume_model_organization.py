import pathlib,json,copy,datetime,shutil
r=pathlib.Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');p=r/'豆包汽车-业务学习站-v31-工作副本.html';s=p.read_text();i=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[i:]);old=copy.deepcopy(d);ps={p['id']:p for p in d['pages']}
V='https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd?from=lark_search_qa&ccm_open_type=lark_search_qa#TvdtdyavUoaSltxkMcsc9mGCnvb';MP='https://bytedance.larkoffice.com/docx/NDPZdBNZuoq1kqxw391cb0GVnzI'
rte=ps['R']['teaching'];fl=next(l for l in ps['F']['teaching']['lessons'] if l['id']=='f-lesson-available')
edge=fl['paragraphs'][5:7]
model={'id':'r-model-roles','title':'1.7B FC、30B视觉模型、Edge_DT与云端Director分别做什么','sourceIds':['RESUME-VLM-DEFINITION','RESUME-MODEL-PLAN'],'paragraphs':[
 '用户说「开副驾座椅加热两档」，核心是把这句话转换成设备、座位、动作和档位，再交车控；用户说「看看后排有没有我的杯子」，核心是取得有效画面并找物；用户说「去昨天泳馆附近找一家清淡餐厅」，还需要历史地点、搜索和多轮判断。三种问题需要的信息不同。模型分工应先看这次输入和任务，再看车型的部署配置，不能只按模型大小判断谁更应该执行。',
 '1.7B中的B表示十亿参数，1.7B约为17亿参数；30B约为300亿参数。参数是模型训练得到的内部数值，不是工具数量、记忆条数、每次处理的汉字数，也不表示1.7秒或30秒响应。模型更大是否值得部署，需要结合输入、质量、延迟、内存与车辆硬件判断，不能直接说30B就能包办全部座舱业务。',
 'FC是Function Calling，即函数调用任务。模型根据文字和工具定义，产出约定的调用名称及参数。例如副驾座椅加热请求，要把位置指向副驾、档位指向两档，再由车辆接口执行。ASR先把声音识别成文字，FC再理解文字并生成调用；两者不同。模型生成了函数候选，也还没有取得端云采信资格，R5和R11再决定这份候选能否放行，真实执行结果由E章说明。',
 '1.7B与1.4B要按原文的车企、硬件和版本读。已有产品概览、AIVA需求和工程部署评论分别列不同配置；“端侧模型”可能指本地业务角色，在没有对应端硬件的项目也可暂放云端。不能因为角色名写端侧就断言每台车都能断网运行。实际运行在哪、支持哪些车控及继承范围，需对照当前项目部署，见本章前面的来源与采信说明。',
 f'视觉语言模型VLM拿图像或视频及文字提示，输出描述、标签或目标位置。模型规划把AIbox上的30B MoE与QC8797侧的4B Dense对照：舱内描述和部分问画面任务两者都列支持，舱外通用描述、某些持续观察和指令泊车在这份规划中列给30B一侧。这里是规划的功能分工，不能把打勾当作所有量产车型已通过验收。[端侧模型规划]({MP})',
 'MoE是混合专家结构，模型内部会按输入选用部分专家参数处理；Dense是稠密结构，通常使用完整网络的对应层参与计算。30B MoE的总参数量不等于每次都计算300亿参数，更不能和4B Dense按数字直接换算响应速度。用户在产品评审中需要问的是同一个视觉任务的准确率、输入分辨率、每次取几帧、时延和资源占用；硬件盒子是部署条件，不是另一套助手人格。',
 *edge,
 f'云端Director是主链的对话推理与工具调度模块。它接当前需求、历史输入、车况、可用记忆和工具定义，决定这轮先查什么、说什么、调用什么；工具结果返回后再判断。Edge_DT是AIbox上的离线文本任务，30B视觉任务负责观察，1.7B FC负责有限调用解析，它们都不自动替代这条完整云端链。当前具体能力是否可用，要同时有任务规格、部署及业务接入证据，不能只看到模型存在就承诺导航、记忆、联网搜索和持续任务全离线。[VLM任务表]({V})'
]}
idx=next(j for j,x in enumerate(rte['lessons']) if x['id']=='r-arb');rte['lessons'].insert(idx,model)
ps['R']['sections'].append({'id':model['id'],'title':model['title'],'paragraphs':copy.deepcopy(model['paragraphs']),'sourceIds':model['sourceIds'],'teachingTarget':model['id']})
# F model specification content now belongs to R, avoid duplicated long explanation among capability gates.
fl['paragraphs']=fl['paragraphs'][:2]+[
 f'模型名称与工具接入是不同问题。1.7B FC、30B视觉任务、Edge_DT和云端Director的具体职责已在R章按输入输出单独讲清；这里继续看模型本轮能获得哪些工具说明。即使本车部署了视觉或文本模型，也不意味着地图、媒体、车控和记忆接口全部接入，更不表示当前用户已获授权。[VLM任务定义]({V})',
 '当前车型、渠道、应用、环境、已发布实现和权限，决定工具能否参与这一轮。某个后台里存在定义，只证明曾建立过一项能力；还要找到当前项目启用的实现与版本。车型没有设备、账号无权、现在不宜执行，需要不同结果，不能都归成模型没听懂。'
]
for sec in ps['F']['sections']:
 if sec.get('teachingTarget')=='f-lesson-available':sec['paragraphs']=copy.deepcopy(fl['paragraphs'])
ps['F']['teaching']['intro'][2]='模型分工和端云采信在R章说明，本章继续处理工具定义、可用实现、调用参数及结果回流。先确认这辆车是否有当前能力，再核对调用协议，最后追到真实结果，避免把“模型生成调用”直接解释成用户的事情已经办成。'
# register actual returned original source and source list.
d['sources'].append({'id':'RESUME-MODEL-PLAN','title':'端侧模型规划（8397 vs AI-Box）原始正文','url':MP});ps['R']['sourceIds']=list(dict.fromkeys(ps['R']['sourceIds']+model['sourceIds']))
assert old['originalSvg']==d['originalSvg'];b=p.with_name(p.name+'.bak-model-location-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S'));shutil.copy2(p,b);p.write_text(s[:i]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[i+n:]);print('R dedicated model lesson written; F returned to capability scope',b)
