# PRD：云端触发器“已有状态优先、动态观察兜底”补充方案

## 1. Summary

当前“云端触发器模型解析 VLM 链路”只覆盖“任务专属动态 VLM 结果上报后，Trigger 用模型判断目标是否达成”，没有定义任务创建或激活时如何复用 Context 中已有的默认 VLM/端状态，也没有定义已有状态与动态观察之间的先后顺序。

本补充需求统一所有 Task 的判断框架：先确定任务何时允许尝试，再检查已有结构化状态和前置条件；已有状态不足以完成判断时，才创建或继续任务专属动态 VLM 观察；动态命中后，执行前再次检查必要条件。

核心原则：

> 激活条件先行，已有状态优先，动态观察兜底，执行前再次校验。

## 2. Contacts

| 角色 | 接口人 | 本需求关注点 |
|---|---|---|
| 产品 PM | 王泽民 | 能力边界、判断规则、异常策略、验收标准 |
| Trigger 研发 | 刘杨、尹振刚 | Context 条件与 VLM 推理的组合方式、场景状态、回调 |
| TaskService | 于庆磊、王梦尧 | TaskSpec、Context 预检查、动态任务下发、Run 与场景失效 |
| VLM/端侧 | 丁彬等 | 默认任务结果、动态任务结果、上报频率、丢轮和容量 |
| Planner/Director 产品 | 郝晓伟等 | 任务生成边界、不可支持任务的拦截和用户表达 |
| Context | 向超然等 | 已有状态字段、对象/位置、更新时间、有效性 |

## 3. Background

### 3.1 当前产品需求

当前需求主要解决：

- 用户创建“后排宝宝哭了告诉我”“有人抽烟提醒我”等持续观察任务。
- 端侧 VLM 只返回自然语言描述，不直接给出业务结论。
- Trigger 使用 `感知目标 + 本轮观察结果` 判断“达成 / 未达成 / 无法判断”。

### 3.2 当前技术链路

```text
用户 Query
  → Planner / Director
  → TaskService 创建 Task
  → TaskService 注册 VLM inference 场景
  → TaskService 下发任务专属动态 VLM 任务
  → VLM 周期观察
  → AI Service
  → TaskService
  → Trigger(goal + data)
  → 达成后回调 TaskService
```

当前字段：

| 当前字段 | 含义 |
|---|---|
| `ConditionParams.conditions` | 结构化静态条件 |
| `ConditionParams.dynamic_conditions` | 现有条件触发协议中的动态条件；不等同于“任务专属动态 VLM” |
| `InferenceParams.goal` | 本 Task 的 VLM 感知目标 |
| `InferenceTriggerParams.data` | 本次任务专属 VLM 观察描述 |
| `InferenceTriggerParams.report_time` | 本轮动态结果的上报时间 |

当前缺口：`ConditionParams` 和 `InferenceParams` 属于不同场景逻辑，没有定义同一 Task 如何执行“已有 Context 状态 → 动态 VLM 兜底”。

### 3.3 会议暴露的产品问题

1. 默认 VLM 结果进入 Context，任务专属动态结果走 AI Service → TaskService，两条链路相互独立。
2. 当前 VLM inference 场景只消费本 Task 的动态结果，不参考 Context 或其他任务结果。
3. 新任务可能需要的事实已经存在，例如性别、座位、乘员状态，无需重复发起动态观察。
4. 动态任务存在 5～6 秒周期、被高优任务抢占、缺轮、无网和无缓存等问题。
5. “每分钟总结宝宝状态”涉及时间窗口内多轮聚合，当前单轮推理方案不支持。

## 4. Objective

### 4.1 产品目标

1. 所有 Task 使用同一套判断顺序，避免各任务类型自行定义。
2. 已有 Context 状态足以判断时，避免创建动态 VLM 任务。
3. 已有状态不足或过期时，可靠地降级到任务专属动态观察。
4. 防止旧对象、旧位置和旧状态导致错误触发。
5. 明确“未知、未达成、不可执行、无法判断”的差异。

### 4.2 成功标准

- 已有有效 Context 明确满足目标的 Case，不下发动态 VLM，也能正确产生 Run。
- 已有 Context 未满足但目标可能变化的 Case，正确进入动态观察。
- Context 缺失或过期时不误判为“未达成”。
- 动态结果到达后，前置条件失效的 Case 不错误触发。
- 同一 Task 的 Context 命中和动态命中并发发生时只产生一个 Run。
- Planner 不生成当前版本不支持的时间窗口汇总任务。

