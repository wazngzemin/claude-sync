
<lark-table rows="8" cols="4" column-widths="68,115,100,441">

  <lark-tr>
    <lark-td>
      版本
    </lark-td>
    <lark-td>
      变更时间
    </lark-td>
    <lark-td>
      变更人
    </lark-td>
    <lark-td>
      变更内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.1
    </lark-td>
    <lark-td>
      2026/07/11
    </lark-td>
    <lark-td>
      <mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/>
    </lark-td>
    <lark-td>
      1. 保存当前版本：输入管理模块及其策略 第 3 版（如有需要请在已存版本中查看）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.2
    </lark-td>
    <lark-td>
      2026/07/11
    </lark-td>
    <lark-td>
      <mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/>
    </lark-td>
    <lark-td>
      1. 内容描述优化
			1. 更新Director新消息类型
			1. 更新打断注入
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.3
    </lark-td>
    <lark-td>
      2026/07/13
    </lark-td>
    <lark-td>
      <mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/>
    </lark-td>
    <lark-td>
      1. 补充一句话总结
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.4
    </lark-td>
    <lark-td>
      2026/09/20
    </lark-td>
    <lark-td>
      <mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/>
    </lark-td>
    <lark-td>
      1. 结合近期对话链路的变更，更新文档
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      v0.5
    </lark-td>
    <lark-td>
      2026/10/13
    </lark-td>
    <lark-td>
      <mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/>
    </lark-td>
    <lark-td>
      1. 补充多任务排队时的处理策略
			1. 补充拼接示例
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
  </lark-tr>
</lark-table>

## 历史已上线的策略

<image token="AG2MbZepbocfxHxL4HocKIhvnSR" width="1009" height="159" align="center"/>

## 新策略

### 需求背景

跟常规的办公派活儿不同，用车是一个连续的场景，不存在类似于“新起一个对话框”的概念，这种连续体现在：

1. 只有一个豆包生命体，交互上是连续的：
	1. 前面跟豆包说过的事情接下来豆包会记得
	1. 豆包同一时间只能跟一个人讲话
1. 车的状态是互相影响且连续的：
	1. 上一个指令对车辆的影响，会变成下一个指令的环境context

在这种背景下，对于推理/交互流的管理尤为重要。Director作为豆包生命体的大脑，现阶段需要有一个模块来对输入做管理，从而让整体的交互靠谱，且更像人。

基于此，产生本文档需求。

此外，与本文档需求有关的其他背景是：

1. 音区合并：如果不同音区vad判停时间很接近，会将有效输入合并在一起给到dt
1. TTS打断恢复：新的user input产生且打断了历史tts播报时，此时会根据新输入的拒识结果上报被打断信息
	1. 如果新的user input没被拒识：被打断信息会作为last_talk_content字段传入
	1. 如果新的user input被拒识，被打断信息会作为一个独立的event传入
1. 模型react视为不同的推理轮次，会等上一轮tts播报完后再进行下一轮的推理

### 输入管理模块和Director的关系

输入管理模块为Director的前置模块，主要对Director所有输入源的有效输入内容进行管理，保障推理/交互管道能够合理运行。

<whiteboard token="TET3wkvOuhdGbfbVYOdc6TjHn4E"/>

- 覆盖范围是**DT所有有效输入**的组织逻辑（包括打断/排队/合并等）

### 详细需求

<whiteboard token="GKyPwDffdhLdeBbPY2HctNhknKh"/>

**一段话总结：**

新的有效输入产生时：

- 如果director没在推理 且 无TTS播报：<text color="green">直接开始新一轮的推理</text>
- 如果director正在推理 且 未输出完整 且 TTS未起播：<text color="green">打断正在进行的推理，新输入和旧输入合并进行推理</text>
  <quote-container>
  **补充说明：**
  未输出完整：表明还未调用工具，包括了首token未出以及首token出了但模型还没输出完的情况
  TTS未起播：表明还未跟用户产生语音交互
  </quote-container>

