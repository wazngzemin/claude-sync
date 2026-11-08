# v30 O 输出链路 — 改写记录

生成/更新：2026-10-30 17:40（Asia/Shanghai）
状态：**已整章写入 HTML**（18 节点 title/lines/detail + teaching + SVG 同名同步）

## 1. 依据 URL

| 材料 | URL |
|---|---|
| v15 讲课版 07｜播报、展示和真实结果 | https://bytedance.larkoffice.com/docx/CYRndDwjDo7TvRxTshac5QWxnAg |
| 豆包 × AIDV 端云链路 OnePager | https://bytedance.larkoffice.com/wiki/DBRnwrLFNiPxV5kZZOXcBYxqnCl |
| 语音链路详解 × 语音 PM 工作地图 | https://bytedance.larkoffice.com/wiki/T9RAd5dcUoSBY3xbr5tcFvxonJg |
| 车控 TTS 播报策略 | https://bytedance.larkoffice.com/wiki/GQvHwQJGriFRoKkNjnIcRkBrn1f |
| v15 主链路与模块详解 | https://bytedance.larkoffice.com/docx/DfiydEuaQoKDERx4PLEc9AA7nDf |
| 体验优化策略 AzAx… | https://bytedance.larkoffice.com/wiki/AzAxwFNJtiy9Rak1NVgcgD9an7f |

落盘：`by_module/O/bodies/`；摘录 `v15_chapter_O.txt`；备份同 E 的 `*.bak-eo-*`

## 2. 已写入内容

### 模块/页
- module subtitle 对齐「文字≠声音≠车动≠办完」
- teaching 4 lessons：三路输出；TTS 选路/复用/合成/取流；焦点与起播；界面与回流
- sourceIds：`VOICE-V15-LECTURE` / `AIDV-ONEPAGER` / `CAR-TTS-STRATEGY` / `VOICE-PM-MAP` / `INPUT-TECH` 等

### 节点标题（对齐讲课版；保留现网 18 节点几何；未扩 O19+）
O01 拆开三类输出，不混为完成 · O02 首轮要不要先说一句 · O10 本轮不说话，动作仍独立执行  
O13 根据网络与话术选择 TTS · O14 先检查可复用的合成音频 · O03 按所选服务生成有序音频  
O15 取得当前请求的可用音频 · O16 多段音频可以先生成，不能乱播 · O17 音频焦点决定谁此刻能发声  
O04 端侧拿到音频并开始播放 · O06 播放期间用户又说话了吗 · O18 用真实播放和完成证据验收  
O05 同步表情、卡片和动作状态 · O08 用户最终看到了什么变化 · O09 把本次结果带回后续对话  
O07 引用唯一的反馈判断回路 · O11 复盘从事实而非话术开始 · O12 长期方向保留，不伪装上线

### 关键口径
- talk_or_not=否仍可执行 action_list
- 播放四态完整定义归 M 章；O 章只讲播报方使用
- TTS 首包等指标不写死；方言 vs 无网冲突【待核】
- 简单车控端模板 / 复杂车控云端过渡+结果；多意图失败保留原因
- O19–O23 画板补充不进主图、不伪装上线

## 3. 故意跳过
- AzAx… 正文未取到，不引用其条款
- Sami/S2S 工程细节仅保留分路与顺序口径
- 不把混成播报 2.6 目标写成现行

## 4. 失败项（沿用）
- AzAx… fetch 失败
