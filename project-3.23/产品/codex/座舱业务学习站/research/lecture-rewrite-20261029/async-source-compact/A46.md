# 【AIVA\-视觉感知】AI\-Box视觉感知信号上传端状态 V1\.2
修订纪要：
2026\.7\.1
V1\.0
初始版本建立
丁彬
2026\.7\.3
V1\.1
梳理端状态，增加异常处理与存储策略
丁彬
2026\.9\.22
V1\.2
新增舱外alwayson的caption
丁彬
参考文档：
[【AICar】主线端侧VLM需求汇总](https://bytedance.larkoffice.com/wiki/HqaswAMWviJEVAkdmBxcZ8eUnBb)
[端侧VLM模型能力 \&amp; 输入输出定义](https://bytedance.larkoffice.com/wiki/NuunwklpIiGS91kg7lRcAprqnMd)
## 背景
AIVA 项目新增了AI\-Box 端侧 VLM模型，VLM模型感知的结果需要上传到云端context，供 Director，静态Advisor、动态Advisor去使用。本需求的核心目标是：将AI\-Box上的VLM输出的结果上传给端侧信号库。
## 链路图
## 相关方梳理
VLM 触发路线
VLM 模型
VLM 上传路线
静态Advisor 触发路线
动态Advisor消费路线
相关方
触发源：
1. 端侧触发器 \+ 云端触发器
2. sls 应用
被触发：
Yitu \+ VLM
1. 0804要交付的范围：
[【端状态】端侧模型格式梳理](https://bytedance.larkoffice.com/wiki/MN4JwSA64iCPQ8kn4YHcJ7bQnbc)
1. 发送方：
yitu\+vlm
2. 中继：
AI service
3. 接收方：
云端 端状态
1. 触发源：云端context \+ 云端触发器
2. 被触发者：静态Adv
1. 既有信号可以cover：动态Adv \+ 云端触发器 \+ 云端Context
2. 需要新拼sp解决的：动态Adv \+ 云端触发器 \+ 端侧触发器
## 上云数据
上云数据：[【端状态】端侧模型格式梳理](https://bytedance.larkoffice.com/wiki/MN4JwSA64iCPQ8kn4YHcJ7bQnbc?sheet=SXNMmo)
- 目前需要上云的数据由表格内A列为“是”的任务进行生产，可以参考下面的截图。
- 任务分别为：舱外AlwaysOn任务，舱内AlwaysOn（动态）任务，舱内AlwaysOn（静态）任务。
- 上云的数据为对应的任务开启后的原始输出，整个上传过程不对模型的原始输出做任何调整，只做整包上传。
PS：模型的原始数据上云后，将会进入端状态，后级业务会在此将数据进行二次组织后提供给更后级的业务使用。
变更为
## 上云通道
1. 开关
1. 周期类任务：VLM\-SDK负责舱外AlwaysOn任务，舱内AlwaysOn（动态）任务，舱内AlwaysOn（静态）任务的开启和关闭，控制逻辑如下
2. AlwaysOn Button 的状态是由端侧（@汪帅）提供
任务
开
关
舱外AlwaysOn
AI\-Box启动后默认打开
AI\-Box 关闭后默认关闭
舱内AlwaysOn（动、静态）
AI\-Box启动后 \&amp; 设置中的AlwaysOn Button 开
AI\-Box 关闭 or 设置中的AlwaysOn Button 关
2. **AI Service** **接收并上传**
通道：由端侧触发器来请求AI\-Box，AI Service 订阅相关Topic并接收结果，随后将结果透传至云端 端状态，链路图如上。
## 异常处理与存储策略
1. 上传异常：按业务场景分级处理
1. 周期类（时效优先）：网络异常时丢弃积压包，不组织补传，仅轮询上报最新状态，保障上传数据的实时性
2. One\-shot类（成功率优先）：漏传触发 1 次自动补传。断网时暂存本地，网络恢复后通过断点续传发出。
2. 云端兜底：不设兜底，但有失效机制
1. 云端兜底：本需求不设云端兜底，由于后续消费方最熟悉自身业务逻辑，由各业务方根据具体场景自行定制兜底机制，以保障最优的用户体验
2. 信号有效期：端状态有过期机制，有效期内正常使用，超期自动作废，防止过期数据引发业务报错
3. 端侧存储：即用即弃
1. 本地不留存：不进行本地数据库存储，未上云及过期信号在本地自动销毁
---
## 参考任务：开充电口盖