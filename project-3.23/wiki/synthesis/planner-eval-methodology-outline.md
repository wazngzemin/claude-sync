---
title: 从单点问答到场景化 — 车载 Planner 评测体系演进 (详细大纲)
date: 2026-05-26
updated: 2026-05-26
tags: [synthesis, methodology, evaluation, planner]
sources:
  - raw/articles/AI Agent评测入门.html
  - raw/articles/Agent评测方法论梳理.html
  - raw/articles/Director评测重点与打分指南.html
  - raw/articles/车载智能助手评测体系2.0.html
  - raw/articles/豆包汽车如何更像人.html
status: draft
---

# 从单点问答到场景化:车载 Planner 评测体系的演进实战

> 这是一份**对外分享的方法论详细大纲**,目标受众为 AI 产品经理与评测负责人。
> 脱敏规则:具体产品名/车型/竞品厂商已抽象为"某车载 AI 助手"、"主流车载 Agent",内部技术细节保留。

---

## 0. 文档骨架(总览)

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

**核心论点(可作为开头金句)**:
> 通用 Agent 评测告诉我们"做什么",但 Planner 作为 Agent 系统里的"大脑节点",它的评测信号必须穿透到决策本身——而不只是看最终效果。本文记录我们把一套通用方法论落到车载 Planner 上,所做的三次重构。

---

## Part 1 — 起点:1.0 评测体系做了什么

### 1.1 1.0 体系的工作模式

1.0 是为"传统车载大模型助手"设计的,核心假设是**单点问答**:用户说一句,系统执行一次,评测一次。

- **评测对象**:单条指令或 2-3 轮的小对话
- **评测类目**:导航 / 多媒体 / 车控 / 闲聊 / 搜索
- **评测方法**:固定 case 库 → 准确率 + 人工打分
- **隐含假设**:用户说什么,系统就执行什么;case 之间相互独立

### 1.2 1.0 体系做对了什么(不要全盘否定)

- 为基础能力提供了**可重复的度量衡**
- 跑通了**回归测试**的链路(每次模型/Prompt 变动跑一遍全集)
- 沉淀了**竞品横向对比**的数据基础

**这一段要强调**:1.0 不是"错"的,只是"不够"。它在它服务的产品形态下是合理的。

### 1.3 1.0 的隐含边界(为后面铺垫)

| 1.0 假设 | 现实何时打破 |
|---------|--------------|
| 一问一答 | 主动服务(0问1答)出现 |
| Case 独立 | 多轮任务、长任务出现 |
| 指令明确 | 模糊指令依赖 context 解释 |
| 只测最终结果 | 偶然成功带来体验偏差 |
| 主观评分模糊 | "像人"成为关键产品诉求 |

---

## Part 2 — 转折:产品形态变了,评测体系暴露了 3 个漏洞

### 2.1 产品端的三个变化

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <table style="width:100%;border-collapse:separate;border-spacing:12px 14px;">
    <thead>
      <tr>
        <th style="width:32%;font-size:13px;color:#95a5a6;font-weight:600;text-align:left;padding-bottom:6px;">维度</th>
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

### 2.2 评测端被暴露的 3 个漏洞

**漏洞 1:单点 case 测不出"主动服务"质量**
- 系统在用户没开口时主动推荐,1.0 没有任何评测维度承载它
- 例:用户上车,系统是否应该主动播报今天的会议?预期触发条件?未触发算 bug 吗?

**漏洞 2:只测结果,丢失过程信号**
- 同样"成功完成任务",有的 Planner 一次到位,有的反复试错
- 1.0 的准确率指标无法区分这两种情况
- 但产品体验上差异巨大(等待时长、信任感、token 成本)

**漏洞 3:没有 context 模拟,"最优解"无法定义**
- 同一句"我好热",在"暴雨/电量低"和"晴天/电量满"下最优解不同
- 1.0 case 是孤立的,无法承载 context 的动态变化
- 评测员之间的判断标准开始分裂

### 2.3 一句话定调

> 评测体系不是被"做错了",而是它服务的产品形态已经迁移了。
> 当产品从"工具"变成"伙伴",评测必须从"功能正确"扩展到"行为合理"。

---

## Part 3 — 重构 1:评测对象,从指令到"场景"