- 如果director正在推理 且 未输出完整 且 TTS已起播：
  <quote-container>
  **补充说明：**
  未输出完整：表明还未调用工具
  TTS已起播：表明已经跟用户产生了语音交互
  因TTS首字合成耗时较久，加上链路延迟，这种情况概率很低，只会出现在talk的内容特别长的场景中
  </quote-container>

  <text color="green">需要区分新输入的类型：</text>
  - <text color="green">如果新的输入为user input或高优任务advice（当前无）：打断正在进行的推理和播报，新输入和旧输入合并进行推理</text><text color="green" bgcolor="light-green">（如果当前已有在排队的任务，将排队的任务合并一起推理）</text>
	- <text color="green">新的输入为其他类型：排队（当前轮推理完成且TTS播报完成后再处理）</text><text color="green" bgcolor="light-green">（如果当前已有在排队的任务，下一次推理窗口到来时合并一起推理）</text>
- 如果director没在推理 且 有TTS播报：
  <text color="green">需要区分新输入的类型：</text>
  - <text color="green">如果新的输入为user input：在前序环节播报就已经被打断了，直接开始新一轮推理即可（如有action，打断信息中告知已下发、仅播报）</text><text color="green" bgcolor="light-green">（如果当前已有在排队的任务，将排队的任务合并一起推理）</text>
	- <text color="green">如果新的输入为高优任务advice（当前无）：打断正在进行的播报，将新输入和旧输出的被打断信息合并进行推理（如有action，打断信息中告知已下发、仅播报）</text><text color="green" bgcolor="light-green">（如果当前已有在排队的任务，将排队的任务合并一起推理）</text>
	- <text color="green">新的输入为其他类型：排队（当前轮推理完成且TTS播报完成后再处理）</text><text color="green" bgcolor="light-green">（如果当前已有在排队的任务，下一次推理窗口到来时合并一起推理）</text>
- 如果模型已输出完整（可能有工具调用下发）但TTS还未起播：<text color="green">**需要区分新输入的类型**</text>
	- <text color="green">如果新的输入为user input或高优任务advice（当前无）：将新输入和旧输出的被打断信息合并进行推理（如有action，打断信息中告知已下发、仅播报）</text><text color="green" bgcolor="light-green">（如果当前已有在排队的任务，将排队的任务合并一起推理）</text>
	- <text color="green">新的输入为其他类型：排队（当前轮推理完成且TTS播报完成后再处理）</text><text color="green" bgcolor="light-green">（如果当前已有在排队的任务，下一次推理窗口到来时合并一起推理）</text>

**拼接格式示例：**

<lark-table rows="3" cols="2" column-widths="108,703">

  <lark-tr>
    <lark-td>
      单user input
    </lark-td>
    <lark-td>
      ```json {wrap}
      [{"query":"副驾驶是不是坐过某一位女生","speaker_name":"未注册用户","speaker_position":"左后","timestamp":"2026-10-13T17:47:32+08:00"}]
      ```
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      单advice
    </lark-td>
    <lark-td>
      ```python {wrap}
      [{"advisor":"情感advisor：你的目标之一是关心、理解、陪伴用户，当前情况：触发事件为主驾上车落座，当前时间为傍晚，路况存在局部拥堵，乘客信息显示主驾已落座，需要你帮用户用温柔的语气对主驾说傍晚好，结合当前路况局部拥堵的情况，提醒主驾平稳驾驶，不要过于急躁。策略：语音确认"}]
      ```
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      user input和advice的拼接示例
    </lark-td>
    <lark-td>
      ```json {wrap}
      [{"query":"副驾驶是不是坐过某一位女生","speaker_name":"未注册用户","speaker_position":"左后","timestamp":"2026-10-13T17:47:32+08:00"},{"advisor":"情感advisor：你的目标之一是关心、理解、陪伴用户，当前情况：触发事件为主驾上车落座，当前时间为傍晚，路况存在局部拥堵，乘客信息显示主驾已落座，需要你帮用户用温柔的语气对主驾说傍晚好，结合当前路况局部拥堵的情况，提醒主驾平稳驾驶，不要过于急躁。策略：语音确认"}]
      ```
    </lark-td>
  </lark-tr>
