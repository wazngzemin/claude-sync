# 智能纪要：专家知识-现状及计划讨论 2026年9月9日

<quote-container>

会议主题：专家知识-现状及计划讨论

会议时间：2026年9月9日（周三） 20:02 - 21:05 （GMT+08）

参会人：<mention-user id="ou_2b3e6e85766bc9e632c349ec03bdefd5"/><mention-user id="ou_b6a6a46c22ace88fcab983dd1f597a4f"/><mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/><mention-user id="ou_c27b79c971fd7603813787a3bc652bac"/><mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/><mention-user id="ou_5db39c36f6959ac9bb6e0128d774e9a9"/><mention-user id="ou_cbb7bb25b1024172c248e9a8136aaeb4"/><mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/><mention-user id="ou_f658cdb7d4a9a149c8add37a3572244e"/><mention-user id="ou_7d458fef5309420dc1afd0ec1a97e6c0"/>
</quote-container>

<quote-container>

智能会议纪要由 AI 生成，可能不准确，请谨慎甄别后使用
</quote-container>

# 总结

<whiteboard token="QxfowUzq8h3cBhbfX9dcxVbBnLb" width="820" height="616" align="left"/>

本次会议围绕专家知识体系建设、落地路径及自学习规划展开研讨，明确各阶段优先级与核心动作，内容如下：

- **现有专家知识体系的问题复盘**
	- **前期交付内容质量缺陷**
		- 结构合理性不足：二三月份赛力斯按专家测试集结构编写的知识，四级场景划分逻辑为赶工产出，适配性较差。
		- 内容通用性缺失：大量内容直接塞入具体案例，执行逻辑存在先入为主假设，未形成可复用的通用规则。
		- 边界认知混淆：将know-how与考察点混同，未明确区分知识属性，大量不具备的条件被设为触发逻辑。
    <grid cols="2">
      <column width="63">
        <image token="X1uHbjVOSollPkxJb5LcHjLjnt1" width="1660" height="508" align="center"/>

      </column>
      <column width="37">
        <image token="A81gbI2z8ov41dxmj11c9EIknah" width="2302" height="1178" align="center"/>

      </column>
    </grid>

  - **现有落地机制效果缺陷**
		- 检索适配性不足：当前以query+context检索目录树知识的逻辑，多轮遵循效果差，长步骤任务易丢失逻辑。
		- 链路干扰严重：多步骤任务插入现有DT链路后，打断恢复机制会进一步干扰执行，任务成功率显著下降。
    <image token="VzFlb4y10ob3w2xeUWdcjUvSnic" width="1696" height="450" align="center"/>

    - 架构适配不足：专家级场景需持续review迭代的特性，无法直接适配现有DT架构，需依托动态Advisor承载。
- **专家知识体系的核心设计规则**
  <grid cols="2">
    <column width="59">
      - **知识分层逻辑定义**
				- 点状知识：对应原子执行技巧、特定场景细碎经验，无统一标准与review要求，仅提供执行参考，落地速度快。
				- 面状知识：对应长周期、多步骤场景，包含阶段划分、AI可客观判断的好坏标准、异常原因与解决方案。
				- 体状知识：对应超大型复合场景，覆盖多类子场景，提供宏观体验标准，支持自主创建子任务迭代优化。
    </column>
    <column width="41">
      <image token="AcombwXvUoEO15xpdR7c6ESVnxd" width="1734" height="948" align="center"/>

    </column>
  </grid>

  - **知识形态与载体适配**
		- 无需设计复杂层级关系，仅区分点状游离知识、类Skill结构化面状知识两类即可，避免存储混乱。
		- 面状知识主要供给动态Advisor调用，点状知识通过向量检索匹配，分别适配不同检索逻辑与使用主体。
		- 全类型知识复用统一结构框架，后续专家注入、自学习生成的知识均可直接适配，降低对接成本。
	- **核心特性与优先级规则**
		- 标准可校验：明确可通过工具/数据客观校验的好坏标准，支持模型自主review执行效果，开展迭代优化动作。
		- 品牌可定制：基础逻辑通用，仅迎宾等场景可按不同品牌、车型的调性定制，支持模块化装载切换。
		- 优先级清晰：用户自学习沉淀的个性化规则优先级高于品牌通用专家知识，冲突时以用户要求为准。
