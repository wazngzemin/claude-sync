<title>语音能力one page</title>

- <cite doc-id="RMUydH1AkoSQTmxT1C9cyjaunNd" file-type="docx" title="硬件设备接入扣子 WebSocket 最佳实践" type="doc"></cite>
- <cite doc-id="X9UKdy0AIoQ7rox1nFZcvanBn5e" file-type="docx" title="扣子语音通话设备控制最佳实践" type="doc"></cite>
- [硬件设备接入扣子 RTC 最佳实践](https://www.coze.cn/open/docs/guides/realtime_embedded)
- <cite doc-id="MqBodNXbWo7g06xtuUwcGlXtnMd" file-type="docx" title="智能语音对话支持自定义传参" type="doc"></cite>
- <cite doc-id="OzcXd9B9fo5KPcxpZX4cL4Qonpd" file-type="docx" title="[对外] 低时延复杂 agent 的搭建原理" type="doc"></cite>
- <cite doc-id="CEJedaaf8oxJMox7g6DcOBnAnbh" file-type="docx" title="[对外] Agent 联网搜索+设备控制+闲聊+长期记忆搭建" type="doc"></cite>
- <cite doc-id="JzE6d1hcio3SrNx0MFAc5WrDnEb" file-type="docx" title="扣子使用最佳实践系列（持续更新）" type="doc"></cite>

# 实时对话能力

<table><colgroup><col/><col/><col/><col/><col/></colgroup><tbody><tr><td>功能</td><td>能力</td><td>RTC</td><td>Websocket</td><td>参考资料</td></tr><tr><td rowspan="14">语音</td><td>自定义音色</td><td>✅</td><td>✅</td><td></td></tr><tr><td>语音合成大模型</td><td>✅</td><td>✅</td><td></td></tr><tr><td>语音合成小模型</td><td>✅</td><td>✅</td><td></td></tr><tr><td>语音识别大模型</td><td>✅</td><td>✅</td><td></td></tr><tr><td>端到端语音模型</td><td>✅</td><td>✅</td><td></td></tr><tr><td>语音识别小模型<br/>方言 + 多语种</td><td>✅</td><td>✅</td><td></td></tr><tr><td>ASR 热词设定</td><td>✅</td><td>✅</td><td></td></tr><tr><td>大模型 ASR 模式</td><td><ul><li>双向流式</li><li>流式</li></ul></td><td><ul><li>双向流式</li></ul></td><td>https://www.volcengine.com/docs/6561/1354869</td></tr><tr><td>音频编码格式</td><td><ul><li>AACLC</li><li>G711A</li><li>OPUS：（默认） </li><li>G722</li></ul></td><td><ul><li>上行: pcm、g711, opus</li><li>下行: pcm、g711, opus</li></ul></td><td>https://www.coze.cn/open/docs/developer_guides/create_room</td></tr><tr><td>同声传译</td><td>✅(内测)</td><td>✅(开发中)</td><td></td></tr><tr><td>自定义音色(声音复刻)</td><td>✅</td><td>✅</td><td></td></tr><tr><td>自定义开场白</td><td>✅</td><td>✅</td><td></td></tr><tr><td>智能外呼</td><td>❌</td><td>✅(内测)</td><td></td></tr><tr><td>声纹识别</td><td>✅(内测)</td><td>✅(内测)</td><td></td></tr><tr><td rowspan="4">视觉</td><td>视频编码格式</td><td><ul><li>H264（默认）</li><li>BYTEVC1</li></ul></td><td>N/A</td><td></td></tr><tr><td>屏幕流</td><td>✅</td><td>N/A</td><td></td></tr><tr><td>视频识别</td><td>✅</td><td>N/A</td><td></td></tr><tr><td>数字人</td><td>✅(开发中)</td><td></td><td></td></tr><tr><td rowspan="3">语音打断</td><td>用户说话</td><td>✅</td><td>✅</td><td>用户说话会自动打断智能体输出</td></tr><tr><td>声纹打断</td><td>✅(内测)</td><td>✅(内测)</td><td>指定声纹用户打断智能体说话</td></tr><tr><td>关键词打断</td><td>✅</td><td>✅</td><td>用户说话的关键词才能打断智能体输出<cite doc-id="QR7ud7bitoVL79xlpiecj9hhnLc" file-type="docx" title="语音对话设定关键词打断" type="doc"></cite></td></tr><tr><td>实时字幕</td><td></td><td>✅</td><td>✅</td><td></td></tr><tr><td>端插件</td><td></td><td>✅</td><td>✅</td><td></td></tr><tr><td>问答节点</td><td></td><td>✅</td><td>✅</td><td></td></tr><tr><td>自定义传参</td><td></td><td>✅</td><td>✅</td><td></td></tr></tbody></table>

# 语音能力商业化套餐

| 功能 | 个人免费版 | 个人进阶版 | 团队版 | 企业版 |
|-|-|-|-|-|
| 声音复刻 | ❌ | ❌ | ✅ | ✅ |
| 语音合成 | ✅ | ✅ | ✅ | ✅ |
| 语音识别 | ✅ | ✅ | ✅ | ✅ |
| 语音消息 | ✅ | ✅ | ✅ | ✅ |
| Ws 实时对话 | ✅ | ✅ | ✅ | ✅ |
| RTC 实时对话 | ✅ | ✅ | ✅ | ✅ |
| 同声传译 | N/A | N/A | N/A | N/A |
| 声纹识别 | N/A | N/A | N/A | N/A |
| 音频理解 | N/A | N/A | N/A | N/A |

# 常见问题解答

## 体验地址

| Websocket  | [https://www.coze.cn/open-platform/realtime/websocket](https://www.coze.cn/open-platform/realtime/websocket)  |
|-|-|
| RTC  | https://www.coze.cn/open-platform/realtime/playground |

## 多语言&方言支持

<table><colgroup><col/><col/></colgroup><tbody><tr><td>语音识别</td><td>语音合成</td></tr><tr><td><ul><li>common：大模型语音识别，可自动识别中英粤。 </li><li>zh：小模型语音识别，中文。 </li><li>cant：小模型语音识别，粤语。 </li><li>sc：小模型语音识别，川渝。 </li><li>en：小模型语音识别，英语。 </li><li>ja：小模型语音识别，日语。 </li><li>ko：小模型语音识别，韩语。 </li><li>fr：小模型语音识别，法语。 </li><li>id：小模型语音识别，印尼语。 </li><li>es：小模型语音识别，西班牙语。 </li><li>pt：小模型语音识别，葡萄牙语。 </li><li>ms：小模型语音识别，马来语。 </li><li>ru：小模型语音识别，俄语。</li></ul></td><td>中文<br/>粤语  7481299960428888103<br/>广西话 7481299960428871719 <br/>川渝  7481299960428920871<br/>东北话  7481299960428855335<br/>英文<br/>日语<br/>西班牙语<br/>未接入语种，但可和产品沟通提需<br/>葡萄牙语<br/>泰语<br/>越南语<br/>印尼语<br/>完整列表<a href="https://www.coze.cn/open/docs/dev_how_to_guides/sys_voice">参考文档</a></td></tr></tbody></table>

# 竞品分析



# 参考文档

<cite doc-id="WViCdVNW2onp5Hx0iSalbnj7gxh" file-type="docx" title="[PRD] 商业化三期 - 订阅套餐版" type="doc"></cite>