import pathlib,json,copy,shutil,datetime
r=pathlib.Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');p=r/'豆包汽车-业务学习站-v31-工作副本.html';s=p.read_text();i=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[i:]);before=copy.deepcopy(d);pgs={p['id']:p for p in d['pages']}
M='https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh';ME='https://aka.doubaocdn.com/s/68EV2Q9r4X';SY='https://bytedance.larkoffice.com/wiki/Aj7AwwY5hifYvRkWxsxcR9cGnKb?from=from_copylink';TR='https://bytedance.larkoffice.com/docx/KdBzd7uzXonxOZxXJW9cHSKonld'
def l(pid,lid):return next(x for x in pgs[pid]['teaching']['lessons'] if x['id']==lid)
k=l('K','k-lesson-cross-device');k['title']='共享乘客、多人在场与跨账号，是不同的数据范围';k['paragraphs']=[
 f'多人同车先确定两个范围：当前车与登录账号能访问哪份记忆，以及这一次在场的人允许共同使用哪些内容。PRD先按车和豆包账号隔离，再按记忆标签与用车场景收窄敏感内容。不能因为同一家庭账号就把所有成员经历都拿来回答，也不能把一位乘客过去坐副驾当成现在有权读取他的私有内容。[记忆系统 PRD·隐私策略]({M})',
 f'白名单和非白名单用不同召回范围。白名单从包含询问者的经历中取：A询问时，可包括A单独、AB、AD等有A的场景。非白名单要求覆盖当前在场人员：A、B、C在车上时，候选来自ABC、ABCD等至少包含这三人的场景。这样做是在已经允许的车与账号空间内再过滤，不能用一个人物名字跨账号搜索其他人的记忆。[记忆系统 PRD·询问人最大集与在场人最小集]({M})',
 f'记忆页面的展示规则与模型召回另行定义。PRD要求页面暂时只显示长期语义记忆，展示当前在场人的交集记忆；按人筛选的界面方案已划掉，但管理接口仍有按人查询或删除。不能由“接口支持按人”推定页面有这个按钮，也不能由“页面没有显示”推定后端没有相应记录。[记忆系统 PRD·常规记忆露出及管理接口]({M})',
 f'摘要没有完整绑定每一次在场组合，因此有独立清理规则。PRD以新注册乘客上车、未注册乘客人数增加判断新人，清除摘要中的敏感信息；单纯功能性偏好与涉及个人身份、关系、重要地点等内容要分开。未注册乘客换人但人数不增加，是文档明示的覆盖缺口，不应写成FaceID已经能完整识别所有换人。[记忆系统 PRD·对话摘要隐私策略]({M})',
 f'共享乘客也有两种含义。FaceID维度的共享，指这台车换登录账号后仍认识该乘客；记忆生成维度的共享，指主账号登录且共享乘客在车内时，相关记忆同时在相应的车与豆包账号空间生成。它是定义好的共同生成机制，不是自动开放两个账号互相读取全部历史。共享身份、共享生成与本轮召回权限必须分别检查。[记忆系统 PRD·共享乘客与记忆生成]({M})',
 '手机与车辆之间再增加一个跨端来源。当前已核的记忆主线规则不能证明手机全部聊天、通讯录或私人记忆都可同步到车内。讲“手机给车一条信息”时，应只说明具体接口已授权传递的对象和用途；缺少跨端协议的字段、范围或落地证据，就不能补成全量同步。用户主动交给车端一个地点，也不代表把手机全部个人记忆授权给在场乘客。'
]
# remove profile inference scheduling and wrong private-memory inclusion in old text
q=l('K','k-lesson-profile');q['paragraphs'][0]=f'用户画像帮助Director了解这个人的相对稳定信息。PRD写已经实现的语义记忆画像是固定注入，未做检索逻辑；更完整的自然语言画像和关系建模列为长期方案。画像来自哪类资料，决定能说到什么程度，不能把设想中的完整人设当成每轮已经注入的事实。[记忆系统 PRD·增加用户画像]({M})'
q['paragraphs'][1]=f'从长期情景记忆里归纳用户规律，是另一路推断。PRD写对应情景画像算法已有实现，但当时实际未使用，更完整方案仍未实现。一次开座椅通风只能证明这次操作，反复操作是否足以说明夏天偏好、是否要限定同乘场景，还要经过归纳与验证。不能把某个夜间或周五更新节奏写成没有对应版本依据的上线规则。[记忆系统 PRD·从情景记忆总结语义记忆]({M})'
q['paragraphs'][5]=f'用户明确事实、画像概括与情景经历在使用时各有角色。画像可以提供常用背景，具体经历仍按本轮查询与权限取回。页面露出的长期语义记忆、模型固定注入的画像和按场景召回的情景记忆不是同一展示对象。删除语义记忆以后还要更新画像，避免已删除偏好从画像再次进入回答。[记忆系统 PRD·画像及删除影响]({M})'
q=l('K','k-lesson-control');q['paragraphs'][4]=f'清理时要分对象。PRD提供新chat_id清空Director历史对话与摘要，语义记忆和情景记忆分别走删除接口；删除语义记忆以后，再按剩余资料更新用户画像。接口返回多少条、清掉哪个范围，都要按实际操作说明，不能把删除一条语义记忆说成同时删完所有原始日志与最近历史。[记忆系统 PRD·记忆管理需求]({M})'
q['paragraphs'][5]=f'当前页面主要露出长期语义记忆，情景类暂不露出；支持标签筛选、单条删除、按标签删除和一键清空，批量操作二次确认。按人筛选的页面设计已划掉，接口仍列有按人操作。语音批量删除由DT确认范围再执行，页面由车企开发，各项目实际开放范围仍要按交付版本看。[记忆系统 PRD·界面及语音删除]({M})'
# Node details synchronize semantic corrections, preserve graph geometry/labels.
mods={m['id']:m for m in d['base']['modules']};ns={n['id']:n for m in mods.values() for n in m['nodes']}
np={
 'K05':[f'情景记忆按用车参与者及场景组织，原始事件和对话不等于已经生成可召回的经历。11月4日讨论旧摘要22轮与短期20轮或20分钟的总结节奏，仍要求核对计数和覆盖衔接，不能把20条、20轮互相替换成统一现状。[11月4日文字记录]({ME})',f'对话摘要从第3轮起随新轮压缩，本稿最多22轮、最长500token，补Director保留5轮时退出原话的缺口。PRD将瞬时记忆标为当时未使用，不能从这段推出瞬时的20分钟阈值。[记忆系统 PRD]({M})'],
 'K06':[f'情景记忆保留发生在某次用车场景中的经历，语义记忆保存事实和关系，画像再从合法资料形成概括。PRD要求保留是谁说的信息，不把临时操作或别人的介绍变成用户亲口偏好。[记忆系统 PRD]({M})',f'语义画像当时固定注入；情景画像有实现但实际未使用，更完整情境建模为长期方案。不能把后台生成能力等同当前Director已经消费，也不能捏造统一夜间偏好推理节奏。[记忆系统 PRD]({M})'],
 'K15':['用户觉得“忘了”，先查原信息是否形成记忆，再查本次权限过滤、召回和采用，最后查执行。地址已取回却导航错，可能是城市或地点匹配错误，不应全算记忆提取错误。',f'家、公司地点的新方案以城市和完整POI名称为必要信息，确认具体地点后写入；消费时DT改写明确地点再调用导航。旧直接写地图的方案与11月4日方向分开核对，不沿用旧同步结论冒称当前已实现。[打通方案]({SY})'],
 'G02':[f'先核当前场景的渠道、车型、车辆与版本范围。OnePage长期规划列出登录与主动服务开关的前置过滤，部分为TODO；实际执行是否已前置，需要按版本核对，不能把规划直接当现状。[触发器 OnePage]({TR})'],
 'G05':[f'按定义判断当前值或状态变化；条件组内及组间组合遵守配置接口。OnePage明确暂不支持定时+条件、条件+推理、定时+推理混合触发，也不支持连续趋势分析，不因为图上有连接就推定任意组合可执行。[触发器 OnePage]({TR})'],
 'G06':[f'条件命中后再查总次数、单日次数、上电周期次数和执行间隔。OnePage默认30秒内同场景仅执行一次，实际按发布配置，不是视觉去重或观察周期。[触发器 OnePage]({TR})'],
 'G10':[f'明确时刻或周期到达后回调配置的业务出口，原任务继续处理动作与结果。时间到了不等于控车完成；取消、离线与迟到消息按任务约定核对，不给所有任务统一补做。[触发器 OnePage]({TR})'],
 'G11':[f'推理触发利用VLM语义判断目标情况，例如婴儿是否哭闹，不仅判断对象是否可见。观察、条件判断和后续动作分开，未知不等于不存在，组合能力依本版接口边界。[触发器 OnePage]({TR})']
}
for nid,ps in np.items():ns[nid]['paragraphs']=ps
# Preserve old section identifiers and sync changed teaching by existing teachingTarget.
for pg in d['pages']:
 ls={x['id']:x for x in pg.get('teaching',{}).get('lessons',[])}
 for sec in pg.get('sections',[]):
  if sec.get('teachingTarget') in ls:
   ll=ls[sec['teachingTarget']];sec['title']=ll['title'];sec['paragraphs']=copy.deepcopy(ll['paragraphs'])
assert before['originalSvg']==d['originalSvg'];assert before['diagrams']==d['diagrams']
bk=p.with_name(p.name+'.bak-node-privacy-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S'));shutil.copy2(p,bk);p.write_text(s[:i]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[i+n:]);print('synced privacy/profile/control & 8 node details;',bk)
