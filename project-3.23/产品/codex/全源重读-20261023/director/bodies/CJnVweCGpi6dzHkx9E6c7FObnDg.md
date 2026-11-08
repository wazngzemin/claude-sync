GUI Agent App 调试功能模块设计方案
需求来源
Gui端侧2026年度计划
GuiAgent端侧任务 需求描述：GUI 端侧会话 Debug 系统：支持会话数据采集与持久化、导出（脱敏）、在线可视化展示与检索，提升问题定位效率。
GUI Agent 调试面板模块设计方案 功能参考

设计方案概述
本模块是为 GUI Agent App 独立设计的调试功能组件，核心目标是解决 GUI Agent 运行过程中问题定位难、调试效率低的痛点。模块通过采集调试数据、会话全量数据（文字、图片等），实现本地持久化存储，支持脱敏后的数据导出，并提供在线可视化展示与检索能力，为开发、测试及运维人员提供一站式的调试数据管理与分析能力。
该模块采用 “低侵入性” 设计原则，作为独立组件集成到主应用中，不影响 GUI Agent 核心业务逻辑，且支持按需启用 / 关闭调试功能。

设计目标
独立性：调试模块与业务模块解耦，可独立集成 / 卸载，不影响主 App 核心功能。
完整性：全面覆盖需求中提及的所有采集、展示、存储、导出、可视化能力。
易用性：调试界面操作简单，数据展示直观，导出 / 可视化流程轻量化。
稳定性：数据采集（如音频、会话数据）不阻塞主线程，本地持久化保证数据安全。
可扩展性：预留接口，支持后续新增调试维度（如新增模块状态采集、数据格式扩展）。

设计原则
单一职责：模块仅聚焦调试数据的采集、存储、导出、可视化，不掺杂其他业务逻辑；
开闭原则：预留数据格式扩展接口（如后续支持音频 / 视频采集），新增功能无需修改核心代码；
数据安全优先：所有对外输出（导出 / 上传）的数据必须经过脱敏处理，敏感字段（如设备 ID、用户信息）默认屏蔽；
性能优化：采用批量插入、索引优化减少存储耗时，图片数据采用压缩存储，避免占用过多内存；
可测试性：核心方法提供单元测试用例，支持模拟数据采集 / 存储场景。

需求分析
功能需求


需求项

详细描述

暂定优先级

调试数据显示


初始化状态显示
权限状态
收音显示
状态机状态
会话任务状态

p1

log 抓取及配置


日志级别区分控制：支持分级（Verbose/Debug/Info/Warn/Error/Assert），可动态开关不同级别日志
环境区分：开发环境输出详细日志，生产环境关闭日志或只输出关键错误日志
日志输出渠道区分：支持控制台、文件、远程服务器等多渠道输出
隐私保护：防止敏感信息（如用户手机号、token）随日志泄露

p2

录屏


启动 / 停止录屏、录屏参数配置：
1. 范围类型（会话型 / 时间型）
2. 时间型：起止时间（精确到秒）
3. 会话型：触发条件（如点击开始 / 特定操作触发结束）4. 录屏分辨率 / 码率 / 帧率（基础配置）
联动录屏时间抓取日志、日志筛选：
1. 日志时间范围：录屏开始前 1 分钟～录屏结束后 1 分钟2. 日志类型筛选：Logcat（Error/Warn/Info/Debug）、Crash 日志、系统日志、应用日志
3. 输出开关：是否输出日志、日志保存路径
录屏文件 + 日志文件打包：
1. 打包格式（ZIP）
2. 文件名规则（录屏时间_设备 ID_日志类型）
3. 存储位置（内部存储 / 外部 SD 卡）
录屏 / 日志抓取状态监听、异常处理：
1. 录屏失败重试机制
2. 日志抓取超时处理
3. 存储空间不足预警

p2

会话数据采集


采集 GUI Agent 与用户的会话数据，支持文字（会话内容、时间戳、设备信息）、图片（Base64 编码 / 文件路径）；
采集触发时机：会话创建、会话更新、会话结束等；
可配置采集开关，支持全局开启 / 关闭。

p0

本地持久化


有中间适配层，可适配不同存储方案
支持数据过期自动清理（可设置默认保留时间，可配置）；
支持手动清空本地数据。

p0


数据脱敏导出

脱敏规则：屏蔽设备 ID、用户手机号 / 姓名等敏感字段，图片水印处理；
导出格式：JSON（文字）、ZIP（图片 + JSON）、MD、HTML

 p1