## 5. Scope

### 5.1 本期支持

- 使用 Context 中已有的结构化车辆、乘员、位置和默认 VLM 结果进行当前状态判断。
- Context 当前状态不足时，降级到本 Task 的动态 VLM 观察。
- 一次性条件达成类 VLM Task。
- 延时/周期 Task 在每次到点后执行已有状态与前置条件检查。
- Trigger 命中后由 TaskService 执行前再次检查必要条件。

### 5.2 本期不支持

- 对一分钟或其他时间窗口内的多轮 VLM 结果进行聚合总结。
- 跨 Task 复用历史动态 VLM 结果作为当前事实。
- 在没有明确有效期和对象绑定时复用旧结果。
- 静态 Advisor 预置场景的迁移。
- 通过单帧结果推断状态变化过程。

## 6. Terminology

### 6.1 四层任务模型

所有 Task 统一拆为：

| 层级 | 产品问题 | 示例 |
|---|---|---|
| WHEN：激活方式 | 什么时候尝试产生一次 Run | 立即、10 分钟后、每小时、条件命中时 |
| IF：前置条件 | 当前是否允许继续判断或执行 | 车辆在线、AlwaysOn 开启、目标座位有人 |
| OBSERVE：感知目标 | 现有状态不足时，需要继续观察什么 | 宝宝是否哭泣、毯子是否滑落 |
| THEN：执行动作 | 条件达成后做什么 | 提醒用户、调整空调、重新进入 Planner |

### 6.2 已有状态

已有状态指当前可以从 Context/端状态直接获取的事实，包括：

- 车辆和设备状态。
- 乘客列表、座位和对象属性。
- 默认 VLM 任务产生的结构化状态。
- 当前会话中已经写入 Context 且仍在有效期内的事实。

“已有状态”不等于永久不变。例如“是否睡着”是动态变化的，但如果 Context 已经有当前结果，仍应先复用。

### 6.3 动态观察

动态观察指云端为当前 Task 专门下发给端侧的 VLM 任务。结果通过 `task_id + data + report_time` 返回，只服务于当前 Task。

### 6.4 三类条件

| 条件类型 | 定义 | 示例 |
|---|---|---|
| 硬性前提 | 不满足时当前不能创建或执行 | AlwaysOn 未开启、动态任务已达 3 个上限 |
| 可变化前提 | 当前不满足，但未来可能满足 | 后排暂时无人、乘客尚未入座 |
| 感知目标 | 用户真正等待发生的事件 | 宝宝哭了、毯子掉了 |

## 7. Product Model

### 7.1 TaskSpec 需要补充的产品信息

以下是产品结构，不强制研发采用相同 IDL：

```json
{
  "activation": {
    "type": "immediate | delay | periodic | condition",
    "schedule": "可选"
  },
  "subject": {
    "type": "baby | passenger | pet | object",
    "position": "副驾后方",
    "identity_binding": "可选"
  },
  "preconditions": [
    {
      "condition": "AlwaysOn 已开启",
      "type": "hard",
      "on_false": "reject"
    }
  ],
  "observation": {
    "goal": "副驾后方宝宝正在哭泣",
    "reuse_context": true,
    "context_freshness_policy": "按字段配置",
    "dynamic_fallback": true,
    "missing_data_policy": "wait"
  },
  "condition_logic": "ALL",
  "action": "提醒用户",
  "execution_recheck": true,
  "completion_policy": "执行成功后关闭"
}
```

### 7.2 必须新增的产品字段概念

| 字段概念 | 必填 | 产品含义 |
|---|---|---|
| `activation_type` | 是 | 立即、延时、周期或条件激活 |
| `subject` | 涉及对象时必填 | 要判断哪个对象 |
| `position` | 用户指定时必填 | 对象所在位置 |
| `preconditions` | 可选 | 进入动态判断或执行前必须成立的条件 |
| `condition_logic` | 多条件时必填 | ALL/ANY |
| `perception_goal` | VLM Task 必填 | 对应 `InferenceParams.goal` |
| `reuse_context` | VLM Task 必填 | 是否先复用已有 Context；本需求固定为 true |
| `freshness_policy` | 是 | Context 数据有效性策略 |
| `dynamic_fallback` | 是 | Context 不足时是否下发动态 VLM |
| `missing_data_policy` | 是 | 缺失、过期、丢轮时如何处理 |
| `execution_recheck` | 是 | Trigger 命中后是否再次校验 |
| `completion_policy` | 是 | 成功、失败、取消时如何结束任务和场景 |

