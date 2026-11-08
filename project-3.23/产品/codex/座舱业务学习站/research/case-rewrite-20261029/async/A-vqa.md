# 赛力斯VQA场景技术链路方案

# 前景

赛力斯VQA和主线VQA方案的差距主要如下，一句话总结赛力斯除了舱内改用端侧模型处理外，其它的和主线方案保持一致不变。

<table><tbody>
<tr>
<td>

场景

</td>
<td>

赛力斯

</td>
<td>

主线

</td>
<td>

差异点

</td>
<td>

优先级

</td>
</tr>
<tr>
<td>

车辆识别

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

无

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

LBS识别

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

无

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

通用识别

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

无

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

舱内识别

</td>
<td>

✅

</td>
<td>

✅

</td>
<td>

赛力斯由端侧模型处理舱内场景（舱内图片不上云）

主线由云端模型处理舱内场景（舱内图片脱敏后上云）

</td>
<td>

P0

</td>
</tr>
<tr>
<td>

观影搭子

</td>
<td>

✅

</td>
<td>

❌

</td>
<td>



</td>
<td>

P1

</td>
</tr>
<tr>
<td>

游玩搭子

</td>
<td>

✅

</td>
<td>

❌

</td>
<td>



</td>
<td>

P1

</td>
</tr>
</tbody></table>

# 背景与目标

## 问题背景

在赛力斯有ORIN端侧大模型部署的场景中，端侧模型可承担一部分识别能力。因此针对舱内数据隐私要求高的特点，可由端侧模型进行识别并输出结果，实现数据不出车。

## 业务目标

1. **赛力斯****场景支持**：在赛力斯完整支持所有VQA功能（车辆识别、LBS识别、通用识别、舱内识别、观影搭子）

2. **成本优化**：降低舱内云端VLM调用量和图片存储成本

3. **隐私合规**：舱内场景不回传原始图片，满足数据隐私要求

<div class="callout">

赛力斯上因舱内数据不上云，存在舱内场景和其它场景体验不一致问题（舱内画布上不展示图片只有文本，其它场景会展示图片\+文本）。

</div>

# 需求信息

<table><tbody>
<tr>
<td>

需求类型

</td>
<td>

产品需求

</td>
</tr>
<tr>
<td>

Meego链接

</td>
<td>

