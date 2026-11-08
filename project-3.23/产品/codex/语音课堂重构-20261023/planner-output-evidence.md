# Planner / Director 与输出链路证据

本轮主动飞书搜索：`语音交互 打断策略 TTS Director tool_feedback action_list`、`打断恢复OnePage TTS 推理 工具执行 取消`。返回状态 success，命中数分别为 400、388；仅最相关文档展开了正文片段，不能声称读完所有命中。避免用用户自建培训稿反向证明底层事实。

## 可用的一手原文

1. [Director（对话推理引擎）PRD](https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g)：飞书实际返回 body_excerpt，本地正文存档在 `全源重读-20261023/director/bodies/XRuKwJ0VPisdUhkxH0ecY1rRn9g.md`。10 月 12 日 v1.7 更新记录。明确结合 Context 对 user input / advice / tool feedback / event 推理；输出 talk_content、action_list、emoji_id；工具反馈后再次推理。单轮工具同时下发，不能放入有先后依赖的动作。当前正文明确工具不自主播报、多工具反馈齐后统一推理。字段以对应项目当前提示词为准。
2. [AI 汽车产品 one page](https://bytedance.larkoffice.com/docx/XNy1dc03QorjiOxnmC5cZy3fnhc)：飞书实际返回正文片段，包含端状态知识注入、冷暖需求、多音区及打断体验。属于产品方向/版本规划，不能将表中所有能力视为本车型已上线。
3. [车控 TTS 播报策略](https://bytedance.larkoffice.com/wiki/GQvHwQJGriFRoKkNjnIcRkBrn1f)：读取本地本日存档正文；不能据此保证源文全文完整： `voice/body-carcontrol-tts.md`。简单车控采用端上固定 NLG 模板、端侧 TTS；复杂车控由云端生成话术与 TTS；多意图失败需反馈成功/失败及原因。此文与 Director 统一播报口径有适用边界差异，需按车型和版本确认，不能强行拼成唯一现网链路。
4. [离在线车载 TTS 服务](https://bytedance.larkoffice.com/wiki/KlRgwueVKipbeLkdzkGcO15inKh)：读取本地本日存档正文；不能据此保证源文全文完整： `voice/body-tts-service.md`。更新记录至 10 月 19 日。定义在线/离线选择、缓存、优先级抢占；优先级由车企音频管理模块定义。明确需求范围不含“在线合成中断后的离线断点续播”。不能讲成在线失败必然无缝续播。响应时间是产品要求，不是实测。
5. [语音交互打断策略](https://bytedance.larkoffice.com/wiki/FLlSwl1GoicNugkWWLCcFxtmnhl)：读取本地本日存档正文；不能据此保证源文全文完整： `voice/body-interrupt-prd.md`。同时含 2.6 短期、二月底实验和长期待定方案；不同触发阈值不能当成当前统一规则。
6. [打断恢复 OnePage](https://bytedance.larkoffice.com/wiki/WG3ZwwQBRidiV3k9HGwcBBjcn3e)：本轮主动按链接读取，实际返回 permission denied（Feishu API 131006，node permission denied）。不能声称读到该文正文。可用 Director PRD 内对打断恢复的明确描述：工程回传已播/未播和新输入，由 Director 判断补说、合并、跳过。

## 关键结论与待核验

- TTS 将文字合成音频；用户实际听到需要端侧取得并播放音频。合成成功、开始播放、播放完成是不同验收点。具体拉流接口、缓存清理和播放回执字段，以上已读正文不足以完整定论。
- Director PRD 的打断恢复主要描述“播报中断后的后续内容决策”。停止喇叭出声，不等于取消正在推理、工具调用或已执行车控。
- 当前已读来源没有明确所有工具的撤销/取消能力、迟到 feedback 丢弃规则、旧推理取消协议及已执行动作自动回滚规则，必须标待核验。
- “把空调调到 24℃”可走简单车控端侧快速路径；课堂如用它解释云端 Director，必须明示为“假设该轮经仲裁交给云端，用于讲解该分支”，不能说每句车控都经云端。
- “有点热”不能固定映射 24℃、风量最大或开窗；取决于当前 Context、项目策略和能力边界。

## 新增核验：AIVA 0930 采纳口径

本轮飞书搜索 `AIVA 0930 本地LLM 3秒 缓存`，返回 success、总命中 788，最相关 [本地对话链路需求](https://bytedance.larkoffice.com/wiki/JXC3wPYxziUiJLk9ZlOcYSZ2nsg) 展开 body_excerpt，明确 20260930 V0.2 修改本地 LLM 命中策略、确定性白名单正则缓存抢跑云端、本地模型 functioncall 仅断网和超时采纳。返回正文在端云仲裁章节处截断，3 秒与迟到禁止执行细项另由本地 `voice/body-local-dialogue.md` 的“端云仲裁”节核实：云端超过 3 秒视为超时；本地有可执行 functioncall/reject 则采纳；云端超时后晚到不再执行。需区分“该 PRD 已定义”与“本车型已验收上线”。该文前部仍残留旧规则，课程必须以明确的 0930 更新和后部仲裁节为准。

补充边界：之前待核验的“迟到结果处理”应收窄为一般改口/取消旧任务的迟到反馈规则；AIVA 此特定 3 秒超时仲裁已有明确晚到不执行规则，不能再统一写成全都未知。