</lark-table>

### 衍生需求

如实施以上需求，且允许tool feedback异步返回，需要对交互卡进行改造：交互卡的出现时机将不能再由工具本身控制，而应该由【工具输出信息被DT处理】来控制。

---

---

<text bgcolor="light-yellow">**以下内容无需查看**</text> {align="center"}

---

---

### 【先不看】一段话策略总结

新的有效输入产生时：

- 如果director没在推理 且 无TTS播报：<text color="green">**直接开始新一轮的推理**</text>
- 如果director正在推理 且 未输出完整 且 TTS未起播：<text color="green">**打断正在进行的推理，新输入和旧输入合并进行推理**</text>
  <quote-container>
  **说明：**
  未输出完整：表明还未调用工具，包括了首token未出以及首token出了但模型还没输出完的情况
  TTS未起播：表明还未跟用户产生语音交互
  **场景举例：**
  用户补话或多音区，vad判停时间超过了合并阈值
  来了一个feedback或advice或event
  </quote-container>

- 如果director正在推理 且 未输出完整 且 TTS已起播：<text color="green">**需要区分新输入的类型**</text>
  <quote-container>
  **说明：**
  因TTS首字合成耗时较久，加上链路延迟，这种情况概率较低
  未输出完整：表明还未调用工具
  TTS已起播：表明已经跟用户产生了语音交互
  </quote-container>

  - <text color="green">**如果新的输入为user input：在前序环节播报就已经被打断，直接开始新一轮推理（新输入+旧输入+旧输出被打断信息，被打断信息中告知上一轮未下发动作）**</text>
	- <text color="green">**如果新的输入为高优任务advice（当前无）：打断正在进行的播报，将新输入+旧输入+旧输出的被打断信息合并进行推理（被打断信息中告知上一轮未下发动作）**</text>
	- <text color="green">**新的输入为其他类型：排队等此轮推理完成且TTS播报完成后再处理**</text>
- 如果director没在推理 且 有TTS播报：<text color="green">**需要区分新输入的类型**</text>
	- <text color="green">**如果新的输入为user input：在前序环节播报就已经被打断了，直接开始新一轮推理即可（如有action，打断信息中告知已下发、仅播报）**</text>
	- <text color="green">**如果新的输入为高优任务advice（当前无）：打断正在进行的播报，将新输入和旧输出的被打断信息合并进行推理（如有action，打断信息中告知已下发、仅播报）**</text>
	- <text color="green">**新的输入为其他类型：排队等TTS播报完成后再处理**</text>

**异步任务独立执行，不同的异步任务可能有不同的界面交互需求，长期所有的界面交互也由DT来输出控制。**

### 【先不看】

