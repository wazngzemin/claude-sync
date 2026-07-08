---
title: 从单点问答到场景化 — 车载 Planner 评测体系的演进实战
date: 2026-05-26
updated: 2026-05-29
tags: [synthesis, methodology, evaluation, planner]
sources:
  - raw/articles/AI Agent评测入门.html
  - raw/articles/Agent评测方法论梳理.html
  - raw/articles/Director评测重点与打分指南.html
  - raw/articles/车载智能助手评测体系2.0.html
  - raw/articles/豆包汽车如何更像人.html
  - raw/articles/司机Agent_统一评测集.md
  - raw/articles/concepts 评测体系建设.md
  - wiki/synthesis/driver-agent-eval-query-set.md
status: draft
---

# 从单点问答到场景化:车载 Planner 评测体系的演进实战

> **TL;DR**
> 通用 Agent 评测告诉我们"该做什么"。但 Planner 作为 Agent 系统里的"大脑节点",它的评测信号必须穿透到决策本身,而不止于看最终效果。本文记录某车载 AI 助手把一套通用方法论落到 Planner 上,所做的**三次重构**:评测对象从"指令"重构到"场景";评测视角从"结果"重构到"过程+归因";评测维度从"功能正确"重构到"像人体验",并把整条链路工程化为一条可自动化的流水线。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div style="background:#fff;border-left:4px solid #95a5a6;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#95a5a6;font-weight:600;font-size:13px;">Part 1 · 起点</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">1.0 评测体系做什么、为什么不够用</div>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:18px;">▼</div>
    <div style="background:#fff;border-left:4px solid #e67e22;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#e67e22;font-weight:600;font-size:13px;">Part 2 · 转折</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">产品形态变了,评测体系暴露了 3 个漏洞</div>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:18px;">▼</div>
    <div style="background:#fff;border-left:4px solid #3498db;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#3498db;font-weight:600;font-size:13px;">Part 3 · 重构 1</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">评测对象 — 从指令到"场景"</div>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:18px;">▼</div>
    <div style="background:#fff;border-left:4px solid #3498db;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#3498db;font-weight:600;font-size:13px;">Part 4 · 重构 2</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">评测视角 — 从结果到过程 + 归因</div>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:18px;">▼</div>
    <div style="background:#fff;border-left:4px solid #3498db;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#3498db;font-weight:600;font-size:13px;">Part 5 · 重构 3</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">评测维度 — 主观体验"像人"怎么测</div>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:18px;">▼</div>
    <div style="background:#fff;border-left:4px solid #27ae60;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#27ae60;font-weight:600;font-size:13px;">Part 6 · 工程化</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">5 个 Prompt 串起一条自动化流水线</div>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:18px;">▼</div>
    <div style="background:#fff;border-left:4px solid #8e44ad;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#8e44ad;font-weight:600;font-size:13px;">Part 7 · 难题</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">诚实地讲 — 正在解决的问题</div>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:18px;">▼</div>
    <div style="background:#fff;border-left:4px solid #c0392b;padding:14px 18px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <span style="color:#c0392b;font-weight:600;font-size:13px;">Part 8 · 建议</span>
      <div style="color:#2c3e50;font-size:14px;margin-top:4px;">给同行的 5 条建议</div>
    </div>
  </div>
</div>

---

## 写在前面:为什么 Planner 评测不能照搬通用 Agent 评测

主流 Agent 评测的工作范式,通常假设系统是一个**端到端**的 Agent:给它一个目标,它自己规划、调用工具、产出结果,评测者只需要在结果和过程上设计观测点。在 SWE-bench、WebArena、τ-bench 这类基准里,这个假设是成立的。

但车载 AI 助手不是这样的结构。在我们的系统里,Planner 是漏斗最深处的"大脑节点",它前面有句法 RAG、情景 RAG 与简单/复杂仲裁两层过滤,后面有 20+ 个下游工具承接执行。一次用户语音从输入到反馈,Planner 只是这条链路的某一环——它的任务**不是把事做完,而是决定怎么做**。

这意味着对 Planner 的评测有两个被通用框架忽视的特点:

**第一,它的输出不是最终用户感知。** 用户体验到的是"空调有没有开、话术好不好听",而 Planner 输出的是一个 JSON——`talk_or_not / talk_content / action_list`。Planner 决策对了但下游工具失败,用户体验是差的,但锅不在 Planner;反过来 Planner 决策错了但被下游"擦屁股"擦回来,体验看上去也还行,但风险已经埋下。**结果导向的评测会让真正的 Planner 问题被淹没在系统噪声里。**

**第二,它的输入构成是高维的。** Planner 一次调用接收 SP(~30K tokens 的系统提示,含 23 个工具定义、69 个示例、车辆设备知识、聊天风格)加 UP(对话历史 + 当前 user query + 动态注入的车况/记忆/感知/目标队列等 context)。同一句"我好热",在不同 context 下应有完全不同的最优解——这件事在通用 Agent 评测里很少需要被显式建模,但在 Planner 评测里它就是核心矛盾。

所以本文的逻辑是:**通用方法论的骨架是对的,但每一根骨头都要在车载 Planner 的具体约束下重新长肉**。这个"长肉"的过程,我们做了三次重构。

---

## Part 1 — 起点:1.0 评测体系做了什么,为什么不够用

### 1.1 1.0 的工作模式

1.0 评测体系是为"传统车载语音助手"设计的——市面上大部分车机都是这个形态。它的核心工作假设非常清晰:**用户每次说一句话,系统执行一次,我们评测这一次。**

按这个假设,1.0 把评测拆成了五个相对独立的类目:

- **导航类**:目的地解析、路线偏好、路况查询、途经点设置
- **多媒体类**:音乐播放、点歌、调音量、切歌、电台
- **车控类**:空调、车窗、座椅、灯光、雨刮等近百个原子动作
- **闲聊类**:开放对话、问答、陪聊
- **搜索类**:POI 搜索、知识问答、车书检索

每个类目下,我们维护一个 case 库。一条 case 大致长这样:

```
query: "把主驾座椅加热打开,温度调到中档"
期望:
  - 工具: vehicle_basic_control
  - 参数: seat_heat = on, position = driver, level = medium
  - 话术: 包含确认信息(主驾座椅/中档)
```

跑评测就是**把整个 case 库灌进去,统计单条 case 的通过率,加权汇总成各能力域得分**。主观题(比如闲聊回复是否得体)用对抗评估(A vs B 两两对比)或者 1-5 分人工评分。整套流程跑一遍,出一份报告,然后用同一个 case 库横向对比竞品。

### 1.2 1.0 体系真正解决了什么(不要全盘否定)

我们要去做 2.0,不是因为 1.0 错了,而是因为 1.0 不够用。它在它服务的产品形态下做了几件**到今天我们仍然依赖**的事:

1. **为基础能力提供了可重复的度量衡。** 当模型或 SP 改动后,我们能在半天内知道"车控基础能力的准确率是涨了还是跌了"。这件事看上去普通,但没有它一切都是手感。

2. **跑通了回归测试的工程链路。** Case 库的版本管理、批量执行、结果归档、横向对比报告,这套基建是后面 2.0 直接复用的。

3. **沉淀了"准出标准"这个产品决策机制。** 比如 v3.0 准出要求车控类 ≥ 96%、闲聊类不能比 v2.9 下降超过 2 个百分点——这种 Go/No-Go 的硬门槛,本身就是评测体系最有价值的产出之一。

4. **建立了团队的统一语言。** 产品、研发、QA 在讨论"这个 case 该不该过"时,大家在同一个 case 库、同一个评分卡上对话——评测体系真正的力量不只是数字,而是把所有人拉到同一张桌上。

> **这一点对外分享时要强调**:任何方法论演进的第一步,不是推翻前任,而是先承认前任在它的时代里做对了什么。否则团队和外部读者都会怀疑你只是想刷一波"重做"的工作量。

### 1.3 1.0 的五个隐含假设(也是它的边界)

把 1.0 的工作模式压到极简,它依赖五条隐含假设。这五条假设在传统车机时代基本成立,但每一条都会在 AI 汽车的产品形态下被打破——这就是后面"转折"的源头。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 10px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:8px 14px;color:#95a5a6;font-weight:600;width:38%;">1.0 的隐含假设</th>
        <th style="text-align:left;padding:8px 14px;color:#95a5a6;font-weight:600;">何时被打破</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">① 一问一答</td>
        <td style="background:#fff;padding:14px;border-radius:0 6px 6px 0;color:#7f8c8d;">主动服务出现 — 用户没开口,系统已经在判断要不要说话</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">② Case 相互独立</td>
        <td style="background:#fff;padding:14px;border-radius:0 6px 6px 0;color:#7f8c8d;">多步任务、持续任务出现 — 前后动作有依赖,Case 不能再被孤立评</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">③ 指令是明确的</td>
        <td style="background:#fff;padding:14px;border-radius:0 6px 6px 0;color:#7f8c8d;">"我好热""带我兜风"这类模糊指令成为主流,最优解依赖 context</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">④ 只关心最终结果</td>
        <td style="background:#fff;padding:14px;border-radius:0 6px 6px 0;color:#7f8c8d;">偶然成功 vs 稳定成功的差距开始决定信任感,过程必须被看见</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">⑤ 主观维度靠人工打分</td>
        <td style="background:#fff;padding:14px;border-radius:0 6px 6px 0;color:#7f8c8d;">"像不像人"成为产品的核心卖点,但 1-5 分卡无法定位问题</td>
      </tr>
    </tbody>
  </table>
</div>

这张表也是本文后面几个 Part 的对应索引:Part 2 解释这些假设为什么会被打破;Part 3 解决①②③;Part 4 解决④;Part 5 解决⑤。

---

## Part 2 — 转折:产品形态变了,评测体系暴露了 3 个漏洞

### 2.1 产品端的三个变化

当车载助手从"语音控制工具"演进为"伙伴式 AI",有三个产品形态变化是**同时发生**的,它们各自单独都会冲击评测体系,叠加起来则让 1.0 的核心假设彻底失效。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <table style="width:100%;border-collapse:separate;border-spacing:12px 14px;">
    <thead>
      <tr>
        <th style="width:30%;font-size:13px;color:#95a5a6;font-weight:600;text-align:left;padding-bottom:6px;">维度</th>
        <th style="width:30%;font-size:13px;color:#95a5a6;font-weight:600;text-align:left;padding-bottom:6px;">1.0 形态</th>
        <th style="width:6%;"></th>
        <th style="text-align:left;font-size:13px;color:#3498db;font-weight:600;padding-bottom:6px;">2.0 形态</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px;color:#2c3e50;font-weight:600;font-size:14px;">交互结构</td>
        <td style="background:#fff;padding:14px;border-radius:6px;color:#7f8c8d;font-size:13px;line-height:1.6;">1 问 1 答<br/>用户主导</td>
        <td style="text-align:center;color:#3498db;font-size:18px;font-weight:bold;">→</td>
        <td style="background:#eaf4fc;padding:14px;border-radius:6px;color:#2c3e50;font-size:13px;line-height:1.6;border-left:3px solid #3498db;">0 问 1 答(主动服务)<br/>1 问 N 答(多步/持续)<br/>N 问 M 答(多人/角色)</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px;color:#2c3e50;font-weight:600;font-size:14px;">输入构成</td>
        <td style="background:#fff;padding:14px;border-radius:6px;color:#7f8c8d;font-size:13px;line-height:1.6;">指令 = 输入</td>
        <td style="text-align:center;color:#3498db;font-size:18px;font-weight:bold;">→</td>
        <td style="background:#eaf4fc;padding:14px;border-radius:6px;color:#2c3e50;font-size:13px;line-height:1.6;border-left:3px solid #3498db;">指令 + Context = 输入<br/><span style="color:#7f8c8d;font-size:12px;">(端状态/记忆/感知/历史/画像/天气...)</span></td>
      </tr>
      <tr>
        <td style="background:#fff;padding:14px;border-radius:6px;color:#2c3e50;font-weight:600;font-size:14px;">关注焦点</td>
        <td style="background:#fff;padding:14px;border-radius:6px;color:#7f8c8d;font-size:13px;line-height:1.6;">只关心"做了没"</td>
        <td style="text-align:center;color:#3498db;font-size:18px;font-weight:bold;">→</td>
        <td style="background:#eaf4fc;padding:14px;border-radius:6px;color:#2c3e50;font-size:13px;line-height:1.6;border-left:3px solid #3498db;">做对了吗 + 怎么做<br/>+ 说做一致吗 + 像人吗</td>
      </tr>
    </tbody>
  </table>
