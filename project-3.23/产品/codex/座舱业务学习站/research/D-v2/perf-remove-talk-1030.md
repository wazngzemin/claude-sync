# DT性能对比｜\[去talk\_or\_not版本\] vs \[线上版本\] 

<div class="callout">

**主要判断**

- **首****token****时延**：**实验组**相比**对照组**，P50 增加 \+121\.5 ms（\+9\.81%），P90 增加 \+187\.5 ms（\+11\.74%）。**对照组：**P50 为 1,239\.0 ms，P90 为 1,596\.8 ms。**实验组：**P50 为 1,360\.5 ms，P90 为 1,784\.3 ms。

- **doplan 到首字**：**实验组** P50 为 2,044\.0 ms，较**对照组**增加 \+220\.0 ms；P90 增加 \+321\.8 ms。

- **Tokens／轮**：实验组为 33,688\.42，较对照组变化 \-11\.22%；实验组轮次数更多（1,856 vs 1,528）。

- **数据质量**：两个 sheet 均为 796 条样本；有效性能记录分别为 793 条和 771 条。

</div>

<div class="callout">

版本说明：

**对照组**｜版本：线上｜环境：ppe\_aidv\_saic\_dev｜PromtVesion：0\.0\.350｜EP：

ep\-20260731162346\-bsgms

**实验组**｜版本：SP优化\+去掉talk\_or\_not｜环境：ppe\_aidv\_del\_talk｜PromtVesion：0\.0\.358｜EP：

ep\-20260731162346\-bsgms



</div>

<table><tbody><tr>
<td>

<div class="callout">

**P50 变化**

\+121\.5 ms

</div>

</td>
<td>

<div class="callout">

**P90 变化**

\+187\.5 ms

</div>

</td>
<td>

<div class="callout">

**平均／记录变化**

\+7\.84%

</div>

</td>
<td>

<div class="callout">

**平均／轮变化**

\-11\.22%

</div>

</td>
</tr></tbody></table>

---

## 实验组与对照组核心指标

比较方向统一为“实验组 − 对照组”。两个目标工作表均未同时包含默认 Planner 字段，本报告实际使用“DT的首包时延”和“DT的tokens消耗”统计。当前未提供 SLA，因此只呈现组间差异，不判断是否达标。

<table><tbody>
<tr>
<td>

工作表

</td>
<td>

样本数

</td>
<td>

性能有效

</td>
<td>

P50\(ms\)

</td>
<td>

P90\(ms\)

</td>
<td>

Tokens 总量

</td>
<td>

平均／记录

</td>
<td>

平均／轮

</td>
<td>

轮次数

</td>
</tr>
<tr>
<td>

对照组｜20261027\_pe\_基础评测集

</td>
<td>

796

</td>
<td>

793

</td>
<td>

1,239\.0

</td>
<td>

1,596\.8

</td>
<td>

57,982,563

</td>
<td>

72,842\.42

</td>
<td>

37,946\.70

</td>
<td>

1,528

</td>
</tr>
<tr>
<td>

实验组｜20261025\-去掉talkornot\_pe\_基础评测集

</td>
<td>

796

</td>
<td>

771

</td>
<td>

1,360\.5

</td>
<td>

1,784\.3

</td>
<td>

62,525,713

</td>
<td>

78,549\.89

</td>
<td>

33,688\.42

</td>
<td>

1,856

</td>
</tr>
</tbody></table>

### doplan 到首字耗时

**实验组 P50 为 2,044\.0 ms，较对照组增加 \+220\.0 ms；实验组 P90 为 2,613\.6 ms，增加 \+321\.8 ms。**

<table><tbody>
<tr>
<td>

工作表

</td>
<td>

有效记录

</td>
<td>

覆盖率

</td>
<td>

P50（ms）

</td>
<td>

P90（ms）

</td>
</tr>
<tr>
<td>

对照组｜20261027\_pe\_基础评测集

</td>
<td>

794 / 796

</td>
<td>

99\.75%

</td>
<td>

**1,824\.0**

</td>
<td>

**2,291\.8**

</td>
</tr>
<tr>
<td>

实验组｜20261025\-去掉talkornot\_pe\_基础评测集

</td>
<td>

772 / 796

</td>
<td>

96\.98%

</td>
<td>

**2,044\.0**

</td>
<td>

**2,613\.6**

</td>
</tr>
</tbody></table>

