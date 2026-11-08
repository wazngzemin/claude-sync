from pathlib import Path
import re, json, hashlib

p = Path(__file__).parent

def read(name):
    return (p / name).read_text()

def sections(text):
    out = {}
    for block in re.split(r'(?=^## )', text, flags=re.M):
        if block.startswith('## '):
            head, _, body = block.partition('\n')
            out[head[3:].strip()] = body.strip()
    return out

def block(title, body):
    return '\n\n## ' + title + '\n\n' + body.strip()

act = sections(read('activation-lecture.md'))
route = sections(read('routing-lecture.md'))
out = sections(read('output-lecture.md'))
inp = read('input-lecture.md').split('\n\n', 1)[1].split('\n来源：')[0]
inp = inp.replace('本次热词技术方案链接无权读取', '本次热词技术方案链接未取得正文')
inp = inp.replace('**正式提交交清楚最终文字与来历，后续业务仍要补齐事实和验证执行。**', '## 正式提交交清楚最终文字与来历，后续业务仍要补齐事实和验证执行')
inp_main, inp_formal = inp.split('## 正式提交交清楚最终文字与来历，后续业务仍要补齐事实和验证执行', 1)
parts = [
    '# 豆包汽车语音全链路｜产品经理完整讲课稿 v01',
    '核验与重写日期：2026-10-29。',
    '用户坐在主驾说：“带我去昨天那家游泳馆……附近的餐厅。”他停了一下又补话，希望系统接住最终目标，尽快给出有用反馈，并真正导航到选中的餐厅。后面他还可能选“第二个”、手动点卡片、插话说“别说了”，或进入没有网络的地方。本文沿这一次体验，解释进入对话、听完整、正式办理、声音交付、插话与续说，不把它们拆成互不相干的术语。',
    '阅读时把每一步连回用户目标：现在已经知道什么、还缺什么，由谁继续判断，什么结果才允许向用户承诺。正文采用已读资料描述的机制和范围；需求、历史方案、讨论结论与实车已上线分开。涉及不同车型的规则，保留对应范围。原来的图不是本稿内容上限，也不作为独立原始证据。'
]
for k in list(act)[:4]:
    parts.append(block(k, act[k]))
parts.append(block('一遍识别、热词、Soft VAD、预请求与二遍识别怎样接起来', inp_main))
for k in ['先判断这句话是不是在找豆包，再决定由谁办理', '本地和云端可以一起准备，但不能各自做一遍', '用户说“第二个”，系统先确认这是什么卡片']:
    parts.append(block(k, route[k]))
parts.append(block('把正式请求交给后面的业务链路，查清地点再执行', inp_formal))
parts.append('在这里，用户的目标已经清楚地交出去了。后面即使模型给出文字，也还要分别确认动作有没有成功、声音有没有生成、车端有没有播出。下面把“办事”和“说话”分开核对，再看它们怎样重新汇合到同一次用户体验。')
out_intro = read('output-lecture.md').split('\n\n', 1)[1].split('\n## ', 1)[0]
parts.append(out_intro)
for k, v in out.items():
    parts.append(block(k, v))
for k in ['两个人一起说，先看旧请求走到了哪里', '豆包说到一半时，“别说了”究竟停了什么', '下一句接得住，靠的是把真实经过及时交回系统']:
    parts.append(block(k, route[k]))
cont = act['开始对话后，用户还需要知道系统在等什么']
cont = cont[cont.index('等豆包这轮播报结束'):]
cont = cont.split('看到这里，再看那句游泳馆请求')[0].strip()
parts.append(block('这一轮结束以后，继续说话、退出会话和关闭免唤醒怎样区分', cont))
parts.append(read('closing-lecture.md').replace('# 用户遇到失败时，也要能理解发生了什么', '## 失败、能力边界和整条语音体验怎样验收', 1))