## 8. Core Product Rules

### 8.1 统一判断顺序

所有 Task 在一次 Run 尝试中统一遵循：

```text
WHEN 激活条件成立
  → IF 检查硬性前提和已有状态
  → OBSERVE 已有状态不足时进入动态观察
  → MATCH 判断目标达成
  → RECHECK 执行前再次检查
  → THEN 执行动作
```

不是所有 Task 都会进入 OBSERVE：

- 纯定时任务可能只有 WHEN + IF + THEN。
- 纯结构化条件任务可能只有 IF 命中 + THEN。
- VLM 任务才需要 Context 优先和动态观察兜底。

### 8.2 三个判断时点

#### 时点 A：任务创建时

检查：

- 能力是否支持。
- AlwaysOn 开关是否开启。
- 动态任务是否超过 3 个上限。
- 用户指定位置是否属于 VLM 可见范围。
- 当前任务是否超出视觉判断能力。

创建时不一定判断最终状态。例如“10 分钟后宝宝睡着就提醒我”，真正状态应在 10 分钟到点时判断。

#### 时点 B：任务激活或每轮动态上报时

检查顺序：

1. 激活条件是否到达。
2. 当前 Context 是否存在有效状态。
3. 硬性和可变化前提是否成立。
4. 当前状态是否已经足以判断感知目标。
5. 不足时是否需要动态 VLM。

#### 时点 C：真正执行前

Trigger 命中后，TaskService 再检查：

- Task 是否仍有效、未被取消或更新。
- 目标对象和位置是否仍匹配。
- 车辆、安全和权限条件是否仍满足。
- 本次 callback 是否已产生过 Run。

### 8.3 Context 判断结果枚举

| 结果 | 含义 | 后续 |
|---|---|---|
| MATCHED | 已有状态明确满足目标 | 直接进入 MATCHED，不创建动态 VLM |
| NOT_MATCHED_MUTABLE | 当前未满足，但未来可能变化 | 创建/继续动态观察 |
| NOT_MATCHED_HARD | 硬性条件不满足 | reject、skip 或等待前提恢复 |
| UNKNOWN_MISSING | 没有相关数据 | 动态观察兜底 |
| UNKNOWN_STALE | 数据已过期 | 动态观察兜底 |
| UNSUPPORTED | 目标超出视觉/产品范围 | 不创建或终止并反馈用户 |

### 8.4 “未知”不等于“未达成”

- 没有上报：未知。
- 上报被抢占：未知。
- 网络导致结果丢失：未知。
- 对象或位置没有覆盖：未知。
- 明确看到宝宝安睡：对“正在哭泣”而言是未达成。

未知时不得触发，也不得使用旧结果假装当前已观察；进入等待下一轮或按超时策略结束。

### 8.5 ALL/ANY 组合逻辑

#### ALL（全部满足）

```text
静态前提全部满足
AND 感知目标达成
→ 触发
```

任一硬性前提不满足时，不进入动态模型判断。

#### ANY（任一满足）

```text
Context 已有状态满足
OR 动态 VLM 判断达成
→ 触发
```

Context 已经满足时不再等待动态 VLM。

### 8.6 对象和位置绑定

- Context 和动态 VLM 必须判断同一车辆、同一 Task、同一目标位置。
- 用户指定位置时，不得使用其他位置对象作为证据。
- 人员变化后，旧乘客状态失效。
- 无稳定人员 ID 时，至少使用 `vehicle_id + seat_position + observed_at` 绑定。

### 8.7 数据新旧和冲突

- 仅使用仍在有效期内的结果。
- 同一来源优先使用时间更新的数据。
- Context 与任务专属动态 VLM 冲突时，先校验对象和时间；无法消除冲突则本轮视为未知，等待下一轮。
- 不允许用历史动态任务结果替代当前 Task 的观察结果。

### 8.8 并发与幂等

Context 命中和动态 VLM 命中可能同时发生：

- 同一 Task 同一激活周期只允许生成一个 Run。
- TaskService 以 task_id + activation_id/run_key 做幂等。
- 已由 Context 直接命中时，尚未下发的动态任务不得再下发；已经下发的需要在下一次全量任务列表更新中移除。

