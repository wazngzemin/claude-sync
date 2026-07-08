#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build an interactive single-page overview of the user's Claude Code architecture,
styled after the 'remem' dashboard. v2 — thick detail, real artifacts, relations, overview."""
import json, os, glob, time

ROOT = "/Users/bytedance/Desktop/3.23"
MEM_DIR = "/Users/bytedance/.claude/projects/-Users-bytedance-Desktop-3-23/memory"

def mtime_label(p):
    try:
        t = time.localtime(os.path.getmtime(p))
        return time.strftime("%m-%d", t)
    except Exception:
        return ""
def size_kb(p):
    try:
        return round(os.path.getsize(p)/1024)
    except Exception:
        return 0

records = []

# ============================================================ MEMORY
MEM_META = {
    "feedback_apply_user_role": ("套用 AI PM 人设", "feedback", "amber"),
    "feedback_dont_delete_user_content": ("不删用户内容", "feedback", "amber"),
    "feedback_fork_internalization_format": ("fork 内化格式", "feedback", "amber"),
    "feedback_fork_workflow": ("Fork 工作流偏好", "feedback", "amber"),
    "feedback_trigger_diagram": ("触发器图细化诉求", "feedback", "amber"),
    "project_career_embodied_ai": ("转具身智能", "project", "green"),
    "project_director_sp_groundtruth": ("Director SP 真身", "project", "green"),
    "project_planner_bug_taxonomy": ("Planner bug 六大类", "project", "green"),
    "project_signal_format_ownership": ("信号格式归属", "project", "green"),
    "project_trigger_architecture": ("端云触发器架构", "project", "green"),
    "project_trigger_system": ("触发器产品链路", "project", "green"),
    "project_video_panel": ("视频翻译面板", "project", "green"),
    "reference_config_platform": ("配置平台真实UI", "reference", "purple"),
    "reference_feishu_wiki": ("飞书 wiki tokens", "reference", "purple"),
    "user_content_creator_system": ("内容创作系统", "user", "blue"),
    "user_profile": ("用户画像 · 王泽民", "user", "blue"),
}
UPDATED = {"user_profile":"基础","user_content_creator_system":"近期","project_trigger_system":"06-15",
    "project_trigger_architecture":"06-15","project_director_sp_groundtruth":"06-12",
    "project_planner_bug_taxonomy":"06-12","project_signal_format_ownership":"06-17",
    "project_career_embodied_ai":"06","project_video_panel":"06-09","reference_config_platform":"06-15",
    "reference_feishu_wiki":"05-26","feedback_apply_user_role":"05-26","feedback_fork_workflow":"基础",
    "feedback_fork_internalization_format":"06-08","feedback_dont_delete_user_content":"06-15",
    "feedback_trigger_diagram":"06-15"}

for path in sorted(glob.glob(os.path.join(MEM_DIR, "*.md"))):
    fid = os.path.splitext(os.path.basename(path))[0]
    if fid == "MEMORY":
        continue
    raw = open(path, encoding="utf-8").read()
    body, desc, name_slug = raw, "", fid
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            fm, body = parts[1], parts[2].strip()
            for line in fm.splitlines():
                ls = line.strip()
                if ls.startswith("description:"): desc = ls.split(":",1)[1].strip().strip('"\'')
                if ls.startswith("name:"): name_slug = ls.split(":",1)[1].strip().strip('"\'')
    title, mtype, color = MEM_META.get(fid, (fid, "memory", "blue"))
    records.append({"id":fid,"category":"memory","badge":mtype.upper(),"color":color,"title":title,
        "subtitle":desc or body[:80],"scope":"global" if mtype in("user","feedback") else "project",
        "status":"active","updated":UPDATED.get(fid,""),"body":body,
        "linkKeys":[fid,name_slug,name_slug.replace("_","-"),fid.replace("_","-")],
        "metaType":mtype,"info":mtype})

# ============================================================ USER SKILLS  (full official descriptions)
SK = [
("article-forker","violet","触发: /forkit · /fork · 深度拆解文章 · 上传飞书知识库",
"把文章、随笔、转写稿、播客、thread、URL 或长文 fork 成可复用知识资产：source / concept / tool 三件套、Planner/SP/Agent 方法论产物、飞书 wiki 页、或交互式 HTML 教程。\n\n**何时用：** 用户想 fork / 深度阅读 / 逆向 / 把文章变成可复用知识。**触发：** /forkit、/fork、article-forker、fork this article、深度拆解文章、做成 source/concept/tool。\n\n**约束（来自记忆）：** 每次必须同时给 concept.md + tool.html 两份；先逐字读原文抓作者真正的 thesis（尤其反转/否定句），别套模板；深度对标 markdown-is-programming（贴真实 SP/工具/触发清单）。",
["llm-wiki-lark","graphify","reference_feishu_wiki","feedback_fork_workflow","feedback_fork_internalization_format","user_content_creator_system"]),
("graphify","violet","触发: /graphify",
"任意输入（代码、文档、论文、图像）→ 知识图谱 → 聚类社区 → 同时产出 HTML + JSON + 审计报告。\n\n**何时用：** 想把一堆素材或一段复杂内容结构化成实体-关系图、看聚类社区时。触发 /graphify。",
["article-forker"]),
("llm-wiki-lark","teal","触发: llm wiki · 知识库 · wiki ingest/query/lint/init/import",
"在飞书云盘或知识库中构建三层目录架构的 LLM 知识库。支持云盘和知识库两种存储模式。\n\n**操作：** init（初始化）/ import（素材导入）/ ingest（源文档摄入）/ query（知识查询）/ lint（健康检查）。\n\n**何时用：** 把文档/文章/笔记整理成结构化知识库，或从已建知识库检索、合成答案。本项目 wiki/ 即此方法论的本地落地。",
["article-forker","reference_feishu_wiki","claudemd_project"]),
("hv-analysis","teal","触发: 横纵分析 · 研究一下 · 深度研究 · 竞品分析",
"横纵分析法（Horizontal-Vertical Analysis）深度研究 Skill，数字生命卡兹克提出。融合索绪尔历时-共时、社会科学纵向-横截面、商学院案例研究与竞争战略。\n\n**双轴：** 纵轴追踪从诞生到当下的完整生命历程（叙事故事）；横轴在当下截面与竞品系统横向对比；交叉两轴产出独到洞察 → 精排 PDF 报告。\n\n**何时用：** 系统性研究产品/公司/概念/技术/人物。即使只说\"帮我了解一下 XX\"\"XX 是什么来头\"且需系统深研都触发。**不要用于：** 简单名词解释、公众号写作（用 khazix-writer）、标题摘要。",[]),
("deep-research","teal","触发: deep research",
"Deep research harness——扇出多源 web 搜索、抓取来源、对抗式验证 claims、合成带引用的研究报告。\n\n**何时用：** 想要深度、多源、经事实核查的研究报告。调用前若问题不够具体（如\"买什么车\"缺预算/用途/地区）先问 2-3 个澄清问题缩小范围，再把细化后的问题作 args 传入。",[]),
("khazix-writer","rose","触发: 写文章 · 写稿子 · 续写 · 公众号长文 · 出稿",
"数字生命卡兹克（Khazix）的公众号长文写作 skill。\n\n**何时用：** 撰写公众号文章、写稿、续写、根据素材产出长文。丢来 PDF/brief/新闻链接/语音转文字说\"帮我写篇文章\"也触发。**不要用于：** 短内容（小红书/推特/朋友圈）或纯标题摘要（用 wechat-title）。",
["renwei-writing","user_content_creator_system"]),
("renwei-writing","rose","触发: 打磨文案 · 润色 · 帮我改 · 人味儿 · AI 味儿",
"人味儿写作——打磨、润色、改写别人的文字时，保住文字背后那个人的存在感。\n\n**两层：** 底层原理（动不动、怎么动）+ 事后检查清单（动过的地方有没有 AI 味儿，源自 Wikipedia Signs of AI writing / blader humanizer）。\n\n**何时用：** 用户拿自己的文字要打磨/润色/精简/改写；代笔后说\"AI 味儿太重\"\"没人味儿\"的返工。**记忆约束：** 给王泽民改讲稿只清真 AI 痕迹（破折号/三段对仗/金句/拔高），其余保留、逐处交代，别删段别重构。",
["feedback_dont_delete_user_content","user_content_creator_system"]),
("any2card","rose","触发: 信息卡 · 卡片摘要 · 社交分享图 · 把链接做成卡片",
"将任意文本、网页或 URL 转成可直接发布的 HTML 信息卡片。适合把文章、线程、论文、观点、数据摘要做成适合微信、小红书、X 发布的图片卡。",
["user_content_creator_system"]),
("aihot","rose","触发: AI 日报 · AI HOT · AI 热点 · 最近 AI · 今天 AI 圈",
"AI HOT（aihot.virxact.com）中文 AI 资讯查询。直接 curl 公开 REST API 拉数据并整理成中文 markdown 简报，无需配置 API Key 或 MCP server。\n\n**何时用：** 任何中文 AI 资讯查询——今天 AI 圈有什么、AI 日报、OpenAI/Anthropic/Google 最近发布了什么、最近一周的 AI 论文。**铁律：不要 undertrigger**——用户问 AI 资讯而你不调本 Skill 就是把过时训练数据当今日新闻，对用户有害。",
["user_content_creator_system"]),
("sun","rose","触发: 用孙宇晨视角 · Justin Sun 会怎么看 · 孙哥模式",
"孙宇晨（Justin Sun）的思维框架与表达方式。基于 21,829 条推文、1 本自传、155 集音频课、40+ 篇采访、2 篇核心长访谈、2 期英文播客、太空飞行纪录，提炼 14 个核心心智模型、18 条决策启发式和完整表达 DNA。\n\n**用途：** 作思维顾问，用孙宇晨视角分析加密行业、审视商业决策、提供反馈。",[]),
("fireworks-tech-graph","blue","触发: 画图 · 架构图 · 流程图 · 可视化一下 · 出图",
"创建任意技术图（架构、数据流、流程图、时序、agent/memory、概念图）并导出 SVG + PNG。\n\n**触发：** 画图、帮我画、生成图、架构图、流程图、可视化一下、出图、generate diagram、visualize，或任何系统/流程描述想被图示化。",
["excalidraw-diagram","architecture-diagram-generator"]),
("excalidraw-diagram","blue","触发: 可视化工作流/架构/概念",
"创建 Excalidraw 图 JSON 文件，做出有视觉论点的图。用于把工作流、架构、概念可视化。",
["fireworks-tech-graph"]),
("architecture-diagram-generator","blue","技能目录内置",
"系统架构图生成器（~/.claude/skills 内）。生成系统架构/链路图。",
["fireworks-tech-graph"]),
("beautiful-feishu-whiteboard","blue","触发: 飞书白板 · infographic · 画板 · 命名风格",
"24 套精选配色风格库，从 SVG 构建美观、可编辑的飞书/Lark 白板、信息图、图表、海报或视觉讲解。\n\n**流程：** 弄清想画什么 → 问视觉氛围 → 从目录挑风格 → 生成可编辑飞书白板 → 返回文档链接和渲染图 → 可换风格。需 lark-cli（@larksuite/cli）已安装并认证 + 飞书账号。",
["reference_feishu_wiki"]),
("json-canvas","blue","触发: .canvas · 思维导图 · 流程图 · Obsidian Canvas",
"创建/编辑 JSON Canvas 文件（.canvas）：节点、边、分组、连接。用于做视觉画布、思维导图、流程图，或处理 Obsidian 中的 Canvas 文件。",
["obsidian-markdown"]),
("qiaomu-design-advisor","indigo","触发: 重新设计 · redesign · 优化界面 · UI 审查 · /design-advisor",
"偏执型设计顾问——Jobs 式产品直觉 + Rams 式功能纯粹主义。\n\n**适用：** 页面/组件重新设计、UI/UX 方案评审、交互逻辑优化、视觉系统建立、设计决策咨询、参考真实网站设计系统。\n\n**核心能力：** 设计思维方法论（如何思考/决策/交付）+ 技术执行规范（色值/间距/动画参数/AI 反套路规则）+ 58 个真实网站 DESIGN.md 设计系统参考库（Google Stitch 格式）。",[]),
("obsidian-markdown","indigo","触发: wikilink · callout · frontmatter · 标签 · embed",
"创建/编辑 Obsidian Flavored Markdown：wikilink、embed、callout、properties 及其他 Obsidian 特定语法。处理 Obsidian 的 .md 文件时用。（by kepano）",
["obsidian-bases","obsidian-cli","json-canvas"]),
("obsidian-bases","indigo","触发: .base · 表格视图 · 卡片视图 · 筛选 · 公式",
"创建/编辑 Obsidian Bases（.base 文件）：视图、筛选、公式、汇总。用于创建笔记的数据库式视图。（by kepano）",
["obsidian-markdown"]),
("obsidian-cli","indigo","触发: vault 操作 · 管理笔记 · 插件/主题开发调试",
"用 Obsidian CLI 读、建、搜、管理笔记/任务/properties。也支持插件和主题开发：重载插件、跑 JS、捕错、截图、检查 DOM。（by kepano）",
["obsidian-markdown"]),
("defuddle","teal","触发: 读这个 URL · 在线文档/文章/博客（非 .md）",
"用 Defuddle CLI 从网页提取干净 markdown，去除杂乱和导航省 token。\n\n**何时用：** 用户给 URL 让你读/分析、在线文档、文章、博客。**不要用于：** .md 结尾的 URL（已是 markdown，直接用 WebFetch）。",[]),
("storage-analyzer","slate","触发: 存储分析 · 磁盘满了 · 清理空间 · 占空间",
"macOS/Windows 只读存储分析助手（自动识别系统）。扫描整机磁盘占用，找出占空间大户，分🟢可自动清理/🟡需人工判断/🔴谨慎清理三级并给可执行处置方案，生成排版精美、可折叠、命令可一键复制的交互式 HTML 报告，可起本地服务一键删除。**扫描全程只读。**\n\n**注意：** 若用户指运行内存/RAM（进程吃内存）那是 RAM 不属本 skill。",[]),
("xiaohu-video-md","orange","触发: 视频转写 · 翻译视频 · 视频转文字 · 加字幕 · 视频转 markdown",
"视频转写与翻译：抓取字幕/音频转写 → 输出 Markdown；翻译视频 → 转写+翻译+烧录中文字幕。支持精确/快速两种转写模式。\n\n**关键：** 说\"翻译视频\"\"配字幕\"必须执行完整翻译管线（提取音频→Whisper 转写 SRT→调 subtitle-polish 翻译→烧录字幕），不能只输出文档。",
["xiaohu-subtitle-polish","xiaohu-video-download","project_video_panel"]),
("xiaohu-video-download","orange","触发: 下载视频 · 下载音频 · 下载播放列表 · 烧录字幕",
"视频下载工具：下载视频和外挂字幕、仅下载音频、批量下载播放列表、为本地视频烧录中文字幕。支持字幕翻译。基于 yt-dlp。",
["xiaohu-video-md","project_video_panel"]),
("xiaohu-subtitle-polish","orange","触发: 润色字幕 · 翻译字幕 · 字幕校对 · SRT 翻译",
"专业字幕润色：将 ASR 转写或外语字幕翻译润色为高质量简体中文字幕。修正识别错误、优化断句、严格对齐时间戳、符合当代中文表达习惯。",
["xiaohu-video-md"]),
("baoyu-skills","slate","技能包（目录）",
"baoyu（宝玉）系列技能合集，以目录形式存放于 ~/.claude/skills/baoyu-skills。",[]),
("khazix-skills","slate","技能包（目录）",
"khazix（卡兹克）系列技能合集，以目录形式存放于 ~/.claude/skills/khazix-skills。",["khazix-writer"]),
]
for name,color,trig,body,rel in SK:
    records.append({"id":"skill_"+name,"category":"skill","badge":"SKILL","color":color,"title":name,
        "subtitle":trig,"scope":"global","status":"active","updated":"",
        "body":"**"+trig+"**\n\n"+body,"related":["skill_"+r if r in [s[0] for s in SK] else r for r in rel],
        "metaType":"skill","info":"slash/语义触发"})

# ============================================================ BUILT-IN / PLUGIN SKILLS
BI = [
("code-review","审查当前 diff 的正确性 bug 与复用/简化/效率清理项，按 effort 分级（low/medium 少而高置信，high→max 更广可含不确定项）。`--comment` 把发现作为 PR 行内评论发出，`--fix` 审完直接改工作树。"),
("simplify","审查改动的复用、简化、效率、抽象层级清理项并应用修复。**仅质量**，不找 bug（找 bug 用 /code-review）。"),
("verify","通过运行 app 观察行为来验证改动确实做到该做的。用于验 PR、确认修复生效、手动测试改动、推送前验证本地改动。"),
("run","启动并驱动本项目的 app 看改动真实运行。用于跑/启动/截图 app，或确认改动在真实 app（非仅测试）中工作。先找项目已有的启动 skill，否则按项目类型（CLI/server/TUI/Electron/browser/library）回退内置模式。"),
("init","初始化新的 CLAUDE.md，写入代码库说明文档。"),
("review","审查一个 pull request。"),
("security-review","对当前分支的待提交改动做完整安全审查。"),
("update-config","通过 settings.json 配置 Claude Code harness。自动化行为（\"从今往后每当 X\"\"每次 X\"\"X 之前/之后\"）需在 settings.json 配 hook——harness 执行而非 Claude，故记忆/偏好无法实现这类。也用于：权限（allow X/加权限/移权限）、env 变量、hook 排障、settings.json 改动。"),
("keybindings-help","自定义键盘快捷键、重绑键、加 chord 绑定、改 ~/.claude/keybindings.json。"),
("fewer-permission-prompts","扫描 transcript 找高频只读 Bash 和 MCP 调用，把优先级 allowlist 加到项目 .claude/settings.json 以减少权限弹窗。"),
("loop","按周期重复运行某 prompt 或 slash 命令（如 /loop 5m /foo，默认 10m）。用于设置周期任务、轮询状态、定时重复跑某事。一次性任务不要用。"),
("claude-api","Claude API / Anthropic SDK 参考：模型 id、定价、参数、流式、tool use、MCP、agents、缓存、token 计数、模型迁移。命中触发（Claude/Anthropic/Fable/Opus/Sonnet/Haiku/claude-* 等）时先读再答，绝不凭记忆。"),
("claude-hud:setup","把 claude-hud 配置为你的状态栏 statusline。"),
("claude-hud:configure","配置 HUD 显示选项（布局/语言/预设/显示元素），同时保留高级手动覆盖。"),
]
for name,body in BI:
    records.append({"id":"builtin_"+name,"category":"builtin","badge":"BUILTIN","color":"gray","title":name,
        "subtitle":body[:74],"scope":"global","status":"active","updated":"","body":body,
        "metaType":"builtin","info":"内置/插件"})

# ============================================================ SUBAGENTS
AG = [
("claude","默认万能 agent · 工具全部(*)",
"FleetView 的默认子智能体，不指定 agent 名时使用。\n\n**工具集：** 全部（*）——可读写文件、跑命令、调 MCP、起子 agent。\n\n**何时用：** 任何不匹配更专门 agent 的任务的兜底。"),
("claude-code-guide","Claude Code 答疑 · 工具 Bash/Read/WebFetch/WebSearch",
"回答关于 Claude Code CLI（功能/hooks/slash 命令/MCP server/settings/IDE 集成/键位）、Claude Agent SDK（自建 agent）、Claude API（tool use/SDK 用法）的问题。\n\n**工具集：** Bash, Read, WebFetch, WebSearch。\n\n**提示：** 起新 agent 前先看有没有在跑/刚完成的同类 agent 可经 SendMessage 续。"),
("Explore","只读广度搜索 · 工具 除 Agent/Edit/Write/NotebookEdit/ExitPlanMode 外全部",
"只读搜索 agent，做广度扇出搜索——当回答意味着横扫大量文件/目录/命名约定、只要结论不要文件堆。读摘录而非整文件，所以它**定位**代码，不**审查/审计**。\n\n**工具集：** 除 Agent、ExitPlanMode、Edit、Write、NotebookEdit 外全部。\n\n**用法：** 指定搜索广度——\"medium\" 适度探索，\"very thorough\" 多位置多命名约定。"),
("general-purpose","通用研究 agent · 工具全部(*)",
"通用 agent，研究复杂问题、搜代码、执行多步任务。当你搜关键词或文件、不确定头几次能否命中时，用它代你搜。\n\n**工具集：** 全部（*）。"),
("Plan","软件架构师 agent · 工具 除 Agent/Edit/Write/NotebookEdit/ExitPlanMode 外全部",
"软件架构师 agent，设计实现方案。需要为一个任务规划实现策略时用。\n\n**返回：** 分步计划、识别关键文件、考虑架构权衡。\n\n**工具集：** 除 Agent、ExitPlanMode、Edit、Write、NotebookEdit 外全部。"),
("statusline-setup","状态栏配置 agent · 工具 Read/Edit",
"配置用户的 Claude Code status line 设置。\n\n**工具集：** Read, Edit。"),
]
for name,sub,body in AG:
    records.append({"id":"agent_"+name,"category":"subagent","badge":"AGENT","color":"indigo","title":name,
        "subtitle":sub,"scope":"global","status":"active","updated":"","body":body,
        "metaType":"subagent","info":"子智能体"})

# ============================================================ WORKFLOW
records.append({"id":"workflow","category":"workflow","badge":"ORCHESTRATION","color":"pink",
    "title":"Workflow 多智能体编排","subtitle":"用 JS 脚本确定性地编排几十个子智能体：fan-out / pipeline / parallel",
    "scope":"global","status":"available","updated":"","info":"编排能力","related":["agent_claude","agent_Explore","agent_general-purpose"],
    "body":("用 JS 脚本**确定性**地编排多个子智能体——为了**全面**（分解并行覆盖）、**可信**（独立视角 + 对抗校验再落地）、或承载单上下文装不下的**规模**（迁移/审计/大扫荡）。脚本是你编码这种结构的地方：什么扇出、什么验证、什么综合。\n\n"
        "## 核心原语\n"
        "- `agent(prompt, opts)` — 起一个子智能体；带 `schema` 时强制结构化输出并校验返回。`opts`：label/phase/model/isolation:'worktree'/agentType。\n"
        "- `pipeline(items, ...stages)` — 每项独立流过所有阶段，**阶段间无栅栏**（默认）。墙钟 = 最慢单项链，不是每阶段最慢之和。\n"
        "- `parallel(thunks)` — 并发跑，**栅栏**等全部完成。只在确实需要所有结果一起时用。\n"
        "- `phase / log / budget / workflow()` — 进度分组、narrator 行、token 预算（\"+500k\"硬上限）、嵌套子工作流（一层）。\n\n"
        "## 常用质量模式\n"
        "对抗式验证（N 个独立 skeptic 各自试图 refute）、视角多样化验证（correctness/security/repro 不同 lens）、评委面板、loop-until-dry（连续 K 轮无新增才停）、多模态扫荡、完整性批评家、无静默截断（截断要 log）。\n\n"
        "## 限制\n"
        "并发上限 min(16, 核数-2)，单次 lifetime 上限 1000 agent，单次 parallel/pipeline ≤4096 项。`Date.now()`/`Math.random()` 在脚本里会抛错（破坏 resume）。**仅在用户显式 opt-in（ultracode / 明确要求工作流）时调用。**")})

# ============================================================ MCP SERVERS
records.append({"id":"mcp_obsidian","category":"mcp","badge":"MCP","color":"teal","title":"obsidian",
    "subtitle":"≈140 工具 · 项目级 · Obsidian vault 全功能操作","scope":"project","status":"active","updated":"",
    "metaType":"mcp","info":"≈140 工具","related":["skill_obsidian-markdown","skill_obsidian-cli","skill_obsidian-bases","skill_json-canvas"],
    "body":("Obsidian vault 全功能操作（项目级 MCP，在 `/Users/bytedance/Desktop/3.23` 启用）。约 140 个工具，按功能分组：\n\n"
        "## 笔记 CRUD\n"
        "- read_note / update_note / append_to_note / rename_note / move_note / delete_note / duplicate_note\n"
        "- create_daily_note / create_meeting_note / create_person_note / create_project_note / create_task_note / create_book_note / create_moc\n"
        "- update_frontmatter_field / batch_update_metadata / rename_property_globally / convert_to_callout / split_note_by_headings\n\n"
        "## 搜索 / 检索\n"
        "- search_notes / search_regex / search_in_frontmatter / search_by_date / search_by_link_type / search_by_word_count\n"
        "- find_similar_notes / find_duplicate_notes / find_note_clusters / suggest_links / suggest_tags\n\n"
        "## 知识图谱\n"
        "- generate_graph_data / link_graph / find_backlinks / extract_links / get_shortest_path\n"
        "- calculate_note_centrality / most_connected_notes / note_complexity / find_isolated_notes\n\n"
        "## Canvas / Bases / Dataview\n"
        "- create_canvas / add_card_to_canvas / add_connection_to_canvas / create_canvas_group / read_canvas / update_canvas_card\n"
        "- execute_dataview_query / create_dataview_codeblock / validate_dataview_query / create_mermaid_diagram / create_math_block\n\n"
        "## 任务\n"
        "- get_tasks_by_criteria / mark_task_complete / find_blocked_tasks / move_task_between_notes / tasks_by_tag\n"
        "- task_statistics / create_task_report / extract_all_todos / add_task_metadata\n\n"
        "## 导出\n"
        "- export_note_pdf / export_note_html / export_note_markdown / export_note_plaintext\n"
        "- export_vault_archive / export_vault_csv / export_vault_json / export_vault_pdf / export_vault_markdown_bundle\n\n"
        "## 健康 / 维护\n"
        "- analyze_vault_health / broken_links / cleanup_broken_references / find_orphaned_notes / find_orphaned_attachments\n"
        "- find_empty_notes / find_large_notes / find_untagged_notes / vault_stats / vault_timeline / backup_vault / list_backups")})
records.append({"id":"mcp_screenshot","category":"mcp","badge":"MCP","color":"teal","title":"screenshot",
    "subtitle":"5 工具 · 项目级 · 屏幕/窗口截图","scope":"project","status":"active","updated":"","metaType":"mcp","info":"5 工具",
    "body":("屏幕/窗口截图 MCP（项目级）。\n\n## 工具\n- `list_displays` — 列所有显示器（ID/名称/主屏/边界）\n- `list_windows` — 列所有窗口\n- `screenshot_screen` — 截整屏（可指定 display_id / save_dir）\n- `screenshot_region` — 截指定区域\n- `screenshot_window` — 截指定窗口\n\n**本次会话**就是用 `screenshot_screen` 截图验证这个架构页渲染效果的。")})
records.append({"id":"mcp_fetch","category":"mcp","badge":"MCP","color":"teal","title":"fetch",
    "subtitle":"1 工具 · 项目级 · 网页抓取","scope":"project","status":"active","updated":"","metaType":"mcp","info":"1 工具",
    "body":"网页抓取 MCP（项目级）。\n\n## 工具\n- `mcp__fetch__fetch` — 拉取 URL 内容。\n\n与 defuddle skill / WebFetch 工具互补。",
    "related":["skill_defuddle"]})
for name,sub,tools in [
    ("Gmail","claude.ai 连接器 · OAuth 授权","authenticate / complete_authentication（授权后开放邮件读写工具）"),
    ("Google Calendar","claude.ai 连接器 · OAuth 授权","authenticate / complete_authentication（授权后开放日历工具）"),
    ("Google Drive","claude.ai 连接器 · OAuth 授权","search_files / list_recent_files / read_file_content / download_file_content / create_file / copy_file / get_file_metadata / get_file_permissions"),
]:
    records.append({"id":"mcp_"+name.replace(" ","_"),"category":"mcp","badge":"MCP","color":"slate","title":name,
        "subtitle":sub,"scope":"global","status":"auth","updated":"","metaType":"mcp","info":"连接器",
        "body":("claude.ai "+name+" 连接器（需先 authenticate / complete_authentication 授权）。\n\n## 工具\n- "+tools+"\n\n**注意：** 交互式认证的 MCP 在 headless/cron 运行下可能不可用。")})

# ============================================================ PLUGINS
records.append({"id":"plugin_claude-hud","category":"plugin","badge":"PLUGIN","color":"pink","title":"claude-hud",
    "subtitle":"状态栏 HUD · marketplace: github jarrodwatts/claude-hud · 已启用","scope":"global","status":"enabled",
    "updated":"","metaType":"plugin","info":"已启用","related":["builtin_claude-hud:setup","builtin_claude-hud:configure","set_statusLine"],
    "body":("已启用插件。来源 marketplace `claude-hud` → github `jarrodwatts/claude-hud`。\n\n"
        "## 工作方式\n通过 settings.json 的 `statusLine.command`，用 bun 运行插件的 `src/index.ts` 渲染状态栏；脚本会探测终端 COLUMNS 宽度并自动选最新版本目录。\n\n"
        "## 配套技能\n- `claude-hud:setup` — 配为 statusline\n- `claude-hud:configure` — 布局/语言/预设/显示元素")})

# ============================================================ SETTINGS
SET = [
("set_API_TIMEOUT_MS","env · API_TIMEOUT_MS = 3000000","`3000000` ms ≈ 50 分钟。把单次请求超时拉到极长，支撑长任务、大上下文（1M）、多轮工作流调用不被中途掐断。"),
("set_NONESSENTIAL","env · CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = 1","`1` 关闭非必要遥测/后台流量，降低网络打扰与开销。"),
("set_statusLine","statusLine · command（bun + claude-hud）","状态栏用一段 bash 命令：探测 `stty size` 得到列宽并 `export COLUMNS`，再用 `/Users/bytedance/.bun/bin/bun` 运行 claude-hud 插件最新版本目录下的 `src/index.ts`。type=command。"),
("set_enabledPlugins","enabledPlugins · claude-hud@claude-hud = true","启用 claude-hud。`extraKnownMarketplaces` 注册了 marketplace `claude-hud`（source: github，repo: jarrodwatts/claude-hud）。"),
("set_skipDangerous","skipDangerousModePermissionPrompt = true","跳过危险模式权限弹窗（已durably授权，少打断）。"),
("set_skipWorkflow","skipWorkflowUsageWarning = true","跳过工作流用量警告。"),
]
for sid,name,body in SET:
    records.append({"id":sid,"category":"settings","badge":"SETTING","color":"slate","title":name,
        "subtitle":body[:74],"scope":"global","status":"active","updated":"","body":body,
        "metaType":"settings","info":"settings.json"})

# ============================================================ CLAUDE.md + structure
records.append({"id":"claudemd_global","category":"config","badge":"CLAUDE.md","color":"dark",
    "title":"全局指令 (~/.claude/CLAUDE.md)","subtitle":"对所有项目生效的技能注册与 slash 触发硬绑定",
    "scope":"global","status":"active","updated":"","metaType":"config","info":"全局",
    "related":["skill_article-forker","skill_graphify","skill_obsidian-markdown","skill_defuddle"],
    "body":("**全局私有指令，覆盖默认行为，必须严格遵守。** 把核心技能的 slash 触发词硬绑定到 Skill 工具调用：\n\n"
        "## article-forker\n`~/.claude/skills/article-forker/SKILL.md` — fork 文章成 tutorial/tool/wiki。**用户输入 `/forkit` → 先调 Skill 工具再做任何事。**\n\n"
        "## graphify\n`~/.claude/skills/graphify/SKILL.md` — 任意输入 → 知识图谱。触发 `/graphify`。\n\n"
        "## Obsidian 技能组（by kepano）\nobsidian-markdown / obsidian-bases / json-canvas / obsidian-cli / defuddle —— 各自处理 OFM 语法、Bases、Canvas、CLI、网页提取。\n\n"
        "**作用：** 确保命中 slash 即先执行对应技能，而不是凭默认行为乱答。")})
records.append({"id":"claudemd_project","category":"config","badge":"CLAUDE.md","color":"dark",
    "title":"项目 Schema (.claude/CLAUDE.md)","subtitle":"Karpathy LLM Wiki 方法论 + Driver Agent 2.0 Planner 领域知识（完整）",
    "scope":"project","status":"active","updated":"","metaType":"config","info":"项目 Schema",
    "related":["claudemd_global","config_structure","skill_llm-wiki-lark","project_director_sp_groundtruth","claudemd_funnel"],
    "body":("**字节豆包上车（Driver Agent 2.0）智能座舱产品知识库**，Karpathy LLM Wiki 方法论维护。用户是 Planner 模块 AI PM。\n\n"
        "## 系统定位\n豆包上车搭载在上汽荣威 D6X。Planner 是系统\"大脑\"——不直接控车，而是理解意图 → 制定计划 → 调度下游 Agent 执行 → 跟踪进度反馈。底层模型豆包 Seed 1.8，云端部署。\n\n"
        "## 三层漏斗架构\n用户语音→ASR → ①句法 RAG（毫秒级·规则匹配·\"打开车窗\"）→ ②情景 RAG + 仲裁模型（注入记忆/车况/情景，简单/复杂分流）→ ③Planner（云端 LLM 深度推理·多步规划·多工具）→ 下游 Agent 执行返回 tool_feedback。\n\n"
        "## Planner 单次调用 = [SP, UP]\n**SP（~30-35K token）：** ①角色 ②输入类型 ③23工具定义 ④输出格式 ⑤10条注意事项 ⑥69个参考示例(约占SP 50%) ⑦D6X设备知识 ⑧工具tips ⑨其他知识 ⑩聊天风格(温柔高知女生) ⑪动态模板变量{{status}}{{goal_list}}{{env_info}}{{memory}}。\n**UP（~10-15K token）：** 最近 N 轮 user/assistant 交替历史 + 当前轮（用户 query + advisor 建议，数组同传）。user 侧三形态：用户query(speaker_name/position/timestamp/goal_list/env_info)、advisor建议、tool_feedback。\n\n"
        "## 23 个下游工具\n⚠ 真实生产 SP 已演进到 26/28（见记忆 Director SP 真身）。CLAUDE.md 原列：vehicle_basic_control / search_vehicle_status_info / search_weather / search_poi_qa / route_planning_qa / navi_basic_control / vehicle_manual_qa / search_and_control_short_video / search_and_control_music / search_user_memory / face_id_register / operate_user_memory / web_search / goal_list_update / ai_broadcast_generate / search_and_control_broadcast / recording_minutes / image_generate / search_visual_info / ambient_light_control / auto_drive / car_log / car_care_qa\n\n"
        "## 四种任务类型\n单步复杂（一句话拆多动作并行·S7）/ 多步串行依赖（S8）/ 条件触发（S8）/ 持续运行（S9-S10）。\n\n"
        "## 缓存机制\nKV Cache 输入前缀完全匹配复用；同请求多轮复用前序全部 token 的 KV 只算增量（几百 token）；跨请求仅 SP 固定段(~30K)可命中，动态变量不同则断裂；长对话>20轮 KV 占用大易被挤出，命中率下降。\n\n"
        "## 上下文优化（远区精简+近区完整）\n远区(1-8轮)只留 user query + talk_content，删 tool_feedback/action_list；近区(9-10轮)完整。省对话历史 40-70% token，总 input 减~10%，因 Attention O(n²) 实际算力减~19%。\n\n"
        "## Goal List + Advisor 演进\n从\"Planner 一人包揽\"→\"团队协作\"：Planner 管快速响应+执行，4 个静态 Advisor（舒适/出行/情感/内容）+ 动态 Advisor 管深度思考+目标监控，Goal List 为共享看板。\n\n"
        "## Badcase 排查路径\n链路问题（走错模块）→ 工具描述问题（SP 工具定义不清）→ 上下文问题（缺记忆/车况/情景）→ 模型能力问题（信息全但推理错）。\n\n"
        "## 已知挑战\n任务拆解不稳定 / 简单复杂误分类 / 长对话上下文捕捉弱 / 车控幻觉 / 话术生硬 / Planner 过载 / 性能 vs 质量矛盾。\n\n"
        "## Wiki 三种操作 + 规范\nIngest（摄入→summaries→entities→concepts→更新 index/log）/ Query（查询→必要时建 comparison）/ Lint（frontmatter/index/孤立页/归档）。命名：小写英文+连字符。Frontmatter 必填 title/date/tags/sources/status。raw/ 不可变铁律：LLM 绝不修改、只追加。log.md append-only。")})
records.append({"id":"config_structure","category":"config","badge":"STRUCTURE","color":"dark",
    "title":"项目三层目录结构","subtitle":"raw（原始·只读）→ wiki（LLM 维护）→ .claude（Schema）",
    "scope":"project","status":"active","updated":"","metaType":"config","info":"目录结构","related":["claudemd_project"],
    "body":("```\nraw/                第1层 原始素材（不可变·LLM 只读）\n├── assets/          图片附件\n└── articles/        文章/网页剪藏\n\n"
        "wiki/               第2层 Wiki 层（LLM 生成维护）\n├── index.md         内容索引\n├── log.md           append-only 操作日志\n├── entities/        实体页（人物/组织/工具/产品）\n├── concepts/        概念页（抽象概念/方法论/框架）\n├── comparisons/     对比分析（A vs B）\n├── summaries/       源文件摘要\n└── synthesis/       跨素材综合\n\n"
        ".claude/CLAUDE.md   第3层 Schema（领域知识 + 维护规则）\n```\n\n"
        "**标签体系：** entity / concept / comparison / summary / synthesis / technology / product / methodology / meeting / architecture。")})

# ============================================================ ARTIFACTS (auto-scan real files)
EXCLUDE = ["bak","备份","副本","before-deep-rewrite",".~","backup","局部框版"]
def included(fn):
    low = fn.lower()
    for e in EXCLUDE:
        if e.lower() in low: return False
    return fn.lower().endswith((".html",".pdf",".md"))

NOTES = {
 "触发器需求-全链路详解.html":"最全·主文档：13 条需求 + 词典 + 交付物规格。触发器全貌的权威说明。",
 "触发器流程图-评审讲解稿.html":"评审讲解稿单一合并版：大图 + 开场 + 主持人分段第一~十二段（内嵌 15/24 原子·VLM 精讲）+ 谁写代码 + 结语。",
 "触发器-业务流程-全模块大图-v2.html":"30 节点全模块业务流程大图 v2（4 路径分色 + 15/24 拆原子）。",
 "触发器接口文档【对外】.html":"对外接口文档（DSL 字段需逐字核对）。",
 "触发器 DSL 定义【对外】.html":"对外 DSL 定义。",
 "触发器Planner转具身智能_能力迁移图谱.html":"职业判断框架图：Planner+触发器 = 具身\"认知脑\"上半身，PM/LLM 转具身的标准入口。",
 "全量Bug逐例详细分析_Planner-Director_20260612.html":"33 个 case 逐例详细分析（六大类 A-F 分诊）。",
 "全量Bug聚合分析报告_Planner-Director_20260612.html":"全量 Bug 聚合分析报告（真该 Planner 修约 17 个、纯顽固 3-4 个）。",
 "系统大图_Planner-Director_深度版_20260612.html":"系统大图深度版：含 L0-L6 解法 + RACI + 物料库。",
 "流程图_Planner-Director_Bug全景_20260612.html":"Planner-Director Bug 全景流程图。",
 "planner_round4_SP真身逐行解剖.html":"陪读 round4：真实 SP 逐行解剖。",
 "planner_MASTER_全景骨架与细节.html":"Planner 全景骨架与细节 MASTER 总图。",
 "对话推理引擎(Director) PRD.html":"Director（=Planner）产品需求文档。",
 "行动指南.html":"触发器本周行动指南 + 9 图。",
 "DNA-616-动态advisor二期-内审分析与待办.md":"DNA-616 动态 Advisor 二期内审分析与待办（泽民被点名）。",
 "动态advisor-感知订阅【技术设计】.html":"动态 Advisor 感知订阅技术设计。",
}
ARTIFACT_DIRS = [
 ("planner 架构","Planner 架构","blue"),
 ("产品-端侧触发器","触发器","teal"),
 ("advisor 架构","Advisor 架构","indigo"),
 ("reqs","触发器","teal"),
 ("产品-培训资料","培训资料","orange"),
]
def add_artifact(full, rel, group, color):
    fn = os.path.basename(full)
    note = NOTES.get(fn,"")
    ext = fn.rsplit(".",1)[-1].upper()
    body = ("**所属：** "+group+"\n\n**路径：** `"+rel+"`\n\n**类型：** "+ext+" · **大小：** "+str(size_kb(full))+" KB · **更新：** "+mtime_label(full)+"\n\n"
            +(note+"\n\n" if note else "")
            +"**打开：** 在 Finder 双击，或浏览器打开本地文件路径。")
    records.append({"id":"art_"+str(len(records)),"category":"artifact","badge":ext,"color":color,
        "title":fn.rsplit(".",1)[0],"subtitle":(note or (group+" · "+ext))[:90],"scope":"project",
        "status":"file","updated":mtime_label(full),"body":body,"metaType":group,"info":ext+" · "+str(size_kb(full))+"KB"})
for d,group,color in ARTIFACT_DIRS:
    base = os.path.join(ROOT,d)
    if not os.path.isdir(base): continue
    for fn in sorted(os.listdir(base)):
        full = os.path.join(base,fn)
        if os.path.isfile(full) and included(fn):
            add_artifact(full, d+"/"+fn, group, color)
# wiki pages
for sub,grp in [("concepts","Wiki·概念"),("summaries","Wiki·摘要"),("synthesis","Wiki·综合")]:
    base = os.path.join(ROOT,"wiki",sub)
    if not os.path.isdir(base): continue
    for fn in sorted(os.listdir(base)):
        full = os.path.join(base,fn)
        if os.path.isfile(full) and fn.lower().endswith((".md",".html")) and included(fn):
            add_artifact(full, "wiki/"+sub+"/"+fn, grp, "purple")
# root-level finished docs
for fn in sorted(os.listdir(ROOT)):
    full = os.path.join(ROOT,fn)
    if os.path.isfile(full) and included(fn) and fn.lower().endswith((".html",)):
        add_artifact(full, fn, "根目录·成品", "slate")

# ============================================================ counts + emit
from collections import Counter
cat_counts = Counter(r["category"] for r in records)
DATA = json.dumps({"records":records,"counts":dict(cat_counts)}, ensure_ascii=False)

HTML = r"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Claude Code · 架构概览</title>
<style>
:root{--bg:#fff;--panel:#fafafa;--line:#ececec;--line2:#f2f2f2;--tx:#1c1c1e;--tx2:#6b6b70;--tx3:#9a9aa0;
--accent:#111;--hov:#f6f6f6;--chip:#f3f3f4;
--green:#16a34a;--greenbg:#e7f6ec;--blue:#2563eb;--bluebg:#e7eefc;--gray:#6b7280;--graybg:#eef0f2;
--red:#dc2626;--redbg:#fbe9e9;--purple:#7c3aed;--purplebg:#f0e9fc;--amber:#b45309;--amberbg:#fbf0dd;
--teal:#0d9488;--tealbg:#dcf3f0;--indigo:#4f46e5;--indigobg:#e8e7fb;--pink:#db2777;--pinkbg:#fbe6f1;
--slate:#475569;--slatebg:#eaeef2;--violet:#7c3aed;--violetbg:#f0e9fc;--rose:#e11d48;--rosebg:#fce7ec;
--orange:#ea580c;--orangebg:#fdecdf;--dark:#111827;--darkbg:#e8e9eb;}
.dark{--bg:#0f0f10;--panel:#161617;--line:#262628;--line2:#1f1f21;--tx:#ececee;--tx2:#9a9aa2;--tx3:#6b6b72;
--accent:#fff;--hov:#1b1b1d;--chip:#222224;--greenbg:#16331f;--bluebg:#162236;--graybg:#26282c;--redbg:#371a1a;
--purplebg:#251a3a;--amberbg:#352616;--tealbg:#0f2e2b;--indigobg:#1d1c36;--pinkbg:#34162a;--slatebg:#22282f;
--violetbg:#251a3a;--rosebg:#34161f;--orangebg:#3a2413;--darkbg:#22242a;}
*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%}
body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Segoe UI",sans-serif;
background:var(--bg);color:var(--tx);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
.app{display:flex;height:100vh;overflow:hidden}
.topbar{position:fixed;top:0;left:0;right:0;height:52px;display:flex;align-items:center;padding:0 22px;
border-bottom:1px solid var(--line);background:var(--bg);z-index:30}
.logo{width:26px;height:26px;border-radius:7px;background:var(--accent);color:var(--bg);display:flex;
align-items:center;justify-content:center;font-weight:700;font-size:13px;margin-right:10px}
.brand{font-weight:650;letter-spacing:-.2px}.crumb{color:var(--tx3);margin:0 10px}.crumb-cur{color:var(--tx2)}
.topright{margin-left:auto;display:flex;align-items:center;gap:16px;color:var(--tx2);font-size:12.5px}
.dotok{width:7px;height:7px;border-radius:50%;background:#22c55e;display:inline-block;margin-right:6px;box-shadow:0 0 0 3px rgba(34,197,94,.15)}
.iconbtn{cursor:pointer;color:var(--tx2);font-size:15px;background:none;border:none;padding:4px;border-radius:6px}
.iconbtn:hover{background:var(--hov);color:var(--tx)}
.side{width:230px;flex:0 0 230px;border-right:1px solid var(--line);background:var(--panel);padding:64px 12px 20px;overflow-y:auto}
.wkspace{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--line);border-radius:9px;
background:var(--bg);font-size:12.5px;color:var(--tx2);margin-bottom:16px}.wkspace .t{font-weight:600;color:var(--tx)}
.sec-h{font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.5px;padding:0 10px;margin:15px 0 5px}
.navitem{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:8px;cursor:pointer;color:var(--tx2);
font-size:13.5px;margin-bottom:1px;user-select:none}.navitem:hover{background:var(--hov);color:var(--tx)}
.navitem.on{background:var(--chip);color:var(--tx);font-weight:550}.navitem .ic{width:17px;text-align:center;opacity:.85}
.navitem .ct{margin-left:auto;font-size:12px;color:var(--tx3);font-variant-numeric:tabular-nums}.navitem.on .ct{color:var(--tx2)}
.main{flex:1;overflow-y:auto;padding:64px 30px 40px}
.h-title{font-size:27px;font-weight:700;letter-spacing:-.6px;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
.h-stats{font-size:13px;color:var(--tx2);font-weight:400}.h-stats b{color:var(--tx);font-weight:600}
.h-sub{color:var(--tx2);margin-top:7px;font-size:13.5px;max-width:820px}
/* overview */
.ov{border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin:18px 0 6px;background:var(--panel)}
.ov-head{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none}
.ov-head h3{font-size:14.5px;font-weight:700}.ov-head .tg{margin-left:auto;color:var(--tx3);font-size:12px}
.ov-body{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:22px}
@media(max-width:1080px){.ov-body{grid-template-columns:1fr}}
.ov h4{font-size:12px;color:var(--tx3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px;font-weight:600}
.funnel{display:flex;flex-direction:column;gap:7px}
.fstep{display:flex;align-items:center;gap:10px}
.fbox{flex:1;border:1px solid var(--line);border-radius:9px;padding:9px 12px;background:var(--bg);font-size:12.5px}
.fbox b{font-weight:650}.fbox .d{color:var(--tx2);font-size:11.5px;margin-top:2px}
.fnum{width:22px;height:22px;border-radius:6px;background:var(--accent);color:var(--bg);display:flex;align-items:center;
justify-content:center;font-size:11px;font-weight:700;flex:0 0 22px}
.farr{text-align:center;color:var(--tx3);font-size:11px;line-height:1}
.stack{display:flex;flex-direction:column;gap:9px}
.slayer{border:1px solid var(--line);border-radius:9px;padding:10px 12px;background:var(--bg)}
.slayer .lt{font-size:12.5px;font-weight:650;margin-bottom:5px;display:flex;align-items:center;gap:7px}
.slayer .pill{display:inline-block;font-size:11px;padding:2px 8px;border-radius:6px;margin:2px 4px 0 0}
.toolbar{display:flex;align-items:center;gap:10px;margin:18px 0 12px;flex-wrap:wrap}
.search{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid var(--line);
border-radius:10px;background:var(--panel)}.search input{flex:1;border:none;background:none;outline:none;color:var(--tx);font-size:13.5px}
.search .kbd{font-size:11px;color:var(--tx3);border:1px solid var(--line);border-radius:5px;padding:1px 6px}
.chip{padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--tx2);
font-size:12.5px;cursor:pointer;white-space:nowrap}.chip:hover{background:var(--hov)}
.chip.on{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.viewtog{display:flex;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.viewtog button{border:none;background:var(--panel);padding:7px 11px;cursor:pointer;color:var(--tx2);font-size:13px}
.viewtog button.on{background:var(--chip);color:var(--tx)}
.thead{display:grid;grid-template-columns:26px 158px 1fr 116px 96px 84px 64px;gap:12px;padding:10px 14px;
border-bottom:1.5px solid var(--line);color:var(--tx3);font-size:11.5px;font-weight:600;text-transform:uppercase;
letter-spacing:.4px;position:sticky;top:0;background:var(--bg);z-index:5}
.row{display:grid;grid-template-columns:26px 158px 1fr 116px 96px 84px 64px;gap:12px;padding:12px 14px;
border-bottom:1px solid var(--line2);cursor:pointer;align-items:center}
.row:hover{background:var(--hov)}
.exp{color:var(--tx3);font-size:11px;transition:.15s;text-align:center}.exp.open{transform:rotate(90deg);color:var(--tx)}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;
letter-spacing:.2px;white-space:nowrap}.badge::before{content:"";width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.9}
.cell-title{min-width:0}.cell-title .t{font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cell-title .s{color:var(--tx2);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.muted{color:var(--tx2);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.status{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--tx2)}
.status::before{content:"";width:6px;height:6px;border-radius:50%;background:#22c55e}
.status.auth::before{background:#f59e0b}.status.avail::before{background:#3b82f6}.status.file::before{background:#a78bfa}
.upd{color:var(--tx3);font-size:12px;text-align:right}
.inline-prev{grid-column:1/-1;background:var(--panel);border:1px solid var(--line);border-radius:10px;
margin:2px 0 8px;padding:14px 16px;font-size:13px;color:var(--tx2);line-height:1.65}
.inline-prev .more{color:var(--blue);cursor:pointer;font-size:12.5px;margin-top:8px;display:inline-block}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:13px}
.card{border:1px solid var(--line);border-radius:13px;padding:15px;cursor:pointer;background:var(--panel);transition:.12s}
.card:hover{background:var(--hov);border-color:var(--tx3);transform:translateY(-1px)}
.card .ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.card .t{font-weight:650;font-size:14.5px;margin-bottom:6px}
.card .s{color:var(--tx2);font-size:12.5px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card .cf{display:flex;align-items:center;gap:8px;margin-top:11px;color:var(--tx3);font-size:11.5px;flex-wrap:wrap}
.c-green{color:var(--green);background:var(--greenbg)}.c-blue{color:var(--blue);background:var(--bluebg)}
.c-gray{color:var(--gray);background:var(--graybg)}.c-red{color:var(--red);background:var(--redbg)}
.c-purple{color:var(--purple);background:var(--purplebg)}.c-amber{color:var(--amber);background:var(--amberbg)}
.c-teal{color:var(--teal);background:var(--tealbg)}.c-indigo{color:var(--indigo);background:var(--indigobg)}
.c-pink{color:var(--pink);background:var(--pinkbg)}.c-slate{color:var(--slate);background:var(--slatebg)}
.c-violet{color:var(--violet);background:var(--violetbg)}.c-rose{color:var(--rose);background:var(--rosebg)}
.c-orange{color:var(--orange);background:var(--orangebg)}.c-dark{color:var(--dark);background:var(--darkbg)}
.dark .c-dark{color:#cbd5e1}
.footer{display:flex;align-items:center;justify-content:space-between;padding:16px 4px 0;color:var(--tx3);
font-size:12.5px;border-top:1px solid var(--line);margin-top:8px}
.scrim{position:fixed;inset:0;background:rgba(0,0,0,.28);opacity:0;pointer-events:none;transition:.18s;z-index:40}
.scrim.show{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;height:100vh;width:580px;max-width:92vw;background:var(--bg);
border-left:1px solid var(--line);transform:translateX(100%);transition:.22s cubic-bezier(.4,0,.2,1);z-index:50;
display:flex;flex-direction:column;box-shadow:-12px 0 40px rgba(0,0,0,.08)}.drawer.show{transform:translateX(0)}
.dh{padding:20px 24px 16px;border-bottom:1px solid var(--line)}
.dh .row1{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.dh .x{margin-left:auto;cursor:pointer;color:var(--tx2);font-size:18px;background:none;border:none;width:30px;height:30px;border-radius:7px}
.dh .x:hover{background:var(--hov);color:var(--tx)}.dh h2{font-size:20px;font-weight:700;letter-spacing:-.3px;line-height:1.3}
.dh .meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.metapill{font-size:11.5px;color:var(--tx2);background:var(--chip);padding:4px 10px;border-radius:7px}
.db{padding:20px 24px;overflow-y:auto;flex:1}
.rel{margin:0 0 18px;padding:14px 16px;border:1px solid var(--line);border-radius:11px;background:var(--panel)}
.rel h4{font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:9px;font-weight:600}
.rel a{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--tx);background:var(--bg);
border:1px solid var(--line);border-radius:7px;padding:5px 10px;margin:0 6px 6px 0;cursor:pointer;text-decoration:none}
.rel a:hover{border-color:var(--tx3);background:var(--hov)}.rel a .d{width:6px;height:6px;border-radius:50%}
.md{font-size:13.7px;line-height:1.72;color:var(--tx)}.md h2{font-size:15px;font-weight:700;margin:18px 0 8px;letter-spacing:-.2px}
.md p{margin:10px 0}.md strong{font-weight:680;color:var(--tx)}.md ul{margin:8px 0 8px 4px;list-style:none}
.md li{position:relative;padding-left:16px;margin:4px 0}.md li::before{content:"–";position:absolute;left:0;color:var(--tx3)}
.md code{background:var(--chip);padding:1.5px 6px;border-radius:5px;font-size:12.5px;font-family:"SF Mono",ui-monospace,Menlo,monospace}
.md pre{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:13px 15px;overflow-x:auto;margin:12px 0}
.md pre code{background:none;padding:0;font-size:12px;line-height:1.6;white-space:pre}
.md .wl{color:var(--blue);cursor:pointer;text-decoration:none;border-bottom:1px dashed var(--blue);padding-bottom:1px}
.md .wl:hover{background:var(--bluebg)}
.empty{text-align:center;color:var(--tx3);padding:60px 0}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--line);border-radius:6px;border:3px solid var(--bg)}
::-webkit-scrollbar-thumb:hover{background:var(--tx3)}
</style></head><body>
<div class="topbar"><div class="logo">cc</div><span class="brand">claude code</span><span class="crumb">/</span>
<span class="crumb-cur">架构概览</span>
<div class="topright"><span><span class="dotok"></span>已连接 · ~/.claude</span><span>opus-4.8 [1m]</span>
<button class="iconbtn" id="themeBtn" title="切换主题">◐</button></div></div>
<div class="app">
<aside class="side">
<div class="wkspace"><span>▣</span><div><div class="t">工作区</div><div style="font-size:11.5px">3.23 · Driver Agent Planner</div></div>
<span style="margin-left:auto;color:var(--tx3)">▾</span></div>
<div id="nav"></div></aside>
<main class="main">
<div class="h-title" id="hTitle">全部组件 <span class="h-stats" id="hStats"></span></div>
<div class="h-sub" id="hSub"></div>
<div id="overview"></div>
<div class="toolbar">
<div class="search"><span style="color:var(--tx3)">⌕</span><input id="q" placeholder="搜索组件名 / 描述 / 内容…"><span class="kbd">⌘K</span></div>
<div id="typeChips" style="display:flex;gap:8px;flex-wrap:wrap"></div>
<div class="viewtog"><button id="vTable" class="on" title="表格">▤</button><button id="vCards" title="卡片">▦</button></div>
</div>
<div id="listWrap"></div>
<div class="footer"><span id="footL">共 0 项</span><span id="footR">点行首 ▸ 展开预览 · 点行开详情</span></div>
</main></div>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer">
<div class="dh"><div class="row1"><span class="badge" id="dBadge">—</span><button class="x" id="dClose">✕</button></div>
<h2 id="dTitle">—</h2><div class="meta" id="dMeta"></div></div>
<div class="db"><div id="dRel"></div><div class="md" id="dBody"></div></div></aside>
<script id="data" type="application/json">__DATA__</script>
<script>
const DB=JSON.parse(document.getElementById('data').textContent);const records=DB.records;
const byId={};records.forEach(r=>byId[r.id]=r);
const CATS=[
{sec:"能力 · Capabilities",items:[{key:"skill",label:"用户技能",ic:"✦"},{key:"builtin",label:"内置/插件技能",ic:"⚙"},
{key:"subagent",label:"子智能体",ic:"◈"},{key:"workflow",label:"工作流编排",ic:"⛓"}]},
{sec:"记忆 · Memory",items:[{key:"memory",label:"长期记忆",ic:"◆"}]},
{sec:"接入 · Integrations",items:[{key:"mcp",label:"MCP 服务",ic:"⬡"},{key:"plugin",label:"插件",ic:"⧉"}]},
{sec:"配置 · Config",items:[{key:"config",label:"CLAUDE.md / 结构",ic:"❏"},{key:"settings",label:"设置项",ic:"⚑"}]},
{sec:"产出物 · Artifacts",items:[{key:"artifact",label:"项目产出物",ic:"❐"}]},
];
const CAT_LABEL={};CATS.forEach(s=>s.items.forEach(i=>CAT_LABEL[i.key]=i.label));
let state={cat:"all",type:"all",q:"",view:"table",ovOpen:true};let expanded=new Set();
const nav=document.getElementById('nav');
let nh=`<div class="navitem ${state.cat==='all'?'on':''}" data-cat="all"><span class="ic">▦</span>全部组件<span class="ct">${records.length}</span></div>`;
CATS.forEach(s=>{nh+=`<div class="sec-h">${s.sec}</div>`;s.items.forEach(i=>{
const n=records.filter(r=>r.category===i.key).length;
nh+=`<div class="navitem" data-cat="${i.key}"><span class="ic">${i.ic}</span>${i.label}<span class="ct">${n}</span></div>`;});});
nav.innerHTML=nh;
nav.querySelectorAll('.navitem').forEach(el=>el.onclick=()=>{state.cat=el.dataset.cat;state.type="all";expanded.clear();
nav.querySelectorAll('.navitem').forEach(n=>n.classList.remove('on'));el.classList.add('on');buildTypeChips();render();});
const TITLES={all:"全部组件",skill:"用户技能",builtin:"内置/插件技能",subagent:"子智能体",workflow:"工作流编排",
memory:"长期记忆",mcp:"MCP 服务",plugin:"插件",config:"CLAUDE.md / 结构",settings:"设置项",artifact:"项目产出物"};
const SUBS={all:"当前 Claude Code 环境的完整架构：能力（技能/子智能体/工作流）、记忆、接入（MCP/插件）、配置与项目产出物。点行首 ▸ 看预览，点行开完整定义。",
skill:"~/.claude/skills 下的用户技能，slash 或语义触发，点开看官方完整描述与触发场景。",
builtin:"Claude Code 内置及插件技能。",subagent:"Agent 工具可调度的子智能体类型，各有独立工具集。",
workflow:"用确定性 JS 脚本编排多个子智能体：fan-out / pipeline / parallel。",
memory:"跨会话提炼的长期记忆，按 user/feedback/project/reference 分型，点开看完整原文与关联。",
mcp:"已接入的 MCP 服务器（项目级 + claude.ai 连接器），点开看全部工具。",
plugin:"已启用的插件。",config:"CLAUDE.md 指令层与项目三层目录结构（全文）。",settings:"settings.json 中的关键配置项。",
artifact:"项目目录下的真实产出物（自动扫描，已排除 .bak/备份/副本）：Planner 架构、触发器、Advisor、Wiki、培训、根目录成品。"};
function buildTypeChips(){const box=document.getElementById('typeChips');let types=[];
if(state.cat==='memory')types=[["all","全部"],["user","user"],["feedback","feedback"],["project","project"],["reference","reference"]];
else if(state.cat==='artifact'){const g=[...new Set(records.filter(r=>r.category==='artifact').map(r=>r.metaType))];
types=[["all","全部"]].concat(g.map(x=>[x,x]));}
else{box.innerHTML='';return;}
box.innerHTML=types.map(([k,l])=>`<span class="chip ${state.type===k?'on':''}" data-t="${k}">${l}</span>`).join('');
box.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{state.type=c.dataset.t;buildTypeChips();render();});}
function filtered(){let rs=records.slice();if(state.cat!=='all')rs=rs.filter(r=>r.category===state.cat);
if(state.type!=='all')rs=rs.filter(r=>r.metaType===state.type);
if(state.q){const q=state.q.toLowerCase();rs=rs.filter(r=>(r.title+r.subtitle+r.body).toLowerCase().includes(q));}return rs;}
const SCOPE_IC={global:"⬡ global",project:"❏ project"};
function statusClass(s){return s==='auth'?'auth':s==='file'?'file':(s==='available'||s==='enabled')?'avail':'';}
function esc(s){return(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function overviewHtml(){return `<div class="ov">
<div class="ov-head" id="ovHead"><span style="font-size:15px">🗺️</span><h3>架构总览</h3>
<span class="tg" id="ovTg">${state.ovOpen?'收起 ▲':'展开 ▼'}</span></div>
<div class="ov-body" id="ovBody" style="${state.ovOpen?'':'display:none'}">
<div><h4>领域 · Driver Agent 2.0 三层漏斗</h4><div class="funnel">
<div class="fstep"><span class="fnum">·</span><div class="fbox"><b>用户语音 → ASR</b><div class="d">speaker / position / timestamp / goal_list / env_info</div></div></div>
<div class="farr">▼</div>
<div class="fstep"><span class="fnum">1</span><div class="fbox"><b>句法 RAG</b><div class="d">毫秒级·规则匹配·"打开车窗"等明确指令</div></div></div>
<div class="farr">▼ 处理不了</div>
<div class="fstep"><span class="fnum">2</span><div class="fbox"><b>情景 RAG + 仲裁模型</b><div class="d">注入记忆/车况/情景 → 简单/复杂分流</div></div></div>
<div class="farr">▼ 复杂需求</div>
<div class="fstep"><span class="fnum">3</span><div class="fbox"><b>Planner（云端 LLM）</b><div class="d">[SP ~30K, UP ~12K] → JSON 决策·多步规划·调多工具</div></div></div>
<div class="farr">▼</div>
<div class="fstep"><span class="fnum">·</span><div class="fbox"><b>下游 Agent 执行</b><div class="d">车控/音乐/导航/搜索… → 返回 tool_feedback</div></div></div>
</div></div>
<div><h4>工具 · 这套 Claude Code 的能力栈</h4><div class="stack">
<div class="slayer"><div class="lt">① 你的请求</div><div style="color:var(--tx2);font-size:12px">自然语言 / slash 命令 / 粘贴文件</div></div>
<div class="slayer"><div class="lt">② 能力层 <span style="color:var(--tx3);font-weight:400">— 干活的</span></div>
<span class="pill c-violet">26 用户技能</span><span class="pill c-gray">14 内置技能</span><span class="pill c-indigo">6 子智能体</span><span class="pill c-pink">Workflow 编排</span></div>
<div class="slayer"><div class="lt">③ 接入层 <span style="color:var(--tx3);font-weight:400">— 连外面的</span></div>
<span class="pill c-teal">obsidian ≈140</span><span class="pill c-teal">screenshot · fetch</span><span class="pill c-slate">Gmail/Calendar/Drive</span></div>
<div class="slayer"><div class="lt">④ 约束/记忆层 <span style="color:var(--tx3);font-weight:400">— 定规矩的</span></div>
<span class="pill c-blue">16 长期记忆</span><span class="pill c-dark">CLAUDE.md 全局+项目</span><span class="pill c-slate">settings.json</span></div>
<div class="slayer"><div class="lt">⑤ 产出层</div>
<span class="pill c-slate">${records.filter(r=>r.category==='artifact').length} 项目产出物（Planner/触发器/Wiki/讲稿…）</span></div>
</div></div>
</div></div>`;}
function render(){
document.getElementById('hTitle').firstChild.textContent="全部组件"===TITLES[state.cat]?"全部组件 ":TITLES[state.cat]+" ";
document.getElementById('hTitle').firstChild.textContent=TITLES[state.cat]+" ";
document.getElementById('hSub').textContent=SUBS[state.cat]||"";
document.getElementById('overview').innerHTML=(state.cat==='all'&&!state.q)?overviewHtml():"";
if(state.cat==='all'&&!state.q){const h=document.getElementById('ovHead');if(h)h.onclick=()=>{state.ovOpen=!state.ovOpen;render();};}
const rs=filtered();
document.getElementById('hStats').innerHTML=`· <b>${rs.length}</b> 项 · 活跃 <b>${rs.filter(r=>r.status==='active').length}</b>`;
document.getElementById('footL').textContent=`共 ${rs.length} 项 · 已选 0`;
const wrap=document.getElementById('listWrap');
if(!rs.length){wrap.innerHTML='<div class="empty">没有匹配的组件</div>';return;}
if(state.view==='table'){
let h=`<div class="thead"><span></span><span>类型</span><span>标题 / 描述</span><span>分类</span><span>作用域</span><span>状态</span><span>更新</span></div>`;
rs.forEach(r=>{const op=expanded.has(r.id);
h+=`<div class="row" data-id="${r.id}">
<span class="exp ${op?'open':''}" data-exp="${r.id}">▸</span>
<span><span class="badge c-${r.color}">${esc(r.badge)}</span></span>
<div class="cell-title"><div class="t">${esc(r.title)}</div><div class="s">${esc(r.subtitle)}</div></div>
<span class="muted">${CAT_LABEL[r.category]||r.category}${r.info?' · '+esc(r.info):''}</span>
<span class="muted">${SCOPE_IC[r.scope]||r.scope}</span>
<span class="status ${statusClass(r.status)}">${esc(r.status)}</span>
<span class="upd">${r.updated||'—'}</span></div>`;
if(op){const txt=r.body.replace(/[#*`>\[\]]/g,'').replace(/\n+/g,' ').slice(0,420);
h+=`<div class="inline-prev">${esc(txt)}…<br><span class="more" data-id="${r.id}">查看完整定义 →</span></div>`;}});
wrap.innerHTML=h;
wrap.querySelectorAll('.exp').forEach(e=>e.onclick=ev=>{ev.stopPropagation();const id=e.dataset.exp;
if(expanded.has(id))expanded.delete(id);else expanded.add(id);render();});
wrap.querySelectorAll('.row').forEach(el=>el.onclick=()=>openDrawer(el.dataset.id));
wrap.querySelectorAll('.more').forEach(m=>m.onclick=ev=>{ev.stopPropagation();openDrawer(m.dataset.id);});
}else{
let h='<div class="cards">';rs.forEach(r=>{
h+=`<div class="card" data-id="${r.id}"><div class="ch"><span class="badge c-${r.color}">${esc(r.badge)}</span>
<span class="status ${statusClass(r.status)}">${esc(r.status)}</span></div>
<div class="t">${esc(r.title)}</div><div class="s">${esc(r.subtitle)}</div>
<div class="cf"><span>${CAT_LABEL[r.category]||r.category}</span><span>·</span><span>${SCOPE_IC[r.scope]||r.scope}</span>${r.info?'<span>·</span><span>'+esc(r.info)+'</span>':''}</div></div>`;});
h+='</div>';wrap.innerHTML=h;
wrap.querySelectorAll('[data-id]').forEach(el=>el.onclick=()=>openDrawer(el.dataset.id));}}
function md(src){const lines=src.split('\n');let out=[],i=0,inCode=false,code=[],inUl=false;
const flushUl=()=>{if(inUl){out.push('</ul>');inUl=false;}};
while(i<lines.length){let ln=lines[i];
if(ln.trim().startsWith('```')){if(!inCode){inCode=true;code=[];}else{inCode=false;out.push('<pre><code>'+esc(code.join('\n'))+'</code></pre>');}i++;continue;}
if(inCode){code.push(ln);i++;continue;}
if(/^##\s+/.test(ln)){flushUl();out.push('<h2>'+inline(ln.replace(/^##\s+/,''))+'</h2>');i++;continue;}
if(/^\s*[-•]\s+/.test(ln)){if(!inUl){out.push('<ul>');inUl=true;}out.push('<li>'+inline(ln.replace(/^\s*[-•]\s+/,''))+'</li>');i++;continue;}
if(ln.trim()===''){flushUl();i++;continue;}flushUl();out.push('<p>'+inline(ln)+'</p>');i++;}
flushUl();return out.join('');}
function inline(s){s=esc(s);s=s.replace(/`([^`]+)`/g,'<code>$1</code>');s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
s=s.replace(/\[\[([^\]]+)\]\]/g,(m,p1)=>'<a class="wl" data-wl="'+esc(p1)+'">'+esc(p1)+'</a>');return s;}
function findByLink(key){key=key.toLowerCase();
return records.find(r=>(r.linkKeys||[]).some(k=>k.toLowerCase()===key))||records.find(r=>r.id.toLowerCase()===key);}
const drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim');
function openDrawer(id){const r=byId[id];if(!r)return;
document.getElementById('dBadge').className='badge c-'+r.color;document.getElementById('dBadge').textContent=r.badge;
document.getElementById('dTitle').textContent=r.title;
document.getElementById('dMeta').innerHTML=`<span class="metapill">分类 · ${CAT_LABEL[r.category]||r.category}</span>`+
`<span class="metapill">作用域 · ${r.scope}</span><span class="metapill">状态 · ${r.status}</span>`+
(r.updated?`<span class="metapill">更新 · ${r.updated}</span>`:'')+(r.info?`<span class="metapill">${esc(r.info)}</span>`:'')+
`<span class="metapill">id · ${r.id}</span>`;
const relBox=document.getElementById('dRel');const rel=(r.related||[]).map(x=>byId[x]).filter(Boolean);
if(rel.length){relBox.innerHTML='<div class="rel"><h4>关联 / 依赖</h4>'+rel.map(t=>
`<a data-go="${t.id}"><span class="d c-${t.color}" style="background:currentColor"></span>${esc(t.title)}</a>`).join('')+'</div>';
relBox.querySelectorAll('[data-go]').forEach(a=>a.onclick=()=>openDrawer(a.dataset.go));}else relBox.innerHTML='';
const body=document.getElementById('dBody');body.innerHTML=md(r.body);
body.querySelectorAll('[data-wl]').forEach(a=>a.onclick=()=>{const t=findByLink(a.dataset.wl);if(t)openDrawer(t.id);});
document.querySelector('.db').scrollTop=0;drawer.classList.add('show');scrim.classList.add('show');}
function closeDrawer(){drawer.classList.remove('show');scrim.classList.remove('show');}
document.getElementById('dClose').onclick=closeDrawer;scrim.onclick=closeDrawer;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();
if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();document.getElementById('q').focus();}});
let qt;document.getElementById('q').oninput=e=>{clearTimeout(qt);qt=setTimeout(()=>{state.q=e.target.value;render();},120);};
document.getElementById('vTable').onclick=()=>{state.view='table';tog();};
document.getElementById('vCards').onclick=()=>{state.view='cards';tog();};
function tog(){document.getElementById('vTable').classList.toggle('on',state.view==='table');
document.getElementById('vCards').classList.toggle('on',state.view==='cards');render();}
document.getElementById('themeBtn').onclick=()=>document.body.classList.toggle('dark');
buildTypeChips();render();
</script></body></html>"""
out = HTML.replace("__DATA__", DATA)
out_path = os.path.join(ROOT, "claude-code-架构概览.html")
open(out_path,"w",encoding="utf-8").write(out)
print("WROTE", out_path, "| records:", len(records))
print("counts:", dict(cat_counts))