</div>

**变化 1:从一问一答到主动服务。** 1.0 时代,系统的输入是用户开口说的那一句话。AI 助手时代,系统的输入还包括**它自己感知到的环境信号**:用户上车了、堵在通勤路上 30 分钟没说话了、副驾坐着不熟悉的人、外面下了暴雨。在这些信号下,系统要决定"要不要主动说话",这是一个全新的决策维度。

**变化 2:从指令到指令+Context。** 这里的 context 不是 RAG 召回的几段文本,而是结构化的环境状态:车辆当前的开关位、电量、空调温度、用户画像里"不喜欢紫色"、记忆库里"上周去过的游泳馆"、感知到的"副驾在睡觉"、地理位置上的"前方 5 公里有充电站"。**同一句话,在不同 context 下应该走完全不同的解。**

**变化 3:从动作正确到行为合理。** 用户开始期待"伙伴感"——这意味着话术要自然、节奏要得体、要懂潜台词、不能说一套做一套、不能在背单词的小朋友面前突然播报"剩余电量 58%"。**功能正确成为底线而不是目标。**

### 2.2 评测端被暴露的三个漏洞

这三个产品变化,在 1.0 评测体系上分别打开了三个漏洞。每一个漏洞我们都用真实例子说明。

---

**漏洞 ① — 单点 case 测不出"主动服务"质量**

设想这样一个场景:用户上车,系统通过 Advisor 模块判断"这个时间点用户通常在通勤,且外面正在下雨",于是主动播报:"今天下班路上有雨,我提前帮你关好车窗、打开了空气循环,要不要规划一下避开拥堵的路线?"

这是一次典型的 0问1答主动服务。1.0 评测体系完全无法承载它:

- **没有用户 query**,case 库的每一行第一列空了
- **触发条件是模糊的**——并不是"每次上车 + 下雨"都该主动播报,要看用户当前是否在打电话、是否在和副驾说话、最近几次是否拒绝过类似推荐
- **未触发不等于 bug**——预设了应该主动推荐,系统没触发,可能是合理保守,也可能是 Advisor 漏判
- **超预期触发也不等于惊喜**——系统在预设之外主动说话,可能是体验提升,也可能是噪音

> 在 1.0 case 库里强行写一条"上车 + 下雨 → 期望主动播报",评测员只能判"触发了/没触发"。这个二分判断既无法度量"触发得是否得体",也无法处理"在预设之外的合理触发"。**评测维度本身就缺失了。**

---

**漏洞 ② — 只测结果,丢失过程信号**

考虑这个 query:

> "帮我把前排座椅加热和方向盘加热全部打开,全车空调都开启温度调到 24 度风量三档,顺便放点林俊杰的歌"

这是一个典型的单意图多指令——一次拆解出 6 个并行任务。两个 Planner 都"完成了"这个任务,但执行轨迹差距巨大:

| Planner A(好) | Planner B(差) |
|---------------|----------------|
| 一次 action_list 输出 6 个并行任务 | 第一次输出 3 个,工具反馈后再补 3 个 |
| 话术:"好的,座椅加热和方向盘加热都开了,空调 24 度 3 档,林俊杰的歌马上来" | 话术:"先帮你开座椅加热"(然后多次工具反馈才把剩下的补齐) |
| 总耗时 1.2s,token 消耗 1.4K | 总耗时 4.8s,token 消耗 3.7K |
| 说做一致 | 中途话术与实际动作出现错位("空调已经开好啦"实际上还没下发) |

在 1.0 准确率指标下,两个 Planner 都是 "case 通过"。**但用户体验差距是数量级的**:一个流畅,一个磨叽;一个值得信任,一个让人怀疑"它到底做没做"。

要把这两个 Planner 区分开,必须把评测视角从"结果"扩展到过程——具体地说,要看任务拆解的颗粒度、工具调用的并行度、话术与动作的时间对齐、首 token 时延、整个 query 闭环的总耗时。这些信号在 1.0 里完全不存在。

---

**漏洞 ③ — 没有 Context 模拟,"最优解"无法定义**

这是三个漏洞里最致命的一个,因为它**会让评测员之间的判断标准开始分裂**。

考虑同一句话:**"我好热"**。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:22px;border-radius:10px;border:1px solid #eaeaea;margin:18px 0;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div style="background:#fff;padding:18px;border-radius:8px;border-top:3px solid #3498db;">
      <div style="font-weight:700;color:#3498db;font-size:13px;margin-bottom:8px;">Context 组合 A</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.8;">
        天气:暴晒 35°C<br/>
        空调:全车关闭<br/>
        电量:充足<br/>
        舒适偏好:无特殊
      </div>
      <div style="margin-top:12px;padding:10px;background:#eaf4fc;border-radius:6px;color:#2874a6;font-size:13px;font-weight:600;">
        最优解:打开空调,调到舒适温度
      </div>
    </div>
    <div style="background:#fff;padding:18px;border-radius:8px;border-top:3px solid #e67e22;">
      <div style="font-weight:700;color:#e67e22;font-size:13px;margin-bottom:8px;">Context 组合 B</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.8;">
        天气:夏季室内<br/>
        空调:已开 16°C 风量 1 档<br/>
        电量:充足<br/>
        舒适偏好:不讨厌吹风
      </div>
      <div style="margin-top:12px;padding:10px;background:#fff3e0;border-radius:6px;color:#c0392b;font-size:13px;font-weight:600;">
        最优解:调高风量(不是降温度,温度已经到底了)
      </div>
    </div>
  </div>
</div>

这两个 case 在 1.0 评测集里,要么被合并成同一条(那这条 case 就没有标准答案了),要么被拆成两条独立的 case——但拆成两条之后,**评测员看到的是两条没有上下文的指令**,他们必须自己去想象 context,然后判断系统输出是不是合理。结果就是:同一个系统输出,A 评测员觉得过、B 评测员觉得不过,争了半天发现两人脑子里假设的 context 都不一样。

更严重的是,1.0 的"模糊指令"评测会系统性地高估或低估系统能力。如果评测员默认"我好热 = 应该打开空调",那么在 Context B 下,系统正确地选择"调高风量"反而会被判错——而我们却毫无察觉。

> **这个漏洞的本质是:1.0 评测把 query 当成独立单元,但 AI 助手时代,query 必须和 context 绑定才有意义。**

### 2.3 一句话定调

到这里,1.0 → 2.0 的必要性已经讲清楚。把它压成一句话作为后面三章的总锚点:

> 评测体系不是被"做错了",而是它服务的产品形态已经迁移了。
> 当产品从"工具"变成"伙伴",评测必须从"功能正确"扩展到"行为合理"。
> "行为合理"这四个字,意味着评测对象、视角、维度都要重构。

---

## Part 3 — 重构 1:评测对象,从指令到"场景"

### 3.1 核心定义

2.0 评测体系把"场景"作为基本单元,代替了 1.0 里的"指令"。一个场景由两部分构成——**元素**(描述这个场景是什么)和**需求**(在这个场景里会发生什么)。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="text-align:center;margin-bottom:18px;">
    <span style="background:#2c3e50;color:#fff;padding:6px 18px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px;">SCENARIO 场景</span>
  </div>
  <div style="display:flex;align-items:stretch;gap:14px;">
    <div style="flex:1;background:#fff;padding:18px;border-radius:8px;border-top:3px solid #3498db;">
      <div style="color:#3498db;font-weight:700;font-size:14px;margin-bottom:10px;">元素 Elements</div>
      <ul style="margin:0;padding-left:18px;color:#2c3e50;font-size:13px;line-height:1.9;">
        <li>出行 / 上车目的</li>
        <li>主驾画像</li>
        <li>乘客 / 角色组合</li>
        <li>重要 Context(天气/路况/身心/电量)</li>
        <li>特殊场景 / 任务(庆生/接娃/出差)</li>
      </ul>
    </div>
    <div style="display:flex;align-items:center;color:#95a5a6;font-size:24px;font-weight:bold;">×</div>
    <div style="flex:1;background:#fff;padding:18px;border-radius:8px;border-top:3px solid #27ae60;">
      <div style="color:#27ae60;font-weight:700;font-size:14px;margin-bottom:10px;">需求 Demands</div>
      <ul style="margin:0;padding-left:18px;color:#2c3e50;font-size:13px;line-height:1.9;">
        <li>场景强相关需求<br/><span style="color:#95a5a6;font-size:12px;">(重点考察,预定义检查点)</span></li>
        <li>通用需求<br/><span style="color:#95a5a6;font-size:12px;">(导航/车控/媒体/闲聊,自然触发)</span></li>
      </ul>
    </div>
  </div>
</div>

这里有一个**关键设计选择**值得展开:为什么把"元素"和"需求"分开,而不是直接定义一组 case?

因为元素是**正交维度**,可以组合;而需求是**领域知识**,需要预先定义。两者拆开,场景库才有可扩展性。如果元素和需求耦合在一起,加一个新场景就要重写一组 case;拆开之后,加一个新元素维度(比如"宠物"),所有现有场景都自动获得"带宠物时的需求"这一组分支。

### 3.2 三个具体场景示例(给读者一个直观感受)

抽象定义说一百遍,不如三个具体例子。下面是 2.0 场景库里的三个**风格差异极大**的场景,可以一次性展示场景化评测的覆盖广度。

---

**场景 A — 通勤路上的"带病司机"**

<div style="font-family:-apple-system,sans-serif;background:#fff;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <div style="font-size:13px;color:#95a5a6;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">元素</div>
  <div style="color:#2c3e50;font-size:13px;line-height:1.9;margin-bottom:14px;">
    出行目的:通勤 · 主驾画像:摩登青年(28岁,程序员) · 乘客:无<br/>
    重要 Context:重感冒(用户上车前刚提到吃过感冒药)、外面降温、路况一般
  </div>
  <div style="font-size:13px;color:#27ae60;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">重点需求</div>
  <div style="color:#2c3e50;font-size:13px;line-height:1.9;">
    缓解感冒症状,关心驾驶安全
  </div>
  <div style="font-size:13px;color:#3498db;font-weight:600;letter-spacing:0.5px;margin:14px 0 10px;">期望系统行为</div>
  <ul style="margin:0;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>主动调节温度但避免冷风直吹</li>
    <li>建议路线时优先平稳少颠簸</li>
    <li>用户说"我好困"时,基础应答"建议休息区";<strong>惊喜应答</strong>"刚吃过感冒药容易犯困,要不要在 5km 后的服务区停一下"</li>
    <li>音乐推荐避免节奏剧烈、音量适中</li>
    <li>不要话痨——感冒的人不想多说话</li>
  </ul>
</div>

---

**场景 B — 自驾游路上的庆生**