在线可视化与检索

数据拉取或上传：支持手动将本地数据上传至调试后台远端拉取；
可视化：以会话列表、会话详情形式展示数据，图片可预览；
检索：支持按时间范围、数据类型（文字 / 图片）、关键词检索会话数据。

p3
非功能需求
性能：采集操作不阻塞主线程，采用协程异步处理；
存储：单张图片压缩后存储；
安全：脱敏逻辑不可绕过，导出数据无原始敏感信息；

模块架构
 整体架构（分层设计）
UI 层（调试界面）
功能：提供调试模块的操作界面，包括采集开关、数据列表、检索界面等；
组件：调试主界面、会话记录、设置
交互层：与业务层通信，不直接操作数据层。
业务层（核心逻辑）
功能：封装调试模块的核心业务逻辑，协调数据采集、存储、导出、上传流程；
核心类：
模块入口，提供初始化、采集开关、数据管理等核心方法；
会话数据采集器，负责文字 / 图片数据的采集与预处理；
数据导出器，实现脱敏与格式转换；
数据上传器，负责将本地数据上传至调试后台；
检索管理器，支持本地 / 在线检索逻辑。
数据层（存储与交互）
功能：负责数据的本地持久化和网络交互；
核心类：
数据库相关：数据库实例、会话数据操作、媒体数据操作；
网络相关：DebugApiService；
数据模型：会话实体、媒体实体、导出数据模型。
基础层（工具与配置）
功能：提供通用工具类和配置项，支撑上层业务；
核心类：
脱敏工具类，实现敏感字段屏蔽、图片水印；
图片压缩工具类；
调试模块配置类（采集开关、数据保留天数、脱敏规则等）；
协程工具类，封装异步任务调度。
核心流程设计
调试数据显示
业务流程


log 抓取及配置
业务流程

录屏
业务流程



会话数据采集
业务流程

本地持久化
 架构设计图

业务流程



文件结构设计