## 9. End-to-End Flow

### 9.1 创建阶段

```text
1. 用户提交 Query
2. Planner/Director 判断需要 Task Agent
3. Task Agent 透传任务文本
4. TaskService Spec Builder 解析 WHEN / IF / OBSERVE / THEN
5. Task Manager 校验能力、开关、数量和可见范围
6. 持久化 Task
```

### 9.2 非定时 VLM 任务初次判断

```text
1. TaskService 查询 Context 当前快照
2. 绑定车辆、对象、位置、时间
3. 判断已有状态：
   a. MATCHED → 直接产生 Run
   b. NOT_MATCHED_MUTABLE → 注册 VLM scene，准备动态观察
   c. UNKNOWN_MISSING/STALE → 注册 VLM scene，准备动态观察
   d. NOT_MATCHED_HARD → reject/wait
   e. UNSUPPORTED → 拒绝并反馈
4. 仅 b/c 下发任务专属动态 VLM
```

### 9.3 延时/周期任务

```text
1. Task 创建后进入 WAITING_SCHEDULE
2. 到点产生 activation event
3. 再查询当时的 Context，而不是使用创建时快照
4. Context 足够 → 直接 Run
5. Context 不足且任务允许动态兜底 → 动态观察
6. 周期任务本轮结束后回到 WAITING_SCHEDULE
```

### 9.4 动态任务下发

```text
1. TaskService 维护当前车辆完整动态任务列表
2. 列表经 Frontier/AI Service 下发端侧
3. 更新、删除采用全量替换
4. 端侧最多同时执行 3 个动态任务
5. VLM 为每个任务输出 task_id + 描述
```

### 9.5 动态结果上报

```text
VLM
  → 端侧数据中心
  → AI Service
  → TaskService 新接口
  → task_id 映射 scene_id
  → TriggerRun(scene_id, data, report_time)
```

### 9.6 动态推理

```text
1. 校验 Task/scene 是否仍有效
2. 校验 report_time 是否过期
3. 重新检查必要的 Context 前置条件
4. 读取 InferenceParams.goal
5. 使用 goal + data 调用模型
6. 输出：达成 / 未达成 / 无法判断
```

处理：

| 模型结果 | 系统行为 |
|---|---|
| 达成 | Trigger callback TaskService |
| 未达成 | 记录本轮，继续 WAITING_DYNAMIC |
| 无法判断 | 记录本轮；按产品超时/失败策略继续或结束 |
| 无上报 | 不调用模型，保持等待 |

### 9.7 回调、执行与关闭

```text
1. Trigger 回调 TaskService
2. TaskService 幂等创建 Run
3. 执行前重新校验 Task 和必要前提
4. Runtime Dispatcher 执行 Planner/Agent/Tool/消息
5. 成功：
   - 一次性 Task → closed，删除 scene 和动态任务
   - 周期 Task → 本轮 finished，Task 回到 waiting
6. 失败：
   - 按 retry/retain policy 处理
   - Trigger 不自行删除 scene
7. 用户取消/更新：TaskService 注销旧 scene，并全量更新端侧任务列表
```

## 10. State Machine

```text
CREATING
  ├─ unsupported / hard check failed → REJECTED
  └─ created
       ├─ 有 schedule → WAITING_SCHEDULE
       └─ 无 schedule → CHECKING_CONTEXT

WAITING_SCHEDULE
  └─ activation reached → CHECKING_CONTEXT

CHECKING_CONTEXT
  ├─ matched → MATCHED
  ├─ mutable false / missing / stale → WAITING_DYNAMIC
  ├─ hard false recoverable → WAITING_PRECONDITION
  └─ hard false non-recoverable → CLOSED/FAILED

WAITING_DYNAMIC
  ├─ new report unmatched → WAITING_DYNAMIC
  ├─ no report → WAITING_DYNAMIC
  ├─ matched → MATCHED
  └─ canceled/offline/timeout → SUSPENDED/CLOSED

MATCHED
  └─ recheck passed → RUNNING
  └─ recheck failed → WAITING/SKIPPED

RUNNING
  ├─ one-shot success → CLOSED
  ├─ periodic success → WAITING_SCHEDULE
  └─ failed → RETRYING/WAITING/CLOSED
```

## 11. Flow by Task Type

