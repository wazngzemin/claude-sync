**口径：**本文“豆包”均指豆包云端服务。

# 一分钟认识端云链路

客户端承接用户交互，豆包承接对话入口与通用能力，AIDV 承接汽车场景的业务处理，Speech 云提供语音识别和语音合成。一次语音交互会经过**用户音频 → ASR 识别文本 → 待播报文本 → TTS 音频**四种数据形态。

<lark-table rows="5" cols="2" header-row="true" column-widths="169,531">

  <lark-tr>
    <lark-td>
      系统
    </lark-td>
    <lark-td>
      在链路中负责什么
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      客户端
    </lark-td>
    <lark-td>
      采集音频、发起请求、展示回复、获取并播放音频；上报端状态，承接车控等执行指令。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      豆包云端
    </lark-td>
    <lark-td>
      承接客户端文本对话，处理**环境风控**、**内容安审**、**打断判定**等入口能力，衔接 AIDV。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIDV（座舱云）
    </lark-td>
    <lark-td>
      承接汽车场景请求，结合座舱上下文组织业务处理和工具调用，输出回复与执行指令；统一承接客户端的音频转换请求，对接 Speech 云完成 ASR 识别、TTS 合成，并缓存音频。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Speech 云
    </lark-td>
    <lark-td>
      作为 AIDV 的下游提供 ASR（语音转文字）、TTS（文字转语音）、S2S 等语音能力，由 AIDV 对接。
    </lark-td>
  </lark-tr>
</lark-table>

# 当前架构：从两个视角看同一条链路

**我们的视角：**复用豆包的文本对话入口和通用能力，由 AIDV 承担座舱业务处理，文本请求经过豆包进入 AIDV。

<whiteboard token="ZBE4wsE1XhEhpjbYLbBceeQ3nXi" width="820" height="381"/>

三角形的三条边分别表示客户端与豆包的文本对话、豆包与 AIDV 的业务交互，以及客户端与 AIDV 的直接通道。**客户端通过 AIDV 完成音频与文本转换，Speech 云只由 AIDV 对接。**交互过程如下：

上行时：

1. 客户端把音频上传 AIDV（WS长链）。
1. AIDV 调用 Speech 云识别后将 ASR 文本返回客户端。
1. 客户端向豆包发起文本对话（HTTP短链）。

下行时：

1. AIDV 调用 Speech 云合成音频并缓存。
1. AIDV把响应内容、tts表示发送给豆包，豆包返回给客户端。
1. 客户端向 AIDV 拉取音频播放（WS长链）。

状态 / 事件上报和 Frontier 指令由客户端和AIDV直接对接，不在以上链路中。

**豆包的视角：**AIDV 作为汽车流量的承接Agent存在于豆包IM链路中。

<whiteboard token="O64OwQgkehJAfAbe6YYciM9ln5b" align="left"/>

# 一轮语音交互：从录音到播报

以用户说“车里有点热”为例：

<whiteboard token="B5vswZtRFhh0bGb0XMicH7n1n02"/>