口径：仅统计“doplan到首字的耗时”非空且可解析的记录，单位按原列视为毫秒，P50/P90 使用线性插值。实验组缺失 24 条，覆盖率为 96\.98%，组间差异可能同时受到样本覆盖范围变化影响。

### 差异速览

- 首包时延：实验组 P50 为 1,360\.5 ms，高于对照组的 1,239\.0 ms；P90 为 1,784\.3 ms，高于对照组的 1,596\.8 ms。实验组仅 774 条首包时延有效记录，覆盖率为 97\.24%。

- 总 Tokens：实验组为 62,525,713，高于对照组的 57,982,563，增幅 \+7\.84%。

- 平均 Tokens：实验组按记录平均更高、按轮平均更低，主要因为总轮次数从对照组 1,528 增至实验组 1,856。

---

## 单表明细

# 对照组｜20261027\_pe\_基础评测集

<div class="callout">

**主要判断**

- **首****token****时延**：P50 为 1,239\.0 ms，P90 为 1,596\.8 ms。

- **Tokens 总量**：57,982,563，按 796 条记录平均为 72,842\.42。

- **每轮平均消耗**：全部 1,528 轮平均为 37,946\.70 Tokens。

- **存在缺失**：有效性能记录 793 条，缺失或异常 3 条。

</div>

<table><tbody><tr>
<td>

<div class="callout">

**P50 首****token****时延**

1,239\.0 ms

</div>

</td>
<td>

<div class="callout">

**P90 首****token****时延**

1,596\.8 ms

</div>

</td>
<td>

<div class="callout">

**平均／记录**

72,842\.42 Tokens

</div>

</td>
<td>

<div class="callout">

**平均／轮**

37,946\.70 Tokens

</div>

</td>
</tr></tbody></table>

---

## 统计范围