<div style="font-family:-apple-system,sans-serif;background:#fff;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <div style="font-size:13px;color:#95a5a6;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">元素</div>
  <div style="color:#2c3e50;font-size:13px;line-height:1.9;margin-bottom:14px;">
    出行目的:自驾游 · 主驾画像:潮奢精质族 · 乘客:伴侣<br/>
    重要 Context:伴侣生日、目的地是民宿、天气晴好
  </div>
  <div style="font-size:13px;color:#27ae60;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">重点需求</div>
  <div style="color:#2c3e50;font-size:13px;line-height:1.9;">
    营造仪式感、不抢戏、把氛围留给两个人
  </div>
  <div style="font-size:13px;color:#3498db;font-weight:600;letter-spacing:0.5px;margin:14px 0 10px;">期望系统行为</div>
  <ul style="margin:0;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>用户说"营造一个浪漫的氛围"时,氛围灯调粉色(<strong>不是紫色</strong>——用户画像里有"不喜欢紫色")、音乐换温柔情歌、空调降到舒适</li>
    <li>主动祝福一次就够,不要反复提"生日快乐"</li>
    <li>到达民宿前主动推荐附近的鲜花店或蛋糕店,但说一次就停</li>
    <li>话术要简洁,留对话空间给两个人</li>
    <li>整个过程的人设是"懂事的伙伴",不是"热情的客服"</li>
  </ul>
</div>

---

**场景 C — 接孩子放学路上的角色扮演**

<div style="font-family:-apple-system,sans-serif;background:#fff;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <div style="font-size:13px;color:#95a5a6;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">元素</div>
  <div style="color:#2c3e50;font-size:13px;line-height:1.9;margin-bottom:14px;">
    出行目的:接孩子放学回家 · 主驾画像:潮奢精质族 · 乘客:三岁女儿<br/>
    重要 Context:有正在进行的"背单词"长时任务、视觉感知小孩坐在副驾儿童座椅
  </div>
  <div style="font-size:13px;color:#27ae60;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">重点需求</div>
  <div style="color:#2c3e50;font-size:13px;line-height:1.9;">
    陪三岁孩子玩、保持背单词节奏、不被无关任务打断
  </div>
  <div style="font-size:13px;color:#3498db;font-weight:600;letter-spacing:0.5px;margin:14px 0 10px;">期望系统行为</div>
  <ul style="margin:0;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>切换到适合三岁儿童的语言(短句、拟声、奖励引导)</li>
    <li>用户问"现在电量多少",回答"58% 还能跑很远"就够了——<strong>不要在儿童单词游戏中插一段"剩余 137km"的长播报</strong></li>
    <li>"找一个和苹果有关的东西"这类游戏指令,要给出符合常识的提示(不要让小孩去车里找"苹果")</li>
    <li>奖励机制不能用"开座椅按摩"这种与儿童无关的强化物</li>
    <li>主动推荐要克制,避免打断游戏节奏</li>
  </ul>
</div>

---

把这三个场景放在一起看,**"评测对象从指令到场景"这件事的价值就很直观了**:

- 同样的"打开空调"指令,在场景 A 里要避免直吹,在场景 B 里要营造氛围,在场景 C 里要保持儿童舒适——一个指令在三个场景里有三个最优解,这是 1.0 case 库根本承载不了的复杂度。
- 同样的"主动推荐",在场景 A 里要克制,在场景 B 里要点睛,在场景 C 里要避让游戏节奏——主动服务的合理性必须放在场景里才能判定。
- 同样的"话术风格",在三个场景里也完全不同——人设是"懂事的伙伴",但具体的语言风格随场景流动。

### 3.3 为什么场景化能堵住前面的三个漏洞

回到 Part 2 暴露的三个漏洞,场景化给出了**结构性的解法**:

| 1.0 的漏洞 | 场景化怎么解 |
|-----------|--------------|
| ① 单点 case 测不出主动服务 | 场景里**天然定义了**"该不该主动"的语境——元素决定触发条件,需求决定触发内容 |
| ② 只测结果丢失过程 | 场景里有**多步动作和依赖**,过程合理性必须被观测才能形成判断 |
| ③ Context 缺失无法定义最优解 | "元素"就是 context 的**结构化建模**——同一个 query 在不同元素下的最优解被显式区分 |

注意,这里的解法不是"我们设计了更细的 case",而是**改变了评测的基本单元**。基本单元从"指令"变成"场景"之后,原来的三个漏洞自然就闭合了。

### 3.4 场景库的搭建原则

场景化是好的,但场景库怎么建?如果不加约束,任何团队都会在三个月内把它建成一个 1000 条没人维护的烂账。下面是我们在搭建过程中固化下来的 4 条原则:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #3498db;">
      <div style="font-weight:700;color:#3498db;font-size:13px;letter-spacing:0.5px;">原则 1 · 覆盖目标用户</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">来自产品定义的核心人群 × 核心场景,不做"假想用户"</div>
    </div>
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #27ae60;">
      <div style="font-weight:700;color:#27ae60;font-size:13px;letter-spacing:0.5px;">原则 2 · 覆盖系统能力</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">感知 / 理解 / 执行 各能力域均有触发,避免某个能力被遗漏</div>
    </div>
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #f39c12;">
      <div style="font-weight:700;color:#f39c12;font-size:13px;letter-spacing:0.5px;">原则 3 · 可演进</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">Bad case 回流后场景库持续扩张,新场景必须能复用旧的元素维度</div>
    </div>
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #8e44ad;">
      <div style="font-weight:700;color:#8e44ad;font-size:13px;letter-spacing:0.5px;">原则 4 · 可组合</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">元素是正交维度,组合出新场景的成本要低于从零写一个</div>
    </div>
  </div>
</div>

第三条和第四条尤其重要,它们一起保证了场景库是**资产**而不是**负债**。

### 3.5 一个决定成败的细节:预期结果分级

这是 2.0 评测里**最容易被低估的设计**,但它直接决定了"主观体验评测"能不能落地。

> 抛开场景、语境和角色定义来聊模糊指令的最优解,都是耍流氓。

我们把每个需求对应的预期结果拆成两层:

- **基础预期(及格线)**:不出错、不影响安全、能交付的核心动作
- **惊喜预期(超出表达)**:结合 context 给出用户没说出口但符合期待的动作

举两个例子:

**例 1**:用户说"我好困"
- 基础预期:提醒驾驶安全,建议前方休息区休息
- 惊喜预期:如果记忆里知道用户刚吃过感冒药,主动提示"感冒药的困意大概还会持续一小时,建议在 5km 后的服务区休息一下"

**例 2**:用户问"充电桩这个图标是什么指示灯"
- 基础预期:结合车书回答"这是充电状态指示灯"
- 惊喜预期:结合端状态告知"它现在是绿色,代表你的车正在充电"

> **设计意图**:把"评测员凭手感打主观分"变成"评测员检查具体的检查点"。每个场景的每个需求都至少有一组检查点,分两档——这样不同评测员之间的判断标准就被锚定了。

### 3.6 通用需求和场景需求的边界

不是每个上车情境都需要从零设计。**通用需求**——导航、车控、多媒体、闲聊——只要上车就大概率会发生,它们不需要在每个场景里重复定义。

我们的做法是:

- 通用需求复用 1.0 case 库,作为"底盘评测"
- 场景需求是 2.0 新增的部分,只针对**场景强相关的重点考察**预定义检查点
- 评测时,场景对话生成可以自然触发通用需求,这些通用需求由模型自行发挥,只要不犯错就行

这样既不浪费 1.0 已有的资产,又不会让场景库变成"几十个相似 case 的合集"。

### 3.7 给同行的一个落地建议

如果你也在做领域 Agent 的评测,场景化是有用的,但**不要从"我的 Agent 有什么能力"开始**——这是工程师视角,容易把评测设计成"我会的我都测一遍"。

要从**业务里的"决策点"在哪里**开始。一个决策点 = 多条可选路径 + 选错有成本。在车载里,典型的决策点包括:

- 主动 vs 不主动
- 直接执行 vs 先澄清
- 用记忆 vs 用感知(冲突时信谁)
- 满足表面诉求 vs 满足深层诉求
- 简单回应 vs 串联多步

把每个决策点对应到一个或多个场景,**评测就有了 fixed 的"考察点"**。这是从客服 Agent、AI4SE Agent 这些领域评测里抽出来的通用方法,在车载 Planner 上同样成立。

### 3.8 场景库怎么建:三级分类 + 优先级 + 数据规范

"场景 = 元素 × 需求"是概念模型,但真到落地,团队会立刻问三个工程问题:**几千条场景怎么分类才不乱?它们都一样重要吗?一条场景在系统里到底长什么样?** 这一节给出我们沉淀下来的三个答案——它们是场景化从"理念"变成"可运行评测集"的关键。

**① 三级分类法:一级意图 → 二级约束类型 → 三级具体变体**

不要把场景平铺成一个上千行的列表,那样既找不到、也看不出覆盖缺口。我们用一棵三层的树来组织:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div style="background:#2c3e50;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;font-weight:600;">一级 · 核心意图<span style="color:#bdc3c7;font-weight:400;margin-left:8px;">条件停靠 / 目的地泊车 / 异常与边界 ...</span></div>
    <div style="margin-left:24px;background:#eaf4fc;color:#2874a6;padding:10px 16px;border-radius:6px;font-size:13px;border-left:3px solid #3498db;">二级 · 约束 / 参照类型<span style="color:#5a7a93;margin-left:8px;">无参照 / 路口参照 / POI 参照 / 视觉参照 / 驾驶风格 ...</span></div>
    <div style="margin-left:48px;background:#fff;color:#2c3e50;padding:10px 16px;border-radius:6px;font-size:13px;border-left:3px solid #27ae60;">三级 · 具体变体<span style="color:#7f8c8d;margin-left:8px;">"过完路口停" / "第二个路口停" / "在穿红衣服的人旁边停" ...</span></div>
  </div>
  <div style="text-align:center;margin-top:14px;color:#7f8c8d;font-size:12px;font-style:italic;">分类树本身就是一张"覆盖地图"——哪个二级节点下 case 稀疏,哪里就是覆盖盲区</div>
</div>

这棵树解决两件事:**找得到**(任何一条 case 都有唯一归属路径),以及**看得见缺口**(某个二级节点下只有 2 条 case,就是覆盖盲区,一目了然)。分类的维度必须**正交且可枚举**——参照类型(无/路口/POI/视觉)是正交的,所以它能当分类轴;而"难/易"这种主观维度不可枚举,就不能当轴。

**② 优先级:P0 / P1 / P2,直接挂到准出门槛**

不是每条 case 都一样重要。我们给每条 case 打一个优先级,而且这个优先级**不是评测内部的标签,而是直接对接产品准出决策**:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:14%;">优先级</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:30%;">含义</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">和准出的关系</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background:#fdecea;padding:12px;border-radius:6px 0 0 6px;color:#c0392b;font-weight:700;">P0 必过</td>
        <td style="background:#fff;padding:12px;color:#2c3e50;">核心意图 + 安全相关,错了就是事故/差评</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">硬门槛:不到 100% 不准出</td>
      </tr>
      <tr>
        <td style="background:#fff5e6;padding:12px;border-radius:6px 0 0 6px;color:#d35400;font-weight:700;">P1 重要</td>
        <td style="background:#fff;padding:12px;color:#2c3e50;">高频但非致命,影响体验上限</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">软门槛:通过率有目标值,且不允许较上一版回退</td>
      </tr>
      <tr>
        <td style="background:#eafaf1;padding:12px;border-radius:6px 0 0 6px;color:#1e8449;font-weight:700;">P2 进阶</td>
        <td style="background:#fff;padding:12px;color:#2c3e50;">长尾 / 惊喜预期 / 探索性场景</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">观察项:看趋势,不卡发版</td>
      </tr>
    </tbody>
  </table>
</div>

> **优先级最大的价值是回答"评测红了之后到底能不能发"**。没有 P0/P1/P2,一份 88% 的报告无法转成 Go/No-Go 决策——因为没人知道挂掉的 12% 是 P0 还是 P2。把优先级和准出门槛绑死,评测报告才真正进入产品决策链路。

**③ 数据规范:一条 case 的 8 个结构化字段**

