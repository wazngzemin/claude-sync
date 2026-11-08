# impact_E — 工具执行与反馈：资料有、副本可能缺的点

来源：d03 Director PRD v1.7、t19 下游工具输入输出整理 sheet、t05 Agent Server One Page、d04 触发器推理触发技术方案、t01 GUI-Agent 主链路、t07 S2S 对话工具。

## 1. 播报权限归属（关键分支）
- 下游工具不具备自主播报权限，所有需要和用户语音交互的内容必须返回 Director 统一播报；同一轮多个工具调用，等全部 feedback 返回后统一推理播报，不返一条播一条。
- 来源：https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g【已确认 PRD】

## 2. 工具 feedback 的标准输出格式（t19 实测）
- 执行成功：`[DT改写query]+[函数名称]+[执行状态]`，例：执行指令打开后排遮阳帘，执行结果遮阳帘开关执行成功，可简洁回复"做好了/完成"。
- 执行失败：`[DT改写query]+[函数名称]+[执行状态]+[原因]`，例：主驾座椅放倒失败——"为了安全，已调节到语音的极限值，再调节需要用户手动操作"。
- 无返回（超时）：执行失败，请勿重复调用，需要告知用户。
- 车控工具 vehicle_basic_control "是否要工具播报=否"。
- 来源：https://bytedance.larkoffice.com/wiki/NxMVwYmqLijlubkKE54cVHfrnib【已确认 sheet，主线/赛力斯/上汽】

## 3. 说做一致的 PRD 判例
- bad：说"座椅通风最大档"实际下发 2 档；good：说最大档实际下发 3 档（话术与下发档位要对齐）。单轮工具调用同时下发，避免单轮内先后依赖；工具输入要明确（bad：下发"空调开关"；good：下发"打开空调"）。
- 来源：d03【已确认 PRD】

## 4. Agent Server 的职责边界（新节点）
- Planner 负责编排/工具选择/总结；Agent Server 只负责单次 Agent 调用及调用内控制（预处理→调用→后处理），不做编排调度。
- 控制指令：Redirect 最多两次、Interrupt 结束当前调用、无通用 Fallback 自动重规划；Context cancel 向下游传播。
- 动态工具信息含 Director 可见性 + description/param_desc/notice/tips；执行通道 HTTP/SSE/Kitex/MCP/Frontier/本地工具。
- 来源：https://bytedance.larkoffice.com/wiki/AQxOwJet9ieV5bkstANcvYHLn5f【已确认 One Page】

## 5. 长时任务的反馈链路（GUI 场景）
- Planner 创建长时任务 → 分发 GUI-Agent → GUI 回 Thought 给 Planner；澄清/接管/结束走豆包文本链路与 Planner 交互，GUI 动作自闭环；Advisor 检测 GUI 任务澄清长时间未响应会主动询问；任务中止后 Advisor 通知用户并删除长时任务。
- 来源：https://bytedance.larkoffice.com/docx/LpVGdcqdWodDbMxvwpccW0E9noh【已确认方案】

## 6. 推理触发的模型结果回流（新分支）
- 端侧 VLM 周期扫描 → TriggerRun(model_inference) → 模型输出 ACHIEVED/NOT_ACHIEVED/UNKNOWN/ERROR；只有 ACHIEVED 走 ByteScheduler 回调 TaskService；流式查找"判断结果"字段完全输出后才回调；"依据"只入库不回传；回调后任务系统按执行结果决定删场景。
- 来源：https://bytedance.larkoffice.com/wiki/Q11CwtB7mitzckkxmnmcKvIDnNg【已确认技术方案】

## 7. 工具清单按车型/项目的覆盖差异
- t19：每个工具标注支持项目（主线/赛力斯/上汽）+负责产品研发；智驾（车道保持/巡航/自动泊车）不属于车控工具，走 auto_drive；氛围灯走 ambient_light_control；导航模糊地点须先 POI 搜索再 route_planning。
- 来源：t19 sheet【已确认】
