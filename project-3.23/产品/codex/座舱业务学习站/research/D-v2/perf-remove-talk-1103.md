# 去掉talk\_or\_not 【播报首字】耗时对比效果

## 结论：

**实验组**比**对照组**的**“播报首字”的**P50 快0\.07s

说明！！！**“播报首字”**埋点Span**：**planner\-model\-stream\-first\-word 

```Plain Text
**版本信息：**
**对照组**｜版本：**线上**｜环境：ppe_aidv_saic_dev｜PromtVesion：0.0.350｜EP：
ep-20260731162346-bsgms
**实验组**｜版本：**SP优化+去掉talk_or_not**｜环境：ppe_aidv_del_talk｜PromtVesion：0.0.358｜EP：
ep-20260731162346-bsgms
```

## **对照组：P50 为1\.6s**

时间段：202610272348510 \- 202610280631

测试数据：[上汽\-Director评测](https://bytedance.larkoffice.com/sheets/JaY2s1aKghWUM0tiLjYct7wunze?sheet=WxSVlU)sheet=20261027\_pe\_基础评测集

## 实验组：P50 为1\.53s

时间段：202611021908 \- 202611030256



测试数据：[上汽\-Director评测](https://bytedance.larkoffice.com/sheets/JaY2s1aKghWUM0tiLjYct7wunze?sheet=WVorxq) sheet=20261103\-去掉talkornot\_pe\_基础评测集