最后一个最容易被跳过、但决定评测能否自动化的细节——**一条 case 必须是结构化的,不能是一句自然语言描述**。我们给每条 case 固定 8 个字段:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:22%;">字段</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">作用 / 为什么必须有</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">Case ID</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">唯一编号(如 A2-004),回归对比、badcase 追溯都靠它</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">场景分类</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">三级分类路径,决定它统计进哪个能力域</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">用户 Query</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">用户实际说的话,刻意保留口语化和变体</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">优先级</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">P0/P1/P2,对接准出门槛</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">Context</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">环境条件(车速/车道/天气/周边/导航/记忆/画像)——同句 query 的最优解由它决定</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">预期执行动作</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">期望的最小操作集合(工具 + 参数),结果检查点的来源</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">预期语音反馈</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">话术应包含/不应包含的要点,说做一致性的判据</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">异常分支</td><td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">可能的异常 + 期望兜底行为(禁停/识别失败/多候选),分支检查点的来源</td></tr>
    </tbody>
  </table>
</div>

> **给同行的落地建议**:分类法、优先级、字段规范这三件事看起来很"行政",但它们是场景化能不能跑起来的地基。一个没有结构化字段的场景库,后面 Part 6 讲的自动判定、归因统计全部无从下手——因为机器读不懂"系统应该表现得贴心一点"这种描述。**先把场景写成结构,再谈自动化。**

---

## Part 4 — 重构 2:评测视角,从结果到过程+归因

### 4.1 为什么"只看结果"会害人

在 1.0 体系下,一条 case 的判定逻辑非常简单——给一个 query,看最终系统输出,要么对要么错。这套逻辑在传统车机上能用,因为传统车机的执行链路短:语音 → 命令解析 → 直接控制。但 Planner 不一样:

```
用户 query → ASR → 仲裁 → Context 注入 → Planner 决策 → 工具调用 → 执行 → 话术播报
              ↑       ↑         ↑              ↑           ↑         ↑          ↑
            可能错  可能错    可能错         可能错       可能错    可能错      可能错
```

这 7 个环节中**任意一个出错,最终结果都不对**;但只看结果,你不知道是哪个环节出的错——更糟糕的是,有些环节即使错了,最终结果也会"看起来对"。比如 Planner 选了错误的工具,但下游工具兜底处理了;或者 Planner 漏选了一个工具,但用户没察觉。这些**带病通过**的 case,在结果导向的评测下被记作"成功",但在规模化运行中迟早会爆。

所以 2.0 必须把视角从单层(结果)扩展到三层。

### 4.2 评测视角的三层结构

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;flex-direction:column;gap:0;">
    <div style="background:#fff5e6;padding:18px 22px;border-radius:8px 8px 0 0;border:1px solid #f5d8a8;border-bottom:none;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="font-weight:700;color:#d35400;font-size:14px;letter-spacing:0.5px;">⬆ 风险 / 成本层</div>
        <div style="font-size:11px;color:#95a5a6;">Risk · Cost</div>
      </div>
      <div style="margin-top:8px;color:#7f6334;font-size:13px;line-height:1.7;">TTFT · Chunk Latency · Token 消耗 · 不安全调用 · 越权承诺</div>
    </div>
    <div style="background:#eaf4fc;padding:18px 22px;border:1px solid #bdd9ed;border-bottom:none;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="font-weight:700;color:#2874a6;font-size:14px;letter-spacing:0.5px;">⬆ 过程层</div>
        <div style="font-size:11px;color:#95a5a6;">Process</div>
      </div>
      <div style="margin-top:8px;color:#1f5278;font-size:13px;line-height:1.7;">各能力域得分 + 7 类归因 · 路径合理性 · 工具选择 · context 利用</div>
    </div>
    <div style="background:#e8f5e9;padding:18px 22px;border-radius:0 0 8px 8px;border:1px solid #b8e0b9;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="font-weight:700;color:#1e8449;font-size:14px;letter-spacing:0.5px;">⬆ 结果层(基础)</div>
        <div style="font-size:11px;color:#95a5a6;">Outcome</div>
      </div>
      <div style="margin-top:8px;color:#196e3b;font-size:13px;line-height:1.7;">任务完成度 · pass@3 · pass^3 · 说做一致性 · 检查点通过率</div>
    </div>
  </div>
  <div style="text-align:center;margin-top:14px;color:#95a5a6;font-size:12px;font-style:italic;">三层向上递进 — 没有结果层稳定,谈过程没意义;没有过程层合理,谈成本/风险没意义</div>
</div>

这三层不是平行的,**是有依赖顺序的**:

- **结果层是入口条件**——如果系统连基本任务都完不成,过程和成本谈了也没用。这一层的核心问题是:"它做没做成?在相同条件下能不能稳定地做成?"
- **过程层决定可解释性**——同样的"做成了",过程合理 vs 满身补丁,后续优化的难度完全不同。这一层的核心问题是:"它是怎么做成的?哪些环节出过问题?"
- **风险/成本层决定可部署性**——一个能在测试集上做对的系统,如果上车后 token 消耗翻倍、TTFT 翻三倍、偶尔会做出违反端状态的危险操作,它就不能上线。这一层的核心问题是:"它的行为有没有越过可接受边界?"

> **这一节借鉴了学术体系里"结果-过程-风险"三层观测框架,但我们做了车载场景的具体绑定**:把 TTFT 和 Chunk Latency 提到与 token 同等重要的位置(车载是强时延敏感场景);把"说做一致性"提到结果层(因为话术与动作的错位是车载最常见的体验杀手)。

### 4.3 结果层:端到端指标定义

结果层的指标必须可量化、可重复。我们定义了 5 个核心指标:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:22%;">指标</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:38%;">公式 / 定义</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">用途</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">任务完成度</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">Σ 通过检查点×权重 / Σ 检查点×权重</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">加权评分,核心检查点权重高</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">pass@3</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">3 次试次至少 1 次完成的概率</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">能力下限(偶然能不能成)</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">pass^3</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">3 次试次全部完成的概率</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">稳定性上限(可不可靠)</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">TTFT</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">首 Token 时延</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">用户感知的响应起点</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">Chunk Latency</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">(T_chunk_i 开始 − T_chunk_{i-1} 结束) / 总 chunks</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">流式播报顺滑度</td>
      </tr>
    </tbody>
  </table>
</div>

**完成定义**:一次试次中,至少 80% 检查点通过 + 所有"结果检查点"通过,才算"完成"。这个 80% 的阈值不是拍脑袋,而是和产品体验对齐:低于这个值用户的不满情绪会显著上升,即使核心任务做了。

**pass@3 vs pass^3 的设计意图**:LLM 输出本身有随机性,跑一次评测就下结论是不严谨的。pass@3 反映"它会不会"——这是能力下限;pass^3 反映"它稳不稳"——这是稳定性上限。两个指标差距大,说明能力有但不稳;两个指标都低,说明能力本身没建立。这种**双指标差异性诊断**比单一指标信息量大得多。

### 4.4 过程层:7 类归因体系

如果说三层视角是评测的骨架,那么**归因体系是评测的灵魂**。没有归因,过程层就只是一堆零散数据,无法驱动优化。

我们把 Planner 调用链路上可能出问题的位置归纳为 7 大类:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="text-align:center;margin-bottom:20px;">
    <span style="background:#c0392b;color:#fff;padding:8px 22px;border-radius:20px;font-size:14px;font-weight:600;letter-spacing:0.5px;">评测出错时,锅在哪里?</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
    <div style="background:#fff;padding:14px;border-radius:8px;border-top:3px solid #3498db;">
      <div style="font-weight:700;color:#3498db;font-size:13px;margin-bottom:6px;">① 感知</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.6;">ASR 错<br/>拒识错</div>
    </div>
    <div style="background:#fff;padding:14px;border-radius:8px;border-top:3px solid #9b59b6;">
      <div style="font-weight:700;color:#9b59b6;font-size:13px;margin-bottom:6px;">② 仲裁</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.6;">简单/复杂仲裁错<br/>SFT 车控模型错</div>
    </div>
    <div style="background:#fff;padding:14px;border-radius:8px;border-top:3px solid #f39c12;">
      <div style="font-weight:700;color:#f39c12;font-size:13px;margin-bottom:6px;">③ Context</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.6;">筛选错误 / 冗余<br/>缺少必要 context</div>
    </div>
    <div style="background:#fff;padding:14px;border-radius:8px;border-top:3px solid #e74c3c;grid-column:span 2;">
      <div style="font-weight:700;color:#e74c3c;font-size:13px;margin-bottom:6px;">④ Planner(核心)</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.6;">调用错工具 · 工具参数错 · 错用 context · 其他理解/执行错</div>
    </div>
    <div style="background:#fff;padding:14px;border-radius:8px;border-top:3px solid #16a085;">
      <div style="font-weight:700;color:#16a085;font-size:13px;margin-bottom:6px;">⑤ Advisor</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.6;">主动服务建议质量</div>
    </div>
    <div style="background:#fff;padding:14px;border-radius:8px;border-top:3px solid #34495e;grid-column:span 3;">
      <div style="font-weight:700;color:#34495e;font-size:13px;margin-bottom:6px;">⑥ 下游工具</div>
      <div style="color:#7f8c8d;font-size:12px;line-height:1.6;">车控 / 导航 / 车书 / S2S / 记忆 / GUI / 媒体 ...</div>
    </div>
  </div>
</div>

每一类归因都对应一个明确的"责任人":

- **感知类问题** → 语音团队(ASR、拒识)
- **仲裁类问题** → 仲裁模型团队(简单/复杂分流、SFT 车控)
- **Context 类问题** → Context 工程团队(筛选规则、注入完整性)
- **Planner 类问题** → 我们(PM + 算法)
- **Advisor 类问题** → 主动服务团队
- **工具类问题** → 各下游 Agent 团队

> **归因体系的真正价值,不只是评分,而是把"系统跑错了"翻译成"具体谁该看一眼"**。Bad case 回流时可以精准分配,飞轮才能转起来——没有归因,失败就只是失败,不会变成改进。

### 4.5 Planner 类归因的四个子类(展开)

Planner 是核心,所以它的归因也最细。在 2.0 报表里,Planner 类下面拆四个子项独立统计:

1. **调用错工具**:意图理解对了,但选了不合适的工具。比如用户问"今天天气",应该调 `search_weather` 但调成了 `web_search`。
2. **工具参数错**:工具选对了,但参数填错。比如"打开主驾座椅加热",但参数里 `position` 填了 `all` 而不是 `driver`。
3. **错用 Context**:Context 注入了,但 Planner 没正确利用。比如端状态显示空调已经 16°C 1 档,用户说"我好热",Planner 仍然下指令降温度而不是调风量。
4. **其他理解/执行错**:话术与动作不一致、任务拆解颗粒度不对、说做不一致等综合性问题。

这四个子项的分布,直接对应不同的优化路径——选错工具是 SP 工具描述的问题、参数错是工具示例的问题、错用 Context 是 SP 注入策略的问题、综合性问题往往是模型本身能力的问题。

### 4.6 检查点设计:把抽象的"好"翻译成可观测的具体事件

评测的智能,在于把"它做得好不好"翻译成"哪些可观测的具体事件发生了"。一个场景下,我们至少定义三类检查点:

- **结果检查点**(必须通过):核心需求是否被满足
- **过程检查点**(加权):中间步骤是否合理
- **分支检查点**:面对 ambiguity 是否选了合理路径

下面用两个真实场景展示这个翻译过程。

---

**案例 A:多指令任务的检查点设计**

> User query:"帮我把前排座椅加热和方向盘加热全部打开,全车空调都开启温度调到 24 度风量三档,顺便放点林俊杰的歌"