数据来源：[性能测试数据工作簿](https://bytedance.larkoffice.com/sheets/JaY2s1aKghWUM0tiLjYct7wunze)，按工作表 **20261027\_pe\_基础评测集** 统计。

<div class="callout">

目标工作表未同时包含默认 Planner 字段，本报告实际使用“DT的首包时延”和“DT的tokens消耗”统计，并在全篇保持该数据口径。

</div>

样本总数为 796 条；有效性能记录 793 条；性能字段有效率为 99\.62%。首包时延字段为“DT的首包时延”，Tokens 字段为“DT的tokens消耗”。

---

## 首token时延

**793 条有效记录的首****token****时延中位数为 1\.2390 秒，90% 的有效记录不高于 1\.5968 秒。**

<table><tbody>
<tr>
<td>

指标

</td>
<td>

结果（ms）

</td>
<td>

折算（秒）

</td>
<td>

统计口径

</td>
</tr>
<tr>
<td>

P50

</td>
<td>

**1,239\.0**

</td>
<td>

1\.2390

</td>
<td>

793 条非空时延，线性插值分位数

</td>
</tr>
<tr>
<td>

P90

</td>
<td>

**1,596\.8**

</td>
<td>

1\.5968

</td>
<td>

793 条非空时延，线性插值分位数

</td>
</tr>
<tr>
<td>

最小值

</td>
<td>

807\.0

</td>
<td>

0\.8070

</td>
<td>

有效记录范围下界

</td>
</tr>
<tr>
<td>

最大值

</td>
<td>

4,362\.0

</td>
<td>

4\.3620

</td>
<td>

有效记录范围上界

</td>
</tr>
</tbody></table>

<div class="callout">

当前数据没有对照版本或 SLA 阈值，因此本报告提供本批次性能基线，不判断是否达标或是否发生回退。

</div>

---

## Tokens 消耗

**全部记录的所有轮次已累加，共解析 1,528 轮；总量校验状态：全部通过。**
**每轮平均消耗 Tokens：37,946\.70**（57,982,563 ÷ 1,528）。

<table><tbody>
<tr>
<td>

指标

</td>
<td>

总量

</td>
<td>

平均值／记录

</td>
<td>

计算公式

</td>
</tr>
<tr>
<td>

Tokens

</td>
<td>

**57,982,563**

</td>
<td>

**72,842\.42**

</td>
<td>

全部轮次 tokens 求和 ÷ 796

</td>
</tr>
<tr>
<td>

input\_tokens

</td>
<td>

57,895,037

</td>
<td>

72,732\.46

</td>
<td>

全部轮次 input\_tokens 求和 ÷ 796

</td>
</tr>
<tr>
<td>

output\_tokens

</td>
<td>

87,526

</td>
<td>

109\.96

</td>
<td>

全部轮次 output\_tokens 求和 ÷ 796

</td>
</tr>
</tbody></table>

### 各轮次平均 Tokens

各轮分母为实际包含该轮次的记录数。第 4 轮以后存在样本数低于 30 条的轮次，不宜作为稳定基线。

<table><tbody>
<tr>
<td>

轮次

</td>
<td>

样本数

</td>
<td>

Tokens 总量

</td>
<td>

平均 Tokens／轮

</td>
</tr>
<tr>
<td>

第 1 轮

</td>
<td>

793

</td>
<td>

30,778,491

</td>
<td>

38,812\.73

</td>
</tr>
<tr>
<td>

第 2 轮

</td>
<td>

622

</td>
<td>

22,898,825

</td>
<td>

36,814\.83

</td>
</tr>
<tr>
<td>

第 3 轮

</td>
<td>

88

</td>
<td>

3,363,911

</td>
<td>

38,226\.26

</td>
</tr>
<tr>
<td>

第 4 轮

</td>
<td>

14

</td>
<td>

509,884

</td>
<td>

36,420\.29

</td>
</tr>
<tr>
<td>

第 5 轮

</td>
<td>

4

</td>
<td>

156,014

</td>
<td>

39,003\.50

</td>
</tr>
<tr>
<td>

第 6 轮

</td>
<td>

2

</td>
<td>

78,318

</td>
<td>

39,159\.00

</td>
</tr>
<tr>
<td>

第 7 轮

</td>
<td>

2

</td>
<td>

78,561

</td>
<td>

39,280\.50

</td>
</tr>
<tr>
<td>

第 8 轮

</td>
<td>

2

</td>
<td>

78,787

</td>
<td>

39,393\.50

</td>
</tr>
<tr>
<td>

第 9 轮

</td>
<td>

1

</td>
<td>

39,772

</td>
<td>

39,772\.00

</td>
</tr>
</tbody></table>

---

## 质量校验

- 记录数：796 条；有效性能记录：793 条；缺失或异常：3 条。

- Tokens 文本：成功解析 793 条；空值 3 条；格式异常 0 条。

- 轮次一致性：1,528 / 1,528 个轮次满足 tokens = input\_tokens \+ output\_tokens。

- 总量一致性：57,982,563 = 57,895,037 \+ 87,526（全部通过）。

- 分位数复核：最近秩法 P50 为 1,239\.0 ms、P90 为 1,597\.0 ms。

---

## 测试数据

[Director评测\-数据汇总版本](https://bytedance.larkoffice.com/sheets/JaY2s1aKghWUM0tiLjYct7wunze?sheet=db6rcG&rangeId=db6rcG_TaLbFP6Fwn&rangeVer=1)sheet=20261025\-去掉talkornot\_pe\_基础评测集

# 实验组｜20261025\-去掉talkornot\_pe\_基础评测集

<div class="callout">

**主要判断**

- **首token****时延**：P50 为 1,360\.5 ms，P90 为 1,784\.3 ms。

- **Tokens 总量**：62,525,713，按 796 条记录平均为 78,549\.89。

- **每轮平均消耗**：全部 1,856 轮平均为 33,688\.42 Tokens。

- **存在缺失**：有效性能记录 771 条，缺失或异常 25 条。

</div>

<table><tbody><tr>
<td>

<div class="callout">

**P50 ****首token****时延**

1,360\.5 ms

</div>

</td>
<td>

<div class="callout">

**P90 ****首token****时延**

1,784\.3 ms

</div>

</td>
<td>

<div class="callout">

**平均／记录**

78,549\.89 Tokens

</div>

</td>
<td>

<div class="callout">

**平均／轮**

33,688\.42 Tokens

</div>

</td>
</tr></tbody></table>

---

## 统计范围

数据来源：[性能测试数据工作簿](https://bytedance.larkoffice.com/sheets/JaY2s1aKghWUM0tiLjYct7wunze)，按工作表 **20261025\-去掉talkornot\_pe\_基础评测集** 统计。

<div class="callout">

目标工作表未同时包含默认 Planner 字段，本报告实际使用“DT的首包时延”和“DT的tokens消耗”统计，并在全篇保持该数据口径。

</div>

样本总数为 796 条；有效性能记录 771 条；性能字段有效率为 96\.86%。首包时延字段为“DT的首包时延”，Tokens 字段为“DT的tokens消耗”。

---

## **首token**时延

**774 条有效记录的****首token****时延中位数为 1\.3605 秒，90% 的有效记录不高于 1\.7843 秒。**

<table><tbody>
<tr>
<td>

指标

</td>
<td>

结果（ms）

</td>
<td>

折算（秒）

</td>
<td>

统计口径

</td>
</tr>
<tr>
<td>

P50

</td>
<td>

**1,360\.5**

</td>
<td>

1\.3605

</td>
<td>

774 条非空时延，线性插值分位数

</td>
</tr>
<tr>
<td>

P90

</td>
<td>

**1,784\.3**

</td>
<td>

1\.7843

</td>
<td>

774 条非空时延，线性插值分位数

</td>
</tr>
<tr>
<td>

最小值

</td>
<td>

922\.0

</td>
<td>

0\.9220

</td>
<td>

有效记录范围下界

</td>
</tr>
<tr>
<td>

最大值

</td>
<td>

4,700\.0

</td>
<td>

4\.7000

</td>
<td>

有效记录范围上界

</td>
</tr>
</tbody></table>

<div class="callout">

当前数据没有对照版本或 SLA 阈值，因此本报告提供本批次性能基线，不判断是否达标或是否发生回退。

</div>

---

## Tokens 消耗

**全部记录的所有轮次已累加，共解析 1,856 轮；总量校验状态：全部通过。**
**每轮平均消耗 Tokens：33,688\.42**（62,525,713 ÷ 1,856）。

<table><tbody>
<tr>
<td>

指标

</td>
<td>

总量

</td>
<td>

平均值／记录

</td>
<td>

计算公式

</td>
</tr>
<tr>
<td>

Tokens

</td>
<td>

**62,525,713**

</td>
<td>

**78,549\.89**

</td>
<td>

全部轮次 tokens 求和 ÷ 796

</td>
</tr>
<tr>
<td>

input\_tokens

</td>
<td>

62,311,559

</td>
<td>

78,280\.85

</td>
<td>

全部轮次 input\_tokens 求和 ÷ 796

</td>
</tr>
<tr>
<td>

output\_tokens

</td>
<td>

214,154

</td>
<td>

269\.04

</td>
<td>

全部轮次 output\_tokens 求和 ÷ 796

</td>
</tr>
</tbody></table>

### 各轮次平均 Tokens

各轮分母为实际包含该轮次的记录数。第 5 轮以后存在样本数低于 30 条的轮次，不宜作为稳定基线。

<table><tbody>
<tr>
<td>

轮次

</td>
<td>

样本数

</td>
<td>

Tokens 总量

</td>
<td>

平均 Tokens／轮

</td>
</tr>
<tr>
<td>

第 1 轮

</td>
<td>

793

</td>
<td>

33,455,577

</td>
<td>

42,188\.62

</td>
</tr>
<tr>
<td>

第 2 轮

</td>
<td>

577

</td>
<td>

22,988,914

</td>
<td>

39,842\.14

</td>
</tr>
<tr>
<td>

第 3 轮

</td>
<td>

85

</td>
<td>

2,772,811

</td>
<td>

32,621\.31

</td>
</tr>
<tr>
<td>

第 4 轮

</td>
<td>

32

</td>
<td>

536,964

</td>
<td>

16,780\.12

</td>
</tr>
<tr>
<td>

第 5 轮

</td>
<td>

24

</td>
<td>

413,699

</td>
<td>

17,237\.46

</td>
</tr>
<tr>
<td>

第 6 轮

</td>
<td>

24

</td>
<td>

304,564

</td>
<td>

12,690\.17

</td>
</tr>
<tr>
<td>

第 7 轮

</td>
<td>

24

</td>
<td>

236,594

</td>
<td>

9,858\.08

</td>
</tr>
<tr>
<td>

第 8 轮

</td>
<td>

24

</td>
<td>

161,746

</td>
<td>

6,739\.42

</td>
</tr>
<tr>
<td>

第 9 轮

</td>
<td>

23

</td>
<td>

178,017

</td>
<td>

7,739\.87

</td>
</tr>
<tr>
<td>

第 10 轮

</td>
<td>

22

</td>
<td>

99,699

</td>
<td>

4,531\.77

</td>
</tr>
<tr>
<td>

第 11 轮

</td>
<td>

22

</td>
<td>

127,564

</td>
<td>

5,798\.36

</td>
</tr>
<tr>
<td>

第 12 轮

</td>
<td>

20

</td>
<td>

125,088

</td>
<td>

6,254\.40

</td>
</tr>
<tr>
<td>

第 13 轮

</td>
<td>

18

</td>
<td>

85,217

</td>
<td>

4,734\.28

</td>
</tr>
<tr>
<td>

第 14 轮

</td>
<td>

18

</td>
<td>

96,763

</td>
<td>

5,375\.72

</td>
</tr>
<tr>
<td>

第 15 轮

</td>
<td>

18

</td>
<td>

102,419

</td>
<td>

5,689\.94

</td>
</tr>
<tr>
<td>

第 16 轮

</td>
<td>

18

</td>
<td>

112,101

</td>
<td>

6,227\.83

</td>
</tr>
<tr>
<td>

第 17 轮

</td>
<td>

17

</td>
<td>

104,412

</td>
<td>

6,141\.88

</td>
</tr>
<tr>
<td>

第 18 轮

</td>
<td>

17

</td>
<td>

110,408

</td>
<td>

6,494\.59

</td>
</tr>
<tr>
<td>

第 19 轮

</td>
<td>

15

</td>
<td>

100,881

</td>
<td>

6,725\.40

</td>
</tr>
<tr>
<td>

第 20 轮

</td>
<td>

8

</td>
<td>

53,139

</td>
<td>

6,642\.38

</td>
</tr>
<tr>
<td>

第 21 轮

</td>
<td>

8

</td>
<td>

45,313

</td>
<td>

5,664\.12

</td>
</tr>
<tr>
<td>

第 22 轮

</td>
<td>

6

</td>
<td>

29,147

</td>
<td>

4,857\.83

</td>
</tr>
<tr>
<td>

第 23 轮

</td>
<td>

6

</td>
<td>

29,039

</td>
<td>

4,839\.83

</td>
</tr>
<tr>
<td>

第 24 轮

</td>
<td>

6

</td>
<td>

31,066

</td>
<td>

5,177\.67

</td>
</tr>
<tr>
<td>

第 25 轮

</td>
<td>

5

</td>
<td>

39,723

</td>
<td>

7,944\.60

</td>
</tr>
<tr>
<td>

第 26 轮

</td>
<td>

5

</td>
<td>

28,639

</td>
<td>

5,727\.80

</td>
</tr>
<tr>
<td>

第 27 轮

</td>
<td>

5

</td>
<td>

38,367

</td>
<td>

7,673\.40

</td>
</tr>
<tr>
<td>

第 28 轮

</td>
<td>

4

</td>
<td>

30,721

</td>
<td>

7,680\.25

</td>
</tr>
<tr>
<td>

第 29 轮

</td>
<td>

3

</td>
<td>

15,528

</td>
<td>

5,176\.00

</td>
</tr>
<tr>
<td>

第 30 轮

</td>
<td>

3

</td>
<td>

25,643

</td>
<td>

8,547\.67

</td>
</tr>
<tr>
<td>

第 31 轮

</td>
<td>

3

</td>
<td>

20,991

</td>
<td>

6,997\.00

</td>
</tr>
<tr>
<td>

第 32 轮

</td>
<td>

2

</td>
<td>

14,155

</td>
<td>

7,077\.50

</td>
</tr>
<tr>
<td>

第 33 轮

</td>
<td>

1

</td>
<td>

10,804

</td>
<td>

10,804\.00

</td>
</tr>
</tbody></table>

---

## 质量校验

- 记录数：796 条；有效性能记录：771 条；缺失或异常：25 条。

- Tokens 文本：成功解析 793 条；空值 3 条；格式异常 0 条。

- 轮次一致性：1,856 / 1,856 个轮次满足 tokens = input\_tokens \+ output\_tokens。

- 总量一致性：62,525,713 = 62,311,559 \+ 214,154（全部通过）。

- 分位数复核：最近秩法 P50 为 1,360\.0 ms、P90 为 1,787\.0 ms。

---

## 12\.测试数据

[Director评测\-数据汇总版本](https://bytedance.larkoffice.com/sheets/JaY2s1aKghWUM0tiLjYct7wunze?sheet=db6rcG&rangeId=db6rcG_TaLbFP6Fwn&rangeVer=1)sheet=20261027\_pe\_基础评测集




