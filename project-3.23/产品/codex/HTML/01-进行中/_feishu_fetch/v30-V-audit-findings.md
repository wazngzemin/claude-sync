# v30 V 章审稿 findings（2026-10-30 18:05 Asia/Shanghai）

对照：宣讲样例A（记忆）、宣讲3DT；清单 `v30-V-ready-for-audit.md`。
实测：intro 446；lessons paragraphs 3320；**guide sections 合计 6209**（notes 写的 12594 是 flat+sections 双计，不实）。

## 必须改

1. **删「课堂元话语」**（对照宣讲：直接讲产品，不说「课堂口令/板书/金句/北极星/当着图念」）
   - guide 中：「课堂验收口令」「课堂上要当场改掉」「并行读图口令」「板书记用途」「编号不是黑话」「产品口令」「口令越硬」「北极星」「课堂固定拆开」「课堂要求」「课堂里强调/用反例钉死/要指着念出」
   - lessons：「课堂里标成缺口」→ 改为「标成缺口」
   - 切法参照宣讲3DT「先澄清一个概念…可以理解为…」——把规则讲给人听，不把培训话术写进正文。

2. **删同义反复**（对照宣讲：同一区分只钉一次，再往下串）
   - `v-guide-entry`：互斥提示讲了两遍（段2与段7）
   - `v-guide-acoustic`：靠背误判、参考音插话、关键字验收前后重复
   - `v-guide-hotword-asr`：热词≠可见即可说、切页注销各出现两次
   - `v-guide-partial-vad`：过程字≠执行、流式拒识边界、并行读图各重复
   - `v-guide-soft-prequery`：三不与专用入口前后重复
   - `v-guide-hard-semantic`：Hard≠final、语义【待核】前后重复
   - `v-guide-final`：同一段音频/完整诉求前后重复
   - `v-guide-reuse`：复用三条件、重算≠回滚各写两遍
   - `v-guide-handoff`：交接清单整段念了两遍；记忆/自进化边界两遍
   - `v-guide-fail`：半截字控车、证据链前后重复

3. **guide 偏薄且有割裂感**（对照宣讲讲 PRD 时的密度：场景时间线 + 规则 + 边界）
   - 真实可读 guide≈6209，低于 9000–15000 目标
   - 关键段（ASR∥VAD、Soft/Hard 同起点、预请求三不、复用分叉、失败线）要用游泳馆补餐厅的**时间线**串起来讲 2–3 分钟，而不是词条叠加
   - 字数只加信息增量，不加元话语

4. **字数口径错误**（notes）
   - 必须按 sections paragraphs 合计计；禁止把 flat 副本再加一遍

## 建议改

5. intro 末段「下面四课按图上的顺序串…」偏目录口吻；可收成一句路线，不展开课表。（宣讲会说「接下来看…」，但少用「避免概念飘成词条」这类自我提醒）
6. lessons `v-handoff`「念得出来才算讲完」略培训腔；改为验收清单本身即可。
7. nodes `detail` 里若残留「课堂里…」，与 guide 同步刮掉。

## 可保留

8. lessons 主体（场景→规则→用户感知/系统决定）整体贴近宣讲切法；字数 3320≥v29 3025。
9. Soft300/Hard600 同起点、【待核】不统一、音区≠身份记忆、自进化不在本步、三不、复用三条件——产品方向正确。
10. Director/Planner 仅作交接边界出现，未整章搬入（保留一句即可）。
11. page.sections 与 lessons 已对齐；双 script 结构完好。

## 本轮改动计划
- 重写 `guides.base.sections`：去重+去元话语+关键段按时间线加厚 → 目标合计 9000–15000
- scrub lessons / nodes 元话语
- 同步 flat paragraphs = sections 拼接；同步 page.sections
- 产出 audit-summary；自检双 script / new Function


## 本轮已落地（审稿执行）
- guide sections 去重+去元话语+时间线加厚 → **sections 合计 9002**
- lessons/intro/nodes scrub 课堂腔与「当着图念」
- HTML 已写回；双 script / new Function OK；v29 未动
- 摘要见 `v30-V-audit-summary.md`
