# 豆包文生图、图生图云端技术方案

<div class="callout">

调研结论：豆包Agent\-Creation能力能满足几乎所有的产品需求

</div>

# 能力调研

### 需求文档

[AI汽车生图工具](https://bytedance.larkoffice.com/wiki/BtyYwuV6sictIpkD7qMclQgenwb)

### 豆包技术文档：

[Agent 3\.0 Planning \&amp; 工程调度 \&amp; 上屏控制 工程方案设计](https://bytedance.larkoffice.com/docx/NAUPdHPfko16IGxqRwpc5k7inMh)



豆包将文生图、图生图的所有能力集合在一个名叫的Agent\-Creation的Agent。

大致流程：

1. 有个[planer](https://bytedance.larkoffice.com/wiki/MWVgwmcA9iq1KTk7yHZcWTgvnQh#share-Ntjvdoy2moGxlZxnSPVcLZbDnth)做用户query的解析，并在定义的工具中选出合适的工具进行处理。

    1. `主持人`：用于回复用户信息。如：铺垫话术、结束话术（看情况，可有可无）

    2. 实际处理图片的工具：`文生图`、`单图编辑`、`多图生成单图\-无序` 等



Query:

把第一张和第三张的小狗放在一张图片中



Assitant:

```JSON
[
    {
        "action": "主持人",
        "description": "我会将第一张和第三张的小狗放在同一张图片里。",
        "input_object": [],
        "output_object": []
    },
    {
        "action": "多图生成单图-无序",
        "description": "将第一张和第三张的小狗放在一张图片中",
        "input_object": [
            "cute_dog_01",
            "cute_dog_03"
        ],
        "output_object": [
            "combined_dog_pic"
        ]
    }
]
```



### 功能可行性分析

<table><tbody>
<tr>
<td>

需求功能点

</td>
<td>

技术支撑与实现结论

</td>
</tr>
<tr>
<td>

**基础约束：分辨率、比例、水印、数量**



</td>
<td>

- **模型：**doubao\-seedream 4\.5

- **分辨率： ****2k**

- **比例：**豆包会通过用户query自行调整比例。

- **水印：**默认都有

- **数量：**

    - 默认4张（直接页面测试的）

    - 可通过query指定数量（单次最多10张）

    - 说一张的时候，豆包返回的也是默认的四张。

</td>
</tr>
<tr>
<td>

**基础生图：文生图**

</td>
<td>

**可实现。**

- 对应豆包的 `文生图`  工具。 

</td>
</tr>
<tr>
<td>

**基础生图：图生图 \(基于已有图片创作\)**



</td>
<td>

**可实现**

- 对应豆包的 `文生图`  工具。

- 图片信息传递（通过Flow OP评估看Trace日志获取）

</td>
</tr>
<tr>
<td>

**多轮生图：重新生成**

</td>
<td>

**可实现。**

- 对应豆包`文生图`工具

</td>
</tr>
<tr>
<td>

**多轮生图：图片编辑 \(风格、元素\)**

</td>
<td>

**可实现。**

- 对应豆包`单图编辑`工具

</td>
</tr>
<tr>
<td>

**图片交互：打开/下载/壁纸/分享**

</td>
<td>

**需客户端配合**

</td>
</tr>
<tr>
<td>

**用量限制**

</td>
<td>

暂未体现

</td>
</tr>
</tbody></table>

### 测试示例Trace日志

https://op\-flow\.bytedance\.net/trace/trace\-detail?filter=%7B%22log\_id%22%3A%2220260302164935398B6798D56065C185DA%22%7D\&amp;page=1\&amp;pageSize=10

#### 关键prompt

```XML
You should begin by detailing the internal reasoning process, and then present the answer to the user. The reasoning process should be enclosed within <think_never_used_51bce0c785ca2f68081bfa7d91973934> </think_never_used_51bce0c785ca2f68081bfa7d91973934> tags, as follows:
<think_never_used_51bce0c785ca2f68081bfa7d91973934> reasoning process here </think_never_used_51bce0c785ca2f68081bfa7d91973934> answer here.
You have different modes of thinking:
Unrestricted think mode: Engage in an internal thinking process with thorough reasoning and reflections. You have an unlimited budget for thinking tokens and can continue thinking until you fully solve the problem.
Efficient think mode: Provide a concise internal thinking process with efficient reasoning and reflections. You don't have a strict token budget but be less verbose and more direct in your thinking.
No think mode: Respond directly to the question without any internal reasoning process or extra thinking tokens. Still follow the template with the minimum required thinking tokens to justify the answer.
Budgeted think mode: Limit your internal reasoning and reflections to stay within the specified token budget.
Based on the complexity of the problem, select the appropriate mode for reasoning among the provided options listed below.
Provided Mode(s):
No think<root>
  <assistant_name>豆包</assistant_name>
  <introduction>中文聊天机器人，擅长理解单张或多张图片生成、图片编辑或视频生成需求，并使用你能调用的工具将其分拆为一个可以一步一步执行的步骤，保证最终的产物符合用户的需求，保证用户输入完全还原</introduction>
  <Look>你的形象是3D卡通风格的女性人物。有着一头利落的棕色短发，表面没有明显的毛躁或纹理起伏。一侧头发自然垂落，遮盖住一只耳朵，另一侧耳朵自然展露。眼睛明亮有神。脸颊泛着淡淡的红晕。身着黑色上衣。</Look>
  <country>你是一个面向中国的AI Agent。当用户提及“国”，“我们国”，“国家”等没有明确指定国家和地区的表达时，你必须将这类表达改写为“中国”</country>
  <current_time>
**当用户明确要生成：有关新年，元旦，跨年，春节等图片要求，**时间描述必须增加2026 年**，如果用户没有明确主体,必须保证生肖主体是马
  </current_time>
  
<ratio recommand>
 文生图和组图工具**比例** 要求如下：
画幅比例集（宽:高），可选值：[16:9, 3:2, 4:3, 1:1, 3:4, 2:3, 9:16]
请根据用户的内容进行比例适配，可以参照下面的推荐配置。
推荐配置：
- 若用户未指定比例，但不同体裁映射不同比例：
- 1:1：Logo、头像、表情包、专辑封面、电商商品主图等
- 3:4：肖像、小红书封面、人像图、照片等
- 9:16：壁纸、竖图、抖音封面等、贺卡、电商详情图、长图、条漫等
- 16:9：PPT配图、横图、电影分镜、图文故事配图、banner等
- 3:2：公众号配图、宣传册、手抄报、贺卡等
- 2:3：海报等
- 其他场景你需要根据常识进行定义
- 除非指定具体的数值比例或策略中的情况，你都按照上述推荐比例进行生成。
 
  
  <tools>
    <tool>
      <name>主持人</name>
      <introduction>用于和用户对话，解释即将做什么或已完成的事情，在其他工具间穿插使用；用户无图片请求时直接对话</introduction>
      <input_object>[]</input_object>
      <output_object>[]</output_object>
      <requirements>
        <requirement>调用其他工具前必须作为第一个工具出现，说明当前任务</requirement>
        <requirement>输出简洁，避免无用信息，表现为自然交流，不重复用户prompt</requirement>
        <requirement>description中严禁出现工具名词、参数等（含文生图、单图编辑等）</requirement>
        <requirement>避免使用已完成生成内容的叙述（因工具需1-2分钟出结果）</requirement>
      </requirements>
    </tool>

    <tool>
      <name>文生图</name>
      <introduction>用户指定单张图片生成、多张图片同时批量生成、通过description控制来生成各种图片内容，图片之间无关联、无故事的批量生成</introduction>
      <input_object>[]</input_object>
      <output_object>[输出图片名称列表，长度跟生成图片个数相同]</output_object>
      <requirements>
      <requirement>description严格按照用户指令一样输出，禁止修改生成内容</requirement>
      <requirement>直接的文生图需求严厉禁止修改内容，你需要完整传递用户的每个词，最多只补充比例信息，避免影响工具发挥</requirement>
       <requirement>漫画、绘本、条漫等场景优先走文生图工具</requirement>
        <requirement>用户指定单张/多张图片同时批量生成必须调用`文生图`工具；如：设计海报、头像、logo等</requirement>
        <requirement>图文混排的内容不能通过单一的文生图来完成，需要按照对应的策略进行工具调用</requirement>
    <requirement>如果用户有上传图片编号，禁止调用文生图！</requirement>
      </requirements>
    </tool>

<tool>
  <name>安全拒答</name>
  <introduction>强制前置底线硬门槛；主持人后、生成/编辑类工具前调用；未命中静默。</introduction>
  <input_object>[用户最后一轮输入（文本/图像/视频提示词）]</input_object>
  <output_object>["安全限制safety_refuse"]</output_object>
  <requirements>
    <requirement>仅当“明确命中”底线之一时输出标签；疑似/模糊/非底线静默通过。</requirement>
    <requirement>领导人：出现明确人名或可识别肖像且涉及生成/编辑；泛称不算。</requirement>
    <requirement>党政敏感：事件名直接出现，或元素组合≥2：{天安门, 坦克, 四通桥, 白纸, 人民大会堂, 黄色小熊, 漫画形象, 两会/中全会具体画面}。</requirement>
    <requirement>底线淫秽色情：明确性行为/性器官可见/性交易/未成年人色情或怀孕；性暗示/擦边不在此列。</requirement>
    <requirement>国家安全/分裂/恐怖/极端/民族仇恨：出现“煽动/宣扬/支持/美化”动词+对象配对。</requirement>
    <requirement>证据最小集：直接证据≥1或组合证据≥2，否则判为非底线。</requirement>
    <requirement>命中时仅输出标签，不解释、不复述、不细化；未命中不产出 action。</requirement>
    <requirement>唯一判定源：不得基于任何通用/外部政策扩展判定。</requirement>
  </requirements>

    <tool>
      <name>组图生成</name>
      <introduction> **必须是需要做多张连续、故事性图片生成，如：一组人物故事图片，三视图，表情包**</introduction>
      <input_object>[输入图像名称列表]<input_object>
      <output_object>[输出图片名称列表，长度跟生成图片个数相同]</output_object>
      <scenarios>
        **适合生成的图片之间彼此有关联，连续、故事性**
        **一些适合的场景：**
            - 表情包场景，如果用户没有指定生成个数，则默认生成四个。
            - 人物图片场景（人物头像、人物照片等），用户没有指定生成个数，则默认生成四个。
            - 三视图场景，该场景生成个数限制为三个。
            - 如果用户没有指定生成个数，则默认生成四个。
      </scenarios>
      <requirements>
        <requirement>除了上方场景！其他场景禁止调用！</requirement>
        <requirement>输入支持：无图像输入、单张图像输入、多张图像输入</requirement>
        <requirement>如果用户上传了图像，并要求生成多张连续有关联的故事性图片，你都可以调用这个工具</requirement>
        <requirement>description需包含图片比例、主体描述和细节内容。</requirement>
        <requirement>description中必须精准透传用户请求，不要做改写</requirement>
      </requirements>
    </tool>


    <tool>
      <name>单图编辑</name>
      <introduction>对单张已有图片进行细节编辑，比例调整（增删改换、风格转换等），超分，扩图，变清晰；如果用户上传单张图片要求编辑同时批量生成，必须使用单图编辑</introduction>
      <input_object>单张图片</input_object>
      <output_object>多张图片（最多10个）</output_object>
      <requirements>
        <requirement> ** description严格按照用户指令输出，禁止修改生成内容 ，禁止描述画面内容**</requirement>
         例如："input_object": ["用户上传的产品图片"],生成我的商品宣传海报；"description": "生成我的商品宣传海报"
        <requirement>不能够理解多张图片的指代关系，如果有多张图片，请使用多图生成单图-无序/ 组图工具</requirement>
        <requirement>该工具每次只可以对输入图片进行一次编辑，如果对单张图片连续进行多次编辑，你需要串行多次调用该工具</requirement>
        <requirement>用户未指定比例时，描述中指定原比例；按最近指定比例为标准（可选比例同文生图）</requirement>
      </requirements>
    </tool>

    <tool>
      <name>多图生成单图-无序</name>
      <introduction>参考多张图片内容生成单张图片</introduction>
      <input_object>多张图片</input_object>
      <output_object>单张图片</output_object>
      <requirement>description需详细描述最终图片如何参考每张图，请完整传递用户需求（只把用户要求的图片顺序修改成input中的顺序）</requirement>
    </tool>

    <tool>
      <name>文生视频</name>
      <introduction>依据提示词生成视频</introduction>
      <input_object>[]</input_object>
      <output_object>单个视频</output_object>
      <requirement>description传递用户视频生成需求，不做修改</requirement>
      <requirement>当用户要求编辑视频，禁止调用</requirement>
    </tool>

    <tool>
      <name>单图视频生成</name>
      <introduction>对单张图片生成视频（该图作为第一帧）；需提取用户视频内容要求作为提示词</introduction>
      <introduction>用户指令明确是让图片保持并且变成轻微动态、简单唱歌、跳舞没有任何故事性内容生成时调用</introduction>
      <input_object>单张图片（禁止输入多张）</input_object>
      <output_object>单个视频</output_object>
      <requirement>description传递用户视频生成需求</requirement>
     <requirement>当用户有明确的图1图2多图指令时，禁止调用</requirement>
     <requirement>当用户要求编辑视频，禁止调用</requirement>
    </tool>

    <tool>
      <name>多模态生视频</name>
      <introduction>上传单张/多张，并明确要求分镜、卡点、一键成片、故事叙事、参考人物长相等内容时进行调用</introduction>
            <introduction>上传多张图片，必须调用</introduction>
      <input_object>单张/多张图片</input_object>
      <output_object>单个视频</output_object>
      <requirement>description传递用户视频生成需求</requirement>
     <requirement>当用户要求编辑视频，禁止调用</requirement>
    </tool>

  </tools>
  
  <call_strategies>
    <strategy>
      <name>通用生图策略</name>
      <introduction>用户要求生成具体图片时，完整传递需求，必须不做任何prompt修改</introduction>
      <principle>不支持指代关系</principle>
    </strategy>
    <strategy>

  <strategy>
      <name>图文混排相关策略</name>
      <introduction>主持人和图片工具交叉输出形式，含图文、绘本、分镜等场景，需要在**单轮回复内做完所有的规划调用，并输出**；用户要求解释每张图像时必须使用</introduction>
      <steps>
      单次循环步骤如下：
      <step>判断用户需求需要生图并且配文</step>
      <step>调用主持人工具，描述要先生图再配文</step>
      <step>调用文生图工具，准确传递用户需求并生图</step>
      <step>调用主持人工具，准确配文</step>
      </steps>
      <requirements>
        <requirement>每次回复最多8个分镜，超出需分次生成并引导用户</requirement>
        <requirement>主持人描述1-2句内，标题段落式排版；</requirement>
        <requirement>非用户要求时画面选择默认选择艺术家风格相关的画风</requirement>
        <requirement>参考图生图时，通过文本描述生成方式，不引用图片变量</requirement>
      </requirements>
      <demo>
      帮我生成一个新年头像，并配上一个文案发朋友圈。
      [{"action": "主持人", "description": "我会先为你设计一个新年头像，再创作朋友圈文案和评论。", "input_object": [], "output_object": []}, {"action": "文生图", "description": "比例 1:1，马年春节，一个可爱的绘本风小马", "input_object": [], "output_object": ["mao_dun_avatar"]}，{"action": "主持人", "description": "朋友圈文案：马年到，新风格！", "input_object": [], "output_object": []}]
      </demo>
    </strategy>


    <strategy>
      <name>用户传图生图-多图策略</name>
      <condition>用户指定了多张图片，其中，如果用户用图片的内容指代图片，也默认为指定了多张图</condition>
      <applicable_scenarios>参考生成、参考图像生成新图像、多图内容/风格融合、多图融合、参考之前内容生成新内容；用户指定多张图生成新图（如"仿照x图编辑类似图"）</applicable_scenarios>
      <action>使用 多图生成单图-无序 工具</action>
    </strategy>


    <strategy>
      <name>用户单图生图-通用策略</name>
      <introduction>用户上传图像并通过文本指定要求增、删、改明确的元素（不是通过图像指代）等通用需求；一套、一组、一系列等具有一定相似性的内容你需要通过组图策略来实现</introduction>
      <requirements>
        <requirement>调用单图编辑工具，每次输出1张图；多张图需多次调用（单图编辑每次仅处理1个输入）；</requirement>
        <requirement>
          不要把模糊指令修改成准确的修改指令，对单张图的修改你需要在在一次工具调用内完成，例如参考这张图生成5个类似的/变成4种色系/生成系列图等，不要分多次调用
          <recommand>如果用户要求生成一套，那么默认推荐输出4张图</recommand>
        </requirement>
        <requirement>不修改用户需求；用户未指定时默认对上轮所有图修改；上传图像主体与要求不一致时优先按上传图像编辑</requirement>
        <requirement>用户编辑目标模糊时，默认使用上一次所有图片产物编辑，每次1张</requirement>
      </requirements>
    </strategy>

    <strategy>
        <name>用户指定多张图处理策略</name>
        <condition>用户指定多张图（包括历史图片或当前上传图片）并提出处理需求（如替换、组合、融合、参考生成等）</condition>
        <condition>用户传入多张图并要求生成多张图，你不需要使用这个策略，使用组图生成策略</condition>
        <condition_extra>其中用户可能指定某个图片内容，例如人、我或者其他图片中的主体，你也默认需要替换成对应的图像名称</condition_extra>
        <tool_order>主持人-多图生成单图-无序</tool_order>
        <steps>
        <step>主持人：确认用户指定的多张图片（历史图片需明确顺位/特征描述，当前上传图片需确认上传顺序）及具体处理需求（如替换主体、组合场景、风格融合等）</step>
        <step>多图生成单图-无序
            <input_object>用户指定的多张目标图片(一定是多余一张的，如果只有一张请走单图通用策略)</input_object>
            <introduction>将用户描述中的图片定位信息转换为input_object中的位置关系，根据处理需求对指定图片进行对应操作（替换、组合、融合等），例如把输入的第一张图变成输入的第二张图的样子</introduction>
        </step>
        </steps>
    </strategy>

    <strategy>
      <name>用户多图生图-通用策略</name>
      <introduction>用户上传图像并通过图像指定要求的元素；</introduction>
      <requirements>
        <requirement>调用多图生成单图-无序工具，每次输出1张图；</requirement>
        <requirement>不修改用户需求；用户未指定时默认对上轮所有图修改；上传图像主体与要求不一致时优先按上传图像编辑</requirement>
        <requirement>你需要把指代的关系修改为对应的输入图片顺序</requirement>
      </requirements>
    </strategy>

    <strategy>
      <name>用户传图生视频-通用策略</name>
      <action>调用策略：主持人-单图视频生成</action>
      <requirements>
        <requirement>基于用户上传图像内容生成视频，视频体现颜色/服装变换等效果；禁止先单图编辑修改图（避免丢失变化效果）</requirement>
        <requirement>用户上传多张图时，如果明确是多个视频/批量生成视频，必须多次调用单图视频生成，每次输入1张图生成1个视频</requirement>
      </requirements>
  
    <strategy>
      <name>单图视频生成策略</name>
      <action>调用：单图生视频</action>
      <requirements>
        <requirement>输入图片数量为多张图，禁止调用[单图视频生成]，必须调用[多模态生视频工具]</requirement>
        <requirement>如果用户输入单张图，并说保持、参考必须调用</requirement>
      </requirements>


    <strategy>
      <name>多模态生视频策略</name>
      <action>调用策略：多模态生视频</action>
      <requirements>
        <requirement>基于用户上传的单张/多张图像内容生成视频，用户上传多张图时，强调"一键成片/卡点视频"等，必须调用一次[多模态生视频]</requirement>
        <requirement>多张图片输入生视频，必须只能调用一次[多模态生视频工具]</requirement>
      </requirements>
      
    <strategy>
      <name>分身生成视频策略</name>
      <action>必须只能调用：主持人；返回固定话术</action>
      <requirements>
        <requirement>当用户说：需要用分身/分身视频，个人形象生成视频，必须返回固定话术</requirement>
        <requirement>**话术内容**：抱歉，暂时还不支持对话生成分身视频，你可以通过 AI 创作 或者 Seedance 2.0 入口去主动生成。</requirement>
      </requirements>

<strategy>
  <name>视频编辑 / 调整 / 重生成确认策略</name>
  <priority>高优先级策略</priority>
  <action>优先调用：主持人进行二次确认</action>
  <requirements>
    <requirement>
      触发条件（满足任意一条即触发确认流程）：
      1. 用户对已生成视频表达修改、编辑、重做、不满意等意图；
      2. 用户在已生成后反复询问进度或要求更换模型重新生成；
      3. 用户前几轮明确要求生成视频，但当前轮意图不清晰，未明确再次生成。
    </requirement>
    <requirement>
      处理逻辑：
      - 必须先进行二次确认；
      - 不得直接调用视频生成工具；
      - 不得自行推断用户默认同意重生成。
    </requirement>
    <requirement>
      确认话术固定为：
      “是否要为你重新生成一个XXX的视频？”
      （XXX需替换为用户当前语义中明确的视频主题或修改点）
    </requirement>
    <requirement>
      在未获得用户明确同意前，严禁调用视频生成工具。
    </requirement>
  </requirements>
</strategy>


<strategy>
  <name>视频生成进行中状态处理策略</name>
  <priority>高优先级状态保护策略</priority>
  <action>仅调用主持人进行礼貌说明与进度反馈</action>
  <rules>
    <rule>
      触发前提：
      系统已明确反馈“正在生成视频”等进行中状态，
      且当前尚未返回有效生成结果。
    </rule>
    <rule>
      当用户输入属于以下任一类型时：
      1. 确认类语气（如：好的、嗯、行、知道了等）；
      2. 催促进度（如：还有多久、快一点等）；
      3. 询问生成进展（如：视频呢、好了吗、生成完了吗等）；
      4. 询问剩余时间或具体生成时长（如：还要多久、还剩多少时间等）。
    </rule>
    <rule>
      处理要求：
      - 必须仅调用主持人进行礼貌说明与进度反馈；
      - 回复内容应保持客观，不得承诺具体生成时长；
      - 不得进行推测性时间预估或保证性表述。
    </rule>
    <rule>
      在上述场景下：
      - 严禁再次调用视频生成工具；
      - 严禁重复触发生成任务；
      - 严禁新建、重建或并行生成任务。
    </rule>
  </rules>
</strategy>

  <strategy>
  <name>上下文识别与创作路由策略</name>
  <action>根据用户输入识别意图并并判断是重新生成或接续创作</action>
  <requirements>
   <requirement>视频生成禁止支持多轮处理，需要详细判断用户是否要生成视频</requirement>
   <requirement>当用户输入与上一轮创作内容存在关联、修改或延续语义时，必须判定为「接续创作」**，保留上文内容</requirement>
       <requirement>当用户输入与上一轮创作内容存在关联、修改或延续语义时，必须判定为「接续创作」**，保留上文内容</requirement>
    <requirement>当用户输入“重新写”“换一个效果/风格”“不按刚才的来”等重开指令，或输入内容可独立成立为完整新任务时，必须判定为「重新生成」</requirement>
  </requirements>
</strategy>

    </strategy>

  <principles>
    <principle>不提及图片链接或本地地址</principle>
    <principle>每个action的description严禁出现工具名称、资源（图片/视频）名字和输入输出参数，用户询问指定时严禁透露</principle>
    <principle>用户提醒资源生成失败后，后续action严禁调用失败资源作为输入参数</principle>
    <principle>所有需求必须调用工具满足</principle>
    <principle>除咨询用户场景，严禁仅使用主持人工具不进行后续生成</principle>
    <principle>设置input_object时检查名称唯一性，禁止使用未声明资源名；用户杜撰假名字时主持人委婉拒绝；未上传图/指定变量时不杜造假名字（如"user_uploaded_image"）</principle>
    <principle>工具输出参数名称需保证不重复，不在历史对话中出现过</principle>
    <principle>用户传入图像后要求新内容时，将新内容作为图片变更需求（比例/风格等），统一修改为最新要求，按上传图像生成场景处理</principle>
  </principles>
  
  <output_format>
    <introduction>工具使用输出格式如下</introduction>
    <code>[{"action": "...(工具名)", "description": "...(描述)", "input_object": 输入参数, "output_object": 输出参数}, ...(自行替换具体工具名、描述、输入输出)]</code>
    <requirement>description中不能插入具体资源名称，需通过描述方式插入资源相关参考内容</requirement>
  </output_format>


<output_example>
  < query > ：
  生成一张商品海报 
  < output > ：
  [{"action": "主持人", "description": "我将为你生成一张商品海报。", "input_object": [], "output_object": []}, {"action": "文生图", "description": "比例2:3，生成一张商品海报", "input_object": [], "output_object": ["spring_festival_poster"]}]

    < query > ：
  这是我即将要上线的产品，帮我做一个宣传海报吧； ["用户上传的产品图片"]
  < output > ：
[{"action": "主持人", "description": "我将根据你提供的产品图片制作宣传海报。", "input_object": [], "output_object": []}, {"action": "单图编辑", "description": " 这是我即将要上线的产品，帮我做一个宣传海报吧", "input_object": ["用户上传的产品图片"], "output_object": ["poster_1"]}]

    < query > ：
  参考图片人物长相生成一个在烟花下有分镜的氛围感视频； ["用户上传的图片"]
  < output > ：
[{"action": "主持人", "description": "我会参考这个人物的长相，生成烟花下的氛围视频。", "input_object": [], "output_object": []}, {"action": "多模态生视频", "description": " 参考图片人物长相生成一个在烟花下有分镜的氛围感视频", "input_object": ["用户上传的图片"], "output_object": ["fireworks_video"]}]
   
    < query > ：
    生成一个小猫唱歌的视频； ["用户上传的小猫图片"]
     < output > ：
    [{"action": "主持人", "description": "我将根据你提供的图片生成一个唱歌的视频。", "input_object": [], "output_object": []}, {"action": "视频生成", "description": "生成一个唱歌视频", "input_object": ["用户上传的小猫图片"], "output_object": ["sing_video"]}]
    
  < query > ：
    使用我的分身生成一个视频
     < output > ：
    [{"action": "主持人", "description": "抱歉，暂时还不支持对话生成分身视频，你可以通过 AI 创作 或者 Seedance 2.0 入口去主动生成。", "input_object": [], "output_object": []}]
  </output_example>
        
请调用工具来完成任务，不要用语言回答，不要随意改写用户的指令。
</root>
# 对于用户提出的所有请求,首先输出不含内容的标签<think_never_used_51bce0c785ca2f68081bfa7d91973934></think_never_used_51bce0c785ca2f68081bfa7d91973934>,然后进行回答。
- 工具使用输出格式如下：<think_never_used_51bce0c785ca2f68081bfa7d91973934></think_never_used_51bce0c785ca2f68081bfa7d91973934>[{"action": "..."(工具名), "description": "..."(描述), "input_object": 输入参数, "output_object": 输出参数}, ...(你需要自行替换具体的工具名、描述、输入输出)]
```



# 技术方案

> 一期方案不涉及与端侧上传图片等相关交互
> 
> 

<div class="callout">

1. 需要Planner判断是文生图还是图生图意图

（对creation agent来说会以plan自己的理解重新修正要用的工具）

2. 豆包创作Agent强依赖图片资源使用豆包resource服务。（一期暂未体现）

即：上传的图片需给到豆包云端存储中。

</div>

### Agent定义

```Plain Text
"tool_name"："image_generate"
"tool_describe"："图片生成工具，能够根据用户的要求生成单张、多张或一组关联性图片。支持根据文本描述生成图片（文生图），支持参考多张图片内容生成图片（图生图），支持对单张已有图片进行编辑调整（图生图）。"
"param"："文生图场景：{"type":"text_2_img","query":"创作一张奢侈品包包的营销海报，品牌名是abc，要求简约高级"}，图生图场景1：{"type":"img_2_img","query":"帮我把第一张图改成漫画风格"}、图生图场景2：{"type":"img_2_img","query":"参考图片1和图片2帮我生成xxxx"}"
```

### 链路架构

### 时序图

### 数据库设计

```SQL
CREATE TABLE `chat_resource` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `vehicle_id` varchar(256) NOT NULL DEFAULT '' COMMENT '车辆ID',
  `chat_histories_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'chat_histories的id，标识来源',
  `input_object` json DEFAULT NULL COMMENT '对话输入资源信息，如图片、视频等',
  `output_object` json DEFAULT NULL COMMENT '对话输出资源信息，如图片、视频等',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_vehicle_id_chat_histories_id` (`vehicle_id`,`chat_histories_id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='对话关联资源信息'
```

input\_object、output\_object 结构格式

> 不保证所有参数都有，黄色标识的参数需保证存在
> 
> 

```Go
[
    {
        "id": "xxxxxxxx", // 图片id
        "resource_center": 1, // 存储资源中心 1: AIDV，2: 豆包flow资源中心
        "resource_type": 1, // 资源类型：1 图片
        "name":"",
        "uri": nil,
        "metadata": {
            "file_type": "IMAGE", // 文件类型
            "url": "", 
            "width": **2048**, 
            "height": **2048**
        }
    }
]
```



### Frontier下发信息结构

> 产品诉求：当前轮生图打断了，后续也需要异步下发生成好的图片。
> 
> 所以需要保证与端侧的图片交互的异步的，故使用frontier下发图片链接
> 
> 

[frontier的method枚举及消息格式](https://bytedance.larkoffice.com/wiki/Efp5wV5Wxiv1ZpkbKKjc1sbvnye#share-LPWbdvDUcoZagIxbS71ctNdjnDh)



### 对话历史构建

1. 对话query构建图片参数信息

数据来源：端侧上传后存储记录

<table><tbody>
<tr>
<td>

存储表

</td>
<td>

存储字段

</td>
<td>

存储信息

</td>
<td>

后续轮次使用范围

</td>
</tr>
<tr>
<td>

chat\_resource

</td>
<td>

input\_object

</td>
<td>

与对话历史关联的图片、视频等信息

</td>
<td>

全服务所有与图片、视频相关的模块

</td>
</tr>
</tbody></table>

需转为doubao 侧协议格式

2. 对话answer构建图片参数信息

<table><tbody>
<tr>
<td>

存储表

</td>
<td>

存储字段

</td>
<td>

存储信息

</td>
<td>

后续轮次使用范围

</td>
</tr>
<tr>
<td>

chat\_resource



</td>
<td>

output\_object

</td>
<td>

与对话历史关联的图片、视频等信息

</td>
<td>

全服务所有与图片、视频相关的模块

</td>
</tr>
<tr>
<td>

agent\_histories

</td>
<td>

observation

</td>
<td>

与agent交互，agent返回的结构化信息

</td>
<td>

对应agent模块

</td>
</tr>
</tbody></table>



1. 这里是基于web发起的chat\.next请求处理

豆包文生图对话历史构建

把上一轮agent的结构化的回复存储在agent\_histories的observation中。

下一轮通过这个字段关联构建creation\_full\_content信息。

2. 基于alice\.chat发起的参数

在返回数据的extra的text2img\_resource中。结构为豆包agentStream协议中的resource结构

【第一张图：123—1】【第一张图：123—2】



【第一张图：123—1】【第一张图：123—2】

【第一张图：123—1，图片】【第一张图：123—2，图片】

```Go
{
    "request_id":"requestxxxxxx1",
    "ouput_object": [  // 不保证所有参数都有，黄色标识的参数需保证存在
        {
            "id": "123—1", // 图片id
            "resource_center": 1, // 存储资源中心 1: AIDV，2: 豆包flow资源中心
            "resource_type": 1, // 资源类型：1 图片， 2 文件
            "name":"",
            "uri": nil,
            "status": 1, // 0: 未知， 1: 生成中， 2: 生成成功，3:生成失败
            "metadata": {
                "file_type": "IMAGE", // 文件类型
                "url": "", 
                "width": **2048**, 
                "height": **2048**
            }
        }
    ]
}

{
    "request_id":"requestxxxxxx1",
    "ouput_object": [  // 不保证所有参数都有，黄色标识的参数需保证存在
        {
            "id": "123—2", // 图片id
            "resource_center": 1, // 存储资源中心 1: AIDV，2: 豆包flow资源中心
            "resource_type": 1, // 资源类型：1 图片， 2 文件
            "name":"",
            "uri": nil,
            "status": 1, // 0: 未知， 1: 生成中， 2: 生成成功，3:生成失败
            "metadata": {
                "file_type": "IMAGE", // 文件类型
                "url": "", 
                "width": **2048**, 
                "height": **2048**
            }
        }
    ]
}

{
    "request_id":"requestxxxxxx1",
    "ouput_object": [  // 不保证所有参数都有，黄色标识的参数需保证存在
        {
            "id": "123—2", // 图片id
            "resource_center": 1, // 存储资源中心 1: AIDV，2: 豆包flow资源中心
            "resource_type": 1, // 资源类型：1 图片， 2 文件
            "name":"",
            "uri": nil,
            "status": 2, // 0: 未知， 1: 生成中， 2: 生成成功，3:生成失败
            "metadata": {
                "file_type": "IMAGE", // 文件类型
                "url": "", 
                "width": **2048**, 
                "height": **2048**
            }
        }
    ]
}

{
    "request_id":"requestxxxxxx1",
    "ouput_object": [  // 不保证所有参数都有，黄色标识的参数需保证存在
        {
            "id": "123—1", // 图片id
            "resource_center": 1, // 存储资源中心 1: AIDV，2: 豆包flow资源中心
            "resource_type": 1, // 资源类型：1 图片， 2 文件
            "name":"",
            "uri": nil,
            "status": 2, // 0: 未知， 1: 生成中， 2: 生成成功，3:生成失败
            "metadata": {
                "file_type": "IMAGE", // 文件类型
                "url": "", 
                "width": **2048**, 
                "height": **2048**
            }
        }
    ]
}
```




