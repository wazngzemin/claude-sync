# 【AI汽车】Agent Server One Page
# 服务定位
Agent Server处于整个链路的最底层，其主要职责是对外提供通用的方法调用各类Agent，为外部调用方屏蔽Agent调用细节。Agent Server具备Agent信息管理、对外适配各方Agent调用协议、Agent预处理和后处理等功能，但不具体负责根据Planner的规划对Agent进行编排调度工作。编排调度会有专门的LLM调度模块负责，Agent Server专注于单Agent的管理和调用等。
# 详细设计
## 业务架构
## 总体流程
上图展示了Agent Server中调用单个具体Agent时的总体流程，主要分为预处理、Agent/Tools调用和后处理三个部分。
#### 预处理
1. 根据调用Agent Server接口时传入的agent\_id，从数据库中检索出对应的Agent配置信息（包含请求端点、来源类型等和调度相关的重要元信息）
2. 根据Agent元信息从请求参数或context模块中获取对应的上下文依赖
3. 根据Agent需要为Agent添加业务后处理逻辑
#### Agent/Tools调用
1. 在正式调用阶段，会根据Agent的类型（豆包、DPFM等）由对应的Executor执行
#### 后处理
1. 通用后处理操作：将不同Executor的响应会转成座舱Agent协议中定义的回包格式
2. 对部分特殊业务Agent，执行自定义的后处理逻辑：如音乐只有结构化数据，需要将结构化数据转成文本作为模型上下文使用
3. 对Agent输出结果，Agent Server会在IsFinish为true的包时将收到的结果存入历史表中并结束此次Agent调用过程。
## Context获取
类型
 | 
说明
 | 
History获取
 | 
用户历史对话记录（包含Q、A）
 | 
Memory获取
 | 
长短期记忆，传递和使用方式待定
 | 
端状态获取
 | 
 | 
SystemPrompt获取及渲染
 | 
~~部分Agent支持传自定义SP时使用~~
Agent内部自行从Fornax上获取SP
 | 
UserPrompt获取及渲染
 | 
~~部分Agent的输入Query需要按照特定格式构造时使用~~
Agent内部自行从Fornax上获取UP
 | 
## Agent协议
> ~~参考文档：~~[【WIP】座舱agent协议](https://bytedance.larkoffice.com/docx/Q4KWd1Nu1oh9vIxfarEc7mpsnLb)
> 
> 参考后续IDL里的定义
> 
> 
座舱侧Agent协议中包含消息协议、控制协议
消息协议：
- 上下文信息传递：
    - 历史消息
    - 端状态信息
    - 长短期记忆
- 控制协议：     
    - 预请求协商
    - Fallback逻辑
    - 下一跳目标Agent指定（支持用于A2A场景）
### 调用流程
**正常流程**
**Fallback流程**
**Redirect流程**
调用过程中如用户操作打断了本次请求，调用方可通过Context发送cancel信号，然后再断开连接。Agent Server在收到cancel信号后会通知下游服务结束请求，并在历史表中记录已生成内容。
### IDL
IDL定义统一在代码仓库中管理https://bits\.bytedance\.net/code/stone\_vehicle/vehicle\_idl/blob/master/thrift/aidv/agent/agent\_base\.thrift?ref\_type=heads
## Agent 管理平台
主要用于处理agent相关信息，新建或者管理Agent实现
[Agent 管理平台使用 SOP](https://bytedance.larkoffice.com/wiki/LCIvwi858iuqvWkTN7mcVZrBnhb)
## 三方Agent协议
外部客户有需求将自己的Agent接入到整体链路中使用的场景。为减少此场景下座舱侧适配成本，客户需要基于座舱侧对外的Agent协议进行实现并提供服务接入点。座舱侧将客户Agent相关的信息注册到座舱链路中，在需要时直接调用。
[【WIP】Agent HTTP协议](https://bytedance.larkoffice.com/docx/ZS6rd5ytKomVEwxDVebcKGTkn6d)
## 