### 3.1 核心定义:什么叫"场景"

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
        <li>重要 Context</li>
        <li>特殊场景 / 任务</li>
      </ul>
    </div>
    <div style="display:flex;align-items:center;color:#95a5a6;font-size:24px;font-weight:bold;">×</div>
    <div style="flex:1;background:#fff;padding:18px;border-radius:8px;border-top:3px solid #27ae60;">
      <div style="color:#27ae60;font-weight:700;font-size:14px;margin-bottom:10px;">需求 Demands</div>
      <ul style="margin:0;padding-left:18px;color:#2c3e50;font-size:13px;line-height:1.9;">
        <li>场景强相关需求<br/><span style="color:#95a5a6;font-size:12px;">(重点考察,预定义)</span></li>
        <li>通用需求<br/><span style="color:#95a5a6;font-size:12px;">(导航 / 车控 / 媒体 / 闲聊,自然触发)</span></li>
      </ul>
    </div>
  </div>
</div>

**举例**(对外分享时可呈现 3 个对比鲜明的场景):

| 元素组合 | 重点需求 |
|----------|----------|
| 通勤 + 摩登青年 + 单人 + 重感冒 | 缓解感冒症状(空调/路线/记忆既往用药) |
| 自驾游 + 潮奢族 + 伴侣 + 庆生 | 仪式感氛围(灯光/音乐/语气) |
| 接送孩子 + 多孩家庭 + 三岁女儿 | AI 角色扮演 + 互动游戏 |

### 3.2 为什么场景化能解决前面的漏洞

| 漏洞 | 场景化怎么解 |
|------|--------------|
| 单点测不出主动服务 | 场景里有"何时该主动"的预设,有触发节奏与预期 |
| 只测结果丢过程 | 场景天然有多步,过程合理性进入观测范围 |
| Context 缺失无法定最优解 | 元素就是 context 的结构化建模 |

### 3.3 场景库的搭建原则

<div style="font-family:-apple-system,sans-serif;background:#f7f9fc;padding:24px;border-radius:12px;border:1px solid #eaeaea;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #3498db;">
      <div style="font-weight:700;color:#3498db;font-size:13px;letter-spacing:0.5px;">原则 1 · 覆盖目标用户</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">来自产品定义的核心人群 × 核心场景</div>
    </div>
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #27ae60;">
      <div style="font-weight:700;color:#27ae60;font-size:13px;letter-spacing:0.5px;">原则 2 · 覆盖系统能力</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">感知 / 理解 / 执行 各能力域均有触发</div>
    </div>
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #f39c12;">
      <div style="font-weight:700;color:#f39c12;font-size:13px;letter-spacing:0.5px;">原则 3 · 可演进</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">Bad case 回流后场景库持续扩张</div>
    </div>
    <div style="background:#fff;padding:16px 18px;border-radius:8px;border-left:4px solid #8e44ad;">
      <div style="font-weight:700;color:#8e44ad;font-size:13px;letter-spacing:0.5px;">原则 4 · 可组合</div>
      <div style="margin-top:6px;color:#2c3e50;font-size:13px;line-height:1.6;">元素是正交维度,可组合出新场景</div>
    </div>
  </div>
</div>

### 3.4 一个细节决定成败:预期结果分级

> 抛开场景、语境和角色定义来聊模糊指令的最优解,都是耍流氓。

- **基础预期**:及格线,不出错就行
- **惊喜预期**:超出用户表达,展示主动智能

例:用户"我好困" → 基础是"建议休息区";惊喜是"察觉到刚吃过感冒药,提示药效持续时间"。

### 3.5 给同行的一个落地建议

不要先想"我的 Agent 有哪些能力",而是先问:
> 在我的业务场景里,哪些**决策点**如果选错了,后果不可接受?

这些决策点才是 Agent 真正发挥智能、也是评测必须紧盯的地方。
(参考:从业务判断 → 决策点 → 评测设计的三步法,来自学术体系的领域 Agent 评测方法论)

---

## Part 4 — 重构 2:评测视角,从结果到过程+归因

### 4.1 评测视角的三层结构

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

(这一节的灵感来自学术体系的"结果-过程-风险"三层观测框架,但我们做了**车载场景的具体绑定**。)

### 4.2 端到端指标的具体定义

