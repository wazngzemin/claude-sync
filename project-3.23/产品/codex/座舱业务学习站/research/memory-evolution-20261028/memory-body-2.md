# 记忆 OnePage

# 背景介绍

火山汽车相关业务有诸多场景都需要使用记忆，为了更好的对相关的流程和算法做管理，我们单独抽象了记忆服务。

职责上，记忆服务负责：

1. 对业务方输入的数据进行记忆的提取、记忆标签的提取、记忆画像的推理

2. 支持业务方获取提取的记忆

3. 支持业务方输入query，进行语义级别的检索

    1. 可能存在过召的情况，需要业务方自行处理

4. 支持根据标签类型获取对应的标签数据

# 支持同学

服务端同学

@向超然@徐燃@高军

算法同学

@但森@李晨延

产品同学

@郝晓伟

# 与业界方案对比

<table><tbody>
<tr>
<td>

**对比维度**

</td>
<td>

**火山汽车记忆服务**

</td>
<td>

**Viking 记忆库**

</td>
<td>

**OpenAI Memory**

</td>
<td>

**LangChain \(LangMem\)**

</td>
</tr>
<tr>
<td>

定位

</td>
<td>

内部车载 AI 记忆提取与管理

</td>
<td>

火山引擎标准化长期记忆云产品

</td>
<td>

ChatGPT 用户级个性化记忆

</td>
<td>

开源 Agent 长期记忆 SDK

</td>
</tr>
<tr>
<td>

服务形态

</td>
<td>

内部 RPC 服务

</td>
<td>

SaaS（API \+ 控制台）

</td>
<td>

集成于 ChatGPT，不单独提供

</td>
<td>

开源 Python SDK，可私有化部署

</td>
</tr>
<tr>
<td>

记忆类型

</td>
<td>

短期情景/历史 \+ 长期情景/语义 \+ 画像

</td>
<td>

事件记忆 \+ 画像记忆

</td>
<td>

已保存记忆 \+ 历史聊天记录

</td>
<td>

Semantic \+ Episodic \+ Procedural

</td>
</tr>
<tr>
<td>

提取方式

</td>
<td>

基于 mem0 算法，周期性提取

</td>
<td>

内置抽取算子，支持自定义模板

</td>
<td>

对话中自动捕捉 \+ 用户主动指定

</td>
<td>

LLM\-driven Memory Manager

</td>
</tr>
<tr>
<td>

存储

</td>
<td>

内部向量数据库

</td>
<td>

VikingDB，百亿级规模

</td>
<td>

内部系统（不公开）

</td>
<td>

可插拔（Pinecone/Chroma 等）

</td>
</tr>
<tr>
<td>

检索

</td>
<td>

语义检索 \+ 标签匹配

</td>
<td>

向量检索 \+ 张量重排，毫秒级

</td>
<td>

语义搜索 \+ 自动注入 Prompt

</td>
<td>

语义搜索 \+ 元数据过滤 \+ 直接访问

</td>
</tr>
<tr>
<td>

演化策略

</td>
<td>

时间维度合并（短期→长期）

</td>
<td>

近期高保真，远期自动压缩

</td>
<td>

持续更新，解决矛盾信息

</td>
<td>

Memory Enrichment 平衡创建与合并

</td>
</tr>
<tr>
<td>

核心优势

</td>
<td>

车载场景深度定制 \+ 打标/标签/画像

</td>
<td>

标准化产品 \+ 高性能 \+ 多层隔离

</td>
<td>

零配置极致体验 \+ 隐私控制

</td>
<td>

完全开源 \+ 高度可定制 \+ Procedural Memory

</td>
</tr>
<tr>
<td>

最佳场景

</td>
<td>

**车载 AI 助手**

</td>
<td>

**ToB SaaS / 通用 AI 应用**

</td>
<td>

**个人 AI 助手（ChatGPT）**

</td>
<td>

**自研 Agent 平台 / 研究原型**

</td>
</tr>
</tbody></table>