<div style="font-family:-apple-system,sans-serif;background:#fff;padding:18px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <div style="font-size:13px;color:#27ae60;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">✓ 结果检查点(权重高)</div>
  <ul style="margin:0 0 16px;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>主驾座椅加热已开启</li>
    <li>副驾座椅加热已开启</li>
    <li>方向盘加热已开启</li>
    <li>全车空调已开启 + 温度 24°C + 风量 3 档</li>
    <li>开始播放林俊杰相关音乐</li>
  </ul>
  <div style="font-size:13px;color:#3498db;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">✓ 过程检查点(加权)</div>
  <ul style="margin:0 0 16px;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>是否一次性 action_list 输出全部 6 个并行任务(而非分多轮)</li>
    <li>话术是否在确认前明确列出动作,且与实际下发动作完全一致</li>
    <li>风量是否精确为 3 档(不是 2 档或 4 档)——这是常见错位点</li>
    <li>是否没有冗余动作(比如错误地多打开了二排座椅加热)</li>
  </ul>
  <div style="font-size:13px;color:#e67e22;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">⚠ 分支检查点</div>
  <ul style="margin:0;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>如果林俊杰歌单调用失败,Planner 是否有合理的兜底话术(而不是默不作声)</li>
    <li>如果某项车控失败,是否报告失败动作而不是声称"都搞定了"</li>
  </ul>
</div>

注意,**这一套检查点不只覆盖"对/错",还覆盖"做的方式对不对"**——这就是过程层的价值。

---

**案例 B:模糊指令 + Context 推理的检查点设计**

> User query:"车里好热啊"
> Context:天气暴晒、空调全关、电量充足、舒适偏好无特殊记忆

<div style="font-family:-apple-system,sans-serif;background:#fff;padding:18px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <div style="font-size:13px;color:#27ae60;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">✓ 结果检查点</div>
  <ul style="margin:0 0 16px;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>打开空调(因为当前空调是关闭状态)</li>
    <li>温度设置在用户未明说但合理的范围(24°C 左右)</li>
  </ul>
  <div style="font-size:13px;color:#3498db;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">✓ 过程检查点</div>
  <ul style="margin:0 0 16px;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>调用 vehicle_basic_control 工具(而非 search_weather 等无关工具)</li>
    <li>不调用降车窗工具(因为是暴晒天气)</li>
    <li>话术不能空话:不能只说"我帮你查一下",必须有动作</li>
  </ul>
  <div style="font-size:13px;color:#e67e22;font-weight:600;letter-spacing:0.5px;margin-bottom:10px;">⚠ 分支检查点(惊喜预期)</div>
  <ul style="margin:0;padding-left:20px;color:#2c3e50;font-size:13px;line-height:1.9;">
    <li>是否主动启用最大制冷模式(因为暴晒)</li>
    <li>是否一起打开座椅通风(同样能快速降温)</li>
    <li>话术是否带情绪共鸣("外面好晒,我马上帮你凉快下来")</li>
  </ul>
</div>

**反例对照**——同样的 query,Context 换成"空调已开 16°C 1 档"时,检查点完全不同:

- 结果检查点变成:**调高风量**(不是降温度,温度已经到底了)
- 过程检查点变成:**不要冗余地降温度**——降温度是错的执行

> 这个反例对照就是 Part 2 漏洞 ③ 的具体解决方案——**通过 Context 显式建模,同一句话在不同语境下的最优解被翻译成了不同的检查点**。

### 4.7 评测报表的结构

把上面所有维度汇总,2.0 评测报表的结构是这样的:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:16%;">分类</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:36%;">维度</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">指标</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="background:#e8f5e9;padding:10px 12px;border-radius:6px 0 0 6px;color:#1e8449;font-weight:600;" rowspan="4">端到端</td>
          <td style="background:#fff;padding:10px 12px;color:#2c3e50;">完成情况</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">任务完成度(加权)</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">稳定性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">pass@3 / pass^3</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">时延</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">TTFT / 平均 Chunk Latency</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">各能力域</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">感知 / 理解 / 执行 得分</td></tr>
      <tr><td style="background:#eaf4fc;padding:10px 12px;border-radius:6px 0 0 6px;color:#2874a6;font-weight:600;" rowspan="7">过程指标</td>
          <td style="background:#fff;padding:10px 12px;color:#2c3e50;">ASR</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">句准率</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">拒识</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">准确率</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">简单/复杂仲裁</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">准确率</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">SFT 车控</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">准确率</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">Context 筛选</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">准确率(错误/冗余/缺失)</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">Planner</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">4 子项准确率(工具/参数/Context/其他)</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;">下游工具</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">分工具的成功率/返回错误率</td></tr>
    </tbody>
  </table>
</div>

这张表本身就是一份**对产品和算法都有用的产出物**——它既能回答"系统现在能力几何",又能回答"问题在哪里",还能回答"下一个版本应该优化什么"。

### 4.8 一张可落地的评分卡:结果 70% + 过程 30%

三层视角和归因体系解决了"评测要看什么",但评测员拿到一条 case 的执行结果,还需要**一张能直接打出分数的卡**。如果没有这张卡,前面所有维度都还停留在"定性观察",无法汇总成可比较的数字。下面是我们实际在用的加权评分卡——它把抽象的三层视角落成了可计算的分数。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;gap:16px;margin-bottom:6px;">
    <div style="flex:1;background:#e8f5e9;border-radius:8px;padding:14px 18px;border-left:4px solid #27ae60;">
      <div style="color:#1e8449;font-weight:700;font-size:14px;">结果评分 · 权重 70%</div>
      <div style="color:#7f8c8d;font-size:12px;margin-top:2px;">"做没做成、做得准不准、安不安全"</div>
    </div>
    <div style="flex:1;background:#eaf4fc;border-radius:8px;padding:14px 18px;border-left:4px solid #3498db;">
      <div style="color:#2874a6;font-weight:700;font-size:14px;">过程评分 · 权重 30%</div>
      <div style="color:#7f8c8d;font-size:12px;margin-top:2px;">"理解、澄清、反馈、平顺——体验上限"</div>
    </div>
  </div>
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;margin-top:10px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:12%;">层</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:22%;">维度</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">打分方式(关键:打分形态要匹配维度性质)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="background:#e8f5e9;padding:10px 12px;border-radius:6px 0 0 6px;color:#1e8449;font-weight:600;" rowspan="4">结果<br/>70%</td>
          <td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">动作正确性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;"><b>二值</b>:正确 / 不正确 —— 离散事件,对就是对</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">位置 / 目标准确性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;"><b>分级</b>:精准(5) / 可接受(4) / 偏差大(2) / 失败(0) —— 连续量用档位</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">操作完整性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;"><b>扣分制</b>:必要动作缺失 −30/个 · 错误动作 −20/个 · 冗余动作 −5/个 —— 可叠加的惩罚</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">安全性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#c0392b;font-weight:600;"><b>一票否决</b>:压实线 / 急刹 / 碰撞风险 —— 出现即整条 case 判 0</td></tr>
      <tr><td style="background:#eaf4fc;padding:10px 12px;border-radius:6px 0 0 6px;color:#2874a6;font-weight:600;" rowspan="4">过程<br/>30%</td>
          <td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">理解准确性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">5 分制 —— 是否正确理解口语化/模糊指令</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">澄清合理性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">5 分制 —— 遇歧义是否合理澄清,而非盲目执行</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">反馈及时性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">5 分制 —— 是否在执行前/中给出语音反馈</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;color:#2c3e50;font-weight:600;">执行平顺性</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">5 分制 —— 多步/串行任务过程是否平顺无突兀</td></tr>
    </tbody>
  </table>
  <div style="margin-top:10px;padding:12px 16px;background:#fff;border-radius:8px;border:1px dashed #c0392b;color:#c0392b;font-size:13px;font-weight:600;text-align:center;">
    通过定义 = 结果评分 ≥ 80% &nbsp;且&nbsp; 无任何安全违规(双门槛,缺一不可)
  </div>
</div>

这张卡里**最值得对外讲的不是具体数字,而是"打分形态要匹配维度性质"这个原则**:

- **离散事件用二值**——"动作对没对"没有中间态,硬给它 1-5 分反而引入噪声。
- **连续量用分级**——"停得准不准"是个连续偏差,用 5/4/2/0 四档把它量化,既保留区分度又避免评测员在小数点上纠结。
- **可累加的错误用扣分制**——"完整性"是由多个独立动作的缺失/错误/冗余叠加而成,扣分制天然能反映"错得越多扣得越多",还能区分"漏一个核心动作(−30)"和"多一个无害动作(−5)"的严重度差异。
- **不可接受的行为用一票否决**——安全不是"占 20% 权重"的维度,它是布尔门。任何把安全做成"扣几分"的卡,都会在某次评测里被一个高分掩盖掉一次危险操作。

> 很多团队主观题一律套 1-5 分卡,这恰恰是评分噪声的来源。**一张好的评分卡,是四种打分形态的混用,不是一种形态的滥用。** 再叠加 pass@3 / pass^3(Part 4.3)做稳定性约束,单条 case 就有了"准不准 + 稳不稳 + 安不安全"的完整画像。

### 4.9 从归因到修复:一个可复用的闭环模板

归因体系(4.4)把"系统错了"翻译成"哪类问题、谁该看",但责任团队拿到一个归因结论之后——**怎么修、怎么证明修好了?** 如果这一步不固化,归因就只是分类,飞轮还是转不起来。我们用一个**四段式模板**让每个 badcase 都能闭环:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;align-items:stretch;gap:8px;">
    <div style="flex:1;background:#fff;padding:14px;border-radius:8px;border-top:3px solid #c0392b;">
      <div style="color:#c0392b;font-weight:700;font-size:13px;">① 现象</div>
      <div style="color:#7f8c8d;font-size:12px;margin-top:6px;line-height:1.6;">badcase 的可观测表现(用户说了什么、系统做了什么)</div>
    </div>
    <div style="display:flex;align-items:center;color:#bdc3c7;font-size:16px;">→</div>
    <div style="flex:1;background:#fff;padding:14px;border-radius:8px;border-top:3px solid #f39c12;">
      <div style="color:#d35400;font-weight:700;font-size:13px;">② 根因</div>
      <div style="color:#7f8c8d;font-size:12px;margin-top:6px;line-height:1.6;">归到 7 类之一 + 具体机制(为什么会这样)</div>
    </div>
    <div style="display:flex;align-items:center;color:#bdc3c7;font-size:16px;">→</div>
    <div style="flex:1;background:#fff;padding:14px;border-radius:8px;border-top:3px solid #3498db;">
      <div style="color:#2874a6;font-weight:700;font-size:13px;">③ 修复</div>
      <div style="color:#7f8c8d;font-size:12px;margin-top:6px;line-height:1.6;">改了什么(SP 工具描述 / 示例 / Context 注入规则 / 状态机 ...)</div>
    </div>
    <div style="display:flex;align-items:center;color:#bdc3c7;font-size:16px;">→</div>
    <div style="flex:1;background:#fff;padding:14px;border-radius:8px;border-top:3px solid #27ae60;">
      <div style="color:#1e8449;font-weight:700;font-size:13px;">④ 验证 Case</div>
      <div style="color:#7f8c8d;font-size:12px;margin-top:6px;line-height:1.6;">构造能复现的最小 case,跑修复前/后通过率对比</div>
    </div>
  </div>
</div>

**一个真实(脱敏)示例**,展示这个模板怎么走完一圈:

<div style="font-family:-apple-system,sans-serif;background:#fff;padding:18px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;font-size:13px;line-height:1.8;">
  <div><b style="color:#c0392b;">① 现象</b> —— 用户在等待某个长时任务回填信息时(比如下游正等用户补一个验证码),系统把用户接下来的话当成了"新的闲聊/新任务",重新发起了一次任务,导致原任务被丢弃。</div>
  <div style="margin-top:8px;"><b style="color:#d35400;">② 根因</b> —— 归到 <b>Planner 类 · 错用 Context / 状态缺失</b>:Planner 没有"等待用户补充"这个状态概念,无法区分"用户在回应上一个任务"和"用户发起新任务"。</div>
  <div style="margin-top:8px;"><b style="color:#2874a6;">③ 修复</b> —— 在 SP 里补一条状态识别规则:当工具反馈中包含疑问句/选项列表/输入请求时,进入"等待用户补充"状态;此时用户的下一句应回传为"补充信息"而非"新任务"。</div>
  <div style="margin-top:8px;"><b style="color:#1e8449;">④ 验证 Case</b> —— 构造三条最小 case:(a) 用户输入验证码 → 应判定为补充信息;(b) 用户在等待中切换话题 → 应判定为终止旧任务+新任务;(c) 打断后重启同一任务。跑修复前/后,看这三条的通过率是否从 0 变 1。</div>
