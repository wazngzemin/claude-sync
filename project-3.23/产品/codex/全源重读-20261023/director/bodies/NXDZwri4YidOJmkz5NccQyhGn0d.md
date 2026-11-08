非豆包IP账号支持技术方案
背景与目标
东风账号需求文档：东风S33-账号方案
东风 S33、奇瑞等项目以非豆包 IP 形式接入 AI 汽车，业务链路中不存在 login_doubao_uid。当前上汽 DNA、赛力斯等豆包 IP 业务的任务、账号配置、记忆均以 车ID + 豆包UID 作为数据绑定关系，而非豆包 IP 渠道要求以 车ID + 车企账户ID（account_id） 绑定。两套身份体系在代码中混用，导致每个下游业务都要自行判断渠道并选择标识符，渠道扩展成本高。
代码现状中，login_doubao_uid 深度耦合在 vehicle_account_config 、memory_user 等数据结构中。本方案旨在建立统一身份层，让下游业务对渠道差异无感。
目标：
AI 汽车业务同时支持豆包 IP 与非豆包 IP 渠道。
入口中间件统一完成身份参数解析与火山账号 ID 转换，缺参即报错，不将身份解析责任下沉到业务层。
下游业务模块统一以 VolcAccountID（火山账号） + VehicleUserID（乘客） 为核心身份概念：Goal 跟随 VolcAccountID 与弋途交互；账号配置以 VolcAccountID 为账号粒度主键（车粒度配置用 VehicleID）；记忆使用 VolcAccountID+ VehicleUserID隔离策略。业务代码中大量使用的 account_id、login_doubao_uid 需梳理后统一切换为 VolcAccountID。
必须使用旧字段的场景（如对接豆包开放平台、车企 OEM 回调）由业务方自行定制化适配。
跟弋途的交互用VolcAccountID取代account_id、login_doubao_uid 参数；

基础概念解释


名词

代码中的定义

规则&概念

用途

渠道

channel

如上汽dna、赛力斯

用于区分每个车企的ai汽车项目

车id

vehicle_id

每个车的唯一id，车厂生成，刷机不变；

区分每个设备（车、台架、pad）


设备id

device_id

字节系对于设备标识的唯一id，当前车辆刷机会变，客户端正在对接让刷机不变

frontier发送消息的设备id

豆包账号

login_doubao_uid

豆包账号，豆包inCar登录的豆包账户


登录豆包；豆包功能依赖豆包账户；

oem账号


account_id


车企的账号，车机登录oem账号

车企账号的数据隔离，例如乘客数据，跨oem不可见 

声纹id

voiceprintID

声纹ID

通过声纹id识别用户

faceID


face_id

用户人脸在车上识别出的唯一ID，车机存储，更新车机系统可能会丢失，

在车的空间内区分每个“人”


乘客ID

vehicle_user_id

车机登录oem后，人脸被识别到了faceID，通过主动query“认识一下”注册的“乘客”；

记忆主体，实现用户个性化记忆功能；
方案概述
核心思路是在请求入口引入统一身份解析中间件，根据渠道类型选择不同的身份映射策略，将异构的入口身份参数转换为统一的 VolcAccountID，连同 VehicleUserID 一起写入请求级上下文 IdentityContext。下游业务只从 IdentityContext 读取 VolcAccountID 和 VehicleUserID，不再直接接触 login_doubao_uid 或 account_id（必须对接外部系统的定制场景除外）。

身份映射采用有状态方案：新建 volc_account_mapping 表存储映射关系，表中直接保留 login_doubao_uid 和 account_id 两个字段（非当前渠道的身份字段填默认值 0 或空字符串）。豆包 IP 渠道以 login_doubao_uid 建立映射；非豆包 IP 渠道以 account_id 建立映射。映射表使用数据库自增 ID 作为 VolcAccountID，保证不可猜测、长度固定、跨渠道统一。