<lark-table rows="9" cols="3" header-row="true" column-widths="198,270,352">

  <lark-tr>
    <lark-td>
      交互
    </lark-td>
    <lark-td>
      传输内容
    </lark-td>
    <lark-td>
      理解重点
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      客户端 → AIDV
    </lark-td>
    <lark-td>
      用户音频
    </lark-td>
    <lark-td>
      客户端把采集的语音交给 AIDV，发起语音识别。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIDV ↔ Speech 云（ASR）
    </lark-td>
    <lark-td>
      上行用户音频；下行 ASR 识别文本
    </lark-td>
    <lark-td>
      AIDV 对接 Speech 云完成第一次转换：语音 → 文字。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIDV → 客户端
    </lark-td>
    <lark-td>
      ASR 识别文本
    </lark-td>
    <lark-td>
      识别结果先回到客户端，作为后续文本对话的输入。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      客户端 → 豆包
    </lark-td>
    <lark-td>
      ASR 识别文本及请求信息
    </lark-td>
    <lark-td>
      客户端通过 HTTP 发起文本请求，使用 SSE 接收下行回复。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      豆包 → AIDV
    </lark-td>
    <lark-td>
      ASR 识别文本及相关上下文
    </lark-td>
    <lark-td>
      豆包将汽车业务请求交给 AIDV，由接入层完成协议转换。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIDV → 豆包 → 客户端
    </lark-td>
    <lark-td>
      待播报文本及音频关联信息
    </lark-td>
    <lark-td>
      文本经豆包返回客户端；关联信息用于获取对应音频。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AIDV ↔ Speech 云（TTS）
    </lark-td>
    <lark-td>
      上行待播报文本；下行 TTS 音频
    </lark-td>
    <lark-td>
      AIDV 对接 Speech 云完成第二次转换：文字 → 语音，并缓存返回的音频。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      客户端 ↔ AIDV（音频获取）
    </lark-td>
    <lark-td>
      请求对应音频；返回音频分片及结束标志
    </lark-td>
    <lark-td>
      客户端通过独立 WebSocket 通道向 AIDV 获取音频并播放。
    </lark-td>
  </lark-tr>
</lark-table>

**文字与声音如何对应：**AIDV 回复元数据携带音频关联标识（tts_audio_id），音频接口按关联请求获取缓存流。这里的“缓存”支持流式消费，不要求先生成完整音频文件。具体字段、分片和结束标记属于接口细节，不影响上述系统分工。

**打断：**豆包云端承担链路中的打断判定能力；当前判定逻辑：同一账号在同一会话中，后到的query会打断前面未处理完成的query。车机场景下，被拒识的query不参与打断判定。

# 架构演进与方案取舍