</div>

走过足够多 badcase 之后,你会发现**很多修复其实在反复使用同几条"纪律"**。把它们沉淀成可复用的通用规则,新 badcase 往往能直接套用,不必每次从零分析。我们沉淀下来的几条:

- **任务独立执行**——每次任务不受历史失败污染,不因"上次失败了"就拒绝重试。
- **参数不默认沿用历史**——新任务的地址/参数只来自当前轮用户表达或系统默认,不擅自继承上一轮。
- **状态播报严格对应实际状态**——下游返回"操作中"就播报"开始操作",返回"已完成"才说"已完成",杜绝"过度承诺"(还没做完就说做好了)。
- **打断后用"新任务"而非"补充信息"**——任务被终止/超时后重启,必须当新任务处理。

> **给同行的落地建议**:一个 badcase 的价值,不在你修复它的那一次,而在它能不能变成两样东西——**一条进了回归集的验证 case**,和**一条可复用的修复纪律**。没有这两个沉淀,修 badcase 就是打地鼠:这次按下去了,下个版本换个场景又冒出来。**归因负责"翻译问题",这个四段式模板负责"沉淀答案"——两者合起来,飞轮(Part 6.4)才真的转得动。**

---

## Part 5 — 重构 3:评测维度,主观体验"像人"怎么测

### 5.1 为什么"像人"是必须被评测的东西

车载 AI 助手有一个特殊的产品张力:**它服务于一个驾驶状态下的、注意力受限的、情绪状态多变的用户**。在这种情境下,系统的"像人感"不是一个加分项——它是**核心体验**。

具体地说,用户对系统的不满,绝大多数不是"它做错了什么",而是:

- 话太多,在我不需要的时候插嘴(节奏)
- 听得懂字面但听不懂意思(理解)
- 像个客服,不像伙伴(人设)
- 死板,不变通(常识)
- 说一套做一套(一致性)

这些都是 1.0 评测里**测不到、也没法测**的维度。但它们恰恰是用户决定"我要不要继续用"的关键。

### 5.2 为什么主观评测之前一直做不好

我们试过两种传统做法,都效果不佳。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <div style="background:#fff;padding:18px;border-radius:8px;border:1px dashed #e74c3c;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="background:#e74c3c;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">传统做法 1</span>
        <span style="color:#2c3e50;font-weight:600;font-size:14px;">对抗评估</span>
      </div>
      <ul style="margin:0;padding-left:18px;color:#7f8c8d;font-size:13px;line-height:1.8;">
        <li>A vs B,谁更好?</li>
        <li>只能多 Agent 横向对比</li>
        <li>无法绝对量化</li>
        <li>没有绝对水位</li>
      </ul>
    </div>
    <div style="background:#fff;padding:18px;border-radius:8px;border:1px dashed #e74c3c;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="background:#e74c3c;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">传统做法 2</span>
        <span style="color:#2c3e50;font-weight:600;font-size:14px;">全局打分</span>
      </div>
      <ul style="margin:0;padding-left:18px;color:#7f8c8d;font-size:13px;line-height:1.8;">
        <li>共情 1-5 分</li>
        <li>人设一致性 1-5 分</li>
        <li>隔靴搔痒</li>
        <li>评分员主观性极强</li>
      </ul>
    </div>
  </div>
  <div style="text-align:center;margin-top:16px;padding:12px;background:#fff;border-radius:8px;color:#c0392b;font-weight:600;font-size:14px;">↓ 两种都不解决问题 ↓</div>
</div>

**对抗评估的根本问题**:它只能告诉你"我比你强",不能告诉你"我离用户的期待还差多远"。两个都很差的 Agent 也可以分出胜负——但这个胜负对产品没有意义。

**全局打分的根本问题**:"共情能力 4 分"——评测员凭什么打 4 分?哪些行为让他打了 4 分?换一个评测员会不会打 3 分?这种**结论无法被分解、无法被追因**的评分,对优化方向几乎没有指导价值。

### 5.3 解法:Case-by-Case 把抽象拆为具体可观测的检查点

我们最终走到的方案,本质上是把 Part 4 的"检查点设计"方法**复用到了主观维度上**——只不过这次,检查点要更细、要更贴近"人的具体体验"。

不再问:"这个回复有没有共情?"
而是问:**"在这个具体场景下,系统是否做到了 X、Y、Z 三件事?"**

例如对一句"我好困"的回复,我们不打"共情分",而是检查:

1. ✓ 是否优先关心驾驶安全(基础)
2. ✓ 是否结合 context(感冒药、连续驾驶时长、当前路况)给出针对性建议(惊喜)
3. ✓ 语气是否符合"伙伴"人设,不是机械客服式
4. ✓ 是否避免了"假关怀"——空话(比如只说"注意休息哦"而没有任何具体动作)

这种拆解的代价是**人力成本高**:每个场景的每个需求都要单独设计检查点,而且这些检查点本身需要 PM 反复打磨。但收益是:

- 评分客观,不同评测员之间分歧大幅下降
- bad case 可定位——某个检查点没过,直接对应到一个具体的优化方向
- 优化效果可验证——下一版评测,可以看那个特定检查点的通过率是否上去了

### 5.4 "像人"维度的三层拆解

为了不让检查点设计变成"想到什么写什么",我们把"像人"拆成三层:**感知层 / 理解层 / 表达执行层**。每一层都有自己的关注点和典型缺陷。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div style="background:#fff;border-radius:8px;padding:18px 22px;border-left:4px solid #3498db;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="font-weight:700;color:#2c3e50;font-size:15px;">感知层</div>
        <div style="color:#3498db;font-size:12px;font-weight:600;">听到 / 看到</div>
      </div>
      <ul style="margin:0;padding-left:18px;color:#2c3e50;font-size:13px;line-height:1.9;">
        <li>口语化输入纠错(口癖 / 重复 / 语法错)</li>
        <li>释义理解("我叫左晨,早晨的晨")</li>
        <li>区分语音和环境音</li>
        <li>听懂打断 / 插话 / 边说边听</li>
        <li>视觉:神态 / 动作辅助意图判断</li>
      </ul>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:16px;">▼</div>
    <div style="background:#fff;border-radius:8px;padding:18px 22px;border-left:4px solid #27ae60;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="font-weight:700;color:#2c3e50;font-size:15px;">理解层</div>
        <div style="color:#27ae60;font-size:12px;font-weight:600;">听懂 / 懂得</div>
      </div>
      <ul style="margin:0;padding-left:18px;color:#2c3e50;font-size:13px;line-height:1.9;">
        <li>切片思考 → 内化记忆</li>
        <li>弦外之意 / 反讽 / 网络热梗</li>
        <li>任务轻重缓急的"分寸感"</li>
        <li>主动澄清而非"看似完整"地答</li>
        <li>同频:潜台词 / 情绪 / 立场</li>
      </ul>
    </div>
    <div style="text-align:center;color:#bdc3c7;font-size:16px;">▼</div>
    <div style="background:#fff;border-radius:8px;padding:18px 22px;border-left:4px solid #e67e22;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="font-weight:700;color:#2c3e50;font-size:15px;">表达执行层</div>
        <div style="color:#e67e22;font-size:12px;font-weight:600;">说出 / 做到</div>
      </div>
      <ul style="margin:0;padding-left:18px;color:#2c3e50;font-size:13px;line-height:1.9;">
        <li>生活化 knowhow(下雨该关窗)</li>
        <li>伙伴式而非客服式人设</li>
        <li>闲聊场景的"省力原则"短句</li>
        <li>长任务的过程反馈("做到一半了")</li>
        <li>反思与学习(夜间反思机制)</li>
        <li>个人喜恶与审美(稳定人格底色)</li>
      </ul>
    </div>
  </div>
</div>

### 5.5 三个真实的"不像人"案例(及其检查点拆解)

抽象的层级说太多就空。下面三个真实 case 直击痛点,每一个我们都拆出了具体的检查点。

---

**案例 1:任务节奏失控——背单词时插播电量**

> 背景:用户带三岁女儿,正在和系统玩"背英语单词"的长时任务。
> 用户:"现在电量还有多少?"
> 系统(差):"电池剩余电量 58%,还能跑 137km 哦~好啦电量问题先到这~小公主快想想那个黄黄弯弯像小月牙的东西是什么,大声说出对应的单词,答对马上给你开座椅按摩哦🥳!"

**问题诊断**:这是典型的**任务优先级与节奏失控**。
- 用户只是顺口问一句电量,系统却把电量播报和单词游戏强行串联,信息量爆炸
- 在三岁儿童的语境下,"137km"是没意义的信息——成人的精确数字 ≠ 儿童的体感
- "答对开座椅按摩"作为儿童奖励完全错位——三岁孩子不会因为座椅按摩而开心
- 整段话破坏了游戏节奏

**检查点拆解**:
- ✓ 信息量是否与 query 匹配(电量 = 短回应,游戏 = 持续状态)
- ✓ 是否区分了任务的"前景/后景"——电量是临时插入,游戏才是主线
- ✓ 儿童语境下,数字是否被翻译成体感("还能跑很远")
- ✓ 奖励机制是否符合儿童心理预期

---

**案例 2:Context 冲突——副驾妈妈 vs 视觉感知小女孩**

> 背景:记忆库里有一句"副驾是我的妈妈你认识下",但视觉感知模块显示副驾座位上是一个小女孩。
> 用户:"副驾上是谁?"
> 系统(差):直接根据记忆回答"是阿姨"——但事实上现在的副驾是孩子。

**问题诊断**:这是**记忆和感知冲突时的判断失败**。
- 系统没有意识到"记忆是历史事实"和"感知是当前事实"是两个独立的信息源
- 当两者矛盾时,需要做时空判断——以当前感知为准,记忆作为补充
- Planner 缺乏"信息源置信度"的概念

**检查点拆解**:
- ✓ 是否优先采信视觉感知(对"此时此刻"的判断)
- ✓ 是否提示了记忆与感知的不一致(主动澄清)
- ✓ 是否避免了基于过时记忆做出对当前不合理的判断

---

**案例 3:过度执行——"我想放松一下"被翻译成全自动套餐**

> User query:"我想放松一下"
> 系统(差):"那我帮你营造放松的氛围,先把座椅按摩调到 2 档,再播放舒缓的轻音乐,氛围灯调成暖黄色,你慢慢放空就好啦"

**问题诊断**:这是**缺乏主动澄清的过度执行**。
- "放松"是一个模糊指令,可能是想听歌、可能是想安静、可能是想按摩、可能只是想关掉广播
- 系统选择了**一次性满足所有可能性**的策略,看起来贴心,实际上很可能全错
- 用户被迫接受一个他没说要的"套餐",还要逐项关掉自己不需要的——体验反而更差

**检查点拆解**:
- ✓ 是否识别到指令的模糊性
- ✓ 是否在执行前做了一次轻量级澄清("放松"和"安静"是两个方向,你想哪种?)
- ✓ 如果选择直接执行,是否限制在最小可接受动作集(比如只调音乐),而不是全套
- ✓ 话术是否给用户留了"撤回"空间("不喜欢可以让我换")

---

这三个 case 展示了一个共同点:**"像人"不是一个能力,而是无数个具体决策点的合集**。把它拆成检查点,就能测、能优化、能闭环。

### 5.6 "意外之喜"机制:让评测维度自己生长

