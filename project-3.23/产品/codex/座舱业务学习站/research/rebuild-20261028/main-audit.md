# 主链路原文核对与重写记录

2026-10-28。此记录供改稿追溯，不作为用户阅读主线。没有宣称读完全部飞书正文，也没有重新核验任何版本的实车部署。

## 本次实际读取的原文

均是既有飞书正文的本地缓存，不是上一版学习站生成的教学段落。

- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/voice/body-car-voice.md`：全文读取。音频处理、音区、ASR、离在线 ASR 采信、热词、权限。保留 PRD 中“删除”“TBD”“by 项目”的界限；不把主驾免唤醒删除方案和声纹规划画成统一必经步骤。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/voice/body-vad-prd.md`：全文读取。预请求只做拒识、意图、简单复杂，不抢跑至 FC/Planner/DM；时间值暂定，末尾另有文本匹配变更。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/voice/body-vad-tech.md`：全文读取。推荐方案三：预请求独立 HTTP 到 AIDV；request_id 关联同次说话，round_id 标识候选轮次。方案一/二不得串成生产步骤。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/voice/body-client-arbitration.md`：全文读取。包含多项 Todo 和候选设计，未作为已经完成的协议实现写进正文。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/voice/body-arbitration-prd.md`：全文读取。无网强离线、有网并行、白名单优先、feel 等云端、非白名单超时兜底。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/voice/body-tts-service.md`：全文读取。在线/离线/缓存、音频优先级、UI 联动。第 244 行明确“不包括在线合成中断后的离线断点续播”。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/director/bodies/C6Ciwrfn0i1Vt7kw3kgcWluxnvh.md`：读取当前版本头、新策略完整段及拼接示例，并查看后半旧内容的明显分界。新策略以 2026-10-13 v0.5 为准；“以下内容无需查看/先不看”旧策略没有继续混用。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/director/bodies/UsHgwkm2Sig3blkAttBclYb0n4g.md`：分段检查了新的执行身份、播放终态与改造工作包。全文体量较大，本次工具输出有截断；因此没有把其中待改造方案升级成线上事实。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/director/bodies/OjGMwBX8fiLS0ikDWqVceVjhnPg.md`：全文读取。V2 取消统一精筛、预注入加按需检索；profile 仍在长期规划，不把所有能力都当现有。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/director/bodies/XRuKwJ0VPisdUhkxH0ecY1rRn9g.md`：读取 v1.7 版本头、模块职责、输入输出、AI Car 1.0 链路、交互与打断恢复段落。后半完整评测表不属于本次重写事实依据。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/director/bodies/EWziwFVftiGvnlk0FA4cadqonud.md`：全文读取。预启动/放行、ReAct、实际工具注入、回流与直返、轮次协调、Agent Server 对接。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/director/bodies/KDJpd1kTmoDgEexJpTicZAlin8e.md`：全文读取。单 Agent 配置查询/依赖准备/Executor/后处理；明确不负责 Planner 规划的编排。
- `/Users/bytedance/Desktop/3.23/产品/codex/全源重读-20261023/director/bodies/ZS6rd5ytKomVEwxDVebcKGTkn6d.md`：读取接口请求响应、卡片/透传、模型内容、is_finish、fallback/cancel 约定。鉴权细节不进入业务教程。
- `/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/coverage-expansion/core/driver-agent-prd.raw.json`：读取 3 月产品定位、职责、导航/泊车/安全边界设计。含大量规划性用户故事，不作为当前统一能力集。
- `/Users/bytedance/Desktop/3.23/产品/codex/座舱业务学习站/research/coverage-expansion/core/driver-d2d-current.raw.json`：读取名词定义、D2D 场景 1.1 全链、SOP 单泊车限制、改目的地/泊车目标/临停及场景 4。此材料将 Director 曾用名 Planner 写明，司机 Agent 单独定义。

## 必须纠正的结构问题

1. 输入管理的旧“首 token 后不打断”和新“完整输出/起播分支”不能叠成一个确定时序。新稿 M 页按 PRD 新策略说明，部署状态未作断言。
2. Context V1 写入→粗筛→统一精筛属于旧架构；V2 预注入+按需检索不能在后面继续接同一个统一精筛框。
3. Planner 可以被预启动但未放行；这不代表每个请求已经进入模型推理，更不代表已产生动作。
4. 车端白名单快路径、云端简单路径、完整 Planner 是分支，不是每句话必须走完的串联阶段。
5. ReAct 普通工具反馈回模型；直返工具跳过后续模型总结。两者不能合成必经一条线。
6. Agent Server 适配单 Agent 的调用，不能给它画成全局 Planner 调度器。
7. `is_finish` 是响应结束，不等于车辆动作、播放或导航目标已经完成。
8. 话术/表情、工具卡片、真实车辆执行是不同输出通道；同一请求下协同，不是 TTS 播完再执行全部车控。
9. D2D 司机 Agent 是 SLS 的垂域协调层，不能称为 Director；普通导航+激活智驾又可以是 Director 先导航后 auto_drive，不能所有导航都强制过司机 Agent。
10. SLS 目的地泊车无图、有图无车位、成功匹配是不同后续；不能用“失败自动降级”一条泛化箭头代替用户确认和地图界面操作。
11. 当前注入工具集合由车型/渠道/注册配置决定。本站 46 个目录条目包含补充与历史项，不得宣传为当前 46 个全部在线工具。

## 新稿交付

`content/source-rebuild-main.json`：8 页（V/R/M/C/D/E/DR/O）、65 个业务步骤、72 条显式连线。每步有谁做、做什么、详细说明、产出、下一步与来源 ID；分支条件单列。`overviewEdges` 给跨模块已核对的连接；`toolScope` 说明实际工具数和调用机制。

这些数字仅供校验数据完整性，不作为内容质量或全文阅读覆盖率指标。
