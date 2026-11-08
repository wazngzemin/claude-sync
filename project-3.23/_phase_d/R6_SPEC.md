# 第六轮：正文按讲稿重写，原图增量补节点（所有组共用，属于硬约束）

副本：https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg （开工前必须重新 fetch，禁止用旧快照）。原文档 DfiydEuaQoKDERx4PLEc9AA7nDf 只读，版本必须停留在 163。

## 用户不满意的五点（交付时逐条核对）
1. 正文只写节点编号、不写名称，例如“从 V12 进入 R1”，读者看不懂。全文约 4300 处。
2. 废话多，不像讲解稿。每章 6–13 个小标题互相重复，补丁小节（V19–V24、R19–R23、“最新 PRD 补细”“权威画板补充”“逐个节点讲透”）和主线没有接上。
3. 混进了研发内容，但读者是产品经理。
4. 原有流程图没有细化：总图和 01–20 这 21 张原图，一个节点都没加。用户要求在原图上补细节。
5. 要按产品团队平时开会的语境和句式写。

## 必读材料（先下载，用 curl -sL -o）
- 节点名称表，共 291 个，格式为“编号→图上名称→图上要点”：md https://aka.doubaocdn.com/s/lwfLEb6NMh ；json https://aka.doubaocdn.com/s/nV505TVUR7
- 样稿 A《云端流程图-需求评审话术稿》https://aka.doubaocdn.com/s/GtvtyWt5Jj ：做法是指着图上某一块讲它解决什么；用一个具体任务从头讲到尾；每块讲完补一句“这时只是…，还没代表…”；结尾转到“接下来按模块确认谁承接”。
- 样稿 B《豆包座舱语音闭环-培训讲稿》节选 https://aka.doubaocdn.com/s/LE2IayhiMX ：常用句式有“我们先把自己放到驾驶位”“我们在这里先停一下”“刚才已经拿到什么、现在还缺什么、交给谁、拿到什么才能继续”。
- 用户的会议表达规范 https://aka.doubaocdn.com/s/xnehDMlJAa ：每句一个主语、一个动作；不用“它/这个/那块”指代；不用“就是”开头；用陈述句，不用“应该是”；不确定就写“这个需要确认”。
- 团队开会逐字稿节选 https://aka.doubaocdn.com/s/iaMhOC98uf ：只用来对齐说法，不当事实来源。常用说法：“这条链路谁来承接”“端上/云端”“下发”“回显”“拉一下某某确认”“这块现在已经有了/还没接”“先把业务规则定好，具体接入方式跟研发确认”。
- Skill（动笔前完整读 SKILL.md）：
  - 产品经理 …/workspace/.skills/doubao-product-manager（SKILL.md、references/review-and-iteration.md）
  - 讲稿 …/workspace/.user_skills/human-writing（SKILL.md、references/formats.md 口播/演讲部分；初稿写完后读 references/revision.md）
  - 飞书文档 …/workspace/.skills/lark-doc
  - 画板 …/workspace/.skills/lark-whiteboard（用增量追加路径；禁止 --overwrite 原图）
  - 本机根目录：/Users/bytedance/Library/Application Support/DoubaoWork/Default/.doubaowork/agent_mode/workspace
- 本组可参考的旧证据：/Users/bytedance/Desktop/3.23/.research/readers/impact_*.md；副本各章现有正文（是本轮改写的原料）。