更多对比见：[AI 记忆方案对比分析 — Viking 记忆库 vs OpenAI Memory vs LangChain](https://bytedance.larkoffice.com/docx/TCP9damEoojo0ex1tM0cca2unAe)

# 已接入业务概览

<table><tbody>
<tr>
<td rowspan="2">

业务方/能力范围



</td>
<td colspan="2">

短期记忆

</td>
<td colspan="2">

长期记忆

</td>
<td colspan="5">

扩展能力

</td>
</tr>
<tr>
<td>

短期情景记忆

</td>
<td>

短期历史记忆

</td>
<td>

长期情景记忆

</td>
<td>

长期语义记忆

</td>
<td>

批量删除记忆

</td>
<td>

记忆打标

</td>
<td>

记忆标签

</td>
<td>

记忆打分

</td>
<td>

记忆画像

</td>
</tr>
<tr>
<td>

AI汽车

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>



</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>



</td>
</tr>
<tr>
<td>

TOB

</td>
<td>



</td>
<td>

✅

</td>
<td>



</td>
<td>

✅

</td>
<td>

✅

</td>
<td>



</td>
<td>

✅

</td>
<td>



</td>
<td>

✅

</td>
</tr>
<tr>
<td>

具身智能（接入ing）

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>

✅

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

# 能力解释

记忆的产物包含多种形态，其衍生关系和具体含义如下图：

针对每块的能力的具体解释如下：

<table><tbody>
<tr>
<td>

名词

</td>
<td>

释义

</td>
<td>

产生频次

</td>
<td>

有效期

</td>
<td>

技术方案

</td>
<td>

数据样例

</td>
</tr>
<tr>
<td>

短期情景记忆

</td>
<td rowspan="2">

负责对用户的行为信息，从时间维度上进行合并

比如“2026年4月13日，我在重庆写代码、吃火锅、打麻将”

短期情景和长期情景记忆的区别在于时间上，短期情景记忆会对当天20min或20个文本进行总结合并，长期情景记忆基于天维度对短期情景记忆进行合并

</td>
<td>

20min

</td>
<td>

1天

</td>
<td rowspan="2">

[AI汽车记忆方案](https://bytedance.larkoffice.com/wiki/PdbRw6JTlisStKkRbXGczIWBnof#share-ElmEdZjStocQrexrKRGcrrAMnue)



</td>
<td rowspan="2">

1. 李华询问月亮为何有阴晴圆缺，随后挑眉查看屏幕显示的月相原理。

2. 李华要求切换新闻并优先播报人工智能相关新闻。

3. 李华用手掌拍打屏幕顶部状态栏。

4. 李华突然眯眼躲避阳光直射屏幕。

5. 李华小声说“这歌真好听”。

6. 李华按下方向盘“静音”键后点头示意，再次按下方控让继续播放新闻，同时因调整需求语音控制将空调温度调至23度、吹风口向上。

7. 李华听到关键信息后抬手通过方控暂停播报，眉头微蹙询问火箭回收试验的具体应用场景。

8. 李华小声抱怨语音助手反应慢。

</td>
</tr>
<tr>
<td>

长期情景记忆



</td>
<td>

1天

</td>
<td>

默认无过期策略，可根据业务情况配置

</td>
</tr>
<tr>
<td>

短期历史记忆



</td>
<td>

负责对超过指定轮次的历史再进行一次总结



</td>
<td>

依赖业务方提交

</td>
<td>

1天

</td>
<td>

[上文压缩算法文档](https://bytedance.larkoffice.com/docx/Wkb9dlD6Uoi5vDxAOl8cC23kn6d?from=from_lark_group_search&disposable_login_token=eyJ1c2VyX2lkIjoiNzEzNTI0NjU5ODIxNjQzMzY5MiIsImRldmljZV9sb2dpbl9pZCI6Ijc1NjgzMTYxOTQ0MzU2MTI2OTEiLCJ0aW1lc3RhbXAiOjE3ODE2ODIxNDcsInVuaXQiOiJldV9uYyIsInB3ZF9sZXNzX2xvZ2luX2F1dGgiOiIxIiwidmVyc2lvbiI6InYzIiwidGVuYW50X2JyYW5kIjoiZmVpc2h1IiwicGtnX2JyYW5kIjoi6aOe5LmmIiwiY2xpZW50X3NjaGVtYSI6IngtZmVpc2h1In0%3D.dc0821045ebaf714ec38ebc9481f181af19eca5d05e9d5561ef1cc1993d197d4)

</td>
<td>

右后用户先尝试导航到日料店后改为宜家，但因无法获取位置信息而未成功规划路线；接着要求调大空调风量至8档并调低温度至20℃，询问为何两个空调温度不同，得知车是双区独立空调，后排随主驾温度和风量调节；还两次要求拍照，首次拍照需确认U盘和权限，第二次拍照已完成；多次要求唤醒助手，其中一次在助手未回应后再次唤醒。副驾用户播放了《Pigs In The River》，并让助手把座椅靠背和整体位置后移。主驾用户刘西西询问天气，得知上海徐汇区阴天，22到32度，还要求暂停播放音乐，再次查询天气，并两次要求唤醒助手，还说车内20度刚好，若热可再调低两度，最后与助手闲聊并询问能帮忙做什么。之后右后用户要求随便说几句话，助手回应了上海天气和推荐冰粉店，提醒明天升温。

</td>
</tr>
<tr>
<td>

长期语义记忆

</td>
<td>

负责对文本提取用户的偏好信息，输出为一段自然语言描述。

比如：“我喜欢吃牛肉火锅”，“我爱听的歌手是周杰伦”

注意，此处的提起只会基于用户说的话去进行提取，而不会基于此扩展。

</td>
<td>

1天

</td>
<td>

默认无过期策略，可根据业务情况配置

</td>
<td>

[记忆清单（持续更新）](https://bytedance.larkoffice.com/sheets/K2WHsA8O5hRkaTtAhDecnUoPnqe?sheet=0ab43d)

</td>
<td>

1. 王五比较喜欢周杰伦

2. 我还挺喜欢伍佰

3. 我觉伍佰歌唱的不错

4. 王五觉得杨紫漂亮

5. 我比较喜欢杨紫，因为她特别漂亮

6. 我现在喜欢林俊杰，也比较喜欢周杰伦

</td>
</tr>
<tr>
<td>

记忆打标

</td>
<td>

针对已经提取的记忆，去进行打标处理，比如：

```JSON
原始记忆：我昨天晚上开车去大钟寺加班，路上听了周杰伦
打标数据：音乐偏好、上下班通勤
```

</td>
<td>

产生长期语义记忆或长期情景记忆后跑

</td>
<td>

无

</td>
<td>

[记忆标签技术方案](https://bytedance.larkoffice.com/docx/WUL0d4ZkOoLlYPxuwsBcZ9zEnBg#share-DPFfdgL31oRe2uxtggnc9vo8nfb)

</td>
<td>

1. 记忆：我喜欢吃香蕉

    打标：饮食偏好



2. 记忆：开高速长途时，喜欢打开座椅通风3档

    打标：出行及导航偏好

</td>
</tr>
<tr>
<td>

记忆标签



</td>
<td>

对已经提取的长期记忆，进行一些结构化的处理，提取后的数据类似：

```JSON
{
  "喜欢的歌手":["周杰伦"]，
  "喜欢的餐厅":["麦当劳"]
}
```

</td>
<td>

产生长期语义记忆后跑

</td>
<td>

无



</td>
<td>

[画像预注入算法方案](https://bytedance.larkoffice.com/docx/PdfEdR6Mzo77xvx6MpIcbyfWn4e#share-HUE2dLJG4o1sL6xzEfDcC2c8nFg)



</td>
<td>

1. 用户画像\-用车偏好\-座椅偏好\-座椅按摩偏好:喜欢5档

2. 用户画像\-用车偏好\-座椅偏好\-座椅加热偏好:喜欢3档



</td>
</tr>
<tr>
<td>

记忆打分

</td>
<td>

对生成的记忆进行打分，方便使用方对获取到的记忆再次进行排序或者过滤逻辑

</td>
<td>

产生长期情景/语义记忆后跑

</td>
<td>

无

</td>
<td>

[情景记忆得分计算方案\_v1](https://bytedance.larkoffice.com/docx/UrwidNOEHosGtuxBQ8wcaYpXnbg?from=from_lark_group_search&disposable_login_token=eyJ1c2VyX2lkIjoiNzEzNTI0NjU5ODIxNjQzMzY5MiIsImRldmljZV9sb2dpbl9pZCI6Ijc1NjgzMTYxOTQ0MzU2MTI2OTEiLCJ0aW1lc3RhbXAiOjE3ODE2ODIwMTUsInVuaXQiOiJldV9uYyIsInB3ZF9sZXNzX2xvZ2luX2F1dGgiOiIxIiwidmVyc2lvbiI6InYzIiwidGVuYW50X2JyYW5kIjoiZmVpc2h1IiwicGtnX2JyYW5kIjoi6aOe5LmmIiwiY2xpZW50X3NjaGVtYSI6IngtZmVpc2h1In0%3D.22f8a13207ffde12e142a39c98bc4370620b03b863a636c2e6d3ce99ac659734)

[语义记忆排序方案](https://bytedance.larkoffice.com/docx/ECA1dYaDJouIlHxSTWzcchQJnib)

</td>
<td>



</td>
</tr>
<tr>
<td>

记忆画像

</td>
<td>

对已经提取的长期语义记忆，进行一些额外的推理，比如输入：

“我喜欢吃麦当劳”

“我喜欢吃肯德基”

“我喜欢吃必胜客”

=\&gt;推理出“我喜欢吃西式快餐”，后续在推荐场景可以推荐汉堡王等餐厅

</td>
<td>

产生长期语义记忆后跑

</td>
<td>

无

</td>
<td>

[情景记忆画像算法方案](https://bytedance.larkoffice.com/docx/D3cpd4H9GozXVJxWQ6gcDPv1nsD)

[语义记忆画像算法方案](https://bytedance.larkoffice.com/docx/PdfEdR6Mzo77xvx6MpIcbyfWn4e)



</td>
<td>



</td>
</tr>
</tbody></table>

# 召回逻辑

当下业界比较主流的召回方案是走向量数据库，但其存在较多问题：

- **口语化漏召：**部分口语化表达的相似度可能落在0\.39等阈值边界，基于经验设定的阈值易出现漏召或过召，corner case难以覆盖。

- **黑盒不可优化：**召回逻辑完全依赖向量实现，对badcase难以做定向优化，问题定位与迭代效率低。

- **模糊指令覆盖弱：**对部分语义模糊case，纯向量召回难以做到稳定覆盖。

- **时序诉求不满足：**情景记忆场景对时效性有强诉求，但纯语义排序难以满足“时序优先”的业务期望。

    针对这种情况，我们自研了一套基于标签召回的打分排序方案：

后续会将相关能力封装到sdk中提供出来使用

# 准确性

评测相关的见文档：[AiCar\-汽车记忆测试方案](https://bytedance.larkoffice.com/wiki/MwYEwrYOMi5mfRkwqZHc1MyIn1e)

<table><tbody>
<tr>
<td>

指标

</td>
<td>

具体数值（2026\.9\.9）

</td>
</tr>
<tr>
<td>

长期记忆召回准确率

</td>
<td>

96\.3%

</td>
</tr>
<tr>
<td>

长期情景记忆召回准确率

</td>
<td>

90\.79%

</td>
</tr>
<tr>
<td>

长期记忆提取准确率

</td>
<td>

91\.29%

</td>
</tr>
<tr>
<td>

长期情景记忆提取准确率

</td>
<td>

93\.6%

</td>
</tr>
<tr>
<td>

标签生成准确率

</td>
<td>

95\.7%

</td>
</tr>
<tr>
<td>

画像生成准确率

</td>
<td>

83\.3%

</td>
</tr>
</tbody></table>

# 技术相关

1. repo：https://code\.byted\.org/stone\_vehicle/memory

2. 接口文档：https://cloud\.bytedance\.net/bam/rd/vehicle\.model\.memory/api\_doc/show\_doc?cluster=default\&amp;x\-resource\-account=public\&amp;x\-bc\-region\-id=bytedance\&amp;version=1\.0\.44\&amp;api\_branch=feature%2F20260325\-mem\-entity\-tag\&amp;endpoint\_id=3897375

3. 目前**仅提供rpc方式**的内部调用，如果需要http接口对外，请联系支持人员沟通需求背景

4. **原始****记忆数据****SAMPLE**

    1. 情景: [查询结果导出](https://bytedance.larkoffice.com/sheets/CJVNsVNCmhI0ywtJLbgc4ZSHnfc)

    2. 语义: [查询结果导出](https://bytedance.larkoffice.com/sheets/WRwIs04E0hIojwtOAqPcxeHCnfe)

# 接入流程

1. 接入需提前跟支持人员拉会同步需求，明确业务场景是否需要记忆服务支持

2. 发送邮件明确需求，邮件模版如下，收件人 xiangchaoran@bytedance\.com，ran\.xu@bytedance\.com，gaojun\.elbn@bytedance\.com

    ```JSON
    业务方名字：
    需要开启的记忆能力：
    相关记忆的有效期：
    是否存在其他额外需求：
    ```

3. 配置相关数据后，一起进行相关联调

4. 测试后无问题上线

# 记忆生成概述

目前采取的记忆提取算法是mem0，更多细节见：[AI汽车context模块技术评审](https://bytedance.larkoffice.com/wiki/ZJNXwI8mpiB7B9kDlhfcCZ2Hnrh)

# milestone\&amp;长期规划

<table><tbody>
<tr>
<td>

规划内容

</td>
<td>

进度

</td>
<td>

优先级

</td>
<td>

完成时间

</td>
<td>

备注

</td>
</tr>
<tr>
<td>

支持长期语义记忆生成和召回

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2025\.9

</td>
<td>



</td>
</tr>
<tr>
<td>

抽象记忆独立服务，支持汽车内多个业务

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2025\.11

</td>
<td>



</td>
</tr>
<tr>
<td>

支持长期情景记忆生成和召回

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2025\.12

</td>
<td>



</td>
</tr>
<tr>
<td>

支持短期情景记忆生成和召回

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2025\.12

</td>
<td>



</td>
</tr>
<tr>
<td>

支持情景记忆基于时间维度的召回

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.1

</td>
<td>



</td>
</tr>
<tr>
<td>

支持多环境记忆生成隔离

</td>
<td>

已完成

</td>
<td>

P1

</td>
<td>

2026\.2

</td>
<td>



</td>
</tr>
<tr>
<td>

拆分记忆独立服务，提供独立rpc接口

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.3

</td>
<td>



</td>
</tr>
<tr>
<td>

支持记忆批量删除

</td>
<td>

已完成

</td>
<td>

P1

</td>
<td>

2026\.3

</td>
<td>



</td>
</tr>
<tr>
<td>

支持生成记忆画像和查找

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.4

</td>
<td>



</td>
</tr>
<tr>
<td>

优化记忆画像

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.5

</td>
<td>



</td>
</tr>
<tr>
<td>

使用eventbus重构消费队列逻辑

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.5

</td>
<td>



</td>
</tr>
<tr>
<td>

语义记忆打标

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.5

</td>
<td>



</td>
</tr>
<tr>
<td>

短期历史记忆

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.6

</td>
<td>



</td>
</tr>
<tr>
<td>

情景记忆打标

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.6

</td>
<td>



</td>
</tr>
<tr>
<td>

支持情景记忆打分

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.7

</td>
<td>



</td>
</tr>
<tr>
<td>

支持基于情景的推理

</td>
<td>

已完成

</td>
<td>

P1

</td>
<td>

2026\.7

</td>
<td>



</td>
</tr>
<tr>
<td>

接入WEB后台

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.7

</td>
<td>



</td>
</tr>
<tr>
<td>

支持TOC场景的记忆展示和删除

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.7

</td>
<td>



</td>
</tr>
<tr>
<td>

支持语义记忆打分

</td>
<td>

已完成

</td>
<td>

P1

</td>
<td>

2026\.8

</td>
<td>



</td>
</tr>
<tr>
<td>

情景记忆支持生成时候绑定相关人

</td>
<td>

已完成

</td>
<td>

P0

</td>
<td>

2026\.8

</td>
<td>



</td>
</tr>
<tr>
<td>

监控体系搭建

</td>
<td>

已完成

</td>
<td>

P1

</td>
<td>

2026\.8

</td>
<td>



</td>
</tr>
<tr>
<td>

支持情景记忆隐私策略

</td>
<td>

施工中

</td>
<td>

P0

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

支持语义记忆隐私策略

</td>
<td>

规划中

</td>
<td>

P0

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

识别到用户的情景感知，并融合到记忆中

</td>
<td>

规划中

</td>
<td>

P1

</td>
<td>



</td>
<td>

有三条路径可以识别情绪：

1. 语音

2. 语义

3. vlm

因排期问题，目前先安排产品同学基于vlm的方案进行下一步调研看看是否可行

</td>
</tr>
<tr>
<td>

支持混合检索

</td>
<td>

规划中

</td>
<td>

P0

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

支持记忆标签的动态、静态区分

</td>
<td>

规划中

</td>
<td>

P1

</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

多模态记忆设计

</td>
<td>

规划中

</td>
<td>

P2

</td>
<td>



</td>
<td>

暂缓，目前大部分做法都是基于多模态提取语义然后复用之前的链路，同时业务侧未看到进一步收益

</td>
</tr>
</tbody></table>