<lark-table rows="7" cols="4" header-row="true" column-widths="198,290,280,520">

  <lark-tr>
    <lark-td>
      版本 / 状态
    </lark-td>
    <lark-td>
      链路方案与主要变化
    </lark-td>
    <lark-td>
      理解重点 / 取舍
    </lark-td>
    <lark-td>
      方案原图（点击放大）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      202509 · 历史方案
    </lark-td>
    <lark-td>
      通过音视频RTC通道进行Query交互，由豆包chat服务并行调用AIDV与S2S系统，并由AIDV的“意图”帧决策使用哪条链路的响应。
    </lark-td>
    <lark-td>
      基于豆包已有链路快速串通初版端云服务，但S2S无法由Director调度，且RTC建联慢，成本高。
    </lark-td>
    <lark-td>
      <reference-synced source-block-id="KxzadMlbZsc59YbLZaIc6hN5nsb" source-document-id="SupzdFrzjoXqhpxiYevcGsO0nXb">
      </reference-synced>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      202511 · 历史方案
    </lark-td>
    <lark-td>
      链路无变化，AIDV服务内部能力迭代。
    </lark-td>
    <lark-td>
      系统职责进一步细化，主动链路和外部能力的边界更加明确。
    </lark-td>
    <lark-td>
      <reference-synced source-block-id="SYN9dpn6SspG1zbEwrpcpPmznxh" source-document-id="SupzdFrzjoXqhpxiYevcGsO0nXb">
      </reference-synced>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      202607 · 当前方案
    </lark-td>
    <lark-td>
      汽车业务采用豆包文本链路衔接 AIDV；客户端的 ASR 与 TTS 均通过 AIDV 对接 Speech 云，识别文本返回客户端，合成音频由 AIDV 缓存、客户端获取。
    </lark-td>
    <lark-td>
      语音识别、文本对话分通道协作，通过纯文本使用S2S能力。
    </lark-td>
    <lark-td>
      <reference-synced source-block-id="SYN9dpn6SspG1zbEwrpcpPmznxh" source-document-id="SupzdFrzjoXqhpxiYevcGsO0nXb">
      </reference-synced>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      手机豆包IM新链路 · 暂不跟进
    </lark-td>
    <lark-td>
      手机端豆包新架构，flow.alice.chat服务替换为flow.chat.next服务。
    </lark-td>
    <lark-td>
      跟进的端云升级成本高，无明显收益，暂不跟进。
    </lark-td>
    <lark-td>
      <whiteboard token="Y6mMwHTO6h266BbFksMcNisXnBb" align="left"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      手机豆包音视频新链路 · 暂不跟进
    </lark-td>
    <lark-td>
      手机端豆包替代RTC链路的新方案，豆包音视频团队与 VnE、应用网络等团队协同建设的新一代链路&MOQ（Media Over Quic）协议。
    </lark-td>
    <lark-td>
      豆包IP线：无法融合当前IM链路，S2S无法被Director调度，暂不推进
      非豆包IP线：抗弱网能力更强，建联更快，但使用的成本偏高（官方价格：7元/1000分钟）
    </lark-td>
    <lark-td>
      <image token="NWRsbXygao7l6hxcFUpc3WyVnGU" width="3190" height="1136" align="center"/>
      参考文档：<mention-doc token="SgCiwqtzDijDZEkzIT4cTQ6PnKh" type="wiki">新一代多模态传输链路(MMT)-豆包服务端技术方案</mention-doc>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      自建链路 · 非豆包IP线建设中
    </lark-td>
    <lark-td>
      端云链路剥离豆包服务，使用QUIC协议，Websocket链路进行音频、文本、信令的传输，全双工。
    </lark-td>
    <lark-td>
      优势：
      1. 摆脱豆包现有体系的束缚（半双工模式，音视频场景与文本场景无法融合等）
			1. 成本低（使用公司基建）
      劣势：
      1. 开发成本高，需要自己实现豆包链路中已有的模块（端云对接，风控，打断，uid解析等）。
    </lark-td>
    <lark-td>
      <whiteboard token="Eq35wYaaLhMu8cbnuXAccua8ngc"/>
      参考文档：
      <mention-doc token="DxV9wY7jGiuNSdkg19XcNV8xnAe" type="wiki">AI汽车自建平台化链路</mention-doc>
      <mention-doc token="Rre5wPq3oiy1bmkm1v3cgQCanvb" type="wiki">AI汽车横展以及非豆包账号体系架构</mention-doc>
    </lark-td>
  </lark-tr>
</lark-table>

# 相关文档

- [【内部】AI汽车技术架构](https://bytedance.larkoffice.com/docx/SupzdFrzjoXqhpxiYevcGsO0nXb)：系统职责、历史版本链路图。
- [服务端 AIDV 架构梳理](https://bytedance.larkoffice.com/wiki/SwaPwKLkNiKDdekvvp5cWwybntb)：整体服务架构介绍。
- <mention-doc token="NofNwLopaihOfdkZBEXc6A08n9f" type="wiki">[技术方案]豆包IM｜头条消息链路整合</mention-doc>：豆包IM系统介绍。
- <mention-doc token="SgCiwqtzDijDZEkzIT4cTQ6PnKh" type="wiki">新一代多模态传输链路(MMT)-豆包服务端技术方案</mention-doc>：豆包音视频链路介绍。
- <mention-doc token="JmWMwSYezibqBdkDdcNcX26VnOZ" type="wiki">消息链路架构分享@202504</mention-doc>：豆包老架构flow.alice.chat链路介绍。
- <mention-doc token="AX0cwMXBCinorSkGcFpcbTObngg" type="wiki">豆包消息链路技术分享与未来展望</mention-doc>：豆包新架构flow.chat.next链路介绍。
- <mention-doc token="SawLwQkv6izanhkiCOocK4kTnuh" type="wiki">同声翻译-多模态跨平台QUIC链路技术方案</mention-doc>：豆包同声传译链路介绍。