详细设计
入口中间件身份解析
当前 HTTP 链路已有 CustomCtx → SetCommonInfoInContext ，RPC 链路通过 CustomKitex 从 metainfo 和 ext 中构建 CommonInfo。本方案在公参解析之后、业务处理之前新增 IdentityResolver 中间件。
HTTP 入口
HTTP 请求通过 query/form/json 携带身份参数。中间件按以下顺序解析：
从 CommonInfo 读取 channel、vehicle_id、account_id、login_doubao_uid、encrypted_doubao_uid。
根据 channel 选择解析策略，获取渠道侧原始身份标识。
调用映射服务查询或创建 VolcAccountID。
通过 face_id + vehicle_id 查询 vehicle_user 表获取 VehicleUserID（即 vehicle_user.id）。
将结果写入 IdentityContext。
参数校验规则：


渠道类型

必需参数

缺失时行为

豆包 IP（master/seres/saic-dna）

channel, vehicle_id, login_doubao_uid 或 encrypted_doubao_uid

缺少vehicle_id或doubao_uid 返回 400


非豆包 IP（dongfeng/chery）

channel, vehicle_id, account_id

缺少 vehicle_id或account_id 返回 400

仅车 ID

channel, vehicle_id

缺少 vehicle_id 返回 400
与弋途的交互改用VolcAccountID后去掉之前的加密豆包UID字段encrypted_doubao_uid。
豆包 RPC 入口
Kitex AgentService 属于豆包 IP 渠道，CustomKitex 中间件已从 persistent metainfo 提取 ALICE_PARAM_USER_ID 作为 LoginDoubaoUID，从 ext 的 vehicle_biz_params 中解析 channel、vehicle_id。IdentityResolver 直接使用 ALICE_PARAM_USER_ID 按豆包 IP 策略映射，不需要 account_id。
豆包回调链路天然携带 ALICE_PARAM_USER_ID，按豆包 IP 策略映射。
RPC 链路的参数校验逻辑与 HTTP 一致，校验失败返回 RPC 错误而非 HTTP 400。
渠道策略接口
定义策略接口实现渠道分流：
type IdentityResolver interface {
    Resolve(ctx context.Context, info CommonInfo) (*IdentityContext, error)
}

type ChannelStrategy interface {
    ChannelType() ChannelType
    ExtractRawIdentity(info CommonInfo) (rawIdentity string, err error)
    RequireParams() []string
}

