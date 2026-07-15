---
name: project_jira_panel
description: 自建 JIRA 一键流转面板(本地工具)+从上汽零束JIRA按JQL捞bug的全套方法与坑
metadata: 
  node_type: memory
  type: project
  originSessionId: 12fe38b9-7214-437b-98c6-b99d2be8af4c
---

为泽民做的**上汽零束 JIRA 自动化**（2026-07-14）。JIRA=`http://jira.z-onesoftware.com:8080`（Jira 8.20.14 Server，内网、需登录）。他的账号 `pwhcoy` = 王泽民。

**认证**：REST API 需登录态。走本机 curl（在公司内网）。认证用浏览器 Cookie 的 `JSESSIONID` 值（他 F12→Application→Cookies 复制给我）；会过期，过期后重取。PAT 也支持但他选了 Cookie。有 TRANSITION/COMMENT/ATTACHMENT/EDIT 权限。

**捞 bug**：`GET /rest/api/2/search?jql=...`。他常用 JQL = 我名下未闭环的字节责任 bug：`project in (DNA,DNAVC) AND issuetype=Bug AND status in (IN-PROGRESS,Reopened,已申请,PENDING,ANALYZING,Verifying,Repairing,DRAFT) AND "问题责任方" in (字节跳动,字节跳动-大模型) AND assignee=pwhcoy`。关键自定义字段：复现步骤=`customfield_11033`(问题初步分析和定位)、根因线索=`customfield_15367`(最新注释)、功能模块=`customfield_13903`、频次=`customfield_11032`、问题责任方=`customfield_11425`(字节跳动-大模型 id=25453)。曾对 138 条做六大类分诊(见 [[project_planner_bug_taxonomy]])：102 A推理(84 是"director未调用车控工具→假成功"同一根因)/3 B幻觉/9 C改写落域/3 E/4 D可转走/17 F可降级。产物在 `~/Desktop/3.23/planner bug/`。

**流转面板**：`~/Desktop/3.23/planner bug/jira_panel.py`（单文件 http.server，端口 8770）。解决他"流转要点三套弹窗"的痛点：左列表选单→右侧把 analyze→repair→fix 三步表单平铺、默认值预填→点提交，服务端自动依次流转 + 传复测图(附件)+ 加评论。**启动必须守护模式否则会被环境回收**：`JIRA_PANEL_DAEMON=1 JIRA_PANEL_NOOPEN=1 python3 jira_panel.py`（脚本内双fork+os.setsid脱离，PPID变1才不掉）。Cookie 存 `.jira_cookie`（勿进仓）。

**流转链三步(DRAFT→Fixed)**：analyze[id11]→ANALYZING / repair[id21]→Repairing / fix[id31]→Fixed。默认值(=他手填习惯)：长期解决措施`cf10646`=sft方案解决、目标基线`cf11475`=P、责任人`cf11018`={name:pwhcoy}、软件/零件版本`cf11030`/`cf11031`=ppe_aidv_saic_dev、日期`cf11037`/`cf11019`=当天ISO。

**大坑：隐藏必填**。这套 JIRA 的 `transitions.fields` 把必填标成"选填"，且**填完一个才暴露下一个**。analyze 实际必填：priority + Components`cf10616`(保持现值) + 问题责任方`cf11425`(现值) + **原因分析`cf10792`** + **Root Cause分类`cf11145`(用"云端问题")**。POST 用 `{transition:{id},fields:{...},update:{comment:[{add:{body}}]}}`，附件走 `POST /issue/{key}/attachments`(multipart + header `X-Atlassian-Token: no-check`)再在评论用 `!filename|thumbnail!` 引用。已实测 DNA-1835 三步全绿真实关单成功。