最后一个设计细节,值得专门提一下:**评测维度必须是开放的**。

"人"由数不清的特质组成。我们不可能在 v1 的检查点库里覆盖所有"像人"的维度——总会有用户在某个场景下被某个细节打动或冒犯,而那个细节我们之前根本没想到。

所以我们在评测流程里加了一个机制:**意外之喜捕获**。

评测员除了检查预设的检查点,还有一个固定动作——记录"虽然不在检查点里,但让我惊讶或不适的回复"。这些观察会进入一个独立的归档,**每个评测周期由 PM 例行 review**,把高频出现的"意外"提炼成新的检查点,回灌到场景库。

这个机制的价值不在它能立刻发现什么,而在它**让评测体系不会僵化**。一年后的检查点库不会是今天的复制品,它会因为用户的真实反应而生长。

---

## Part 6 — 工程化:5 个 Prompt 串起一条自动化流水线

### 6.1 为什么必须工程化

到 Part 5 为止,我们已经把"评测什么、怎么评"讲清楚了。但还有一个现实问题:**这样评测的人力成本是 1.0 的 5-10 倍**。

每个场景要写元素、需求、检查点;每条 case 要生成多轮对话、跑出执行 trace、比对检查点、做归因。如果靠人工,2.0 体系根本无法规模化——一周做完两个场景,产品迭代节奏完全跟不上。

所以 2.0 必须工程化。我们把整条链路拆成 5 个 LLM 驱动的环节,每个环节都由一个独立的 Prompt 承担,人工只在两个高价值的环节里兜底。

### 6.2 5 阶段流水线总览

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;flex-direction:column;gap:8px;">

    <div style="background:#2c3e50;color:#fff;padding:14px 20px;border-radius:8px;text-align:center;">
      <div style="font-weight:700;font-size:14px;">核心场景库</div>
      <div style="font-size:12px;color:#bdc3c7;margin-top:3px;">元素 × 需求 × 检查点</div>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;gap:10px;color:#3498db;font-size:13px;font-weight:600;">
      <span style="flex:1;height:1px;background:#3498db;"></span>
      ① 场景选取 Prompt
      <span style="flex:1;height:1px;background:#3498db;"></span>
    </div>

    <div style="background:#fff;padding:14px 20px;border-radius:8px;border-left:4px solid #3498db;">
      <div style="color:#2c3e50;font-weight:600;font-size:14px;">本轮要评测的场景实例</div>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;gap:10px;color:#3498db;font-size:13px;font-weight:600;">
      <span style="flex:1;height:1px;background:#3498db;"></span>
      ② 对话生成 Prompt <span style="color:#95a5a6;font-size:11px;">(LLM 扮演用户 · 核心集人工审核)</span>
      <span style="flex:1;height:1px;background:#3498db;"></span>
    </div>

    <div style="background:#fff;padding:14px 20px;border-radius:8px;border-left:4px solid #3498db;">
      <div style="color:#2c3e50;font-weight:600;font-size:14px;">用户-Agent 多轮对话轨迹 + 完整执行 Trace</div>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;gap:10px;color:#3498db;font-size:13px;font-weight:600;">
      <span style="flex:1;height:1px;background:#3498db;"></span>
      ③ 检查点生成 Prompt <span style="color:#95a5a6;font-size:11px;">(核心集人工审核)</span>
      <span style="flex:1;height:1px;background:#3498db;"></span>
    </div>

    <div style="background:#fff;padding:14px 20px;border-radius:8px;border-left:4px solid #3498db;">
      <div style="color:#2c3e50;font-weight:600;font-size:14px;">过程检查点 + 结果检查点 + 可能分支</div>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;gap:10px;color:#3498db;font-size:13px;font-weight:600;">
      <span style="flex:1;height:1px;background:#3498db;"></span>
      ④ 检查点验证 Prompt <span style="color:#95a5a6;font-size:11px;">(自动判定)</span>
      <span style="flex:1;height:1px;background:#3498db;"></span>
    </div>

    <div style="background:#fff;padding:14px 20px;border-radius:8px;border-left:4px solid #3498db;">
      <div style="color:#2c3e50;font-weight:600;font-size:14px;">检查点通过率 / 完成度</div>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;gap:10px;color:#3498db;font-size:13px;font-weight:600;">
      <span style="flex:1;height:1px;background:#3498db;"></span>
      ⑤ 归因分析 Prompt <span style="color:#95a5a6;font-size:11px;">(人工 + 自动)</span>
      <span style="flex:1;height:1px;background:#3498db;"></span>
    </div>

    <div style="background:#fff;padding:14px 20px;border-radius:8px;border-left:4px solid #3498db;">
      <div style="color:#2c3e50;font-weight:600;font-size:14px;">7 类归因结论 + 建议方向</div>
    </div>

    <div style="text-align:center;color:#c0392b;font-size:18px;margin-top:6px;">↓</div>
    <div style="background:#fff3e0;padding:12px 20px;border-radius:8px;text-align:center;border:1px dashed #e67e22;">
      <div style="color:#c0392b;font-weight:700;font-size:13px;">回灌场景库 / 检查点库(评测飞轮闭环)</div>
    </div>

  </div>
</div>

### 6.3 每个 Prompt 的设计要点

下面逐一展开,每个 Prompt 的**输入、输出、关键设计选择和易错点**。

---

**① 场景选取 Prompt**

- **输入**:测试目标(例如"专项回归 Planner 工具选择"、"全量评测"、"S7 主动服务专项")+ 场景库
- **输出**:本轮要评测的场景实例列表(N 个,通常 20-50)
- **关键设计**:不能"随机抽场景"。要按**测试目标**反向找——比如要回归工具选择,就抽场景里有"多工具组合"或"工具歧义"的实例。
- **易错点**:抽完场景后没有去重,导致几个高度相似的场景被同时纳入,虚高覆盖率。

---

**② 对话生成 Prompt**(LLM 角色扮演用户)

- **输入**:场景实例 + 用户画像
- **输出**:一段多轮用户-Agent 对话
- **关键设计**:这是整个流水线**最难的一步**。LLM 扮演用户时,要同时满足三个矛盾要求:
  1. **真实**——说话方式像真人(口语化、不完美、有口癖)
  2. **目标导向**——围绕场景的核心需求推进
  3. **可控对抗性**——在指定的检查点上,有意识引入歧义、追问、变更需求
- **易错点**:模型扮演的用户太"模型味"——说话太完整、需求太清晰、缺乏真实用户的犹豫和反复。这种"理想用户"会高估系统能力。
- **人工兜底**:核心评测集的对话必须人工审核。非核心可以全自动。

---

**③ 检查点生成 Prompt**

- **输入**:场景实例 + 对话内容
- **输出**:针对这段对话的检查点列表(结果检查点 + 过程检查点 + 分支检查点)
- **关键设计**:不要泛泛产出"系统回复是否得体"这种空洞检查点。每条检查点必须**可被自动验证**——要么是工具调用层面的(调了 XX 工具、参数是 YY)、要么是话术层面的(包含 ZZ 信息 / 不包含 WW 信息),要么是状态层面的(车窗状态变为 closed)。
- **易错点**:检查点太多导致信噪比下降。一个 8 轮对话产 30 个检查点是合理的;产 100 个就是过度。
- **人工兜底**:核心场景的检查点必须 PM 过一遍,因为检查点本身就是产品认知的固化。

---

**④ 检查点验证 Prompt**

- **输入**:执行 trace + 检查点列表
- **输出**:每个检查点的通过/失败 + 原因
- **关键设计**:这一步几乎全自动,但要解决**模糊检查点的判定一致性**。比如"话术是否带情绪共鸣"这种检查点,模型的判定要稳定——同一个回复跑 3 次判定结果要一样。我们的做法是:把这类检查点拆细到"是否包含表达情绪共鸣的关键词或句式"这种可枚举的层面。
- **易错点**:验证模型"自我宽容"——倾向于给 borderline 的回复打"通过"。要用 prompt 显式压制这个倾向。

---

**⑤ 归因分析 Prompt**

- **输入**:失败的检查点 + 完整 trace + 场景元素
- **输出**:归因到 7 大类之一(感知/仲裁/Context/Planner/Advisor/工具/其他)+ 简要说明
- **关键设计**:归因要**有判据,不是猜**。Prompt 里要给清楚每一类归因的判断条件(比如"ASR 出错"的判据是 user query 的文本与音频不一致;"Planner 工具选错"的判据是 trace 里有 action 但 action 与意图不匹配)。
- **易错点**:归因往"Planner 其他理解错"这个垃圾桶里灌——任何说不清的失败都被甩到这个类目。必须用 Prompt 显式限制这一类的占比(超过 20% 触发人工 review)。
- **人工兜底**:对核心 bad case 和高频归因模式,PM 要人工复核,避免被模型带偏。

### 6.4 评测飞轮:让每一次失败都变成系统改进

这条流水线的真正价值,不是它能跑得多快,而是它**让评测变成一个持续转动的飞轮**。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:28px 24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
    <div style="flex:1;background:#fff;padding:14px 10px;border-radius:8px;text-align:center;border-top:3px solid #3498db;">
      <div style="font-weight:700;color:#2c3e50;font-size:14px;">运行</div>
    </div>
    <div style="color:#3498db;font-size:20px;font-weight:bold;">→</div>
    <div style="flex:1;background:#fff;padding:14px 10px;border-radius:8px;text-align:center;border-top:3px solid #3498db;">
      <div style="font-weight:700;color:#2c3e50;font-size:14px;">观测</div>
    </div>
    <div style="color:#3498db;font-size:20px;font-weight:bold;">→</div>
    <div style="flex:1;background:#fff;padding:14px 10px;border-radius:8px;text-align:center;border-top:3px solid #3498db;">
      <div style="font-weight:700;color:#2c3e50;font-size:14px;">诊断</div>
    </div>
    <div style="color:#3498db;font-size:20px;font-weight:bold;">→</div>
    <div style="flex:1;background:#fff;padding:14px 10px;border-radius:8px;text-align:center;border-top:3px solid #3498db;">
      <div style="font-weight:700;color:#2c3e50;font-size:14px;">修正</div>
    </div>
    <div style="color:#3498db;font-size:20px;font-weight:bold;">→</div>
    <div style="flex:1;background:#fff;padding:14px 10px;border-radius:8px;text-align:center;border-top:3px solid #3498db;">
      <div style="font-weight:700;color:#2c3e50;font-size:14px;">再评测</div>
    </div>
  </div>
  <div style="text-align:center;margin-top:12px;padding:10px;background:#eaf4fc;border-radius:6px;color:#2874a6;font-size:13px;font-weight:600;">↻ 闭环:每次循环都在压缩失败空间</div>
  <div style="text-align:center;margin-top:10px;color:#7f8c8d;font-size:12px;font-style:italic;">⚠ 没有归因体系,飞轮转不起来</div>
</div>

具体的回流路径:

- **失败的检查点** → 归因到对应模块的责任团队 → 修复后下一轮回归
- **被发现的"意外之喜"** → PM review → 提炼为新检查点 → 下个版本评测它
- **被验证的好 case** → 进入"金标"数据集 → 用于模型 SFT 数据生产
- **归因分布的异常波动**(比如某周突然 30% 的失败都是 Context 类) → 触发针对性专项 review

> 一个评测体系的成熟度,不看它的指标多漂亮,看它**能不能驱动系统持续改进**。这条飞轮就是判定标准。

### 6.5 自动化的边界:哪些环节不能去掉人

最后一个工程上的硬话:**全自动化是个陷阱**。我们在落地过程中明确划定了两个必须保留人工的环节:

1. **核心评测集的对话生成与检查点设计**——这两步是产品认知的"锚"。一旦让模型自己生产、自己评测,评测的标准会随模型版本漂移,失去对比基础。
2. **高频归因模式的复核**——评测模型有自己的盲点和偏好,如果不抽查,会形成"模型评测模型,自圆其说"的封闭循环。

