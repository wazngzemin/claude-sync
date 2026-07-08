# 【AI汽车-PRD】多级VAD产品体验

<!-- doc_id: CUrhd06kOoQWqcxa9LfcL8M5nNg -->
<!-- total_length: 2995 -->

# 版本管理

<lark-table rows="3" cols="5" header-row="true" column-widths="100,351,143,100,204">

  <lark-tr>
    <lark-td>
      版本
    </lark-td>
    <lark-td>
      变更记录
    </lark-td>
    <lark-td>
      变更日期
    </lark-td>
    <lark-td>
      变更人
    </lark-td>
    <lark-td>
      状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.1
    </lark-td>
    <lark-td>
      撰写需求初始版本
    </lark-td>
    <lark-td>
      2025-12-4
    </lark-td>
    <lark-td>
      <mention-user id="ou_5234bbf5abd4f16914e588e5093d0742"/>
    </lark-td>
    <lark-td>
      <text bgcolor="light-yellow">**待评审**</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

# 需求背景

在当前的端到端语音交互中，语音活动检测 (VAD) 是决定用户话语何时开始和结束的关键环节，直接影响系统的延迟与响应准确性。传统单次VAD判决的机制，难以在“快速响应”与“语义完整”之间取得理想平衡：过短的VAD窗口可能导致语义不完整，过长则增加用户等待时间。

本次需求的核心目标是引入一种时间窗驱动的阶段化处理策略，通过设置不同长度的VAD时间窗（soft/hard/语义），并结合启发式的语义完整性判断，实现对语音输入的渐进式处理。

# 多级VAD概念

多级VAD一共分成三个：Soft VAD，Hard VAD，语义VAD

<lark-table rows="4" cols="4" column-widths="100,122,351,219">

  <lark-tr>
    <lark-td>
      VAD类型
    </lark-td>
    <lark-td>
      时间
    </lark-td>
    <lark-td>
      描述
    </lark-td>
    <lark-td>
      主要用途
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Soft VAD
    </lark-td>
    <lark-td>
      300ms
    </lark-td>
    <lark-td>
      是一个较短的时间可以检测出用户是否说完话。
    </lark-td>
    <lark-td>
      快速响应
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Hard VAD
    </lark-td>
    <lark-td>
      500ms
    </lark-td>
    <lark-td>
      是一个相对长的时间可以检测出用户是否说完话。
    </lark-td>
    <lark-td>
      对快速响应进行二次确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      语义VAD
    </lark-td>
    <lark-td>
      1000ms
    </lark-td>
    <lark-td>
      是根据句子的完整性来看用户是否说完话。
    </lark-td>
    <lark-td>
      语义完整性延长
    </lark-td>
  </lark-tr>
</lark-table>

注：VAD的时间，暂定为以上信息，随实车体验后可变更。

# 详细需求定义

## 系统流程图

<image token="FuzMbQsaYorwHYxtjeLcf16ynEg" width="4038" height="964" align="center"/>

##  关键逻辑说明

1. 双路径独立语义判断：
  - Soft路径：在300ms进行语义完整性判断，决定是否“抢跑”请求LLM。
  - Hard路径：在500ms进行语义完整性判断，结果为与Soft路径的ASR文本做比对。
1. 抢跑机制：预处理环节仅完成LLM的“拒识”“意图”“简单复杂”处理。不抢跑至FC/Planner/DM的模块。
1. 用户的表达中存在语义不完整情况，需多等待收音结束时间1000ms（暂定），让用户表达完整。1000ms结束时，不再进行语义完整性判断。直接将结果进行后续LLM处理

## 语义完整性定义

当前语义完整性，暂不做定义，需测试思必驰输出的完整性结果评测后，再考虑是否「自研」

# 用户体验场景

场景一：流畅成功（抢跑成功）

- 用户：“明天北京的天气怎么样？”（说完后清晰停顿）
- 系统：300ms时判断语义完整，ASR文本A=“明天北京的天气怎么样？”。500ms时Hard VAD文本B相同。
- 结果：文本一致，直接使用300ms时LLM的天气的意图。进行调用下游链路。

场景二：抢跑失败

- 用户：“播放音乐。”（300ms时ASR识别为“播放音月”）
- 系统：300ms路径按“播放音月”请求LLM，可能被拒识或错误处理。500ms时Hard VAD正确识别为“播放音乐”。
- 结果：文本对比不一致，系统用“播放音乐”重新请求LLM，获得正确指令。响应略有延迟，但结果正确。

场景三：语义不完整处理

- 用户：“我想订一张去...”（犹豫）...“上海的机票。”
- 系统：300ms时截获“我想订一张去”，判断语义不完整，启动语义VAD。1000ms时获得完整文本“我想订一张去上海的机票。”，后续流程正常。
- 结果：用户未被打断，系统准确理解了完整意图。

**2月底演示需求变更**

1. 云端soft vad的预请求，接入云端拒识回捞模型
1. 云端soft vad和hardvad的asr结果判断方式进行修改，修改成最短路径的方式进行匹配。提高soft vad的命中概率。