| 指标 | 公式 | 含义 |
|------|------|------|
| 任务完成度 | ∑ 通过检查点×权重 / ∑ 检查点×权重 | 加权计算,核心检查点权重高 |
| pass@3 | 3 次试次至少 1 次完成的概率 | 偶然成功能力下限 |
| pass^3 | 3 次试次全部完成的概率 | 稳定性上限 |
| TTFT | First Token Time | 用户感知的响应起点 |
| 平均 Chunk Latency | (T_chunk_i 开始 − T_chunk_(i-1) 结束) / 总 chunks | 流式播报顺滑度 |

**完成定义**:至少 80% 检查点通过 + 结果检查点通过。

### 4.3 过程指标:7 类归因体系

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
  <div style="margin-top:14px;padding:12px 16px;background:#fff8e1;border-left:3px solid #f39c12;border-radius:4px;color:#7f6334;font-size:12px;line-height:1.6;">
    <strong>为什么归因体系是核心资产:</strong>它让"Agent 跑错了"变成"具体哪个环节挂了" — 这是评测飞轮的诊断引擎。
  </div>
</div>

**为什么这个归因体系是核心资产**:
- 让"Agent 跑错了"变成"具体哪个环节挂了"
- bad case 回流时可以精准分配给负责人
- 是评测飞轮(详见 Part 6)的诊断引擎

### 4.4 检查点的设计哲学

> 评测的智能,在于把"它做得好不好"翻译成"哪些可观测的具体事件发生了"。

- **结果检查点**(必须通过):核心需求是否被满足
- **过程检查点**(加权):中间步骤是否合理
- **分支检查点**:面对 ambiguity 是否选了合理路径

(参考 Director 打分指南的 10 条要求 + 0-4 分卡,可在这里展开 1-2 个具体场景的检查点示例。)

---

## Part 5 — 重构 3:主观体验"像人"维度怎么测

### 5.1 为什么主观评测之前一直做不好

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

### 5.2 解法:Case-by-Case 把抽象拆为具体检查点

不再用"共情能力分 = 3"这种描述,而是:

> 用户说"我好困",
> ✓ 检查点 1:是否先关心安全(基础)
> ✓ 检查点 2:是否结合 context(感冒药/连续驾驶时长)给出针对性建议(惊喜)
> ✓ 检查点 3:语气是否符合"伙伴"人设,而不是"客服"

这种拆解的代价是**人力成本高**(每个场景要单独定义检查点),但收益是:
- 评分客观可复现
- bad case 可定位
- 优化方向明确

### 5.3 "像人"维度的三层拆解

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

### 5.4 评测维度的开放性

> "人"由数不清的特质组成。我们的评测体系必须是开放的——每用一次,都可能发现新的特质需要纳入。

实操上,我们引入一个机制:**意外之喜捕获**。
评测员除了打检查点,还要记录"虽然不在检查点里,但让我惊讶/不适的回复",这些观察再被回灌进检查点库。

---

## Part 6 — 工程化:5 个 Prompt 串起一条自动化流水线

### 6.1 整体链路图

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

### 6.2 每个 Prompt 的设计要点

| 阶段 | Prompt 做什么 | 是否需人工 |
|------|--------------|------------|
| 1 场景选取 | 按测试目标(回归/专项)从库里挑场景 | 否 |
| 2 对话生成 | LLM 角色扮演用户,与系统多轮对话 | 核心集要 |
| 3 检查点生成 | 基于场景+对话产出检查点 | 核心集要 |
| 4 检查点验证 | 比对 trace,自动判通过/失败 | 否 |
| 5 归因分析 | 分析失败链路,归到 7 类之一 | 部分要 |

### 6.3 评测飞轮:让每一次失败都变成系统改进

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

(这一节借鉴学术体系的"评测飞轮"概念,但需要强调:**没有归因体系,飞轮转不起来**。)

### 6.4 报表结构

| 维度 | 指标 | 用途 |
|------|------|------|
| 端到端 完成情况 | 任务完成度加权 | 主决策依据 |
| 端到端 稳定性 | pass@3 / pass^3 | 偶然 vs 稳定 |
| 端到端 时延 | TTFT / 平均 Chunk Latency | 性能水位 |
| 端到端 各能力域 | 感知/理解/执行 各域得分 | 短板定位 |
| 过程 ASR | 句准率 | 感知层归因 |
| 过程 拒识 | 准确率 | 感知层归因 |
| 过程 仲裁 | 准确率 | 路由归因 |
| 过程 SFT 车控 | 准确率 | 工具层归因 |
| 过程 Planner | 工具选择/参数/context/其他 4 项准确率 | 核心归因 |

