<quote-container>

会议主题：主动推荐 双方沟通会议

会议时间：2026年11月11日（周三） 18:00 - 19:12 （GMT+08）

参会人：<mention-user id="ou_16df93670f32dabf865bdc9cc4e6ef6a"/><mention-user id="ou_400f33e5c3888a2e100fc4e627b8a2c1"/><mention-user id="ou_86dca38c9ad20efbb9f9b7c287c69012"/><mention-user id="ou_dc72abe0ff1dbc747bf80cf2ade9d4a8"/><mention-user id="ou_709eabcc5b6d391d4222ba04fbaba531"/><mention-user id="ou_46b3c1b415b92dae29a5ca2228ad8940"/><mention-user id="ou_e246f07f347f7821859f0312310119aa"/><mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/><mention-user id="ou_5ec566afdbf9ab8344f9928a7e30ea51"/><mention-user id="ou_306a646d19b65cb2eccf72931910144e"/><mention-user id="ou_8d70900829a5cfbb2c8cb496d6b0b7d4"/><mention-user id="ou_7d458fef5309420dc1afd0ec1a97e6c0"/> <text color="gray" bgcolor="gray">@陈伯顺</text> <text color="gray" bgcolor="gray">@陈牧原</text> <text color="gray" bgcolor="gray">@高雅哲</text> <text color="gray" bgcolor="gray">@谷旸</text> <text color="gray" bgcolor="gray">@黄爽爽</text> <text color="gray" bgcolor="gray">@蒋莹</text> <text color="gray" bgcolor="gray">@李继威</text> <text color="gray" bgcolor="gray">@李俭</text> <text color="gray" bgcolor="gray">@吕书炜</text> <text color="gray" bgcolor="gray">@糜梦星</text> <text color="gray" bgcolor="gray">@彭威</text> <text color="gray" bgcolor="gray">@任睿奇</text> <text color="gray" bgcolor="gray">@宋辉</text> <text color="gray" bgcolor="gray">@孙超</text> <text color="gray" bgcolor="gray">@田润泽</text> <text color="gray" bgcolor="gray">@王海峰</text> <text color="gray" bgcolor="gray">@王志聪</text> <text color="gray" bgcolor="gray">@闻文</text> <text color="gray" bgcolor="gray">@吴丹</text> <text color="gray" bgcolor="gray">@吴鹏</text> <text color="gray" bgcolor="gray">@夏兵</text> <text color="gray" bgcolor="gray">@谢拥军</text> <text color="gray" bgcolor="gray">@徐鹏</text> <text color="gray" bgcolor="gray">@严立康</text> <text color="gray" bgcolor="gray">@余江滔</text> <text color="gray" bgcolor="gray">@余钧雷</text> <text color="gray" bgcolor="gray">@张陵军</text> <text color="gray" bgcolor="gray">@赵乾宽</text> <text color="gray" bgcolor="gray">@赵燕</text> <text color="gray" bgcolor="gray">@赵益红</text> <text color="gray" bgcolor="gray">@周怀君</text> <text color="gray" bgcolor="gray">@周宇</text> <text color="gray" bgcolor="gray">@祝志鹏</text>
</quote-container>

<quote-container>

智能会议纪要由 AI 生成，可能不准确，请谨慎甄别后使用
</quote-container>

# 总结

<whiteboard token="OACwwVYQ0hzo4nbplmkc6Qcsnmf" width="820" height="703" align="left"/>

本次上汽与字节团队围绕8838平台下Advisor主线功能落地、合作对接方案、后续排期等内容展开充分讨论，明确了各场景可行性、依赖条件及后续行动安排，内容如下：

- **8838平台主动推荐场景可行性评估**
  <grid cols="2">
    <column width="56">
      - **基础场景落地结论**
				- 小七小憩、冥想模式可落地：二者基于用户历史偏好记忆做推荐，8838平台可支持，仅小七小憩全车型覆盖，冥想当前仅BS5PR车型支持。
				- 长睡眠模式可落地：基于用户历史开启记录做推荐，仅BS5PR车型支持，露营场景暂不纳入本次落地范围。
				- 强依赖条件：上述三个场景均强依赖FaceID获取用户身份，无FaceID则无法调取用户历史偏好记忆。
    </column>
    <column width="43">
      <image token="Sliwb4oXEoT8XkxDf9RcrmsMnZg" width="1764" height="823" align="center"/>

    </column>
  </grid>

  - **其他场景评估结论**
		- 情感关怀、兴趣延伸：无需强制上车即刻推送，可在行程中车速为0、驻车等时机推送，字节会后内部评估可行性。
		- 功能发现：字节侧无法直接承接，因无上汽全量埋点数据，且双方均不支持全量埋点数据互通。
		- 兴趣延伸：暂未更新评估结论，与此前沟通内容保持一致。
