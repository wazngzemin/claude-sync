# 记忆模块\-产品内同步
## 一、记忆类型
序号
记忆类型
说明
1
history
用户query时最近的历史记录，默认最新5轮历史
2
短期记忆
一次会话中，超过对话历史的部分进行提炼和总结
3
长期记忆
从用户的聊天数据中提取用户的属性、用户的观点等信息存储到记忆库中用以干预与用户之后的话题倾向。整个流程应当分为两个步骤，分别是信息的获取和使用，主要包含：用户画像、行为数据（主要来自事件日志）、对话内容（天级别）。
## 二、架构说明
## 三、规则说明
短期记忆
长期记忆
**生成规则**
1. 按事件日志生成用户短期记忆
1. 按天生成用户长期记忆
2. 查询短期用户记忆T\-1数据作为最新用户记忆
3. 查询用户聊天记录T\-1数据，调用记忆模型生成用户最新记忆
4. 记忆模型fc生成记忆适合哪些场景
**记忆更新**
实时更新
根据模型更新策略对比新老记忆的差异更新
根据模型更新策略对比新老记忆的差异更新
1. 根据相似度搜索获取老的用户记忆信息
2. 如果存在老的用户记忆信息,与当前记忆信息一起送入大模型,最终返回优化后的用户记忆并保存数据库
3. 如果没有,生成用户记忆直接保存数据库
4. 离线记忆生成使用离线模型批量方案，按照每天/每周汇总
**使用规则**
用户最后一次事件日志的那一天短期记忆
**记忆查询**
用户Query时,根据Query查询向量数据库,相似度最匹配top10,结果直接存入sp发送给大模型
将用户对话、历史对话记录和从向量数据库提取的记忆拼接成 prompt，获取反馈
```Plain Text
示例：以 “我喜欢吃车厘子” 为例，通过与记忆库中 “我喜欢吃苹果” 进行语义相似度计算，提取相近记忆。计算方式是将语句输入 embedding 模型得到向量值，比较向量距离判断语义相似性。
```
**生效时间**
生效时间：上电时间触发
失效时间：某条记忆超过 3 天或 24 小时持续未使用车辆，记忆将被清除
## 四、记忆内容
### 1、已有记忆内容：
长期记忆：[记忆清单](https://bytedance.larkoffice.com/sheets/K2WHsA8O5hRkaTtAhDecnUoPnqe?sheet=0ab43d)
短期记忆：[【客户反馈文档】车端信号分类](https://bytedance.larkoffice.com/sheets/NfiSsDMhEhJZBStkB0oc6eEInWh?sheet=4b9f3e)
### 2、持续收集新记忆需求：主要主动服务
[【需求收集】AI汽车记忆需求收集](https://bytedance.larkoffice.com/wiki/AsoKwTioPi1kc3kAjtlcrkIXn6d?sheet=c2401e)
### 3、 Demo Car 需求（会上沟通）
优先级顺序：
导航
闲聊
车控、多媒体
@白宇梳理验收详细case
## 五、For 其他业务接入 \- 技术
[AI汽车context模块技术评审](https://bytedance.larkoffice.com/wiki/ZJNXwI8mpiB7B9kDlhfcCZ2Hnrh)
### 获取短期记忆结果
- Method：`GET`
- Path: `/aidv/v1/mem/short/result`
参数:
参数
参数位置
参数类型
是否必须
含义
取值
channel
query
string
是
通参，渠道名
申请接入时分配
channel\_app\_id
query
string
是
通参，渠道appid
申请接入时分配
entity\_id
body
string
是
记忆实体ID，用于在系统中关联上相关记忆
一个长度小于128的字符串
query
body
string
否
如果有该值，则会通过向量数据库返回相关匹配的记忆
一个长度小于512的字符串
limit
body
int
否
返回的数量限制
取值为0\-100,默认10条
dense\_weight
body
float
否
稠密向量比例
当有query参数时有效
~~offset~~
~~body~~
~~int~~
~~否~~
~~偏移量~~
~~用于分页查询~~
### 获取长期记忆结果
- Method：`POST`
- Path: `/aidv/v1/mem/long/result`
参数:
参数
参数位置
参数类型
是否必须
含义
取值
channel
query
string
是
通参，渠道名
申请接入时分配
channel\_app\_id
query
string
是
通参，渠道appid
申请接入时分配
entity\_id
body
string
是
记忆实体ID，用于在系统中关联上相关记忆
一个长度小于128的字符串
query
body
string
否
如果有该值，则会通过向量数据库返回相关匹配的记忆
一个长度小于512的字符串
limit
body
int
否
返回的数量限制
取值为0\-100
dense\_weight
body
float
否
稠密向量比例
当有query参数时有效
~~offset~~
body
int
否
偏移量
用于分页查询