<lark-table rows="10" cols="5" header-row="true" column-widths="70,198,61,612,332">

  <lark-tr>
    <lark-td colspan="2">
      新输入类型
      <quote-container>
      说明：
      本优先级策略适用于所有消息类型（包括合并后的，合并后消息的优先级等同于合并前消息中的最高优先级）
      </quote-container>
    </lark-td>
    <lark-td>
      处理优先级
    </lark-td>
    <lark-td>
      处理策略及示例
    </lark-td>
    <lark-td>
      失效策略
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td colspan="2">
      **用户说的话**
    </lark-td>
    <lark-td>
      **P0**
    </lark-td>
    <lark-td>
      <text underline="true">**处理策略：**</text>
      当新的用户query输入时
      - 若Director正在进行推理且首token未出：则打断当前推理，将本次query和上一个正在推理的query合并后进行推理
			- 若Director已经开始输出（首token已出到tts播报完成）：直接打断正在进行的播报，<text bgcolor="light-green">拼接上一轮输出的被打断信息（</text><text bgcolor="light-green">），</text>开始处理新的输入
			- 已经有输入在排队的情况，将排队的输入合并，执行上述打断逻辑
      <text underline="true">**场景演绎：**</text>
      **场景一：无输入在排队、director正在进行推理且首token未出**
      输入A（user：给我讲一下今天有什么新闻）正在推理且首token未出，
      输入B（user：先把空调调下，车里热死了）插入
      处理逻辑：此时输入A的推理被打断，A、B合并在一起后输入给Director处理
      Director输出话术参考：车里是有点热呢，我来调一下，顺便帮你找今天的热点新闻
      <whiteboard token="GeaZwMqqLhZjlhbzgRrcwTs4nrd" width="595" height="242"/>
      **场景二：无输入在排队、director已经开始输出（首token已出到tts播报完成）**
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（user：先把空调调下，车里热死了）插入
      处理逻辑：此时输入A的输出被打断，<text bgcolor="light-green">端侧上报被打断信息（</text><text bgcolor="light-green">）后与输入B拼接，</text>Director开始处理合并后的输入
      Director输出话术参考：车里是有点热呢，我来帮你调一下<text bgcolor="light-green">，刚我们说到，台风巴威今晚将登陆我国东南沿海地区……</text>
      <whiteboard token="AIiJwJkkqhcWZUbVbJfccoHpndf" width="595" height="241"/>
      **场景三：有输入在排队、director已经开始输出（首token已出到tts播报完成）**
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（advisor：剩余续航已低于100km，需要提醒用户给车充电）正在排队
      输入C（user：先把空调调下，车里热死了）插入
      处理逻辑：此时输入A的输出被打断，<text bgcolor="light-green">端侧上报被打断信息（</text><text bgcolor="light-green">）后与输入B</text>、C合并在一起给Director处理
      Director输出话术参考：车里是有点热呢，我来帮你调一下，对了，剩余续航已经不到100km了，该去充电啦<text bgcolor="light-green">，刚我们说到，台风巴威今晚将登陆我国东南沿海地区……</text>
      <whiteboard token="P4fjwOxxnh2zGrbaVPncbyVVnLc" width="595" height="246"/>
    </lark-td>
    <lark-td rowspan="6">
      **端侧上传用户query后，未收到上传成功的feedback：**
      端侧处理，在不同的场景中执行不同逻辑
      1. 端侧白名单召走：采纳端侧结果，不再等云端结果，取消query上报
			1. 端侧有结果，非白名单：判断超时后采纳端侧结果，不再等云端结果，取消query上报
			1. 端侧无结果：判断超时后进行超时播报兜底，不再等云端结果，取消query上报
      **云端调用工具后，结果获取超时：**
      云端处理：
      1. step1：工程判断超时，tool feedback反馈工具超时信息
			1. step2：云端告知用户后执行重试逻辑（Director react特性）
			1. step3：重试失败后，云端告知用户后结束任务（Director react特性）
      **排队任务过多：**
      暂不做逻辑，先观察真实场景以及压力场景中的表现；
      后续根据体验和测试结果补充限制策略。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="6">
      **非用户主动说的**
    </lark-td>
    <lark-td>
      **不参与合并的Tool/Agent feedback**
      比如：长程任务工具（订座、停车、外卖等）的返回等
    </lark-td>
    <lark-td rowspan="6">
      **P1**
    </lark-td>
    <lark-td rowspan="6">
      <text underline="true">**处理策略：**</text>
      当左侧列出的非用户query输入时
      - 若Director正在进行推理且首token未出：则打断当前推理，将本次query和上一个正在推理的query合并后进行推理
			- 若Director已经开始输出（首token已出到tts播报完成），执行排队策略，上一个输入的tts播报完成后，再进行新输入的Director推理
			- 已经有输入在排队的情况，将输入合并后继续排队
			- 特殊说明：
				- 部分输入不参与合并（详见左侧一列，不参与合并的原因为有特殊的界面交互机制）
				- aigc（比如生图、ailight等）类的任务，不属于上述逻辑，完成后走独立的界面push链路，无语音播报，无需进入director，不在本需求覆盖范围内
      <text underline="true">**场景演绎：**</text>
      <text bgcolor="light-green">场景一：无输入在排队、director正在进行推理且首token未出</text>
      输入A（user：给我讲一下今天有什么新闻）正在推理且首token未出
      输入B（advisor：剩余续航已低于100km，需要提醒用户给车充电）插入
      处理逻辑：此时输入A的推理被打断，A、B合并在一起后输入给Director处理
      Director输出话术参考：好呀，我来帮你整理今天的新闻，对了，剩余续航已经不到100km了，该去充电啦
      <whiteboard token="OyR0wr8NRhhyaKbeabPc5ukxnXg" width="595" height="248"/>
      <text bgcolor="light-green">场景二：无输入在排队、director已经开始输出（首token已出到tts播报完成）</text>
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（advisor：剩余续航已低于100km，需要提醒用户给车充电）插入
      处理逻辑：此时输入B排队，输入A播报完成后，输入B进入Director处理
      Director输出话术参考：[输入A继续播报完成]对了，车辆剩余续航已经不足100km，需要去充电啦
      <whiteboard token="RSg1wzq19hDJWPbQMwBcIyxjnnc" width="595" height="247"/>
      <text bgcolor="light-green">场景三：有输入在排队、director已经开始输出（首token已出到tts播报完成）</text>
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（advisor：剩余续航已低于100km，需要提醒用户给车充电）正在排队
      输入C（advisor：已经持续驾车两小时了，需要提醒用户进服务区休息）插入
      处理逻辑：此时输入B、C排队，输入A播报完成后，B、C合并在一起输入给Director处理
      Director输出话术参考：[输入A继续播报完成]车辆剩余续航已经不足100km，需要去充电啦，另外你已经连续驾车2小时，正好去休息一下
      <whiteboard token="KnJBwcpeshbBf9bsgeEcakz0nYe" width="595" height="238"/>
      <text bgcolor="light-green">场景四：不参与合并的tool/agent feedback</text>
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（advisor：剩余续航已低于100km，需要提醒用户给车充电）正在排队
      输入C（advisor：正在帮用户选购咖啡，需要用户澄清杯型：超大杯/大杯/中杯）正在排队
      输入D（advisor：已经持续驾车两小时了，需要提醒用户进服务区休息）插入
      处理逻辑：此时输入B、C、D排队，输入A播报完成后，B、D合并在一起输入给Director处理，输入C继续排队（原因：输入C为不参与合并的tool/agent feedback）
      Director输出话术参考：[输入A继续播报完成]车辆剩余续航已经不足100km，需要去充电啦，另外你已经连续驾车2小时，正好去休息一下。[BD处理完后]对了，你的咖啡要点什么杯的呀，快选一个吧
      <whiteboard token="M0DiwxWwghis3eb6PVvcuqyTnCh" width="595" height="242"/>
      <text bgcolor="light-green">场景五：不参与合并的tool/agent feedback（和场景四的区别为新插入的输入是否参与合并）</text>
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（advisor：剩余续航已低于100km，需要提醒用户给车充电）正在排队
      输入C（advisor：正在帮用户选购咖啡，需要用户澄清杯型：超大杯/大杯/中杯）正在排队
      输入D（advisor：正在帮用户缴停车费，需要用户输入车牌）插入
      处理逻辑：此时输入B、C、D排队，输入A播报完成后，B、C、D不合并顺序处理（原因：输入C、D为不参与合并的tool/agent feedback）
      Director输出话术参考：[输入A继续播报完成]车辆剩余续航已经不足100km，需要去充电啦。[B处理完后]对了，你的咖啡要点什么杯的呀，快选一个吧。[C处理完后]缴纳停车费需要输入车牌哦，我还不知道呢，你告诉我一下吧
      <whiteboard token="RlXXwzTMahtm2LbJxqQcFP70n7f" width="595" height="243"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **参与合并的Tool feedback**
      比如：车控工具的返回、记忆工具的返回等
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **Notification**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **动态advisor给的建议（包含定时任务/条件任务触发）**
      1. 需要区分advisor的身份，同一个advisor排队期间的多个advice，只保留最新的
			1. advisor的建议需要带上有效时间，排队时间超过有效时间后，丢弃并通知advisor
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **静态advisor给的建议**
      1. 需要区分advisor的身份，同一个advisor排队期间的多个advice，只保留最新的
			1. advisor的建议需要带上有效时间，排队时间超过有效时间后，丢弃并通知advisor
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **上一轮播报的被打断信息**
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td colspan="5">
      **纯云端场景 ⬆️ ⬆️ ⬆️ ⬆️ ⬆️                      端云场景 ⬇️ ⬇️ ⬇️ ⬇️ ⬇️**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td colspan="2">
      **输入被端侧召走**
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      <text underline="true">**背景：**</text>
      当前被端侧召走的query，云端会并行在跑，只是最后采纳了端侧结果。
      <text underline="true">**处理策略：**</text>
      当新的用户query输入时
      query被端侧召走后，需要打断云端推理/或拒绝云端结果，云端本轮query被丢弃，被合并的输入恢复排队处理；云端历史对话中保留端侧处理信息，不保留被打断/拒绝的云端推理历史
      <text underline="true">**场景演绎：**</text>
      <text bgcolor="light-green">场景一：无输入在排队、director正在进行推理且首token未出</text>
      输入A（user：给我讲一下今天有什么新闻）正在推理且首token未出，
      输入B（user：打开空调）插入
      处理逻辑：此时输入B被端侧召走，需要打断云端推理/或拒绝云端结果，云端输入B被丢弃，输入A 重新进入Director处理
      Director输出话术参考：好呀，我来帮你找今天的热点新闻
      <whiteboard token="BBU9wVkrqhQ5YfbhVc9cj6i0nrg" width="595" height="495"/>
      <text bgcolor="light-green">场景二：无输入在排队、director已经开始输出（首token已出到tts播报完成）</text>
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（user：打开空调）插入
      处理逻辑：输入B生成时输入A的输出被打断，<text bgcolor="light-green">端侧上报被打断信息（</text><text bgcolor="light-green">），</text>输入B被端侧召走，需要打断云端推理/或拒绝云端结果，云端输入B被丢弃，输入A 的被打断信息进入Director处理
      Director输出话术参考：<text bgcolor="light-green">刚我们说到，台风巴威今晚将登陆我国东南沿海地区……</text>
      <whiteboard token="DDjAwVciMh5N9xbREbQcj6D9nOc" width="595" height="530"/>
      <text bgcolor="light-green">场景三：有输入在排队、director已经开始输出（首token已出到tts播报完成）</text>
      输入A（user：给我讲一下今天有什么新闻）已经在输出：今日要闻主要有台风巴威（此时被打断）
      输入B（advisor：剩余续航已低于100km，需要提醒用户给车充电）正在排队
      输入C（user：打开空调）插入
      处理逻辑：输入B生成时输入A的输出被打断，<text bgcolor="light-green">端侧上报被打断信息（</text><text bgcolor="light-green">），</text>输入C被端侧召走，需要打断云端推理/或拒绝云端结果，云端输入C被丢弃，输入A 的被打断信息与输入B合并进入Director处理
      Director输出话术参考：车辆剩余续航已经不足100km，需要去充电啦。<text bgcolor="light-green">另外，刚我们说到，台风巴威今晚将登陆我国东南沿海地区……</text>
      <whiteboard token="GNGLwwgmKhgTr0bBZWPcBgNqnFe" width="595" height="536"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

### 【先不看】高优任务保持

上一小节介绍了输入管理模块的通用打断/排队策略。

本小节主要针对上述策略做优化：在排队策略中，考虑非用户主动说的输入内容的优先级，高优输入允许打断前序输入的播报，与上一轮的被打断信息一起输入director处理，从而提高这些内容的处理优先级。

高优输入示例：

<whiteboard token="OD3ywLaLwhRXgEbBZROc5FuWn0f"/>

<image token="Xb27bwEepoOEA4xb4n2czAs0nae" width="1130" height="1054" align="left"/>

<image token="TnIob37kZoA3A4xcNv0cdWxbn1b" width="1114" height="514" align="left"/>
