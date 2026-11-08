# SV-191 retry

来源：https://bytedance.larkoffice.com/wiki/FtzDwbXpVi0BPlkmwP1cNYK6nGe?sheet=6ldZ9A&range=MTE6MTE=

范围：[{"title":"【记忆开关】测试集","range":"6ldZ9A!A1:T197","declaredRows":197,"declaredColumns":20}]

partial=false

## 【记忆开关】测试集 [6ldZ9A!A1:T197]
1 | 优先级 | 研发自测 | 测试场景 | 用例标题 | 前置条件 | 测试步骤 | 预期结果 | 实际结果 | 备注 | null | null | null | null | null | null | null | null | null | null | null
2 | P0 | 是 | 实车 | 开关默认开启 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理 | 1.查看豆包记忆 | 1.豆包记忆开关默认打开 | null | null | null | null | null | null | null | null | null | null | null | null | null
3 | P0 | 是 | 实车 | 开关可以关闭 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理 | 1.关闭记忆开关 | 1.豆包记忆开关可以正常关闭 | null | null | null | null | null | null | null | null | null | null | null | null | null
4 | P1 | 否 | 实车 | 多次关闭开关 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理 | 1.连续多次的关闭记忆开关 | 1.连续操作豆包开关无异常，最后可以正常进行关闭和打开 | null | null | null | null | null | null | null | null | null | null | null | null | null
5 | P1 | 否 | 实车 | 主题模式切换验证开关 | 1.豆包账号已登录 | 1.分别切换车机深色主题和浅色主题
2.关闭和打开记忆开关 | 1.豆包记忆开关背景跟随切换的主题
2.记忆开关验证无异常 | null | null | null | null | null | null | null | null | null | null | null | null | null
6 | P1 | 否 | 实车 | 系统语言切换验证开关 | 1.豆包账号已登录 | 1.进入车机系统设置切换语言为英文（再切换回中文）
2.关闭和打开记忆开关 | 1.豆包记忆语言跟随车机系统切换的语言
2.记忆开关验证无异常 | null | null | null | null | null | null | null | null | null | null | null | null | null
7 | P1 | 否 | 实车 | 豆包记忆关闭后车机下电再上电 | 1.豆包账号已登录 | 1.进入AI豆包设置中关闭记忆开关
2.车机下电/重启车机，查看记忆开关 | 1.关闭成功
2.下电后重新上电/或者重启车机，豆包记忆开关正常关闭状态 | null | null | null | null | null | null | null | null | null | null | null | null | null
8 | P2 | 否 | 实车 | 切换豆包账号，记忆开关默认打开 | null | 1.登录豆包A账号，进入AI豆包设置中关闭记忆开关
2.退出豆包A账号，登录豆包B账号，进入AI豆包设置 | 1.豆包A账号豆包记忆关闭成功
2.豆包B账号成功登录，豆包记忆开关默认打开 | null | null | null | null | null | null | null | null | null | null | null | null | null
9 | P2 | 否 | 实车 | 未登录豆包账号，开关置灰 | null | 1.未登录豆包账号下，进入车辆设置——AI豆包设置中 | 1.开关处于置灰，功能不可用状态 | null | null | null | null | null | null | null | null | null | null | null | null | null
10 | P1 | 否 | 实车 | 跨车场景，记忆开关状态继承 | 1.两台上汽的车，同一个豆包账号 | 1.豆包账号在A车上登录后关闭记忆开关
2.退出豆包账号在B车上登录 | 1.记忆开关关闭成功
2.B车上登录成功，记忆开关也是关闭状态 | null | null | null | null | null | null | null | null | null | null | null | null | null
11 | P1 | 否 | 实车 | 跨品牌车型场景，记忆开关不同步 | 1.一台上汽车和一台问界车，同一个豆包账号 | 1.豆包账号在A上汽车上登录后关闭记忆开关
2.豆包账号在B问界车上登录后生成和使用记忆 | 1.记忆开关再A上汽车上关闭成功
2.豆包账号在B问界车上登录使用无异常 | null | null | null | null | null | null | null | null | null | null | null | null | null
12 | P1 | 否 | 接口/实车 | 之前已有的记忆点被保留 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理
3.提前生成了一个记忆点：我喜欢的歌手是邓紫棋
4.关闭记忆开关 | / | 1.数据库可以查询到歌手邓紫棋 | null | null | null | null | null | null | null | null | null | null | null | null | null
13 | P0 | 是 | 接口/实车 | 之前的记忆内容冻结无法使用 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理
3.提前生成了一个记忆点：我喜欢的歌手是邓紫棋
4.关闭记忆开关 | 
1.唤醒豆包后query：你还记得我喜欢的歌手叫什么名字吗 | 1.豆包回复不记得；豆包回复：请先在豆包设置中开启记忆开关” | null | null | null | null | null | null | null | null | null | null | null | null | null
14 | P0 | 是 | 接口/实车 | 记忆开关关闭后不在记忆事件 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理 | 1.关闭记忆开关
2.唤醒豆包后query：帮我记忆一下我喜欢吃的水果是香蕉 | 1.开关成功关闭
2.当前期望记忆的内容不在被记住，库中也无对应的数据：
豆包回复：请先在豆包设置中开启记忆开关” | null | null | null | null | null | null | null | null | null | null | null | null | null
15 | P1 | 否 | 接口/实车 | 记忆开关关闭后进行9轮对话后查询 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理
 | 1.关闭记忆开关
