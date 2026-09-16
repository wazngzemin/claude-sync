# AI Car主链路架构

<div class="callout">

本篇为AI Car1\.0整体大块的架构链路图，作为主线产品迭代的施工图，方便各角色同学快速明确全局模块协作关系，对齐整体落地规划和检查各个模块的进展。

详细的架构链路细节，见[豆包incar1\.0\-长期架构梳理](https://bytedance.larkoffice.com/docx/XM8GdtFsTok8CwxcMrKcywMmnQg)

详细feature，见[【AI汽车】 FeatureList](https://bytedance.larkoffice.com/sheets/Ue0ZsJ9N2he0LOtA9kdcZKsrnI4?sheet=wLVvuJ)

产品对核心功能落地节奏期望，见[AI car产品计划及里程碑](https://bytedance.larkoffice.com/docx/KBqedMH8LoTy1Yxai9Sc5G93nDf)

</div>

# AI Car宏观架构



# 主线内部链路架构（AI Car规划）



# 落地链路细化梳理（2\.6目标\+长期）

> 从产品模块视角，说明全局架构中各模块之间交互的详细链路，和设计\+现状系统逻辑1：1对齐
> 
> 

更新架构

TOb架构

# 豆包架构及分工

**架构核心理念**

- 通过react架构，在低延迟满足用户对话交互同时，灵活调用汽车全域工具

- 拆分即时任务和异步任务，配备动静态目标机制，驱动持续满足场景需求

- 实时感知车内大量系统\+视觉信息，结合情境注意力机制关注重要上下文

- 打通豆包app控车能力，共享上下文记忆

- 隐私视觉\+记忆信息端侧存储，简单任务端侧处理

**分工原则**

- 火山：负责端云工程链路搭建、端云模型精调部署、汽车生态工具、汽车感知信号处理、小程序开发

- 豆包：提供核心模型能力、豆包生态工具、手车通信链路支持、小程序框架



# 链路性能

> 全局各链路流程的每个节点之间的时延性能目标
> 
> 



# 车企协作链路架构