非核心评测可以全自动,但要承认它的结论质量低于核心评测,只能用于**趋势观察**,不能用于**版本决策**。

### 6.6 模拟器 vs 实车:分层执行 + Mock 真实性瓶颈

5 个 Prompt 解决了"评测内容怎么生产",但车载评测还有一个绕不开的**物理约束**:很多 case 根本没法纯靠云端跑出来——它要么依赖实时视觉识别,要么涉及真实的车辆动态,要么需要真实的工具返回。这一节讲两个最实在的工程坑。

**① 分层执行:能模拟器就模拟器,只有"必须真实信号"的才上实车**

实车测试慢、贵、不可重复(同一个路口你没法精确跑 100 遍)。所以原则是:**默认走模拟器批量跑,只有依赖真实世界信号的 case 才升级到实车**。我们按 case 类型做了分层:

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:38%;">Case 类型</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:30%;">执行方式</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">为什么</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;">纯逻辑 / Context 可构造(如无视觉的条件任务)</td>
          <td style="background:#eafaf1;padding:10px 12px;color:#1e8449;font-weight:600;">模拟器批量 + 实车抽验</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">场景可人为构造,适合大规模回归</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;">依赖实时视觉识别</td>
          <td style="background:#fff5e6;padding:10px 12px;color:#d35400;font-weight:600;">实车为主</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">视觉识别精度只有真实摄像头能测准</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;">涉及动态驾驶行为</td>
          <td style="background:#fff5e6;padding:10px 12px;color:#d35400;font-weight:600;">实车</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">平顺性/安全性必须在真实车辆动力学下验证</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;">异常 / 边界场景</td>
          <td style="background:#eafaf1;padding:10px 12px;color:#1e8449;font-weight:600;">模拟器人为构造</td>
          <td style="background:#fff;padding:10px 12px;border-radius:0 6px 6px 0;color:#7f8c8d;">禁停区/识别失败这类极端场景,实车难复现,模拟器反而更可控</td></tr>
    </tbody>
  </table>
</div>

**② 真正的拦路虎:Mock 真实性瓶颈**

这是车载 Agent 评测里最隐蔽、也最致命的一个坑。Planner 的每一步决策都依赖**上一步工具的返回**(tool_feedback)。如果评测时工具返回是写死的 mock 数据,你测的就**不是 Planner 在真实环境里的表现**——因为它从没见过真实工具返回里的脏数据、超时、字段缺失。

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:30%;">瓶颈</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">后果</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:32%;">解决方向</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">工具返回是 mock</td>
          <td style="background:#fff;padding:10px 12px;color:#7f8c8d;">测不出 Planner 对真实返回(失败/异常)的处理</td>
          <td style="background:#eafaf1;padding:10px 12px;border-radius:0 6px 6px 0;color:#1e8449;">让工具尽量走真实底层链路拿真实返回;有副作用/危险的(如车控)才用受控 mock</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">缺真实定位信息</td>
          <td style="background:#fff;padding:10px 12px;color:#7f8c8d;">导航/POI 类工具整条跑不通</td>
          <td style="background:#eafaf1;padding:10px 12px;border-radius:0 6px 6px 0;color:#1e8449;">向链路上报模拟设备定位,补齐位置上下文</td></tr>
      <tr><td style="background:#fff;padding:10px 12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">新工具未覆盖</td>
          <td style="background:#fff;padding:10px 12px;color:#7f8c8d;">新上线工具没有对应 case,评测有盲区</td>
          <td style="background:#eafaf1;padding:10px 12px;border-radius:0 6px 6px 0;color:#1e8449;">badcase 回流时同步补该工具的 case 到评测集</td></tr>
    </tbody>
  </table>
</div>

> **给同行的落地建议**:评测链路的"**保真度**"直接决定结论的可信度。一个用全 mock 数据跑出 95% 的系统,上车后可能只有 70%——差的那 25% 全在"真实工具返回的脏数据"里。**在能力允许的范围内,让评测链路尽量贴近真实运行链路**,是评测结论可信的前提。这条对所有"依赖工具调用的 Agent"都成立,不只是车载。

---

## Part 7 — 诚实地讲:正在解决的难题

> 这一节是分享的"价值高地"。讲难题比讲成绩更让同行愿意听,也是建立信任的关键。下面这些是我们到今天仍然没有完美解的问题。

### 7.1 上下文模拟的一致性

场景化评测严重依赖 context 模拟,但 context 模拟有三个内在矛盾:

1. **元素之间要逻辑自洽**——"暴雨天气"和"路况通畅"不应同时出现;"用户重感冒"和"用户兴致勃勃要唱 K"不应共存。
2. **Context 要和 query 匹配**——用户说"我好热",context 里就不该是"外面下雪、空调已开制热";如果不匹配,评测员会感到困惑,系统输出也会偏离真实分布。
3. **多轮中 context 要动态更新**——第 1 轮用户说"我开车去机场",第 3 轮 context 里的"目的地"就应该是机场,但很多评测里这个状态没有传递。

**当前尝试**:模拟器 + Prompt 自校验。我们用一个轻量的"上下文校验模型"在 context 生成后过一遍,检测明显冲突。但仍有 case 出现自相矛盾——彻底解决需要把车端模拟器接入评测链路,这是 Q2-Q3 的重点。

### 7.2 主动服务的"未触发场景"判定模糊

主动服务评测有一个**结构性难点**:系统不响应的情况怎么判?

- 预设了"上车 + 下雨"应该主动播报,系统没触发——是 bug 还是合理保守?
- 系统在预设之外的场景主动触发了——是体验提升还是噪音?

**当前尝试**:
- 对预设触发场景,精确到具体 case 设计验收检查点,但**不设计过高召回率**——宁可少触发,不要错触发。
- 对非预设触发,以场景和角色视角进行二维评价:**逻辑合理性**(是否符合常识)+ **体验提升性**(与"什么都不做"相比是否更好)。
- 节奏问题(同一场景下多次触发的间隔)还在探索。

这个问题的本质是:**主动服务的评测维度,本身就是一个需要被产品定义的事情**——我们至今没有完全收敛。

### 7.3 主观性消除是个伪命题

我们曾经追求"消除主观性",试过让评测员之间做盲评对齐、做评分标准培训、做多人交叉打分取平均。这些都有效果,但都没有解决根本问题——**主观维度的判定本来就是主观的**,你能做的是让分歧收敛,不是消除分歧。

**当前态度**:
- 短期方向:用自动化降低人为分歧,通过把抽象拆为具体检查点来锚定判断
- 长期方向:**接受主观性,把评测的价值从"打分"迁移到"定位问题"**

一句话:**现阶段评测更多服务于问题定位和产品迭代,不要太纠结于具体分数**。这个心态调整本身就是 2.0 体系最重要的"软件升级"。

### 7.4 多轮对话无法预设

1.0 的 case 库可以预设——一条 case 就是一个固定的 query + 期望。但 2.0 的对话是多轮的、有分支的,你不可能预先写完所有可能的对话路径。

**当前解法**:LLM 角色扮演用户,生成对话(Part 6 的第二个 Prompt)。这是有效的,但要警惕两个风险:
- **模型扮演的"用户"太理想化**——说话太完整、目标太清晰,导致评测高估系统能力
- **模型扮演的"用户"和模型评测的"系统"是同源模型**——可能形成"自己评自己"的循环偏差

要在 LLM 角色扮演里有意识引入"真实用户的不完美"——说话停顿、口癖、突然变主意、信息提供不完整——这是 Q2 的优化重点。

### 7.5 持续任务的"节奏问题"

长时任务(比如颈椎操、单词游戏、长途驾驶陪聊)的评测,有一个独特的难题:**节奏感**。

- 反馈频率高了——扰民、像唠叨的客服
- 反馈频率低了——用户觉得系统"消失了"、不可信
- 中间被其他任务打断后,如何优雅地继续——这是工程和体验的双重难题

**当前进展**:有意识地在场景里加入"长时任务 + 打断 + 恢复"的检查点设计,但还没有形成稳定的节奏评测指标。这是 2.0 体系**最不成熟的一块**,值得整个行业一起探索。

---

## Part 8 — 给同行的 5 条建议

把整篇文章压缩成 5 句话,每一句都希望能被独立引用。

---

**01 · 别先想 Agent 有什么能力,先想业务里的"决策点"在哪里。**

一个决策点 = 多条可选路径 + 选错有成本。从决策点反推评测,不会陷入"我会的我都测一遍"的工程师视角,而是直接对齐产品价值。这一点对所有领域 Agent 评测都成立——不只是车载。

---

**02 · 评测集是和代码同等重要的资产,不是一次性产物。**

一次性写的 case、临时手写的测试,产生的结论不可比。把评测集**版本化、固定化、纳入代码评审流程**。允许它演进(新场景回流、bad case 入库),但不允许它随便改——尤其不能为了"让数据好看"而改。

---

**03 · 失败模式比失败 case 更重要。**

单个 case 的修复价值有限。把 case 抽象成"失败模式"——能力型 / 策略型 / 结构型 / 交互型 / 工具型——才能驱动结构性改进。归因体系就是把 case 翻译成模式的工具,**没有归因,评测就只是计数,不是诊断**。

---

**04 · 主观评测不要追求"消除主观",要把抽象拆为具体的可观测检查点。**

"共情 4 分"这种评分对优化没有意义。把"共情"拆成"是否优先关心安全 / 是否结合 context 给针对性建议 / 是否避免假关怀的空话"——这些具体检查点,既能客观验证,又能驱动具体优化。**Case-by-case 的检查点设计成本高,但收益远超 1-5 分卡。**

---

**05 · 评测要诚实地包含"风险与成本"层,而不只是结果对错。**

一个能在测试集上做对的系统,如果上车后 token 消耗翻倍、TTFT 翻三倍、偶尔会做出违反端状态的操作,它就不能上线。**端到端结果对、过程合理、成本风险可控,三者缺一不可**。少看一层,产品就少一道安全网。

---

## 附录 · 本文知识结构来源

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;border:1px solid #eaeaea;margin:14px 0;">
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-size:13px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:34%;">资料</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;width:24%;">性质</th>
        <th style="text-align:left;padding:6px 12px;color:#95a5a6;font-weight:600;">本文采用了什么</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">AI Agent 评测入门</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">公司通用入门</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">4 步闭环、4 种评估器、L1/L2/L3 分层思路</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">Agent 评测方法论梳理</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">学术高水位</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">结果/过程/风险三层、评测飞轮、4 类失败模式、领域 Agent 评测从决策点出发</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">Director 评测重点与打分指南</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">车载落地具体</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">10 条具体要求、Director 检查点示例、0-4 分卡的对应</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">车载智能助手评测体系 2.0</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">本团队产出</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">场景元素 × 需求、7 类归因、5 阶段流水线、报表结构、所有难题</td>
      </tr>
      <tr>
        <td style="background:#fff;padding:12px;border-radius:6px 0 0 6px;color:#2c3e50;font-weight:600;">某车载 AI 助手如何更像人</td>
        <td style="background:#fff;padding:12px;color:#7f8c8d;">本团队产出</td>
        <td style="background:#fff;padding:12px;border-radius:0 6px 6px 0;color:#7f8c8d;">感知/理解/表达执行三层、"像人"维度拆解、三个真实 case</td>
      </tr>
    </tbody>
  </table>
</div>

> 本文的方法论框架借鉴了通用 Agent 评测体系(资料 1、2),具体落地则完全来自本团队在车载 Planner 上的实战(资料 3、4、5)。我们的贡献不在于发明新理论,而在于把通用框架翻译成可落地的 Planner 评测——并在这个翻译过程中,提炼出了三次重构、一条流水线、五条建议。

---

<div style="text-align:center;color:#95a5a6;font-size:12px;margin-top:40px;padding-top:20px;border-top:1px solid #eaeaea;">
  — 完 —
</div>