text = '\n\n'.join(parts)
# 旧图编号不作为新课堂的阅读前提；保留中文业务职责。
mapping = {
    'R1':'入口识别','R2':'激活状态判断','R3':'请求关联','R4':'本地模型','R5':'结果采信','R6':'本地调用','R7':'最终拒识','R8':'有效请求交接','R9':'本地执行回执','R10':'拒识出口','R11':'兜底条件检查','R12':'本地历史同步','R13':'流式判断','R14':'提前上云','R15':'正则规则匹配','R16':'本地结果分类','R17':'迟到结果拦截','R18':'离线失败出口',
    'I1':'播放中的新输入入口','I2':'停播条件判断','I3':'旧声音停止与进度保存','I4':'中断原因判断','I5':'结束旧播报','I6':'插话最终有效性判断','I7':'恢复事件','I8':'新旧输入交接','I9':'剩余信息价值判断','I10':'自然结束','I11':'必要内容续接','I12':'任务或动作取消','I13':'旧请求阶段判断','I14':'无效插话处理','I15':'在途结果关联','I16':'交互状态呈现','I17':'版本范围判断','I18':'系统音频抢占',
    'W01':'页面控件解析','W02':'指令与对象登记','W03':'热词增强','W04':'最终文字与页面关联','W05':'指令匹配','W06':'歧义处理','W07':'目标交回业务','W08':'页面实际执行','W09':'业务执行回执','W10':'统一反馈','W11':'交互事实同步','W12':'退场注销',
    'O01':'回复与动作出口','O02':'首轮话术判断','O03':'声音合成','O04':'车端真实起播','O05':'界面与表情呈现','O06':'播放中收音','O07':'实际结果说明','O08':'真实履约核对','O09':'交互历史','O10':'首轮静默','O11':'结果复盘','O12':'长期演进','O13':'引擎选择','O14':'缓存复用','O15':'音频获取','O16':'片段顺序管理','O17':'音频焦点','O18':'真实播放核验','M1':'输入管理','M10':'播放状态回流'
}
text = re.sub(r'\b(?:R\d+|I\d+|W\d+|O\d+|M1|M10)\b', lambda m:mapping.get(m[0],m[0]), text)
replacements = {
    '接着前一张语音图往下看：':'接着正式识别往下看：',
    '图中的 入口识别、激活状态判断':'入口管理先',
    '入口管理先先保留':'入口管理先保留',
    '这张图最后要让你':'这一段最后要让你',
    '你读完这张图':'你读完这一段',
    '讲这张图时':'讲这一段时',
    '按下一图':'按下一阶段',
    '交给下一图':'交给下一阶段',
    '专门看已接入的 W 图':'专门看已经接入可见即可说的页面',
    '走 W 图的匹配与点击流程':'走可见即可说的匹配与点击流程',
    '画 W 图时':'设计这条页面链路时',
    '不走 W':'不走可见即可说',
    '图 O 从 回复与动作出口':'声音输出从回复与动作出口',
    '图里的 首轮话术判断':'首轮话术判断',
    '最终拒识 的最终拒识':'最终拒识',
}
for a,b in replacements.items():text=text.replace(a,b)
text = re.sub(r'([^\s，。；：]{2,14}) 的\1',r'\1',text)
text = text.replace('“带我去昨天那家游泳馆，顺便找找附近的餐厅”','“带我去昨天那家游泳馆附近的餐厅”')
text = text.replace('这堂课承接主链的同一个场景：主驾说“带我去昨天那家游泳馆”，系统查记忆、找地点、获得路线，再启动导航。','接着刚才的餐厅请求往下看：系统查记忆、确认泳馆位置、查找并选定附近餐厅、获得路线，再启动导航。')
text = text.replace('回到游泳馆。系统暂时只知道','回到这次寻找餐厅的请求。系统暂时只知道')
text = text.replace('现在把场景往前推一步：','现在把刚才过程里的多人补充单独看清楚：')
text = text.replace('图中的','链路中的').replace('图里的','链路里的')
text += '\n\n## 原始来源、覆盖范围与尚未核实的内容\n\n'
text += '本次重新搜索飞书并沿语音专题索引补读原始 PRD、OnePager、技术方案和相关会议逐字稿。搜索会返回命中总数，但本次工具没有交出全部命中明细；不能据此声称已读完全部飞书或全部语音文档。以下完整列出本次实际使用来源与发现线索，分别标明正文、相关章节、会议时间段、片段和未获权限。热词技术方案未取得正文，两份拒识专项本轮无权限，评测表只返回局部，未用它们编造当前阈值或成绩。\n\n'
text += '原稿中的唤醒、声学、音区和专有词；一遍 ASR 与 partial；Soft VAD、Hard VAD、语义 VAD、预请求、request_id/round_id、二遍 ASR 与 final；正式提交，均保留并展开。新增的端云采信、卡片渠道、TTS、焦点、打断、历史、续说和失败边界，与同一条用户主线衔接。\n\n'
for name in ['activation-evidence.md','routing-evidence.md','output-evidence.md']:
    ev=read(name)
    lines=ev.splitlines()
    table=[]
    active=False
    for line in lines:
        if line.startswith('|'):
            active=True;table.append(line)
        elif active:break
    text+='### '+{'activation-evidence.md':'收音、权限与唤醒来源','routing-evidence.md':'有效性、采信与连续交互来源','output-evidence.md':'声音交付与评测来源'}[name]+'\n\n'+'\n'.join(table)+'\n\n'
