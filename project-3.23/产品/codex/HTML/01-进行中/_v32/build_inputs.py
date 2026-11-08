import json,re,os
HTML="豆包汽车-业务学习站-v31-工作副本.html"
s=open(HTML,encoding="utf-8").read()
i=s.index("const DATA=")+len("const DATA=")
depth=0
for j in range(i,len(s)):
    if s[j]=='{': depth+=1
    elif s[j]=='}':
        depth-=1
        if depth==0: break
DATA=json.loads(s[i:j+1])

# node table
NODES={}
for m in DATA["base"]["modules"]:
    for n in m.get("nodes") or []:
        NODES[n["id"]]={"id":n["id"],"title":n["title"]}

# v15 chapters
V15=open("_feishu_fetch/lecture_style_20261030/clean/v15讲课版.md",encoding="utf-8").read()
CH={}
for part in re.split(r'(?m)^# ',V15)[1:]:
    head=part.split("\n",1)[0].strip()
    body=part.split("\n",1)[1] if "\n" in part else ""
    CH[head]=body.strip()

MAP={
 "V":["01｜声音成为正式请求"],
 "R":["02｜有效入口与端云采信"],
 "M":["03｜输入管理"],
 "C":["04｜上下文准备","N6｜Context 加工：筛选、打分、压缩"],
 "D":["05｜Director 理解与规划","N3｜介入判断与任务意图：要不要接、简单还是复杂"],
 "E":["06｜工具执行与反馈","N4｜工具使用与工具执行三类：控制、查询、复杂 Agent"],
 "O":["07｜播报、展示和真实结果","N7｜拟人对话与拟人表情动作"],
 "I":["08｜多人插话、打断与恢复"],
 "W":["09｜可见即可说"],
 "F":["10｜工具准入与单 Agent 协议","N17｜三方智能体、A2A 与 AgentCard：旧能力向子 Agent 怎样映射到今天的工具"],
 "K":["11｜身份与记忆"],
 "T":["12｜任务生命周期"],
 "G":["13｜云端触发器"],
 "L":["14｜端侧触发与本地闭环"],
 "S":["15｜主动服务与 Advisor","N2｜Always On 与 Watcher：全时观察和情境描述","N11｜Advisor Creator、动态 Advisor 与 Goals"],
 "P":["16｜场景配置平台","N11｜Advisor Creator、动态 Advisor 与 Goals"],
 "A":["17｜视觉感知","N13｜视频通话"],
 "H":["18｜静默展示与 PHUD","N8｜GUI 主交互与感知可视化"],
 "B":["19｜信号与状态","N1｜手势、动作与操作事件","N2｜Always On 与 Watcher：全时观察和情境描述"],
 "U":["20｜任务中心与卡片","N12｜手车互联：豆包空间、运营 Web、车主 App 与豆包 App 车控"],
 "DR":["N18｜司机 Agent 与舱驾融合"],
 "SE":["N19｜自进化：从专家知识到车自己学会你的习惯","N5｜反思与自我认知"],
 "EV":["N9｜基础能力：事件日志、身份记忆分层、情境模拟、知识库与工具库"],
 "EL":["N9｜基础能力：事件日志、身份记忆分层、情境模拟、知识库与工具库"],
}
SRC={x["id"]:x for x in (DATA["base"].get("sources") or [])}
for x in DATA.get("sources") or []: SRC[x["id"]]=x

for pg in DATA["pages"]:
    pid=pg["id"]
    chapters=MAP.get(pid,[])
    v15={}
    for c in chapters:
        if c in CH: v15[c]=CH[c]
        else: print("MISSING chapter",pid,c)
    teach=pg.get("teaching") or {}
    lessons=[{"id":l["id"],"title":l["title"],"paragraphs":l["paragraphs"]} for l in teach.get("lessons") or []]
    guides={k:{"title":v.get("title"),"paragraphs":v.get("paragraphs"),"sections":v.get("sections")} for k,v in (teach.get("guides") or {}).items()}
    srcs=[{"id":sid,"title":(SRC.get(sid) or {}).get("title"),"url":(SRC.get(sid) or {}).get("url")} for sid in (pg.get("sourceIds") or [])]
    bundle={
      "id":pid,"title":pg.get("title"),"summary":pg.get("summary"),"scenario":pg.get("scenario"),
      "lessons":lessons,"guides":guides,"intro":teach.get("intro"),"closing":teach.get("closing"),
      "sources":srcs,"v15_chapters":list(v15.keys()),
      "v15":v15,"node_titles":NODES
    }
    open(f"_v32/inputs/page_{pid}.json","w",encoding="utf-8").write(json.dumps(bundle,ensure_ascii=False,indent=1))
    open(f"_v32/v15/{pid}.md","w",encoding="utf-8").write("\n\n".join(f"## {k}\n\n{v}" for k,v in v15.items()))
print("pages:",len(DATA["pages"]))