| Task 类型 | WHEN | IF/已有状态检查 | 动态 VLM | 结果 |
|---|---|---|---|---|
| 10 分钟后打开车窗 | 10 分钟到点 | 到点检查车辆、安全状态 | 不需要 | 执行动作 |
| 温度高于 28 度打开空调 | Context 温度条件命中 | 检查车辆/空调状态 | 不需要 | 执行动作 |
| 每小时开启座椅按摩 | 每小时到点 | 检查座椅有人、车辆在线 | 通常不需要 | 每次产生 Run |
| 宝宝哭了告诉我 | 立即进入观察 | 先查 Context 当前宝宝状态 | Context 不足时需要 | 达成后提醒 |
| 10 分钟后如果宝宝睡着就提醒 | 10 分钟到点 | 到点查 Context | 不足时需要有界动态观察 | 达成/超时 |
| GUI 下单 | 用户创建即激活 | 检查网络、登录等 | 不需要 | GUI Agent 执行 |
| 每分钟总结宝宝状态 | 每分钟到点 | 单帧 Context 不足 | 需要时间窗口聚合 | 本期不支持 |

## 12. Detailed Case: “后排宝宝哭了告诉我”

### 12.1 Context 已明确哭泣

```text
Context：副驾后方婴儿张嘴哭泣，脸上有泪珠
更新时间：3 秒前
```

结果：Context MATCHED → 直接提醒 → 不创建动态任务。

### 12.2 Context 明确安睡

```text
Context：副驾后方婴儿闭眼安睡
更新时间：3 秒前
```

结果：对“正在哭泣”是 NOT_MATCHED_MUTABLE → 当前不提醒 → 创建动态观察。

### 12.3 Context 没有目标位置结果

结果：UNKNOWN_MISSING → 不得判“未达成” → 创建动态观察。

### 12.4 Context 已过期

结果：UNKNOWN_STALE → 不使用旧状态 → 创建动态观察。

### 12.5 动态观察期间目标乘员离开

结果：静态前提失效 → 本轮不推理或不执行 → 根据产品策略进入 WAITING_PRECONDITION 或关闭。

### 12.6 Context 与动态结果同时命中

结果：TaskService 只创建一个 Run；另一条命中作为重复事件丢弃并记录。

## 13. Abnormal and Boundary Rules

### 13.1 动态任务被抢占/缺轮

- 本轮没有结果即“未观察到”。
- 不等于目标未达成。
- 不复用上一轮动态结果假装本轮已观察。
- 事件触发任务继续等待下一轮。

### 13.2 网络断开

- 无上传即不执行云端推理。
- 无缓存时不补历史结果。
- 恢复后使用新上报继续判断。

### 13.3 动态任务达到 3 个上限

- 新 Task 创建前检查容量。
- 超限时不创建“实际上不会被观察”的 Task。
- 引导用户删除或替换已有任务。

### 13.4 AlwaysOn 感知开关关闭

- 属于硬性前提。
- 创建时明确拒绝或引导用户开启，不进入动态等待。

### 13.5 无法判断

- 目标本身不可视觉判断：拒绝创建或结束任务。
- 目标可视觉判断但本轮证据不足：应为“未达成/等待”，不是“无法判断”。

### 13.6 时间窗口汇总

“每分钟告诉我宝宝状态”需要缓存一分钟内的多轮结果、定义缺轮比例并综合总结，不得复用单轮 Trigger 推理冒充时间窗口总结。本期 Planner 必须拦截或降级。

## 14. Module Changes

| 模块 | 当前 | 本需求变化 |
|---|---|---|
| Planner/Director | 判断并路由 Task | 识别任务对象、位置和四层意图；不直接判断状态 |
| Task Spec Builder | 自然语言生成 TaskSpec | 增加 activation、preconditions、observation、context reuse、fallback、completion policy |
| Task Manager | 创建后注册 Trigger | 新增 Context 检查和分支编排；决定是否需要动态任务 |
| Context | 提供文本/结构化状态 | 需要对象、位置、来源、observed_at 和有效性 |
| Trigger Adapter | RuleSpec 转现有协议 | 需要承载组合规则或支持 TaskService 分阶段调用 |
| Trigger | 条件、定时、推理分开 | 支持前置条件校验、数据来源记录、同 Task 幂等命中 |
| AI Service/VLM | 收到列表后观察 | 只接收确需动态观察的 Task；全量列表更新逻辑不变 |
| SP | goal + data 单轮语义判断 | 不负责查询 Context、时间窗口或生命周期；输出协议保持不变 |
| Runtime Dispatcher | 回调后执行 | 执行前再次校验必要前提 |
| Observability | 记录结果 | 增加命中来源、Context 时间、fallback 原因、缺轮和重复命中 |