debugkit/
├── src/main/kotlin/com/agent/debugkit/
│   ├── ├── core/                  // 核心层：全局配置、入口、基础能力
│   │   ├── DebugKit.kt            // 调试模块总入口（初始化、全局开关）
│   │   ├── DebugConfig.kt         // 全局配置类（日志级别、录屏参数、存储策略等）
│   │   ├── constant/              // 常量定义
│   │   │   ├── DebugConstants.kt  // 通用常量（如存储路径、文件名规则）
│   │   │   ├── LogConstants.kt    // 日志相关常量（级别、渠道）
│   │   │   ├── RecordConstants.kt // 录屏相关常量（分辨率、码率、触发条件）
│   │   │   └── DataConstants.kt   // 数据采集/脱敏常量
│   │   └── manager/               // 核心管理器（统筹各子功能）
│   │       ├── FunctionManager.kt // 功能总管理器（初始化各子模块）
│   │       └── StateManager.kt    // 全局状态管理器（录屏/日志/采集状态监听）
│   │
│   ├── display/                   // 调试数据显示模块
│   │   ├── ui/                    // UI 页面+组件
│   │   │   ├── DebugMainView.kt // 调试主界面（聚合所有显示入口）
│   │   │   ├── init/              // 初始化状态显示
│   │   │   │   ├── InitStateView.kt
│   │   │   │   └── InitStateAdapter.kt
│   │   │   ├── permission/        // 权限状态显示
│   │   │   │   ├── PermissionStateView.kt
│   │   │   │   └── PermissionAdapter.kt
│   │   │   ├── audio/             // 收音波形显示
│   │   │   │   ├── AudioRecordView.kt
│   │   │   │   └── WaveformDrawView.kt // 自定义波形绘制View
│   │   │   ├── statemachine/      // 状态机状态显示
│   │   │   │   ├── StateMachineView.kt
│   │   │   │   └── StateLogAdapter.kt
│   │   │   ├── setting/      // 配置设置
│   │   │   │   ├── settingView.kt
│   │   │   │   └── settingAdapter.kt
│   │   │   └── sessiontask/       // 会话任务状态显示
│   │   │       ├── SessionTaskView.kt
│   │   │       └── TaskStateAdapter.kt
│   │   ├── model/                 // 显示模块数据模型
│   │   │   ├── InitState.kt       // 初始化状态实体
│   │   │   ├── PermissionInfo.kt  // 权限信息实体
│   │   │   ├── StateMachineLog.kt // 状态机日志实体
│   │   │   └── SessionTaskState.kt// 会话任务状态实体
│   │   └── manager/               // 显示模块业务逻辑
│   │       ├── DisplayManager.kt  // 显示总管理器
│   │       ├── InitStateManager.kt// 初始化状态采集+更新
│   │       ├── PermissionManager.kt// 权限状态检测+更新
│   │       └── AudioDisplayManager.kt// 收音波形数据处理
│   │
│   ├── log/                       // 日志抓取及配置模块
│   │   ├── config/                // 日志配置
│   │   │   ├── LogLevel.kt        // 日志级别枚举（Verbose/Debug等）
│   │   │   ├── LogEnvConfig.kt    // 环境配置（开发/生产）
│   │   │   └── LogOutputConfig.kt // 输出渠道配置（控制台/文件/远程）
│   │   ├── processor/             // 日志处理（过滤/脱敏/分发）
│   │   │   ├── LogFilter.kt       // 日志级别/类型过滤
│   │   │   ├── LogDesensitizer.kt // 日志敏感信息脱敏（手机号/token）
│   │   │   └── LogDispatcher.kt   // 日志多渠道分发（控制台/文件/远程）
│   │   ├── collector/             // 日志采集
│   │   │   ├── LogcatCollector.kt // Logcat日志采集
│   │   │   ├── CrashCollector.kt  // Crash日志采集
│   │   │   ├── SystemLogCollector.kt // 系统日志采集
│   │   │   └── AppLogCollector.kt // 应用自定义日志采集
│   │   ├── manager/               // 日志模块管理器
│   │   │   └── LogManager.kt      // 日志配置/采集/分发总管理
│   │   └── model/                 // 日志数据模型
│   │       └── LogEntity.kt       // 日志实体（级别、内容、时间、类型）
│   │
│   ├── screenrecord/              // 录屏模块
│   │   ├── config/                // 录屏配置
│   │   │   ├── RecordRangeType.kt // 录屏范围枚举（会话型/时间型）
│   │   │   ├── RecordParams.kt    // 录屏参数（分辨率/码率/帧率）
│   │   │   └── RecordTrigger.kt   // 触发条件（点击/特定操作）
│   │   ├── core/                  // 录屏核心逻辑
│   │   │   ├── ScreenRecorder.kt  // 录屏核心（启动/停止/重试）
│   │   │   ├── RecordStateListener.kt // 录屏状态监听接口
│   │   │   └── RecordExceptionHandler.kt // 录屏异常处理
│   │   ├── loglink/               // 录屏联动日志
│   │   │   ├── LogTimeFilter.kt   // 日志时间范围筛选（录屏前后1分钟）
│   │   │   ├── LogTypeFilter.kt   // 日志类型筛选
│   │   │   └── RecordLogLinker.kt // 录屏+日志联动核心
│   │   ├── pack/                  // 录屏+日志打包
│   │   │   ├── FilePacker.kt      // ZIP打包工具
│   │   │   ├── FileNameGenerator.kt // 文件名生成（时间_设备ID_类型）
│   │   │   └── StorageSelector.kt // 存储位置选择（内部/外部SD）
│   │   ├── manager/               // 录屏模块管理器
│   │   │   └── ScreenRecordManager.kt // 录屏总管理
│   │   └── model/                 // 录屏数据模型
│   │       ├── RecordConfig.kt    // 录屏配置实体
│   │       └── RecordState.kt     // 录屏状态实体
│   │
│   ├── session/                   // 会话数据采集模块
│   │   ├── collector/             // 采集逻辑
│   │   │   ├── TextCollector.kt   // 文字数据采集
│   │   │   ├── ImageCollector.kt  // 图片数据采集（Base64/路径）
│   │   │   └── SessionTrigger.kt  // 采集触发（创建/更新/结束）
│   │   ├── config/                // 采集配置
│   │   │   └── SessionCollectConfig.kt // 全局开关/触发规则
│   │   ├── manager/               // 采集管理器
│   │   │   └── SessionCollectManager.kt // 采集总管理
│   │   └── model/                 // 会话数据模型
│   │       ├── SessionData.kt     // 会话总实体
│   │       ├── TextData.kt        // 文字数据实体
│   │       └── ImageData.kt       // 图片数据实体
│   │
│   ├── persistence/               // 本地持久化模块
│   │   ├── cache/                 // 缓存中间层
│   │   │   ├── MemoryCache.kt     // 内存缓存
│   │   │   └── DiskCache.kt       // 磁盘缓存
│   │   ├── strategy/              // 存储策略
│   │   │   ├── TaskStrategy.kt    // 任务触发策略（定时/大小）
│   │   │   ├── ProcessStrategy.kt // 存储前处理策略
│   │   │   └── CleanStrategy.kt   // 过期清理策略（默认保留时间/手动清空）
│   │   ├── storage/               // 存储实现（适配不同方案）
│   │   │   ├── StorageFactory.kt  // 存储工厂（Room/SP/File）
│   │   │   ├── RoomStorage.kt     // Room存储实现
│   │   │   ├── SharedPrefsStorage.kt // SP存储实现
│   │   │   └── FileStorage.kt     // 文件存储实现
│   │   ├── manager/               // 持久化管理器
│   │   │   └── PersistenceManager.kt // 持久化总管理
│   │   └── db/                    // Room数据库相关
│   │       ├── AppDatabase.kt     // Room数据库实例
│   │       ├── SessionDao.kt      // 会话数据DAO
│   │       ├── LogDao.kt          // 日志数据DAO
│   │       └── entity/            // Room实体
│   │           ├── SessionEntity.kt
│   │           └── LogEntity.kt
│   │
│   ├── export/                    // 数据脱敏导出模块
│   │   ├── desensitize/           // 脱敏规则
│   │   │   ├── DesensitizeRule.kt // 脱敏规则枚举（设备ID/手机号/图片水印）
│   │   │   ├── DataDesensitizer.kt // 数据脱敏核心
│   │   │   └── ImageWatermark.kt  // 图片水印处理
│   │   ├── format/                // 导出格式
│   │   │   ├── ExportFormat.kt    // 格式枚举（JSON/ZIP/MD/HTML）
│   │   │   ├── JsonExporter.kt    // JSON导出
│   │   │   ├── ZipExporter.kt     // ZIP导出（图片+JSON）
│   │   │   ├── MdExporter.kt      // MD导出
│   │   │   └── HtmlExporter.kt    // HTML导出
│   │   ├── manager/               // 导出管理器
│   │   │   └── ExportManager.kt   // 脱敏+导出总管理
│   │   └── model/                 // 导出模型
│   │       └── ExportConfig.kt    // 导出配置（格式/路径/脱敏规则）
│   │
│   ├── remote/                    // 在线可视化与检索模块
│   │   ├── manager/               // 远程模块管理器
│   │   │   └── RemoteManager.kt   // 上传/拉取/检索总管理
│   │   └── model/                 // 远程数据模型
│   │       └── RemoteSessionData.kt // 远程会话数据实体
│   │
│   └── common/                    // 通用工具层
│       ├── utils/                 // 工具类
│       │   ├── DeviceUtils.kt     // 设备信息工具（设备ID/分辨率）
│       │   ├── FileUtils.kt       // 文件操作工具（创建/删除/打包）
│       │   ├── TimeUtils.kt       // 时间工具（时间戳/范围筛选）
│       │   ├── DesensitizeUtils.kt // 通用脱敏工具
│       │   ├── PermissionUtils.kt // 权限检测工具
│       │   └── NetworkUtils.kt    // 网络工具（上传/下载）
│       ├── exception/             // 自定义异常
│       │   ├── RecordException.kt
│       │   ├── LogCollectException.kt
│       │   └── PersistenceException.kt
│       └── listener/              // 通用监听接口
│           ├── OnStateChangeListener.kt // 状态变更监听
│           └── OnProgressListener.kt    // 进度监听（导出/上传）
│
├── src/main/res/                  // 资源文件
│   ├── layout/                    // 布局文件（对应各UI页面）
│   ├── values/                    // 字符串/颜色/尺寸
│   └── drawable/                  // 图标/背景
│
└── build.gradle.kts 
调试界面
本地调试界面样式


