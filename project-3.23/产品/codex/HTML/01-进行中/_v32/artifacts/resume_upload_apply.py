import pathlib,json,copy,datetime,shutil
r=pathlib.Path('/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中');p=r/'豆包汽车-业务学习站-v31-工作副本.html';s=p.read_text();i=s.index('const DATA=')+11;d,n=json.JSONDecoder().raw_decode(s[i:]);old=copy.deepcopy(d);pgs={p['id']:p for p in d['pages']}
ME='https://aka.doubaocdn.com/s/68EV2Q9r4X';V='https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd?from=lark_search_qa&ccm_open_type=lark_search_qa#TvdtdyavUoaSltxkMcsc9mGCnvb'
def l(pid,lid):return next(x for x in pgs[pid]['teaching']['lessons'] if x['id']==lid)
def rep(pid,lid,needle,new):
 ll=l(pid,lid);hits=[j for j,z in enumerate(ll['paragraphs']) if needle in z];assert len(hits)==1,(pid,lid,needle,hits);ll['paragraphs'][hits[0]]=new
rep('B','b-facts','任务跑完一到两秒后', '字段缺失先标未接入或本次未返回，不能补成设备已开或已关。任务控制的同步应答只证明指令送达或受理，后续状态与实际数据还需要对应回调。启动、识别完成、失败、停止的含义不同，各任务超时及重试由具体协议约定，不能一律假定一至两秒必回，也不能在已经有副作用时默认再试一次。')
rep('B','b-facts','事实来源里还有一路是人人对话',f'人人对话是乘客之间的交流，和向豆包提出需求的人机对话分开。11月4日讨论激活态实时上报；降级情况下每十句打包，不足十句但沉默三十秒也可上报；每次有效query检查未上传内容一起补上。真正断网时先在本地保留，网络恢复再补报，云端按时间戳还原发生顺序，不能把补报到达顺序当成真实对话顺序。当天是开发和提测安排，不能直接宣称11月5日所有车已经生效。[文字记录00:16至00:18]({ME})')
rep('B','b-facts','端侧视觉模型输出两类结果',f'B03（把视觉描述作为有条件的观察证据）接视觉任务输出。V1.3里舱内描述包含乘客位置、造型或动态，舱外包含天气、路面和所见描述。它们是模型从图像或视频推理的观察，不是车辆硬件直接上报的挡位、空调设定或身份授权。结构化JSON也可能装着推断内容，不能因为有字段就把它当成设备实测值。[VLM任务定义]({V})')
rep('B','b-state-change','可以沿用上一轮安全默认值', '缺失、过期、权限撤回与设备断连分开记录。需要当前车速、挡位或空调设定时，应按该字段的有效期和业务规则取得可靠状态。旧温度即使曾经正确，也不能补成此刻事实；可作有时间标记的历史参考，但不能据它默认再调整设备。依赖状态仍未知时，要补查、保留未知或停止相关动作，不能用所谓安全默认值掩盖数据缺口。')
rep('B','b-consumers','Context 给 DT 的对话背景分两层',f'原人机历史窗口和新的混合输入范围要分版本看。11月4日讨论保留5轮人机，再补近期5次混合输入中的非人机部分；独立旧事件流变量不再单独调用。摘要也从只压人机问答扩到人人与事件，但22轮与记忆侧20轮或20分钟的计数覆盖仍待核对。两份输入分别保原话与压缩内容，不能把事件上报等同已经进入本轮推理，更不能把开发计划写成已上线。[文字记录00:01至00:15]({ME})')
rep('B','b-visual-upload','2026 年 11 月的状态是',f'11月4日实车讨论暴露的是供给与使用脱节：舱内外caption已进入Context，但对话中的DT未能稳定参考。问副驾是谁时，应优先核FaceID已有身份，视觉问答不能代替身份服务。团队提出调整主模型对持续视觉的认识、拿实际已上报数据和实车案例验证；把高频动作作为事件插入历史输入，是讨论中的改进方向，不能写成已经完成。某些案例没用到不代表所有查询都从未消费视觉。[文字记录00:18至00:35]({ME})')
rep('B','b-visual-upload','空代表看过且确认没问题',f'空结果要按任务的输出契约解释。V1.3里遗留物任务输出“正常”表示该次画面未检出关注对象；舱外天气某些空字段表示没有检出对应类别；失败或超时则没有形成可用观察。这三者不能混叫“没问题”。即使模型正常返回空结果，也可能受视角和遮挡限制，不能保证全车所有位置都不存在该对象，更不能拿超时空包覆盖上一份带时间的观察。[VLM任务定义]({V})')
rep('B','b-feedback','它由导航剩余距离和车速、拥堵和道路类型多信号合成', '「快到了」要先有本项目定义好的条件和可用导航信号。只有剩余距离、车速、拥堵等字段可取，并不证明已经实现某套综合权重模型。条件实际选哪些字段、从何时判断、用户改目的地后如何更新，应回到该任务与触发配置核对。距离缺失或过期时保留未知，不按旧目的地硬触发泳镜提醒。')
rep('S','s-origin','Advisor 也不能把这一路当成已经可用',f'视觉来源要分别看任务定义与消费效果。V1.3舱内高频任务每5秒取5秒视频，低频每5分钟取5秒视频，舱外每3秒取3秒视频；这些是该文档的任务周期，不能概括成所有视觉一帧固定几秒。11月4日会中指出DT对已有caption利用不足，并要求拿实际上报与实车验证。这个问题不能直接推出Advisor也从不使用视觉。影子观测模型是另一个发现端侧误召的保底讨论方案，不是视觉采集主路。[VLM任务定义]({V}) [11月4日文字记录]({ME})')
# Remove unverified preset group limits and old duplicated statistical guarantees: keep version-specific original values elsewhere until reviewer checks.
rep('L','l-resources','天气保护一期不做进入防抖', '天气保护的进入确认与退出确认需要分别定义，不能同一段既说进入不防抖，又说必须连续多个周期。雨雪雾触发条件、重复观察次数和退出等待，按该车型已发布规则及对应PRD核对；旧设计中已划掉的周期与次数不继续当当前标准。观察样本不足时不补成确定天气，退出后的旧卡片也不能继续执行过期建议。')
rep('L','l-control-data','例如座位占用等于主驾、挡位等于 P',f'视觉任务输出有结构化字段和自然语言描述，字段结构不等于实测真值。乘客位置、动态和天气可来自VLM推理，挡位、车灯等状态来自车辆数据。V1.3用不同topic区分乘客列表和动态任务，部分工程输出已去掉动态任务；应按实际topic及版本核对，不把不同出口混成“所有视觉输出都上报端状态”。[VLM任务定义]({V})')
rep('L','l-confirm','空代表看过且确认没问题',f'识别正常返回、未检出关注对象、失败或超时、被打断，需要分别记录。未检出只描述本任务在这次有效画面中的结果，不保证所有位置都没有问题；失败或超时不能写成“无障碍物”，也不能用空值伪装正常。高优抢占后的恢复按调度规则处理，恢复并不意味着旧观察仍然代表现在。[VLM任务定义]({V})')
rep('L','l-lifecycle','正常唤醒交互场景下，用户音频并行', '离在线语音采信规则不等于端侧触发器的通用调度规则。较早PRD的白名单优先及2秒心跳，与R章9月30日缓存优先、云端业务等待超时属于不同版本和计时器。端侧本地预设任务按自身协议运行，用户语音的端云候选由R章负责解释；不能把两套规则同时列成这台车当前必须遵守的流程。')
# Synchronize all affected legacy sections.
for pid in ['B','L','S']:
 pg=pgs[pid];ls={x['id']:x for x in pg['teaching']['lessons']}
 for sec in pg['sections']:
  if sec.get('teachingTarget') in ls:sec['paragraphs']=copy.deepcopy(ls[sec['teachingTarget']]['paragraphs'])
 pg['sourceIds']=list(dict.fromkeys(pg.get('sourceIds',[])+['RESUME-VLM-DEFINITION','RESUME-MEETING-RAW']))
assert old['originalSvg']==d['originalSvg'];bk=p.with_name(p.name+'.bak-upload-correction-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S'));shutil.copy2(p,bk);p.write_text(s[:i]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[i+n:]);print('B/L/S input and observation corrections written',bk)