## 一、每章正文的新结构（01–20 和 N1–N18 统一，H1 标题不改）
H1 下只保留下面这些块，顺序固定，二级标题文字必须一字不差：
1. 承接段（不加标题，一到两段）：“上一张图交给我们的是 XX（编号＋名称），这一张要解决的是……”。贯穿案例用“带我去昨天那家游泳馆”；触发器、任务类章节（12 T、13 G、14 L、15 S、16 P、20 U、N2、N11）用“快到时提醒我拿泳镜”。
2. 画板：原图位置不动；N 章用上一轮的新图。
3. H2「这张图怎么讲」：一篇连贯的讲稿。按样稿 A 的口吻边指图边讲，例如“先看左上…”“接着看…”。先沿主例把主路讲完，再逐个讲分叉。每个分叉讲清四件事：条件、走到哪个节点（编号＋名称）、用户在车里实际遇到什么、一个例子。原来“这张图怎么看”“逐个节点讲透”“沿着图X把业务讲通”“最新 PRD 补细”“权威画板补充”和各种补丁小节里的产品事实，全部合并进这篇讲稿，按它们在图上的位置插进去，不另开小节。图上本轮新增的节点也要讲到。每块讲完用一句话收住：“这时只是…，还没代表…”。最后一段把读者交给下一张图。
4. H2「这一块我要讲清楚的产品规则」：只写产品口径，即用户能感知的规则、边界、车型差异、状态（【已落地】【2.6目标】【讨论中】【待核】）、资料冲突（并列写出各自出处）。用列表，每条一到两句，不写实现方式。
5. H2「评审时我要问清什么」：把原来的“产品经理要问清什么”改成开会时能直接说出口的话，例如“这块我想确认一下：端侧拒识之后已经上云的音频，最终以谁的结果为准？”。每条后面跟一句“为什么要问”。
6. H2「验收口径」：保留原有指标、数字和统计口径，一条都不能少。
7. H2「原文入口」：只留文档标题加链接，去掉 token、docx id、“完整正文已读”这类过程记录。
- 不再保留任何 H3 补丁小节。“这张图怎么看”“逐个节点讲透”“沿着图…讲通”“产品经理要问清什么”“验收指标和统计口径”“最新 PRD 补细”“权威画板补充”这些旧标题全部删除，内容并入上面的新结构。
- 结构以外的旧段落：有用的产品事实并入，重复的删掉。信息不能丢，尤其是数字、车型、状态、出处链接、问题清单、验收指标。

## 二、节点写法（最高优先级）
- 正文每次出现节点编号都写成“编号（图上名称）”，名称照抄节点名称表里的“图上名称”。例如：“V12（把最终输入交给正式业务链路）”“R8（交输入管理，准备进入 Director）”“M1（接住四类输入，保留来处）”“C5（接最近对话、工具事实和摘要）”。
- 同一段里第二次出现，可以只写编号加 2–6 个字的简称，例如“R8（交输入管理）”。不允许出现裸编号。
- 跨图引用也照这个写法，并点明是哪张图，例如“R 图的 R8（交输入管理）”。
- 本轮新增的节点、N 章节点，编号后面同样带上图上标题。
- 可以用自检脚本 check.py 统计孤立编号，目标是 0：python3 check.py "本章H1关键词"。

## 三、研发细节清零
- 正文删除以下内容：接口名、协议名、缓存/存储组件、钩子、函数名、字段名、内部服务名、token、docx id、芯片型号、工程实现步骤。黑名单（check.py 会统计，目标 0）：Redis、request_id、RoundID、pre_query、AIDV、Kitex、MCP、Frontier、SSE、HTTP、Handler、VehicleControlAgent、BeforeRequest、AfterResponse、Orin、NPU、token、docx、Virtual Display、RPC、QoS、TTL、JSON、SDK、API/OpenAPI、gocron、ByteScheduler、VikingDB、method=、channel_app_id、encrypted_doubao_uid、tts_content、mastagent、函数名形态（如 set_xxx）、模型版本串。
- “接口”“服务端”“技术方案”逐处检查：只有产品能听懂的用法才保留，例如“任务中心只负责展示，不负责执行”。
- 研发事实如果影响体验或产品判断，就改写成产品语言保留结论。例如：“预请求先把拒识和意图判断做在前面，正式请求来了直接用，体感快约 200 毫秒；用户中途改口时，提前做的结果可能作废，要重新判断。”可以写“同一句话端云各有一份结果，要靠同一个请求编号对上”，但不能出现字段名。
- 只有研发才需要的实现细节，不放进正文。