三种内置策略实现：
DoubaoIPStrategy：使用 login_doubao_uid 查询映射表，映射表中 account_id 为空字符串。
NonDoubaoIPStrategy：使用 account_id 查询映射表，映射表中 login_doubao_uid 为 0。
VehicleOnlyStrategy：使用 vehicle_id 查询映射表，login_doubao_uid 为 0，account_id 为空字符串。
策略通过 channel 常量注册到工厂 map，新增渠道只需注册新策略，无需修改中间件主流程。
统一身份上下文
新增 IdentityContext 结构体，作为请求级身份的唯一可信来源：
type IdentityContext struct {
    VolcAccountID   uint64  // 火山账号ID，统一账号标识
    VehicleUserID   uint64  // 乘客/车辆用户ID，即 vehicle_user.id
    Channel         string  // 渠道
    VehicleID       string  // 车辆ID
    AccountID       string  // 车企账号ID（扩展字段，仅OEM回调等定制场景使用）
    LoginDoubaoUID  uint64  // 豆包UID（扩展字段，仅豆包登录态判断等定制场景使用）
}
通过 context key 注入，提供 GetIdentityContext(ctx) 和 MustGetIdentityContext(ctx) 两个获取方法。依赖账号的下游业务统一通过 MustGetIdentityContext 获取身份，使用 VolcAccountID 和 VehicleUserID 作为核心标识符。
AccountID 和 LoginDoubaoUID 保留在结构体中但标注为扩展字段，仅在对接豆包开放平台、车企 OEM 回调、豆包登录态判断等必须使用旧标识的场景下使用。新增业务代码默认使用 VolcAccountID + VehicleUserID，code review 时检查是否有必要使用旧字段。
火山账号映射表
新建 volcano_account_mapping 表：
CREATE TABLE volcano_account_mapping (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '火山账号ID',
    channel          VARCHAR(64)     NOT NULL COMMENT '渠道',
    vehicle_id       varchar(256)    NOT NULL DEFAULT '' COMMENT '车辆ID',
    uid              VARCHAR(256)    NOT NULL DEFAULT '' COMMENT '火山账号UID，与第三方交互使用',
    login_doubao_uid BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '豆包UID（豆包IP渠道使用，其余为0）',
    account_id       VARCHAR(256)    NOT NULL DEFAULT '' COMMENT '车企账号ID（非豆包IP渠道使用，其余为空串）',
    status           TINYINT         NOT NULL DEFAULT 1 COMMENT '1:active 0:disabled',
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       DATETIME        NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_identity (channel, vehicle_id, login_doubao_uid, account_id, deleted_at),
    KEY idx_channel_vehicle (channel, vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='火山账号映射表';
映射查询逻辑使用 get-or-create 模式，在事务中先查后建，通过唯一索引保证并发安全。豆包 IP 渠道按 (channel, login_doubao_uid, '', vehicle_id) 查询；非豆包 IP 渠道按 (channel, 0, account_id, vehicle_id) 查询；车维度渠道按 (channel, 0, '', vehicle_id) 查询。首次请求自动建映射，无需额外注册流程。
存量数据回填：存量数据均为豆包 IP 渠道，login_doubao_uid 一定有值。从 vehicle_account_config 表和 memory_user 表中读取 (channel, vehicle_id, login_doubao_uid) 组合，批量生成 VolcAccountID 映射，并将生成的 VolcAccountID 写回两张表的新字段。
任务模块改造
上汽动态advisor（弋途服务）： 当前 AIDV 与弋途交互时使用 vehicle_id + encrypted_doubao_uid 标识用户，改造后 Goal 全程使用 VolcAccountID：
AIDV 调用弋途时，去掉 encrypted_doubao_uid 和 login_doubao_uid 参数，改为传递 volc_account_id，vehicle_id 保持不变。弋途侧以 vehicle_id + volc_account_id 标识用户。
弋途回调 AIDV 时携带 VolcAccountID，AIDV 直接通过映射表反查身份，不再依赖豆包 UID。
赛力斯动态advisor（自建）：task_record表使用VolcAccountID替代DoubaoUID。
账号配置模块改造
账号配置改造以 VolcAccountID 为账号粒度主键。当前 vehicle_account_config 表唯一索引为 (channel, login_doubao_uid, vehicle_id, config_key)，配置查询的 ConfigParam 以 LoginDoubaoUID 为核心维度。部分配置本身是车辆粒度（与账号无关），这类配置继续以 VehicleID 为主键。
改造方案：
表结构变更： 新增 volc_account_id BIGINT UNSIGNED NOT NULL DEFAULT 0 字段。账号粒度配置的唯一索引迁移到 (channel, volc_account_id, config_key)（不含 vehicle_id）；车辆粒度配置继续使用 (channel, vehicle_id, config_key)（volc_account_id=0）。灰度期保留旧字段和旧索引，双写双读。
配置粒度调整： 账号粒度配置以 VolcAccountID 为主键；车辆粒度配置以 VehicleID 为主键（VolcAccountID=0）。原 DataTypeVehicleDoubao（车+豆包账号粒度）统一归入账号粒度，不再按车+账号组合查询。
查询逻辑改造： ConfigParam 中将 LoginDoubaoUID 替换为 VolcAccountID，queryByDataType 函数查询条件同步修改。isAccountUseMemory 和 IsUserUseMemory 改为从 IdentityContext 获取 VolcAccountID。
默认配置： 车粒度默认配置以 volc_account_id=0 标识；账号粒度默认配置按 VolcAccountID 匹配。
vehicle_account_info 表保留 login_doubao_uid 用于豆包登录态判断（判断豆包 App 是否登录前台），但业务查询不再以该字段为主键。账号注册和登录状态更新时同步写入 volc_account_mapping。
记忆模块改造
记忆模块本期只关注 memory_user 的生成逻辑。当前 memory_user 记录的生成逻辑是 VehicleUserID + LoginDoubaoUID，调整成使用VolcAccountID + VehicleUserID。
具体改动点：
memory_user 表： 新增 volc_account_id BIGINT UNSIGNED NOT NULL DEFAULT 0 字段，创建 MemoryUser 时从 IdentityContext 获取 VolcAccountID 写入。 login_doubao_uid字段在上线过渡期保留，非豆包 IP 渠道 login_doubao_uid 填 0。运行稳定后删除 login_doubao_uid 字段，唯一索引迁移到 (vehicle_user_id, volc_account_id)。
event_log 和 chat_histories 表中的 login_doubao_uid 字段过渡期保留，新增 volc_account_id 字段用于按统一账号查询。记忆处理流程中通过 IdentityContext 获取 LoginDoubaoUID（非豆包 IP 为 0）查询事件，逻辑不变。
VehicleUserID 说明
代码中乘客对应的概念是 vehicle_user.id（自增主键），本方案统一称为 VehicleUserID。vehicle_user 表通过人脸识别（face_id）或音区定位解析当前操作用户。乘客解析逻辑（TransferVehicleUserIDByParams 中间件）保持不变，IdentityContext.VehicleUserID 从已解析的 VehicleAccountUser.VehicleUser.ID 获取。下游业务应统一使用 VolcAccountID + VehicleUserID 两个概念，避免再引入 PassengerUID 等新命名。
存量引用梳理
代码库中除上述三个核心模块外，仍有大量位置直接使用 account_id 或 login_doubao_uid。经全量审计，按改造难度分类如下。标注为 KEEP 的场景保留旧字段，其余均需切换为 VolcAccountID。
直接替换（EASY）： 从 IdentityContext 透传即可，改动量小。
gateway/doubao_app/function.go buildContext：AccountID + LoginDoubaoUID 透传
goal_lifecycle/define.go CommonInfoFromCallback：回调构造 CommonInfo
goal_lifecycle/consumed.go：传递身份到 AdviceConsumed
flow/after_flow.go：构造 AdvisorNotifyRequest
context/source/signal/resource/vehicle_resource.go：结构体字段赋值
agent_server/.../long_term_task.go：GoalInfo.AccountID 透传
handler/rpc/aidv.go QueryContext/Recommend：从 RPC 构造 CommonInfo
handler/web/memory.go：Web 端记忆列表身份透传
middleware/get_vehicle_user_id.go：传递身份到 GetVehicleAccountUser
需调整查询/写入逻辑（MEDIUM）： 涉及 DB 查询条件、缓存键、MQ 消息字段。


位置

当前用法

改造方式

model/chat_history/model.go

QueryChatHistoryByLoginDoubaoUID 按豆包UID查聊天历史

新增按 VolcAccountID 查询版本

model/chat_history/functions.go

buildChatHistory 写入 LoginDoubaoUID

同时写入 VolcAccountID

model/event/model.go

事件查询按 LoginDoubaoUID 过滤

改为按 VolcAccountID 过滤

service/recommend/recommend.go

按豆包UID查账号、查聊天历史

改为通过 VolcAccountID 查账号配置

service/meeting/

MQ 消息体含 login_doubao_uid 字段

MQ 契约新增 volc_account_id，双写后切换

service/event/report/

EventLog 写入 AccountID + LoginDoubaoUID

新增 VolcAccountID 写入

service/context_sync/history.go

离线历史写入 LoginDoubaoUID

新增 VolcAccountID 写入

handler/v1/history.go

query param login_doubao_uid 查历史

改为 VolcAccountID 或从 context 获取

memory_business/defline.go

API 响应/请求含 login_doubao_uid_list、account_id_list

Web API 响应新增 volc_account_id_list

memory_business/memory.go ListWebMemory / GetDoubaoAccountList

按 AccountID + LoginDoubaoUID 查询/返回

改为 VolcAccountID 查询，旧字段兼容返回

memory_process/mem_process.go / instant_memory.go

按 MemoryUser.LoginDoubaoUID 查事件

非豆包IP时 DoubaoUID=0，查询逻辑天然兼容

service/user/vehicle_user.go

新建 VehicleUser 写入 LoginDoubaoUID

新增 VolcAccountID 字段写入
深度耦合（HARD）： 涉及唯一索引、外部 API 契约、实体 ID 编码格式，需单独排期。


位置

耦合点

应对策略

doubao_uid_vehicle_relation 表

唯一索引 uniq_login_doubao_uid_vehicle_id

评估是否可由 volc_account_mapping 替代

model/user/vehicle_account.go GetVehicleAccountInfoByUniqLoginDoubaoUID

按豆包UID反查车辆账号，recommend 等模块依赖

新增按 VolcAccountID 查询版本

service/advisor/advisor.go


弋途 Advisor 外部 HTTP API 传 account_id + login_doubao_uid

与 Goal 同步改造，改为 volc_account_id

goal_lifecycle/callback.go

弋途回调校验 LoginDoubaoUID、解密 EncryptedDoubaoUID

回调改为 VolcAccountID，豆包登录态校验移至中间件

signal_sync_extour.go

弋途信号同步传 LoginDoubaoUID（有 TODO）

弋途整合时改为 VolcAccountID

signal_sync_trigger.go

Trigger 服务 RPC 设置 LoginDoubaoUid + AccountId

Trigger RPC 新增 VolcAccountID 字段

agent_server web_search.go / s2s/start_session_processor.go

Agent Hub / S2S 外部协议以 LoginDoubaoUID 为用户标识

与外部 Agent 平台协调新增 VolcAccountID

memory validateMemoryUsersExist / validateMemoryEntitiesExist

entity_id 格式 vehicleUserID_doubaoUID 深度解析校验

本期不改，非豆包IP doubaoUID=0 天然兼容

memory_common/function.go GetMemoryEntityID

实体ID = VehicleUserID_LoginDoubaoUID

本期不改，保持现有格式
保留不动（KEEP）： 以下场景使用 account_id 或 login_doubao_uid 是合理的，不在本期改造范围。
豆包登录态判断： vehicle_account_info.login_doubao_uid 用于判断豆包 App 是否登录前台/后台
OEM 账号体系： RegisterAccount、BindUser、家庭组同步、人脸 ID 同步等以 account_id 为车企账号标识
火山云账号： ark_config.MaasConfigItem.AccountID、VolcengineWebWhiteItem.AccountID、TCC 中的火山计费账号
外部第三方 API： DPFM、Ecology、停简单停车订单等外部契约中的 account_id
模拟器与测试代码： simulator/、simulator_v2/、测试 URL 中的账号字段
反馈与录音： feedback/base.go 中的豆包 UID 反馈信息、record/ 中的 AccountID 展示字段
vehicle_user 表 CRUD： 按 account_id 查询/删除/更新乘客（OEM 账号维度）

数据库变更汇总


表名

变更内容

灰度策略

volc_account_mapping（新建）

id, channel, login_doubao_uid, account_id, vehicle_id, status

新建即启用

vehicle_account_config

新增 volc_account_id；账号粒度以 VolcAccountID 为主键，车粒度以 VehicleID 为主键

双写双读，存量回填后切换

memory_user

新增 volc_account_id，去掉login_doubao_uid；

逻辑兼容，无需迁移

event_log / chat_histories

新增 volc_account_id 字段，旧字段保留

双写，逐步切换查询

多方案对比
原始文档提出了四种方案，本方案基于方案一（有状态抽象火山账号 ID）细化，与其他方案的对比如下：


方案

核心策略

优势

劣势

方案一（选定） 有状态映射

数据库存储映射关系，自增 ID 作为火山账号 ID；

标识符短且不可猜测；下游完全统一；支持跨渠道身份合并

需要映射表和数据回填；首次请求有一次 DB 写入

方案二 无状态拼接

channel + vehicle_id + 原始身份拼接作为 UID

无需映射表，开发量略小

ID 过长暴露渠道和身份信息；不可变性差（原始身份变更则 ID 变更）；无法支持身份合并

方案三 业务定制 ID

中间件为每个业务生成专用用户 ID


改动小，各业务灵活

无统一策略，业务间无法关联身份；记忆模块已有类似模式但维护成本高

方案四 现状

各业务自行处理渠道差异

无改造工作量


每新增一个渠道所有业务都要改；当前已无法支持非豆包 IP 渠道
选定方案一的关键原因：自增 ID 作为 VolcAccountID 长度固定（uint64），不泄露渠道和用户信息，下游业务只依赖这一个账号字段，降低复杂度；

兼容性与迁移
对上游调用方的影响
HTTP 调用方： 请求中不再传递 login_doubao_uid 参数。豆包 IP 渠道的豆包 UID 由中间件通过 (channel, vehicle_id) 查询 vehicle_account_info 表获取当前登录的豆包 UID；非豆包 IP 渠道必须携带 account_id。缺失必需参数返回 400。
豆包 RPC： 豆包回调链路（AgentService）属于豆包 IP 渠道，无需改动，ALICE_PARAM_USER_ID 由豆包平台自动注入，按豆包 IP 策略映射即可。
灰度策略
分三阶段推进：
阶段一：映射表 + 中间件（1 周）
新建 volc_account_mapping 表。
实现 IdentityResolver 中间件和三种渠道策略写入volc_account_mapping表数据。
执行存量数据回填：从 vehicle_account_config 和 memory_user 表读取 (channel, vehicle_id, login_doubao_uid) 批量生成 VolcAccountID 映射并写回。
阶段二：下游业务双写（1周）
根据volc_account_mapping表数据，回填下游业务表的VolcAccountID字段；
下游业务双写：VolcAccountID字段和原始的account_id、login_doubao_uid同时写入；
查询侧逐步切换到 VolcAccountID；
监控双写一致性，出现差异告警。
阶段三：切换与清理（1 周）
全量切换到 VolcAccountID 查询。
非豆包 IP 渠道（东风）正式接入验证。
观察 1-2 周后，标记旧字段为 deprecated，停止双写。
旧索引和字段暂不删除，保留至少一个版本周期后再清理。

可观测性：
中间件解析成功率、耗时分渠道监控。
映射表命中率（缓存 vs DB）。
双写一致性对比指标。
参数缺失报错量按渠道和接口维度聚合。

风险评估


风险

等级

影响与应对

负责模块

代码中大量散落的 account_id / login_doubao_uid 引用遗漏改造

高

需全局梳理并分类（见下文"存量引用梳理"章节）；EASY 类直接替换，MEDIUM/HARD 类逐个排期；code review 全局搜索把关

全部下游

映射表 get-or-create 并发冲突

中

依靠唯一索引兜底，捕获 duplicate key 错误后重查；热点渠道首次登录可能有少量锁等待

身份解析中间件

account_config 唯一索引变更期间双写不一致

中

双写在同一事务内完成；灰度期定时对比新旧索引数据，发现差异自动修复

账号配置模块

弋途侧 VolcAccountID 适配进度阻塞 Goal 改造

中

AIDV 侧先完成 VolcAccountID 生成和传递，弋途侧最小改动替换 encrypted_doubao_uid，双方并行开发

Goal 模块

排期


时间

目标

人员

风险

0901-0906

完成火山账号的抽象以及中间件转换逻辑，同时完成历史账号数据写入，上线后保证火山账号后数据是完整、最新的；

@徐燃



0907-0916

完成账号配置、记忆、任务的适配和历史数据双写；
任务分三步跟弋途适配：
1.对弋途的接口增加火山账号UID（其他参数先不删除），弋途调用我们的参数也支持火山账号UID（优先用火山账号ID，没有则用老字段），火山先上这一版（9.18，ppe环境联调）；（排给振刚）
2.弋途发一版，使用火山账号UID，不用老字段；
3.火山最后发一版，删除老字段

@徐燃
@熊勇敢





回归测试

@梁浩杰



0917-0920

依赖的业务完成账号的查询使用切换使用火山账号id

@徐燃



0920

回归测试

@梁浩杰



0920

东风可以接入，客户端联调

@马超



0921-0925

账号中间件代码优化，删除无用字段，过渡代码删除；

@徐燃