远端调试界面样式


接口功能设计
会话数据采集 概要设计
数据模型定义

// 会话数据类型枚举
enum class MessageContentType {     
TEXT,        // 文字     
IMAGE,       // 图片     
AUDIO,       // 音频     
OTHER        // 其他类型
}

// 会话方向枚举
enum class MessageDirection {     
USER,        // 用户发送     
ASSISTANT    // 助手回复
}

// 会话数据实体类
@Entity(tableName = "conversation_records")
data class ConversationRecord(
@PrimaryKey(autoGenerate = true)
val id: Long = 0,                     // 主键ID
val sessionId: String,                // 会话ID，用于标识同一场对话
val direction: MessageDirection,      // 消息方向
val contentType: MessageContentType,  // 内容类型
val textContent: String? = null,      // 文字内容
val mediaData: ByteArray? = null,     // 图片/音频字节数组
val mediaType: String? = null,        // 媒体类型（如image/jpeg, audio/mpeg）
val timestamp: Instant,               // 时间戳
val deviceInfo: String? = null        // 设备信息（脱敏）
)

数据库定义

// DAO接口
@Dao
interface ConversationDao {

// 插入单条记录
@Insertsuspend fun insertRecord(record: ConversationRecord)

// 插入多条记录
@Insertsuspend fun insertRecords(records: List<ConversationRecord>)

// 根据会话ID查询记录
@Query("SELECT * FROM conversation_records WHERE sessionId = :sessionId ORDER BY timestamp ASC")
suspend fun getRecordsBySessionId(sessionId: String): List<ConversationRecord>

// 查询所有会话ID
@Query("SELECT DISTINCT sessionId FROM conversation_records ORDER BY timestamp DESC")
suspend fun getAllSessionIds(): List<String>

// 根据时间范围查询记录
@Query("SELECT * FROM conversation_records WHERE timestamp BETWEEN :start AND :end ORDER BY timestamp ASC")
suspend fun getRecordsByTimeRange(start: Instant, end: Instant): List<ConversationRecord>

// 删除指定会话的记录
@Query("DELETE FROM conversation_records WHERE sessionId = :sessionId")
suspend fun deleteRecordsBySessionId(sessionId: String): Int      

// 删除所有记录
@Query("DELETE FROM conversation_records")
suspend fun deleteAllRecords(): Int 
}
落地排期