## 四、在原图上增量补节点（本轮最重要的增量）
- 对象：总图（token JGwiwsR9rhy182b3Oz6cmJcjnqg）和 01–20 原图，token 见下表。不要换、不要删、不要 overwrite。
  01 V Y772w0iwBhdfHZbox5XcmYBwnEf｜02 R DtbpwZyqrhoj32bLSa1ckstzn9e｜03 M JNOIwvqDmhGzSxbuYq0cdInhnSd｜04 C XivlwS6OQhT4Ppb29BscBgbvnH0｜05 D EjAgw8CNXhDoqgbwTsQcFWBAnNc｜06 E H24fwt0svhvMXMbQ4tNc6Wk9nQc｜07 O OtbAwf41DhD9hqb4E7icb0KonTg｜08 I EhIIwSTEHhEpU8b8IP0crDDfn6g｜09 W Xp2CwvW6BhNRvMbDgDjc7lpPnbr｜10 F FpijwuuTHhW6iZbgJmicSmisnuf｜11 K Ajnhw8ztzhKaBkbYUf3ceaJynCd｜12 T Xbdqwjm0ph5XSEbg0fmc60gPnuh｜13 G VBR1wT15AhmlcEbcN7dcgVVJnDe｜14 L HqClwTmUJhEklWbhNdpc6891nIg｜15 S FxdhwToOehqbPubF8OwcSMvxnDb｜16 P VKqswpOfeh1dRJbgWgxcub16nic｜17 A O2EmwDWeWh4FGpbDltyc8qkQnxb｜18 H MMMywwe3JhSYLfbtduJcrFsHnJh｜19 B Wq4NwlCaEhE3fLbwyPacwCRwnWe｜20 U RCu9wnQOChoCORb9v4PczkQhn0e
- 步骤：
  1. 先导出 preview 和 raw，记录原节点数，看清原布局和空位，也看清原卡片的尺寸、配色、字号。
  2. 用 lark-whiteboard 的增量追加方式写入新卡片和连线，不加 --overwrite。
  3. 新增节点编号接着原编号往下排，例如 V 图原来到 V18，新增就从 V19 开始。卡片风格和原图一致：卡片尺寸相同；金底表示判断或关卡，蓝底表示处理，绿底表示交出或回流；每张卡片写编号、标题和 2–4 条要点。新增连线用同色系，线上标出文字。
  4. 原图版面放不下时，在原画板右侧或下方加一个“补充区”分区框，标题写“本次补充：…”，再用连线接回原节点。不能压住原有节点和连线。
- 内容来源：上一轮正文里“最新 PRD 补细”和 V19–V24、R19–R23、M13–M16、C13–C16 等补丁小节中属于产品口径的内容，以及 impact_*.md。研发实现类内容（缓存组件、接口）不上图。每张图新增 3–8 个节点，以资料支撑为准，不凑数。状态（讨论中、资料冲突等）写进卡片要点。
- 示例：V 图可以补多级判停三段（300/600/语义 1000 毫秒，资料冲突）、声纹注册约束、车外语音独立入口、上屏前口癖过滤（讨论中）。R 图可以补预请求提前判断与作废、离线白名单范围、拒识三级（离线高精准→云端高召回→Director 兜底→Advisor 回捞，讨论中）。
- 自检：追加后导出 preview，用 Read 看图，确认没有重叠、遮挡、裁切、文字溢出，新旧风格一致。然后回读 raw，确认原节点数没有减少、新增节点都在。写入后至少等 60 秒再导出；导出文件小于 100KB 很可能是占位图，要重导。
- 讲稿“这张图怎么讲”必须讲到新增节点，名称和图上一致。

## 五、写入与并发安全
- 只改自己负责的章节，即本章 H1 到下一个 H1 之前；H1 标题文字不改。
- 推荐做法：先把整章旧正文（画板除外）存到本机 scratch 备份，在本地写好新正文 XML，然后：
  1. 在画板前插入承接段；
  2. 在画板后插入新的 H2 结构；
  3. 删除旧段落。
- 删除范围不能跨 H1，不能包含画板 block。
- 写完回读本章，并跑 check.py：孤立编号 0、研发词 0、H2 只有五个标准标题、画板仍在原位。

## 交回（每章一行，800 字内）
孤立编号数、研发词数、H2 列表是否标准、原图新增节点（编号＋标题）、preview 文件大小及是否无重叠、原节点数前后对比、待核项。
