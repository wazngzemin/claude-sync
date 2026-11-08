动态示例问题汇总-20240605

1、待确认：query 无效？ （2）
Q：
启用车载宠物恒温守护模式
启用自能空调模式


2、没有调用工具（4）
Q：
取消开启无线充电
把后雾灯关了
将车辆能量回收强度调至低档位
把车辆强制保电功能打开
image.png



3、knowhow中提到充电口盖不可以语音控制，需手动按压打开
不能在调用 车控工具。

"工具列表：
 工具1：span_name=vehicle_basic_control | query=打开充电口盖"
"工具列表：
 工具1：span_name=vehicle_basic_control | query=弹出充电口外盖"


4、query改写问题，行人提示音不能“调音量”。

Q：调整一下提醒行人的喇叭声音

工具列表：
 工具1：span_name=vehicle_system_settings | query=调整行人警示音音量

5、系统屏幕亮度的功能，但是回复话术很像“空调换气”

Q：打开清洁模式
工具列表：
 工具1：span_name=vehicle_system_settings | query=打开清洁模式

output：
好 的，清洁模式已开启～你看前面街角那家亮着暖光的糖水铺，玻璃橱窗里摆着满满的芋圆和烧仙草，甜香都飘到车上来啦😋执行成功清洁模式已开启，现在车内空气正在焕新呢～你看前面巷口挂着串彩色灯笼，暖光把青石板路都染成蜜色了，像不像藏在城市里的小桃源呀😌

6、误删长时任务
Q：我想开车去闲逛散散心情

7、长时任务的播报话术 内容 中的 “人名” 与 “说话人” 不一致（甚至那个人不在车上）
https://fornax.bytedance.net/space/7522018773168046082/analytics/log-query?queryID=20260604233425D5D8CEE4A89FE71DF04C&queryType=log_id&logIdTime=4&id=31a03642588852de 

image.png


测试数据：
Director评测-数据汇总版本 sheet=20260605-动态示例测试集-1
Director评测-数据汇总版本sheet=20260605-动态示例测试集-2