2.唤醒豆包后query：帮我记忆一下我喜欢吃的水果是香蕉
3.继续唤醒豆包进行9轮闲聊对话
4.再第十轮询问豆包：你还记得我喜欢吃的水果是什么吗 | 1.
2.
3.
4.关闭开关后，豆包正常回复
示列：当然知道啦，你喜欢吃的水果是香蕉，你刚刚才跟我说过呢～ | null | null | null | null | null | null | null | null | null | null | null | null | null
16 | P1 | 否 | 接口/实车 | 记忆开关关闭后进行11轮对话后查询 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理 | 1.关闭记忆开关
2.再11轮对话，唤醒豆包后query：帮我记忆一下我喜欢吃的水果是香蕉
3.询问豆包：你还记得我喜欢吃的水果是什么吗 | 1.
2.
3.豆包回复不记得，或者让我们重新告诉她
（和没有这个记忆回复的内容保持一致） | null | null | null | null | null | null | null | null | null | null | null | null | null
17 | P0 | 否 | 接口/实车 | 关闭后修改之前的记忆 | 1.豆包账号已登录
2.进入车辆设置——AI豆包设置中的账号管理
3.提前生成了一个记忆点：我喜欢的歌手是邓紫棋
4.关闭豆包记忆开关 | 
1.唤醒豆包后query：我现在不喜欢邓紫棋了，你重新记一下我喜欢的歌手是刘德华 | 1.喜欢的歌手记忆不能被修改，数据库中的歌手记忆还是邓紫棋
豆包回复不记得，或者让我们重新告诉她
（和没有这个记忆回复的内容保持一致） | null | null | null | null | null | null | null | null | null | null | null | null | null
18 | P0 | 否 | 接口/实车 | 记忆开关关闭，验证短期记忆 | 1.豆包账号已登录 | 1.记忆开关关闭状态，上传事件或对话记忆 | 1.数据库不在生产任何记忆内容，日志中也不能被调用 | null | null | null | null | null | null | null | null | null | null | null | null | null
19 | P0 | 否 | 接口/实车 | 记忆开关打开，验证短期记忆 | 1.豆包账号已登录 | 1.记忆开关打开状态，上传事件或对话记忆 | 1.数据库和日志中的短期记忆正常生成或被调用 | null | null | null | null | null | null | null | null | null | null | null | null | null
20 | P0 | 否 | 接口/实车 | 记忆开关关闭，验证长期记忆 | 1.豆包账号已登录 | 1.记忆开关关闭状态，上传事件或对话记忆 | 1.数据库不在生产任何记忆内容，日志中也不能被调用 | null | null | null | null | null | null | null | null | null | null | null | null | null
21 | P0 | 否 | 接口/实车 | 记忆开关打开，验证长期记忆 | 1.豆包账号已登录 | 1.记忆开关打开状态，上传事件或对话记忆 | 1.数据库和日志中的长期记忆正常生成或被调用 | null | null | null | null | null | null | null | null | null | null | null | null | null
22 | P1 | 否 | 接口/实车 | 记忆开关关闭，验证长期情景 | 1.豆包账号已登录 | 1.记忆开关关闭状态，上传事件或对话记忆 | 1.数据库不在生产任何记忆内容，日志中也不能被调用 | null | null | null | null | null | null | null | null | null | null | null | null | null
23 | P1 | 否 | 接口/实车 | 记忆开关打开，验证长期情景 | 1.豆包账号已登录 | 1.记忆开关打开状态，上传事件或对话记忆 | 1.数据库和日志中的长期情景正常生成或被调用 | null | null | null | null | null | null | null | null | null | null | null | null | null
