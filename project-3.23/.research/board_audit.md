# 飞书画板审计报告（2026-10-27 全量目检）

审计对象：副本 CYRndDwjDo7TvRxTshac5QWxnAg 中总图 + 01–20 共 21 张原图。
审计方式：每张导出 preview，肉眼检查六项：原节点完整露出、补充区不压原节点、补充卡文字不溢出、连线标签无黑框、外围无黑大矩形框、补充卡与原卡字号一致。

## 审计结果表

| 章 | token | preview | 原节点齐全 | 新增节点 | 问题清单 |
|---|---|---|---|---|---|
| 总图 | IkYKwwdAnhy9rnbIgeHc9pEon9f | 380KB | 是（V/R/M/C/D/E/O + 四支路） | Z1–Z4 | 通过 |
| 01 V | KlP4wZc4ihhCheb2FXkc3u0MnSg | 570KB | 是（V1–V18） | V19–V24 | 通过 |
| 02 R | DtbpwZyqrhoj32bLSa1ckstzn9e | 627KB | 是（R1–R18） | R19–R24 | 通过 |
| 03 M | GvX5wGz3OhoncKbNAtTcV55CnXg | 409KB | 是（M1–M12） | M13–M16 | 通过 |
| 04 C | MMZgw2OI0h1uzAbyVjCcHnOqnwf | 405KB | 是（C1–C12） | C13–C17 | 通过 |
| 05 D | EjAgw8CNXhDoqgbwTsQcFWBAnNc | 769KB | 是（D1–D12） | D13–D17 | 通过 |
| 06 E | H24fwt0svhvMXMbQ4tNc6Wk9nQc | 646KB | 是（E1–E12） | E13–E17 | 通过 |
| 07 O | OtbAwf41DhD9hqb4E7icb0KonTg | 605KB | 是（O01–O12） | O19–O23 | 通过 |
| 08 I | EhIIwSTEHhEpU8b8IP0crDDfn6g | 642KB | 是（I1–I18） | I19–I23 | 通过 |
| 09 W | Xp2CwvW6BhNRvMbDgDjc7lpPnbr | 659KB | 是（W01–W12） | W13–W17 | 通过 |
| 10 F | FpijwuuTHhW6iZbgJmicSmisnuf | 600KB | 是（F01–F15） | F16–F21 | 通过 |
| 11 K | Ajnhw8ztzhKaBkbYUf3ceaJynCd | 596KB | 是（K01–K15） | K16–K23 | 通过 |
| 12 T | Xbdqwjm0ph5XSEbg0fmc60gPnuh | 563KB | 是（T01–T18） | T19–T23 | 通过 |
| 13 G | VBR1wT15AhmlcEbcN7dcgVVJnDe | 659KB | 是（G01–G12） | G13–G19 | **连线标签黑框**：登记后等待运行/范围与开关有效/等待后续信号/预置场景出口/用户任务出口/终点通过/交出本轮证据/不满足或未知/策略拦截/语义判断/目标达成/未达成或不可判或失败/登记时间条件共 13 处；**外围黑大矩形框**包住原 G01–G12 主区 |
| 14 L | HqClwTmUJhEklWbhNdpc6891nIg | 706KB | 是（L01–L12） | L13–L18 | 通过 |
| 15 S | FxdhwToOehqbPubF8OwcSMvxnDb | 729KB | 是（S01–S12） | S16–S19 | **连线标签黑框**：定义关注入口/先检查使能/值得服务/可用历史供后续参考/形成潜在需求/用户Task/Goal作上下文/生成或更新子目标/车控后状态型UI更新/允许推理/点击确认+原建议/舒适出行界面确认/静默去重证据不足/内容界面确认/10分钟或新事件review/按交互窗口送入/需Director承接共 16 处 |
| 16 P | VKqswpOfeh1dRJbgWgxcub16nic | 654KB | 是（P01–P12） | P13–P16 | **连线标签黑框**：确定配置范围/非全渠道核本项目已授权范围/简单模式直接配置动作/涉及全渠道范围/复杂场景编排判断/补齐运行限制/唯一终点对应动作/提交校验/发现问题后修订版本/核场景能力与交互/授权通过/注册与发布通过/验证实际生效/确认可落地规则/失败停用回滚验证共 15 处 |
| 17 A | O2EmwDWeWh4FGpbDltyc8qkQnxb | 534KB | 是（A01–A18） | A19–A23 | 通过 |
| 18 H | MMMywwe3JhSYLfbtduJcrFsHnJh | 536KB | 是（H01–H15） | H16–H19 | 通过 |
| 19 B | Wq4NwlCaEhE3fLbwyPacwCRwnWe | 538KB | 是（B01–B12） | B13–B15 | 通过 |
| 20 U | RCu9wnQOChoCORb9v4PczkQhn0e | 633KB | 是（U01–U15） | U16–U20 | 通过 |

## 共性结论

- 21 张 preview 全部 >100KB（最小 380KB），无占位图。
- 18 张图六项检查全部通过。
- 3 张图存在连线标签黑框问题：**13 G、15 S、16 P**。这三张图的连线标签用了黑色实心矩形底（黑底白字），与其他图的浅灰/浅色标签风格不一致，且用户明确要求"连线标签不能有黑框"。
- 13 G 另外有外围黑大矩形框包住原 G01–G12 主区。
- 13 G 和 05 D 按用户说明由另外两组正在修，本次记录的是目检时状态。