## 15. Technical Implementation Options

### 15.1 方案 A：TaskService 编排（首期推荐）

```text
TaskService 查询 Context
  → 足够：直接 Run
  → 不足：注册 VLM scene + 下发动态任务
```

优点：不要求 Trigger 立即支持复杂组合场景，责任与 Task 生命周期一致。

需要研发确认：Context 中自然语言描述若仍需模型语义判断，使用哪个同步能力返回 MATCHED/NOT_MATCHED，而不能沿用“只有达成才异步 callback”的接口。

### 15.2 方案 B：Trigger 组合场景

同一 Scene 同时保存 Context 前置条件和 VLM inference goal，由 Trigger 先订阅 Context，再决定是否接收/执行动态推理。

优点：条件判断集中；缺点：改动更大，现有单一 `scene_type` 和分离参数需要重新设计。

### 15.3 产品必须坚持的结果

产品不强制选 A 或 B，但最终实现必须满足：

1. Context 命中时不重复创建动态观察。
2. Context 不足时能确定性进入动态观察。
3. 动态命中后执行前能重新校验。
4. 同一激活周期只产生一个 Run。

## 16. Observability

每次判断至少记录：

- task_id、scene_id、run_id/activation_id。
- 判断阶段：create/context/dynamic/pre_execute。
- 数据来源：Context 或 dynamic VLM。
- observed_at/report_time。
- Context 状态：matched/not_matched/missing/stale/unsupported。
- 是否发生 dynamic fallback 及原因。
- 模型判断结果。
- 是否产生 callback/Run。
- 是否被幂等拦截。

## 17. Acceptance Cases

1. Context 已满足目标，直接 Run，不下发动态任务。
2. Context 未满足但可变化，正确下发动态任务。
3. Context 缺失，正确下发动态任务，不误判未达成。
4. Context 过期，正确下发动态任务。
5. 硬性前提不满足，不下发动态任务。
6. 动态上报未达成，继续等待。
7. 动态上报达成，回调并执行。
8. 动态上报无法判断，按策略继续/结束。
9. 动态任务被抢占缺轮，不触发、不复用旧轮。
10. 目标位置不匹配，不触发。
11. Context 与动态结果冲突，进入未知/等待。
12. Context 和动态同时命中，只生成一个 Run。
13. Task 已取消后迟到动态结果不触发。
14. Task 更新后旧 scene 结果不触发。
15. 一次性 Task 成功后删除 scene 和动态任务。
16. 执行失败时按保留/重试策略处理。
17. 周期 Task 每次到点重新查询 Context。
18. “每分钟总结状态”被 Planner 拦截或明确降级。
19. 动态任务超过 3 个时不创建空任务。
20. AlwaysOn 关闭时明确反馈用户。

## 18. Release

### 首期

- 支持当前时刻 Context 结果优先。
- 支持 Context 不足时动态 VLM 兜底。
- 支持任务创建、动态命中和执行前三个检查点。
- 支持幂等和基础可观测。
- 不支持时间窗口聚合和跨 Task 历史复用。

### 后续

- 时间窗口内多轮 VLM 聚合。
- 不同 Context 字段的精细化有效期。
- 跨来源冲突消解。
- Trigger 原生组合条件表达式。
- 动态任务容量的自动替换和优先级管理。

## 19. Product Decisions Required Before Review

1. 哪些 Context 字段允许首期复用？
2. 每类字段的有效期由产品固定还是由数据源提供？
3. Context 中的自然语言描述由谁做语义判断？
4. 后排暂时无人属于等待前提还是直接结束？
5. `无法判断` 连续出现多少次后需要结束或通知用户？
6. Context 与动态 VLM 冲突时的产品策略是什么？
7. 延时任务到点后允许动态观察多久？
8. 动态任务达到 3 个上限时，是拒绝还是允许用户替换？
9. 首期是否明确排除所有时间窗口总结类任务？
10. Trigger 组合条件由 TaskService 编排还是 Trigger 原生支持？