需求

功能

2026 Q1

2026 Q2

2026 Q3

2026 Q4

GUI Agent App 调试功能模块

调试数据显示




初始化状态显示
权限状态
收音显示
状态机状态
会话任务状态







log 抓取及配置






日志级别区分控制：支持分级（Verbose/Debug/Info/Warn/Error/Assert），可动态开关不同级别日志
环境区分：开发环境输出详细日志，生产环境关闭日志或只输出关键错误日志
日志输出渠道区分：支持控制台、文件、远程服务器等多渠道输出
隐私保护：防止敏感信息（如用户手机号、token）随日志泄露





录屏






启动 / 停止录屏、录屏参数配置：
1. 范围类型（会话型 / 时间型）
2. 时间型：起止时间（精确到秒）
3. 会话型：触发条件（如点击开始 / 特定操作触发结束）4. 录屏分辨率 / 码率 / 帧率（基础配置）
联动录屏时间抓取日志、日志筛选：
1. 日志时间范围：录屏开始前 1 分钟～录屏结束后 1 分钟2. 日志类型筛选：Logcat（Error/Warn/Info/Debug）、Crash 日志、系统日志、应用日志
3. 输出开关：是否输出日志、日志保存路径
录屏文件 + 日志文件打包：
1. 打包格式（ZIP）
2. 文件名规则（录屏时间_设备 ID_日志类型）
3. 存储位置（内部存储 / 外部 SD 卡）
录屏 / 日志抓取状态监听、异常处理：
1. 录屏失败重试机制
2. 日志抓取超时处理
3. 存储空间不足预警





会话数据采集


采集 GUI Agent 与用户的会话数据，支持文字（会话内容、时间戳、设备信息）、图片（Base64 编码 / 文件路径）；
采集触发时机：会话创建、会话更新、会话结束等；
可配置采集开关，支持全局开启 / 关闭。









本地持久化

有中间适配层，可适配不同存储方案
支持数据过期自动清理（可设置默认保留时间，可配置）；
支持手动清空本地数据。









数据脱敏导出







脱敏规则：屏蔽设备 ID、用户手机号 / 姓名等敏感字段，图片水印处理；
导出格式：JSON（文字）、ZIP（图片 + JSON）、MD、HTML



在线可视化与检索

数据拉取：
本地可视化：以会话列表、会话详情形式展示数据，图片可预览；
检索：支持按时间范围、数据类型（文字 / 图片）、关键词检索会话数据。

支持手动将本地数据上传至调试后台远端拉取；
远端可视化：以会话列表、会话详情形式展示数据，图片可预览；