---

## Part 7 — 诚实地讲:正在解决的难题

> 这一节是分享的"价值高地"——讲难题比讲成绩更让同行愿意听。

### 7.1 上下文模拟的一致性

- 元素与元素之间要逻辑自洽(暴雨天 ↔ 路况)
- Context 与 query 要匹配
- 多轮中 context 要动态更新
- **当前的尝试**:模拟器 + Prompt 自校验,但仍有 case 出现 context 自相矛盾

### 7.2 主动服务的"未触发场景"判定

- 预设了应该主动推荐,但系统没触发——是 bug 还是合理保守?
- 预设之外的场景系统触发了——合理还是噪音?
- **当前的尝试**:精确到具体场景设计验收 case,但不设计过高召回率;非预期触发用"逻辑合理性 + 体验提升性"二维评估

### 7.3 主观性消除

- 短期方向:自动化降低人为分歧
- 长期方向:**接受主观性,把评测的价值从"打分"迁移到"定位问题"**
- 一句话:不要太纠结于分数本身,要纠结于问题被定位了多少

### 7.4 多轮对话无法预设

- 解法:大模型角色扮演用户,生成对话
- 难点:模拟用户的真实性 vs 对抗性平衡(参考学术体系的用户模拟设计)

### 7.5 持续任务的"节奏问题"

- 长任务进度反馈频率多少合适?
- 节奏太密扰民,太疏丢失存在感
- 还在探索

---

## Part 8 — 给同行的 5 条建议(可独立流传)

> 这一节是分享的"金句区",每条都要打磨到能被独立引用。

1. **别先想 Agent 有什么能力,先想业务里的"决策点"在哪里。**
   一个决策点 = 多条可选路径 + 选错有成本。决策点决定了评测往哪里看。

2. **评测集是和代码同等重要的资产。**
   一次性的 case、临时手写的测试,产生的结论不可比。把评测集版本化、固定化。

3. **失败模式比失败 case 更重要。**
   单个 case 的修复价值有限,把 case 抽象成"失败模式"——能力型/策略型/结构型/交互型——才能驱动结构性改进。

4. **主观评测不要追求"消除主观"。**
   要把抽象能力(共情/人设/情商)拆为具体的可观测检查点,case-by-case 而非通用打分。

5. **评测要诚实地包含"风险与成本"层。**
   只测结果不测成本的系统,在规模化部署时会被 token / 延迟 / 不安全调用反噬。

---

## 附录:本文知识结构来源

- **通用 Agent 评测框架**(认知 × 执行、结果/过程/风险三层、飞轮、4 类失败模式):综合自外部研究与公司内部评测方法论梳理
- **车载 1.0/2.0 演进**(场景元素 × 需求、能力域、归因、报表、自动化链路):来自团队内部 2.0 评测体系
- **Planner 落地具体要求**(话术/拆解/性能/Token 4 大类、0-4 分卡):来自 Director 评测重点与打分指南
- **"像人"维度拆解**(感知/理解/表达执行三层):来自团队对豆包"不像人"问题的复盘

---

## 下一步(写正文前需要你确认的)

1. ✅ 整体骨架(8 Part)是否接受?
2. ⏳ 三个具体场景示例的素材,你想用哪三个?(我目前默认是:通勤+感冒、自驾游+庆生、接孩子+扮演)
3. ⏳ Part 4 想展开几个**具体检查点设计案例**?推荐选 1-2 个真实的、能直接被读者拿走用。
4. ⏳ Part 5 的"像人"维度举例,你想保留哪几个最有冲击力?(我推荐:车里背单词时插播电量、副驾妈妈 vs 小女孩的 context 冲突、"我想放松一下"的过度执行)
5. ⏳ Part 7"难题"这一节的诚实度——可以讲到什么颗粒度?
6. ⏳ 是否要在 Part 0 之前加一张**总图**(把 5 份资料的知识结构与本方法论的关系画出来,给读者"上帝视角")?