[\[需求\]【SLS】VQA工具迁移\_SLS适配](https://meego.larkoffice.com/telematics/story/detail/7346112629?parentUrl=%2Ftelematics%2Fstory%2Fhomepage&openScene=4)

</td>
</tr>
<tr>
<td>

PRD链接

</td>
<td>

[【AI汽车】视觉问答（VQA）需求文档](https://bytedance.larkoffice.com/wiki/H80iw85YwiSS5Rkr6cccKAofnBc)

</td>
</tr>
<tr>
<td>

PM

</td>
<td>



</td>
</tr>
<tr>
<td>

研发Owner

</td>
<td>

@吕鹏浩

</td>
</tr>
<tr>
<td>

需求群

</td>
<td>

</td>
</tr>
<tr>
<td>

参考资料

</td>
<td>

[舱内预期任务](https://bytedance.larkoffice.com/wiki/M2UJwQnH0iU7F1k5s7acylOJnCb#share-Cdl1dtNUSo6CU5xy88ScfeMNnMc)

</td>
</tr>
</tbody></table>

# 方案概述

## 核心设计思路

赛力斯场景VQA采用\&\#34;端云协同\&\#34;架构，基于**场景分层处理**原则：

1. **舱内场景**：完全端侧识别处理，端侧VLM直接返回识别结果，云端下发SP和对应Query；云端收到结果后交给Planner总结

2. **舱外****/LBS/搭子/通用****场景**：和主线逻辑保持一致，云端向客户端发送取图指令，客户端收到指令后完成取图、上传操作后，再通过Frontier链路回传图片URI；云端收到图片URI后交给内容定制联网智能体处理，若是车辆识别则调用ToB车辆识别接口。

## 系统边界

### 保留能力边界（与主线场景一致）

- 所有VQA语义理解、槽位提取、指令分发逻辑

- 端侧摄像头控制、图片采集能力

- 所有异常处理、兜底话术、用户交互逻辑

- 指标埋点、可观测性体系

### 赛力斯专属能力边界

- 赛力斯舱内场景识别和路由逻辑

- 端侧VLM模型推理\+SP下发\+结果回传能力

## 整体架构对比

<table><tbody>
<tr>
<td>

架构维度

</td>
<td>

主线场景（现有）

</td>
<td>

赛力斯舱内场景（新增）

</td>
</tr>
<tr>
<td>

处理位置

</td>
<td>

云端集中处理

</td>
<td>

端侧分布式处理为主，云端为辅

</td>
</tr>
<tr>
<td>

舱内数据流向

</td>
<td>

端侧采集图片 → 云端VLM处理 → 返回结果给Planner

</td>
<td>

云端下发VQA任务 → 端侧采集图片 → 端侧VLM处理 → 结果回传 → 云端返回给Planner

</td>
</tr>
<tr>
<td>

图片回传

</td>
<td>

原始图片上传到云端

</td>
<td>

不回传原始图片，仅回传描述性结果

</td>
</tr>
<tr>
<td>

云端展示

</td>
<td>

支持图片展示和Widget下发

</td>
<td>

不展示任何图片，仅返回文本结果

</td>
</tr>
</tbody></table>

# 典型Case

## 看下前面车辆的品牌

## 前面那座山是什么山

## 前面的路牌是什么含义

## 现在画面里的女子是谁

## 车内现在有几个人

# 舱内链路讨论

## ~~方案一：复用TaskService的下发和上传链路~~

## 方案二：VQA云端走VQA端侧链路，端侧车控\-VQA模块同AiBox直接通信



# 详细设计

## 模块改动设计

### 1\. 场景识别模块

**位置**：`vqa\.go` 新增 `is``CabinEdgeVLM``Scene\(\)` 方法**功能**：根据车辆配置和请求上下文判断是否为赛力斯场景**判断逻辑**：

```Go
func isCabinEdgeVLMScene(ctx context.Context) bool {
    customConfig := oem_port.GetCommonProvider(ctx).GetCustomConfig(ctx)
    return customConfig.VQAConfig.EnableCabinEdgeVLM
}

```

### 2\. 端侧指令封装模块

**位置**：`buildCaptureFunctionResponse\(\)` 方法扩展**功能**：赛力斯场景下在拍照指令中增加端侧识别参数**改动点**：

```Go
// 赛力斯场景下新增端侧识别参数
if isCabinEdgeVLMScene(ctx) {
    captureResp.Functions[0].Params[0]["edge_vlm_up"] = "给AIBox的输入"
}

```

在下发的

### 3\. 端侧结果解析模块

**位置**：新增 `parseEndSideRecognitionResult\(\)` 方法**功能**：解析端侧返回的结构化识别结果**协议定义**：

在capture\_details里增加AiBox识别的结果

```JSON
{
  "vehicle_control_exec_status": [
      "capture_details": [
          "direction": "前排",
          "capture_time": 11111,
          "picture_uri": "图片URI",
          "picture_id": "图片ID，和客户端缓存映射上",
          "edge_vlm_result": "端侧VLM识别的文本结果"
      ]
  ]
}
```

**解析逻辑**：

- 成功场景：直接返回端侧识别结果

- 失败场景：返回对应兜底话术

### 4\. 结果处理模块

在下发图片Widget时增加图片ID

[VQA卡片结构化数据说明](https://bytedance.larkoffice.com/wiki/JcRWwrLE8iEnrkkjRHHcGpd9nVb)



## 数据流设计

### 赛力斯舱内场景完整数据流

## 功能场景适配

### 1\. 舱内识别场景（人物/物品）

- **处理方式**：完全端侧处理，不回传图片

- **支持能力**：所有舱内人物状态、物品位置查询

- **异常处理**：端侧识别失败时返回统一兜底话术，不fallback到云端（隐私保护）

### 2\. 观影搭子场景

- **处理方式**：云端处理

- **支持能力**：剧情理解、人物关系、背景信息查询

- **异常处理**：端侧回传图片

### 3\. 车辆识别场景

- **处理方式**：云端处理

- **支持能力**：车辆品牌、型号、价格识别

- **回传策略**：端侧回传图片

### 4\. LBS/通用识别场景

- **处理方式**：云端处理

- **支持能力**：地标识别、动植物识别、路牌识别等

- **回传策略**：端侧回传图片

# 里程碑与验证

## 开发排期

<table><tbody>
<tr>
<td>

阶段

</td>
<td>

时间

</td>
<td>

交付物

</td>
<td>

负责人

</td>
</tr>
<tr>
<td>

技术评审

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

代码开发

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

联调测试

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

灰度发布

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

全量发布

</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

## 测试验证

### 功能测试用例

1. **舱内识别测试**：覆盖所有舱内人物、物品查询场景，验证无图片回传

2. **观影搭子测试**：覆盖视频内容查询场景，验证无屏幕截图回传

3. **车辆识别测试**：覆盖车辆品牌、型号查询，验证端侧识别准确率

4. **异常场景测试**：覆盖端侧识别失败、超时等异常场景