- **高价值功能接入主动推荐框架方案**
	- **接入规则说明**
		- 开放自定义接口：上汽侧将高价值主动推荐场景以自然语言描述的Advisor形式传入字节侧Master Agent，由其完成后续推荐、触发执行全链路。
		- 准入要求：接入场景需双方产品共同判定为高价值，且对应功能已具备可被语音直接调用的原子控制能力。
	- **交互框架共识**
		- 共用同一套容器：双方共同维护同一套主动推荐交互容器，不做两套独立体系，优先采用小卡片弱打扰的交互形式。
		- 暂不支持大容器形态：当前技术阶段暂不支持带大图、多内容承载的大尺寸推荐卡片，避免对用户造成过度打扰。
	- **调用规则约定**：上汽侧直接调用字节侧Advisor接口即可，断网、账号未登录等异常场景由字节侧自行处理。
	- **开关设置要求**
		- 保留场景级子开关：原有基于规则的推荐场景保留独立子开关，基于模型的推荐仅设置一个总开关。
		- 开关入口要求：开关入口层级不能过深，优先放置在车辆设置的智能化板块，方便用户快速找到并关闭。
- **字节侧主线主动推荐功能说明**
	- **四大核心功能分类**
		- 舒适类：基于车内温度、空气质量等传感器数据，综合推理后向用户推送舒适车控相关建议。
		- 出行类：覆盖导航途中补能、停车、目的地预测等场景，为用户提供出行相关的主动推荐服务。
		- 情感类：以上车打招呼等场景为主，后续逐步拓展更多细分场景。
		- 内容类：面向音乐、媒体等内容消费场景，为用户推送匹配偏好的相关内容。
	- **落地边界说明**
		- 暂不支持离车场景：当前字节侧仅能实现车内场景的主动推荐，离车场景的相关能力暂不具备，后续待能力成熟后再逐步释放。
		- 舒适类落地前置要求：上汽侧需先梳理确认车内温度、车外温度、空气质量等舒适类相关传感器的支持情况，再进一步细化场景合作方案。
  <image token="WVZ4bkjgBoXTbmx0bW4cBIQYnze" width="3324" height="895" align="center"/>

- **后续行动与排期安排**
  <grid cols="2">
    <column width="55">
      - **上汽侧待办**
				- 梳理车型适配表：整理不同车型对应的主动推荐支持功能清单，同步给字节侧。
				- 跟进UE规范流转：会后对接内部相关负责人，明确双方共用交互容器的需求流转、维护协作规则。
			- **字节侧待办**
				- 输出技术依赖清单：于17号左右输出所有主动推荐场景的技术强依赖清单，同步给上汽侧。
				- 梳理UE修改需求：同步梳理交互框架需要调整的UE相关需求，与技术依赖并行推进。
    </column>
    <column width="45">
      <image token="TKKObzzKso139Jxfjlrcx50vnCc" width="1706" height="976" align="center"/>

    </column>
  </grid>

  - **后续对接安排**
		- 上汽侧收到依赖清单后，由内部架构、系统团队评估端侧状态是否可满足相关诉求，消化周期约2-3天。
		- 预计20号或23号双方召开对接会，共同核对依赖落地可行性。

<add-ons component-id="" component-type-id="blk_69a977ea0b004bc4ae4401a7" record="{"bizType":"ai_notes","extra":"{\"sectionType\":\"summary\",\"subScene\":\"meeting\",\"sourceType\":\"meeting\",\"sourceID\":\"7706851234812595435\",\"showFeedbackMenu\":true}","protocolVersion":1,"styleType":2}"/>

# 待办

- [ ] 梳理车型功能表：梳理不同车型对应的主动推荐功能清单，形成表格后同步给字节侧相关人员（来自张苑哲）
- [ ] 对齐功能方案：和宋辉单独对齐功能发现模块的实施可行性，确认最终落地的技术方案
- [ ] 咨询框架需求流转：会后找贝贝老师沟通，确认推荐容器后续定制化需求的流转规则，同步对齐大产品的相关意见
- [ ] 沟通推荐触发逻辑：会后和赵益红沟通，确认情感关怀、兴趣延伸两类功能的非上车即时触发方案可行性（来自闻文） <mention-user id="ou_16df93670f32dabf865bdc9cc4e6ef6a"/>
- [ ] 输出技术依赖清单：在17号左右输出本次主动推荐相关的所有技术强依赖，同步给上汽侧进行后续内部评审（来自闻文） <mention-user id="ou_16df93670f32dabf865bdc9cc4e6ef6a"/>
- [ ] 梳理UE改造需求：内部安排设计师同步梳理推荐框架UE层面需要改动的需求点，和技术依赖并行推进（来自闻文） <mention-user id="ou_16df93670f32dabf865bdc9cc4e6ef6a"/>

<add-ons component-id="" component-type-id="blk_69a977ea0b004bc4ae4401a7" record="{"bizType":"ai_notes","extra":"{\"sectionType\":\"todo\",\"subScene\":\"meeting\",\"sourceType\":\"meeting\",\"sourceID\":\"7706851234812595435\"}","protocolVersion":1,"styleType":2}"/>

# 相关链接

- 妙记：[主动推荐 双方沟通会议](https://bytedance.larkoffice.com/minutes/obcn6h293yvib1t3c92d3y63?from=ai_minutes)
- 文字记录
	- [主动推荐 双方沟通会议 2026年11月11日](https://bytedance.larkoffice.com/docx/M6zvdX3Ecoqt8ox1sDUcaMNznZF)