root_sources=[
('语音基础体验OnePager','https://bytedance.larkoffice.com/wiki/GBcCw5c6xiWvGukPMQgcMiuKnEc','业务正文已读，资源配置段剔除'),
('多级VAD产品体验','https://bytedance.larkoffice.com/wiki/FzViwCNb2iF43QkB5eDcD3D2nJh','正文已读，旧待评审暂定规则'),
('服务端技术评审-多级VAD策略','https://bytedance.larkoffice.com/wiki/PJMUwwRCNiC2A8kjXCjcs4Bun7Y','正文已读，推荐设计不等于部署证明'),
('Context OnePage','https://bytedance.larkoffice.com/wiki/OjGMwBX8fiLS0ikDWqVceVjhnPg','正文已读，V2与V1分开'),
('SLS Context需求','https://bytedance.larkoffice.com/docx/RLW7dLbgBoc9TyxMX8hcdMddnuh','正文已读，需求不等于全车型现状'),
('语音动态VAD旧交付PRD','https://bytedance.larkoffice.com/docx/Rua6dvlehoI5uYxQYY7cjVZsnBS','正文已读，2024年方案不能覆盖新口径'),
('热词数据回流管理技术方案','https://bytedance.larkoffice.com/wiki/IMpVw1X28iDRUnkb7gUc70JYnEc','本次未取得正文'),
('S2S/语音融合方案','https://bytedance.larkoffice.com/wiki/Ai7ewOC9zi5XPTkmjjQckdNTn5c','正文已读，带日期的能力与演进方案'),
('车控不支持指令播报和车书打通','https://bytedance.larkoffice.com/wiki/SatlwpKqXiuwqnkxqplcJzjxnpe','正文已读，保留SOP与需求差别'),
('Ai汽车测试质量评测标准','https://bytedance.larkoffice.com/wiki/Ur3Zwu4LMiqatwk4xrScTwYMntV','仅返回电子表格前部片段，不引用整体成绩'),
('导航场景分析','https://bytedance.larkoffice.com/docx/U2JmdYwyGof74OxGDnBcpKHgnDf','短正文已读，用作场景分类线索')]
text+='### 识别、判停、背景与边界补读来源\n\n| 来源 | 本次状态 |\n|---|---|\n'
for title,url,status in root_sources:text+=f'| [{title}]({url}) | {status} |\n'
text+='\n完整发现清单与搜索范围记录见 [本次来源与线索清单](./语音全链路-来源与线索-v01.md)。条目仅被索引收录不等于正文已读；正文中的业务结论以以上核验来源和明确范围为依据。\n'
dest=p/'豆包汽车-语音全链路产品讲课稿-v01.md'
dest.write_text(text)
report={'title':'豆包汽车-语音全链路产品讲课稿-v01','characters':len(text),'bodyCharacters':text.index('## 原始来源、覆盖范围'),'paragraphs':len(text.split('\n\n')),'missingTerms':[x for x in ['Soft VAD','Hard VAD','二遍','ASR','partial','final','预请求','request_id','round_id','Context','音区','声学','唤醒','热词','仲裁','可见即可说','打断','恢复','TTS','焦点','历史','延时聆听'] if x not in text],'sourceFiles':[x for x in ['activation-lecture.md','input-lecture.md','routing-lecture.md','output-lecture.md','closing-lecture.md']],'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()}
(p/'publication-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