- **落地路径与阶段优先级**
	- **短期落地核心动作**
		- 优先保障端侧底座：全量接入各类触发器与感知信号，是否使用可后续按需订阅控制，避免信号遗漏无法补接。
		- 快速落地可调教能力：先实现口述生成动态示例，调试模式下产出的规则可作为公共动态示例全量推送。
		- 并行打磨核心场景：挑选核心高频出行场景，先产出粗糙版面状知识框架，再通过用户反馈逐步迭代优化。
	- **成本与产品定位匹配**
		- Leading车阶段优先保障能力上限，不计短期成本，相当于品牌广告投入，待首个OTA周期后可按需降级。
		- 后续走量车型可采用SMT方案压缩成本，不同定位产品承担不同使命，无需统一成本标准。
	- **长期演进方向**
		- 逐步实现自学习能力：支持模型自主从用户纠正、运行日志中沉淀知识，无需人工编写规则，覆盖长尾需求。
		- 搭建公共知识沉淀机制：通过模型自动筛选共性知识，经人工校验后升级为通用规则，持续优化全量体验。
- **后续专项工作安排**
	- **专项会议规划**
		- 近期组织自学习专项会议，对齐今年年底赛力斯SOP节点的自学习落地范围、效果标准，明确各模块分工。
		- 待核心框架跑通后，组织团队共同观看参考案例内容，拆解优秀案例的设计逻辑，为知识体系设计提供参考。
	- **核心验证要求**
		- 优先验证动态Advisor核心特性：确保其具备自主review、问题分析、方案迭代、效果校验的完整闭环能力。
		- 明确通用知识模板标准：先抽象出通用的面状知识模板，再逐步验证模板对不同场景的适配性，避免存储混乱。

<add-ons component-id="" component-type-id="blk_69a977ea0b004bc4ae4401a7" record="{"bizType":"ai_notes","extra":"{\"sectionType\":\"summary\",\"subScene\":\"meeting\",\"sourceType\":\"meeting\",\"sourceID\":\"7683503799382428633\",\"showFeedbackMenu\":true}","protocolVersion":1,"styleType":2}"/>

<!-- Unsupported block type: 55 -->

# 待办

- [ ] 自学习专题会议组织：于下周一拉取相关人员，待一鸣演示完成后开展专题讨论，明确 12 月底赛力斯 SOP 时自学习可落地的程度 <mention-user id="ou_2b3e6e85766bc9e632c349ec03bdefd5"/>

<add-ons component-id="" component-type-id="blk_69a977ea0b004bc4ae4401a7" record="{"bizType":"ai_notes","extra":"{\"sectionType\":\"todo\",\"subScene\":\"meeting\",\"sourceType\":\"meeting\",\"sourceID\":\"7683503799382428633\"}","protocolVersion":1,"styleType":2}"/>

# 相关链接

- 会中共享的文档：
	- <mention-doc token="RaY1sOIf5hcbgEtRhIncYgDDnwb" type="sheet">赛力斯knowhow知识</mention-doc>
	- <mention-doc token="WhbsdukLFo8Q5Hx9OsMccjFInef" type="docx">专家知识-现状及后续规划思路讨论</mention-doc>
- 妙记：[专家知识-现状及计划讨论](https://bytedance.larkoffice.com/minutes/obcnxc91s9mcxc1csx4a5659?from=ai_minutes)
- 文字记录
	- [专家知识-现状及计划讨论 2026年9月9日](https://bytedance.larkoffice.com/docx/V85Udy3G5oQLnHxw3Mqc6LZEnHe)
