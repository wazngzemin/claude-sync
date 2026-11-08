# N2 Always On 与 Watcher — 资料里有、副本需补/修正的事实点

## AlwaysOn 三任务与 VLM 生命周期管理
- 端侧 VLM 本身不具备自主决策能力，需要 AlwaysOn 模块管它什么时候开/关/跑什么任务/结果给谁。
- 三任务：舱外（前视 caption 3s 周期）/舱内动态（5s）/舱内静态。
- 开关条件：power==on && Awake Button 开 → start；power==off 或 Button 关 → stop。
- 来源：端侧触发器 PRD docx Q1RBwsEuliWvk6kv8Jxc1JB7nEc。【2.6目标·赛力斯】

## Watcher 与触发器的关系
- 副本 S 章画板有 Advisor→Watcher→目标管理；端侧 VLM 定时上报结果→任务系统转发→触发器推理判断目标是否达成。
- AlwaysOn 周期任务持续循环直到 power→off；OneShot 任务超时守卫释放 VLM_FRONT 摄像头互斥。
- 来源：端侧触发器 PRD + KvUUwo9 触发器三类链路画板。【2.6目标】

## 待核
- Awake Button（物理按钮）与 AI 设置里的主动服务开关是两个层级（逐字稿 Mijvdy2），副本 N2 若混为一谈需拆开。
