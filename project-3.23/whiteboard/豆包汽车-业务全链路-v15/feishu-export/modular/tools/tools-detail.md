# 豆包汽车 v15 · 工具分类明细

本清单按《下游工具输入输出整理》表第2–41行逐行保留，共40个业务条目、39个不同表内英文ID：music_search有豆包历史版和FC版两行。6行被表格或评论标弃用/停止作为Planner工具，余下34行也不等于任何车型当前可调用34项。最新Director PRD标准化表为33个业务行、34个英文标识（goal_list_update/task_agent同一行），与工具说明表版本和粒度不同。实际每轮可调用集合必须由渠道、车型、环境、发布启用状态、权限和动态条件决定。补充定义不计入40行，别名不作为新增工具。

以下内容逐字段保留 graph-v15.json 中的原始定义，包括版本、弃用、待核及未确认上线等限定。分类只是阅读整理，不改变工具状态。

## 清单计数口径

| 原字段 | 原值 |
|---|---|
| sourceBusinessRows | 40 |
| distinctTableIdentifiers | 39 |
| deprecatedOrCommentRetiredRows | 6 |
| remainingRowsNotConfirmedActive | 34 |
| prdBusinessRows | 33 |
| prdEnglishIdentifiers | 34 |
| currentRunnableToolCount | null |

## 车辆与系统

<!-- tool-start:TOOL01 -->
### 表第 2 行 · 车辆设备控制

工具名：`vehicle_basic_control`

**接收什么（input）**

明确设备、座位、动作与合法参数；例：打开副驾座椅加热，不写模糊“加热开关”。

**内部处理／能力边界（mechanism）**

Director按当前人名座位和车型能力改写→当前渠道车控实现理解→下发具体函数→端侧执行→返回逐项结果。智驾与专属氛围灯走各自工具；语控不支持不等于车辆无该硬件，必要时另查手动方法。用户自定义模式/位置/App名称可依赖车端动态词典。

**交回什么结果（output）**

工具表回包有改写query、函数、执行状态和失败原因。调节到语音可调极限可能只部分实现；需区分已受理与真实车端状态改变。

**异常、限制与用户下一步（exception）**

无回包超时按执行失败且表明确请勿重复调用；混合动作逐项报告，不能只用一个总成功。安全条件与实际可调范围依车型协议。

**适用范围与状态（status）**

标准化PRD必选；具体动作集合与项目实现另核。

**后续交接（next）**

结果交E6→M→D；必要时查状态/车书由D另发动作。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 2 |
| name | "vehicle_basic_control" |
| label | "车辆设备控制" |
| category | "车辆与系统" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","DT-PRD","CONTROL-DYNAMIC"] |
| states | ["待调用","已下发","执行成功/部分成功/失败"] |
| id | "TOOL01" |
| x | 190 |
| y | 35300 |
| w | 2760 |
| h | 943 |

<!-- tool-end:TOOL01 -->

<!-- tool-start:TOOL02 -->
### 表第 3 行 · 系统设置

工具名：`vehicle_system_settings`

**接收什么（input）**

设置项和合法参数，如热点、屏幕亮度、音量/音效、应用或页面、电源及账号相关操作。

**内部处理／能力边界（mechanism）**

对应当前车型系统能力，下游把语义映射到具体功能。媒体上下首/进度/收藏归媒体控制，K歌点播与模式归本工具；不能把系统设置都当车辆硬件控制。

**交回什么结果（output）**

该表反馈栏空。必须从项目接口补取函数执行状态、当前值、失败原因及高权限确认结果。

**异常、限制与用户下一步（exception）**

参数越界、应用未安装、账号权限、车机状态限制需具体合同。表空白不能推断系统无反馈，也不能宣称已生效。

**适用范围与状态（status）**

标准化PRD必选；当前车型可控范围待项目核验。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 3 |
| name | "vehicle_system_settings" |
| label | "系统设置" |
| category | "车辆与系统" |
| sourceId | "TOOLS-IO" |
| id | "TOOL02" |
| x | 3710 |
| y | 35300 |
| w | 2760 |
| h | 943 |

<!-- tool-end:TOOL02 -->

<!-- tool-start:TOOL03 -->
### 表第 4 行 · 车载通讯

工具名：`vehicle_communication`

**接收什么（input）**

拨打、接听、挂断蓝牙电话或视频通话；对象为联系人称呼或号码。

**内部处理／能力边界（mechanism）**

下游依赖本车通讯录与蓝牙/视频能力完成通讯动作。动态示例指南旧名vehicle_communication_control要求联系人称呼无需改写、不能用本工具发短信；与当前标准名映射需注册配置核实。

**交回什么结果（output）**

本表反馈栏空；需区分拨号命令已发、呼叫中、对方接通、通话结束，不能都叫成功。

**异常、限制与用户下一步（exception）**

未连接、未授权、同名联系人和无记录的处理需接口确认；不能猜私人号码或把拨号受理说成已经接通。

**适用范围与状态（status）**

标准化PRD可选；主线/上汽/赛力斯按实际搭载。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 4 |
| name | "vehicle_communication" |
| label | "车载通讯" |
| category | "车辆与系统" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"vehicle_communication_control","evidence":"动态示例指南","status":"历史名称，运行时映射待核"}] |
| id | "TOOL03" |
| x | 7230 |
| y | 35300 |
| w | 2760 |
| h | 943 |

<!-- tool-end:TOOL03 -->

<!-- tool-start:TOOL04 -->
### 表第 5 行 · 智能辅助驾驶

工具名：`auto_drive`

**接收什么（input）**

泊入/泊出、贴边/循迹/记忆泊车，或巡航速度、跟车时距、变道及辅助驾驶风格。

**内部处理／能力边界（mechanism）**

工具覆盖泊车与辅助行车控制，不负责导航目的地规划。表中风格枚举为舒适、标准、运动；执行前需车型支持、当前车辆状态与控制权限，不能凭模型说能做就进入动作。

**交回什么结果（output）**

表反馈栏空；真实接管、执行、终止和拒绝状态需由智驾协议说明。

**异常、限制与用户下一步（exception）**

速度/挡位/驾驶员控制权/环境是否允许，必须由具体车型接口与安全规则核验；导航成功不代表智驾已执行。

**适用范围与状态（status）**

标准化PRD可选；不代表每辆车都开放所有驾驶动作。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 5 |
| name | "auto_drive" |
| label | "智能辅助驾驶" |
| category | "车辆与系统" |
| sourceId | "TOOLS-IO" |
| id | "TOOL04" |
| x | 10750 |
| y | 35300 |
| w | 2760 |
| h | 943 |

<!-- tool-end:TOOL04 -->

<!-- tool-start:TOOL30 -->
### 表第 31 行 · 氛围灯语义与视觉配色

工具名：`ambient_light_control`

**接收什么（input）**

开关、模式、颜色；可提出按晚霞、衣着、屏幕颜色等配色要求。

**内部处理／能力边界（mechanism）**

本工具内部处理需要的视觉取色和配色，再调用对应氛围灯能力；不要让Director先单独VQA取色再二次改写。普通车灯/阅读灯等仍走车辆控制。表支持语义设计，但实际硬件是否有流光能力要分别判断。

**交回什么结果（output）**

可能先返回设计中，后续成功或失败；无流光硬件与完全无氛围灯应分别说明。

**异常、限制与用户下一步（exception）**

视觉没取到或硬件不支持不能说颜色已设好；处理中不是完成。具体取图、颜色映射和超时接口未从该表取得，不编造。

**适用范围与状态（status）**

标准化PRD为上汽定制，非所有车型通用。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 31 |
| name | "ambient_light_control" |
| label | "氛围灯语义与视觉配色" |
| category | "车辆与系统" |
| sourceId | "TOOLS-IO" |
| id | "TOOL30" |
| x | 3710 |
| y | 42741 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL30 -->

## 导航与行程

<!-- tool-start:TOOL05 -->
### 表第 6 行 · 路线规划（AiNavi）

工具名：`route_planning`

**接收什么（input）**

精确目的地导航、途经点增删改、路线选择；模糊目标先由POI明确，选择需映射真实候选序号。

**内部处理／能力边界（mechanism）**

下游做地点定位与算路，返回候选后由用户或Director按合法条件选择。表的旧范围包含较广路线问答，与新增高德工具存在重叠，当前道路级偏好按新的amap工具边界核验，不能两套并行争抢路线。

**交回什么结果（output）**

POI或路线列表带ID、时间、距离、费用、红绿灯数等；保存路线、算出路线和开始导航需分辨真实状态。

**异常、限制与用户下一步（exception）**

导航工具互斥；动态指南旧名允许最多重试2次，但不能推广给当前全工具，是否适用须接口/版本确认。缺具体地址不得猜。

**适用范围与状态（status）**

标准化PRD必选；AiNavi版与高德补充版需按项目路由。

**后续交接（next）**

候选或执行事实→E6；互斥要求D分轮。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 6 |
| name | "route_planning" |
| label | "路线规划（AiNavi）" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"route_planning_qa","evidence":"动态示例指南/互斥栏旧ID","status":"历史名称，别名映射待核"}] |
| states | ["地点/条件待明确","算路/候选返回","选择/发起导航","成功/失败"] |
| id | "TOOL05" |
| x | 190 |
| y | 36393 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL05 -->

<!-- tool-start:TOOL06 -->
### 表第 7 行 · POI类别搜索（AiNavi）

工具名：`poi_search`

**接收什么（input）**

类别＋范围＋筛选条件：附近、多个点中间或当前路线沿途；不是精确地名导航或单店详细问答。

**内部处理／能力边界（mechanism）**

按多条件找一批地点并返回排序候选；Director介绍真实序号，用户选中后再规划导航。沿途搜索前要有导航路线，不能没有路线就假装顺路；旧search_poi_qa范围更广，不能直接套其全部说明。

**交回什么结果（output）**

返回POI列表；序号必须与本次真实结果对应。附近无结果可以由Director考虑联网补查。

**异常、限制与用户下一步（exception）**

沿途无结果勿重复调用；未导航不能沿途搜。单店详细问答与精确目的地处理按当前工具边界分流。

**适用范围与状态（status）**

标准化PRD必选；当前表为AiNavi定义。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 7 |
| name | "poi_search" |
| label | "POI类别搜索（AiNavi）" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"search_poi_qa","evidence":"旧指南及互斥说明","status":"旧范围不完全一致，运行映射待核"}] |
| id | "TOOL06" |
| x | 3710 |
| y | 36393 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL06 -->

<!-- tool-start:TOOL07 -->
### 表第 8 行 · 行程规划记录

工具名：`trip_plan_record`

**接收什么（input）**

预览、创建、确认或修改多日行程；需出发日期、总体目标、每日行程段与地点/操作。

**内部处理／能力边界（mechanism）**

Director先搜索并整理行程，再口头预览并调用记录工具保存；口头说完不等于行程已存。修改需指明已有行程与添加/删除/换序等动作。本工具记录计划，不直接启动导航。

**交回什么结果（output）**

保存、添加、删除、更新各自成功结果或创建/修改失败；缺出发时间要追问。

**异常、限制与用户下一步（exception）**

与路线规划、POI、导航基础控制的互斥按指南串行；不能在未确定行程对象时覆盖旧计划。后续trip_planning是否替代需项目确认。

**适用范围与状态（status）**

40行工具表有定义；不在当前33标准化业务行同名出现，属于版本/渠道补充。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 8 |
| name | "trip_plan_record" |
| label | "行程规划记录" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","DYNAMIC-EXAMPLE"] |
| aliases | [{"name":"trip_planning","evidence":"标准化PRD独立行","status":"不直接断言同一工具，需确认替代关系"}] |
| id | "TOOL07" |
| x | 7230 |
| y | 36393 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL07 -->

<!-- tool-start:TOOL08 -->
### 表第 9 行 · 地图选点

工具名：`map_location_pick`

**接收什么（input）**

一个精确地名或当前位置；不承接多条件商家筛选和路况查询。

**内部处理／能力边界（mechanism）**

下游定位具体地点，给名称、地址和坐标。若有多个同名候选，需用户确认，不能凭第一条默认设置目的地；坐标供后续业务使用，不等于已经开始导航。

**交回什么结果（output）**

返回具体地点名称、地址、坐标；多个候选进入选择分支。

**异常、限制与用户下一步（exception）**

模糊类别搜索应走POI，路线或路况问题走对应导航工具；查不到/权限/超时等完整异常合同本表未明确。

**适用范围与状态（status）**

40行表有定义；当前PRD标准化表未同名列出，车型与发布状态待核。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 9 |
| name | "map_location_pick" |
| label | "地图选点" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| id | "TOOL08" |
| x | 10750 |
| y | 36393 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL08 -->

<!-- tool-start:TOOL09 -->
### 表第 10 行 · 豆包本地生活搜索

工具名：`search_local_life`

**接收什么（input）**

美食、景点、娱乐、住宿等生活需求；不用于停车场、商场等超出本表范围的类型。

**内部处理／能力边界（mechanism）**

通过豆包本地生活能力检索POI，给Director用于选择与后续规划；它不是AiNavi POI的全部等价替代。类型、渠道和供应商数据覆盖要明确，不能为无结果随意换到不支持的分类。

**交回什么结果（output）**

返回结构化POI；无结果可由Director选择联网兜底。

**异常、限制与用户下一步（exception）**

工具失败表要求勿重复；不存在合适结果应明确无结果，不能编造地点或擅自开始导航。

**适用范围与状态（status）**

40行表有定义；标准化PRD未同名列入；当前调用与车型范围待核。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 10 |
| name | "search_local_life" |
| label | "豆包本地生活搜索" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| id | "TOOL09" |
| x | 190 |
| y | 37451 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL09 -->

<!-- tool-start:TOOL10 -->
### 表第 11 行 · 地图与导航基础控制

工具名：`navi_basic_control`

**接收什么（input）**

导航启停/继续、界面缩放视角、播报开关模式、收藏和路线偏好等，不做新目的地搜索。

**内部处理／能力边界（mechanism）**

下游执行已有导航过程或地图界面上的基础控制。新目的地与算路走路线工具，道路级复杂偏好走高德对应工具；表互斥字段仍写route_planning_qa/search_poi_qa/trip_plan_record旧ID，应核当前映射。

**交回什么结果（output）**

成功或失败；失败可区分未处于导航、不支持等，不能把打开界面当导航已启动。

**异常、限制与用户下一步（exception）**

无回包勿重复；与互斥导航工具分轮。条件不成立则解释当前状态，不盲目把相同命令再发。

**适用范围与状态（status）**

标准化PRD必选；支持项以车型能力集合为准。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 11 |
| name | "navi_basic_control" |
| label | "地图与导航基础控制" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| id | "TOOL10" |
| x | 3710 |
| y | 37451 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL10 -->

<!-- tool-start:TOOL39 -->
### 表第 40 行 · 高德复杂路线规划

工具名：`amap_complex_planning`

**接收什么（input）**

走或避开具体道路/路段/高速，或沿河、风景好、路宽等非枚举路线偏好。

**内部处理／能力边界（mechanism）**

补足AiNavi普通算路无法承接的道路级需求；普通精确目的地、固定偏好、途经点与启停按各自工具，POI搜索不在本工具。9/20评论有新的高德定义，当前项目应对照新合同而非混用旧例子。

**交回什么结果（output）**

返回带ID、位置、距离等POI/路线列表或自然语言结果，不能在用户未选择时随意假定目标路线。

**异常、限制与用户下一步（exception）**

禁止与route_planning或amap_navigation_interaction同轮并行。道路不存在、偏好不能满足时需真实返回，不自动改成相反路线。

**适用范围与状态（status）**

PRD可选；10/22宣讲明确高德两项仍测试中，后续上线状态另核。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 40 |
| name | "amap_complex_planning" |
| label | "高德复杂路线规划" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","DT-PRD","DT-MEETING"] |
| relatedSourceUrl | "https://pq3b44yw2t9.feishu.cn/wiki/HnlvwjM9FihWUEkv6HFc2SJwn6d" |
| id | "TOOL39" |
| x | 7230 |
| y | 44857 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL39 -->

<!-- tool-start:TOOL40 -->
### 表第 41 行 · 高德导航交互

工具名：`amap_navigation_interaction`

**接收什么（input）**

导航中出高速、主辅路切换、转向、环岛出口等；已有路线/导航下的路线原因和道路信息问答。

**内部处理／能力边界（mechanism）**

先核当前路线或导航状态。普通算路、复杂道路偏好、地图显示设置分别走对应工具；当前位置、目的地、剩余时间距离等若端状态已知，优先状态查询而不是高德重问。

**交回什么结果（output）**

高德自然语言返回结果；动作执行与信息问答要分清，不把解释路线当车辆已转向。

**异常、限制与用户下一步（exception）**

禁止与其他互斥导航工具同轮并行。未导航时导航态动作不可用，需解释当前状态；错误、超时与重试合同按项目核实。

**适用范围与状态（status）**

PRD可选；10/22宣讲仍测试中，不宣称当前所有车型已接入。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 41 |
| name | "amap_navigation_interaction" |
| label | "高德导航交互" |
| category | "导航与行程" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","DT-PRD","DT-MEETING"] |
| id | "TOOL40" |
| x | 10750 |
| y | 44857 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL40 -->

## 事实与知识

<!-- tool-start:TOOL11 -->
### 表第 12 行 · 实时车辆状态查询

工具名：`vehicle_status_search`

**接收什么（input）**

需要知道的当前设备或车辆状态，如空调温度、车窗、续航、导航或媒体当前值。

**内部处理／能力边界（mechanism）**

读取本车实际上报状态，返回事实供回答或后续规划；不改变设置。Context已有且新鲜的状态可直接使用，信息缺失或需要补查时再调用。

**交回什么结果（output）**

自然语言状态与已知可设置范围；可能返回空结果。

**异常、限制与用户下一步（exception）**

空值不等于关闭或零，过期值不等于当前真值；必须检查来源与时间，不能用历史话术补造缺失状态。

**适用范围与状态（status）**

标准化PRD必选。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 12 |
| name | "vehicle_status_search" |
| label | "实时车辆状态查询" |
| category | "事实与知识" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"search_vehicle_status_info","evidence":"历史指南","status":"旧名映射需核当前注册配置"}] |
| id | "TOOL11" |
| x | 7230 |
| y | 37451 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL11 -->

<!-- tool-start:TOOL12 -->
### 表第 13 行 · 天气查询

工具名：`weather_search`

**接收什么（input）**

地点和时间，尽量明确到所需城市/小时级范围；天气、气温、风、空气质量与生活指数。

**内部处理／能力边界（mechanism）**

查外部天气资料用于回答或决策，别把远处或全天预报自动当本车此刻正在下雨；Context背景是否已足够先判断。未来天气与传感器观察属于不同证据。

**交回什么结果（output）**

天气文本或空结果；结果范围与时间应保留给Director。

**异常、限制与用户下一步（exception）**

无结果不能编天气；城市歧义、时间范围及供应商超时合同需项目确认。

**适用范围与状态（status）**

标准化PRD可选，主线/上汽/赛力斯按接入。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 13 |
| name | "weather_search" |
| label | "天气查询" |
| category | "事实与知识" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"search_weather","evidence":"历史指南","status":"旧名映射待核"}] |
| id | "TOOL12" |
| x | 10750 |
| y | 37451 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL12 -->

<!-- tool-start:TOOL13 -->
### 表第 14 行 · 通用车辆说明书问答

工具名：`vehicle_manual_qa`

**接收什么（input）**

车辆通用功能、使用方法、教程和参数知识；本车专属配置/维修/权益资料交car_care_qa。

**内部处理／能力边界（mechanism）**

检索相应车型/版本说明书，不负责直接执行。另有技术方案将常用2000条QA前置Context：多轮改写→车型过滤→TOP3→低置信过滤→knowledge注入，并明确禁用旧车书工具；与当前PRD必选需分项目确认。

**交回什么结果（output）**

本表反馈栏空；独立工具回答与前置知识答案两条路不可混写。引用知识必须匹配实际配置。

**异常、限制与用户下一步（exception）**

语控不支持时按条件查手动操作方法，不是每个车控调用前必查。低置信/无知识不编造；前置方案阈值仍需评测。

**适用范围与状态（status）**

PRD列必选；前置Context替代方案存在，当前渠道路由待核。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 14 |
| name | "vehicle_manual_qa" |
| label | "通用车辆说明书问答" |
| category | "事实与知识" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","MANUAL-TECH","DT-PRD"] |
| id | "TOOL13" |
| x | 190 |
| y | 38509 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL13 -->

<!-- tool-start:TOOL22 -->
### 表第 23 行 · 联网信息素材搜索

工具名：`web_search`

**接收什么（input）**

明确待核实的联网问题，如时效信息、歌曲知识、新闻或目标地点线索。

**内部处理／能力边界（mechanism）**

联网结果作为Director中间决策素材，不默认直接对用户问答或执行。Director核对结果是否支持当前问题，再选择回答或后续工具；例如先确认歌名再调音乐，不把搜索摘要当已完成播放。

**交回什么结果（output）**

返回相关信息或空结果，后续统一由Director组织话语。

**异常、限制与用户下一步（exception）**

空结果应说明无法确认；实时事实不要凭旧知识编造。来源时效与可信度需要在实际结果里核对，不能仅因工具返回就无条件采信。

**适用范围与状态（status）**

标准化PRD必选；与已弃用web_qa直接问答路径区分。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 23 |
| name | "web_search" |
| label | "联网信息素材搜索" |
| category | "事实与知识" |
| sourceId | "TOOLS-IO" |
| id | "TOOL22" |
| x | 3710 |
| y | 40625 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL22 -->

<!-- tool-start:TOOL33 -->
### 表第 34 行 · 单车维养与专属资料问答

工具名：`car_care_qa`

**接收什么（input）**

本车生产、配置、维修保养、权益、事故与长周期报告等专属资料。

**内部处理／能力边界（mechanism）**

依赖车企侧单车数据，区别于通用说明书vehicle_manual_qa和实时状态vehicle_status_search。Director先判断问题要的是此刻车况、通用方法还是这辆车历史，避免把泛化车型知识当本车维修事实。

**交回什么结果（output）**

本表未给完整输出契约；回答质量、资料可见范围和引用时点需车企接口确认。

**异常、限制与用户下一步（exception）**

没有本车数据不能套别车或泛化参数；涉及安全故障时不能编确定结论。授权、资料缺失和供应商失败需保留原因。

**适用范围与状态（status）**

标准化PRD为上汽定制；不可当所有车企均提供完整维养数据。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 34 |
| name | "car_care_qa" |
| label | "单车维养与专属资料问答" |
| category | "事实与知识" |
| sourceId | "TOOLS-IO" |
| id | "TOOL33" |
| x | 190 |
| y | 43799 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL33 -->

## 历史与弃用

<!-- tool-start:TOOL14 -->
### 表第 15 行 · 声音演绎（历史工具）

工具名：`voice_acting`

**接收什么（input）**

旧合同接唱歌、悄悄话、指定语言方言和音色等请求。

**内部处理／能力边界（mechanism）**

旧链路直接下发语音并中断后续Planner，不返回给Planner总结。5/14评论明确不再作为Planner工具，改由talk_content标签选择唱歌/TTS链路；不能和当前统一播报主线并列为必经工具。

**交回什么结果（output）**

旧协议无Planner反馈，不能拿它解释现在所有工具的结果回流。

**异常、限制与用户下一步（exception）**

历史直返行为仅用于版本对照；用户唱歌能力是否可用还要看当前语音与车型接入，不因工具弃用就说能力不存在。

**适用范围与状态（status）**

评论标记5/14已不作为Planner工具；当前通常走话术标签，运行版本需核。

**弃用／停用依据（deprecationEvidence）**

5/14评论，不是表格空白推断

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 15 |
| name | "voice_acting" |
| label | "声音演绎（历史工具）" |
| category | "历史与弃用" |
| sourceId | "TOOLS-IO" |
| deprecated | true |
| id | "TOOL14" |
| x | 3710 |
| y | 38509 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL14 -->

<!-- tool-start:TOOL16 -->
### 表第 17 行 · 音乐搜索·豆包版（历史实现）

工具名：`music_search`

**接收什么（input）**

歌手、歌名、风格等音乐查询，不搜索播客/有声书等长音频。

**内部处理／能力边界（mechanism）**

与第18行同一英文工具ID，但本行是豆包历史实现，不是多一个不同工具。旧结构化返回专辑/歌单/单曲，曾有无版权时短视频音频兜底；7/2评论说明弃用改函数调用版。

**交回什么结果（output）**

历史返回结构化音乐结果；不能把该返回形态套到当前FC版。

**异常、限制与用户下一步（exception）**

旧版权兜底并不证明当前版本仍开放；按当前实现确认搜索/播放是否一体，避免重复播放或选错媒体。

**适用范围与状态（status）**

7/2评论标弃用，由音乐FC版替代；只保留演进说明。

**弃用／停用依据（deprecationEvidence）**

7/2评论

**实现版本说明（implementationVariant）**

doubao_legacy

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 17 |
| name | "music_search" |
| label | "音乐搜索·豆包版（历史实现）" |
| category | "历史与弃用" |
| sourceId | "TOOLS-IO" |
| deprecated | true |
| sameDefinitionAsRow | 18 |
| id | "TOOL16" |
| x | 10750 |
| y | 38509 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL16 -->

<!-- tool-start:TOOL23 -->
### 表第 24 行 · 联网问答（已弃用）

工具名：`web_qa`

**接收什么（input）**

历史直接联网回答用户问题的输入。

**内部处理／能力边界（mechanism）**

旧工具用于直接回答，与web_search作为中间素材不同。工具表明确弃用，当前主图不得让它与Director统一问答并列为常态。

**交回什么结果（output）**

历史直接问答返回；当前反馈合同不作为新主链路依据。

**异常、限制与用户下一步（exception）**

不能为了省一轮把现工具路由擅自切回旧web_qa；仅用于识别旧日志和迁移来源。

**适用范围与状态（status）**

工具表明确标弃用。

**弃用／停用依据（deprecationEvidence）**

表第24行明确弃用

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 24 |
| name | "web_qa" |
| label | "联网问答（已弃用）" |
| category | "历史与弃用" |
| sourceId | "TOOLS-IO" |
| deprecated | true |
| id | "TOOL23" |
| x | 7230 |
| y | 40625 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL23 -->

<!-- tool-start:TOOL24 -->
### 表第 25 行 · 定时日程提醒（已弃用）

工具名：`operate_conditional_task`

**接收什么（input）**

历史时间类任务新增、删除、修改、查询。

**内部处理／能力边界（mechanism）**

历史提醒实现不是当前Goal List或新Task Service之前的一个串行必经层。现任务应按项目新合同创建、等待触发、执行与回流。

**交回什么结果（output）**

只用于解释旧任务日志，不能据旧工具的成功判断当前任务已注册。

**异常、限制与用户下一步（exception）**

不要将旧增删改查能力直接映射到只支持增删的Goal工具；任务ID和生命周期必须按实际系统。

**适用范围与状态（status）**

工具表明确标弃用。

**弃用／停用依据（deprecationEvidence）**

表第25行明确弃用

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 25 |
| name | "operate_conditional_task" |
| label | "定时日程提醒（已弃用）" |
| category | "历史与弃用" |
| sourceId | "TOOLS-IO" |
| deprecated | true |
| id | "TOOL24" |
| x | 10750 |
| y | 40625 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL24 -->

<!-- tool-start:TOOL25 -->
### 表第 26 行 · 临时AI播客（已弃用）

工具名：`search_and_control_ai_broadcast`

**接收什么（input）**

历史深入研究/播客搜索等请求。

**内部处理／能力边界（mechanism）**

旧能力已被工具表标弃用，不能与当前播客搜索和AI播客生成合成三个同时可用的等价工具。当前生成与消费分别看新定义。

**交回什么结果（output）**

历史返回形态不应用于当前工具闭环。

**异常、限制与用户下一步（exception）**

遇到旧日志先核工具版本，不用旧接口做默认兜底，也不把弃用工具计入当前车型可调用数量。

**适用范围与状态（status）**

工具表明确标弃用。

**弃用／停用依据（deprecationEvidence）**

表第26行明确弃用

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 26 |
| name | "search_and_control_ai_broadcast" |
| label | "临时AI播客（已弃用）" |
| category | "历史与弃用" |
| sourceId | "TOOLS-IO" |
| deprecated | true |
| id | "TOOL25" |
| x | 190 |
| y | 41683 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL25 -->

<!-- tool-start:TOOL26 -->
### 表第 27 行 · GUI Agent操作（已弃用）

工具名：`gui_agent_operation`

**接收什么（input）**

历史点餐、订座、停车缴费等长程界面操作，通常需要精确商家/地点和完整条件。

**内部处理／能力边界（mechanism）**

旧GUI流程包含澄清clarify、交接handoff和结束finish；不是只点击一个按钮。用户登录、支付等可能要人工接管，finish示例仍可能是待手机付款，不能当已支付。

**交回什么结果（output）**

clarify要求补问，handoff交用户登录，finish结束该Agent任务；仍需解读具体业务状态。

**异常、限制与用户下一步（exception）**

异常勿重复；表已弃用，不能把新动态卡片工具等同旧GUIAgent，也不能用结束状态冒充履约。

**适用范围与状态（status）**

工具表明确标弃用。

**弃用／停用依据（deprecationEvidence）**

表第27行明确弃用

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 27 |
| name | "gui_agent_operation" |
| label | "GUI Agent操作（已弃用）" |
| category | "历史与弃用" |
| sourceId | "TOOLS-IO" |
| deprecated | true |
| states | ["clarify","handoff","finish（不必然履约完成）"] |
| id | "TOOL26" |
| x | 3710 |
| y | 41683 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL26 -->

## 内容与媒体

<!-- tool-start:TOOL15 -->
### 表第 16 行 · 长短视频搜索

工具名：`video_search`

**接收什么（input）**

短视频仅抖音，长视频仅腾讯；可按片名、演员、剧集、类别等具体需求搜索。

**内部处理／能力边界（mechanism）**

短视频和长视频内部结果路径不同。后排未开屏时先询问，用户同意则开屏成功后搜索；拒绝开屏仍可搜，不能将开屏作为强制前置。该顺序涉及依赖，Director不应同轮把开屏与需要开屏成功的动作一起发。

**交回什么结果（output）**

短视频返回候选列表，需要手动点播；长视频通过函数执行，回成功/失败。

**异常、限制与用户下一步（exception）**

长视频超时勿重复；内容版权/供应商限制要保留，搜索到列表不等于视频已开始播放。

**适用范围与状态（status）**

标准化PRD可选；以项目屏幕与内容接入为准。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 16 |
| name | "video_search" |
| label | "长短视频搜索" |
| category | "内容与媒体" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"search_and_control_short_video","evidence":"历史指南","status":"旧名范围与实现待核"}] |
| states | ["搜索/开屏待确认","候选返回或播放执行","已播放/待手动选择/失败"] |
| id | "TOOL15" |
| x | 7230 |
| y | 38509 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL15 -->

<!-- tool-start:TOOL17 -->
### 表第 18 行 · 音乐搜索·函数调用版

工具名：`music_search`

**接收什么（input）**

明确歌手、歌名、专辑、风格或可被搜索的音乐描述；复杂知识推断由Director先查清。

**内部处理／能力边界（mechanism）**

当前表FC实现通过具体媒体能力搜索/播放。用户说“那首冠军歌”时先获取真实歌名，再调用本工具，不应让弱推理搜索接口自己猜。实际媒体授权、登录与版权由供应商和项目决定。

**交回什么结果（output）**

成功回正在播放的歌曲、歌手、专辑；失败可能是未登录等。是否已播放要看真实反馈而非只看搜索命中。

**异常、限制与用户下一步（exception）**

超时勿重复；未登录应引导合法登录，不编造已播放。第17行同ID的历史豆包返回不可混用。

**适用范围与状态（status）**

标准化PRD必选；本表FC版，实际供应商和车型实现待核。

**实现版本说明（implementationVariant）**

function_call

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 18 |
| name | "music_search" |
| label | "音乐搜索·函数调用版" |
| category | "内容与媒体" |
| sourceId | "TOOLS-IO" |
| sameDefinitionAsRow | 17 |
| aliases | [{"name":"search_and_control_music","evidence":"历史指南","status":"旧名映射待核"}] |
| id | "TOOL17" |
| x | 190 |
| y | 39567 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL17 -->

<!-- tool-start:TOOL18 -->
### 表第 19 行 · 媒体播放与内容控制

工具名：`media_basic_control`

**接收什么（input）**

当前媒体的播放暂停、上下个、进度、倍速、收藏、画质、点赞关注等操作。

**内部处理／能力边界（mechanism）**

对已经存在的媒体会话执行控制，不能拿它代替搜歌或新内容搜索。K歌点播与模式属于系统设置，避免两条工具同时抢同一应用。下游返回具体函数与执行状态。

**交回什么结果（output）**

函数、状态与原因；可说明已是当前状态、未登录或执行失败。

**异常、限制与用户下一步（exception）**

无回包勿重复；当前没有可控制媒体、应用不支持等需具体接口判断。已是目标状态不要宣称又完成了一次新变化。

**适用范围与状态（status）**

标准化PRD必选；支持操作由当前媒体供应商和车型决定。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 19 |
| name | "media_basic_control" |
| label | "媒体播放与内容控制" |
| category | "内容与媒体" |
| sourceId | "TOOLS-IO" |
| id | "TOOL18" |
| x | 3710 |
| y | 39567 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL18 -->

<!-- tool-start:TOOL31 -->
### 表第 32 行 · 播客/听书长音频搜索

工具名：`broadcast_search`

**接收什么（input）**

喜马拉雅播客、听书或长音频；可筛选、换一批、选第几个，须关联上一轮真实结果。

**内部处理／能力边界（mechanism）**

下游在喜马拉雅内搜索并按选择播放，不是小宇宙，也不等于AI生成新播客。用户追问第二条时，要保留前次候选；没有前次列表不能随意映射。

**交回什么结果（output）**

找到并播放、没找到、错误、未同意隐私协议等；多轮名称不匹配或序号越界明确失败。

**异常、限制与用户下一步（exception）**

未同意协议需交用户合法授权；没找到或列表越界不能编内容。是否再次检索由Director按原因判断，不把所有失败统一重试。

**适用范围与状态（status）**

标准化PRD可选；供应商边界为本表喜马拉雅。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 32 |
| name | "broadcast_search" |
| label | "播客/听书长音频搜索" |
| category | "内容与媒体" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"search_and_control_broadcast","evidence":"历史指南","status":"旧名映射待核"}] |
| id | "TOOL31" |
| x | 7230 |
| y | 42741 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL31 -->

## 身份与记忆

<!-- tool-start:TOOL19 -->
### 表第 20 行 · 用户记忆检索

工具名：`user_memory_search`

**接收什么（input）**

需要查谁的什么记忆，给具体姓名和必要关键词/时间；例如合法范围内查询昨天去的地点。

**内部处理／能力边界（mechanism）**

先核FaceID与账号/在场人范围，再检索候选并按相关性过滤。它是Context预取之外的显式补查路线，不是每轮必调；结果经feedback回Director，不能由检索层直接执行导航。

**交回什么结果（output）**

已识别人时返回具体记忆或明确没查到；身份未知不能查私人记忆。

**异常、限制与用户下一步（exception）**

没查到、未注册、授权关闭和服务异常要分开。不能从另一人的记忆补造目标，也不能把召回相关性当真实性保证。

**适用范围与状态（status）**

标准化PRD必选；具体隐私与开关规则按记忆新版本。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 20 |
| name | "user_memory_search" |
| label | "用户记忆检索" |
| category | "身份与记忆" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","MEMORY-PRD","MEMORY-ONEPAGE"] |
| aliases | [{"name":"search_user_memory","evidence":"历史指南","status":"旧名映射待核"}] |
| id | "TOOL19" |
| x | 7230 |
| y | 39567 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL19 -->

<!-- tool-start:TOOL20 -->
### 表第 21 行 · 基础记忆操作

工具名：`user_memory_operate`

**接收什么（input）**

明确要记录/更新哪个人的什么事实；纠正旧事实需把新内容写清，不确定内容先确认。

**内部处理／能力边界（mechanism）**

旧工具表支持增改并明确不支持删除；10/19记忆PRD v1.10新增车主语音删除语义/情景需求，批量由Director二次确认。两者存在版本差异，不能一口咬定永不删除或已经全量可删。生成异步，受理后还需核success与可召回。

**交回什么结果（output）**

未注册FaceID、说话人/位置未识别或异常有不同提示；记忆生成内容未必同步显示。

**异常、限制与用户下一步（exception）**

不能越权改他人记忆；关闭授权先说明与询问。新删除接口/上线范围待核，删除后还须联动画像，不能只删页面展示。

**适用范围与状态（status）**

标准化PRD必选；新增语音删除需求与旧表待对齐，未获全车型上线证明。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 21 |
| name | "user_memory_operate" |
| label | "基础记忆操作" |
| category | "身份与记忆" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","MEMORY-PRD","MEMORY-TEST"] |
| aliases | [{"name":"operate_user_memory","evidence":"历史指南","status":"旧名映射待核"}] |
| states | ["准入确认","操作已受理","异步生成/删除处理中","成功可用/失败"] |
| id | "TOOL20" |
| x | 10750 |
| y | 39567 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL20 -->

<!-- tool-start:TOOL21 -->
### 表第 22 行 · 人脸身份注册与管理

工具名：`face_id_register`

**接收什么（input）**

注册、改名、改关系或查询；注册必须有昵称和当前座位，不能只说记住这个人。

**内部处理／能力边界（mechanism）**

按座位定位实际人脸，再与姓名/关系建立记录；同脸异名、多人同名和空座有独立业务判断。删除在本表要求去手动设置，不能与记忆内容删除混成同一个能力，更不能把人脸注册当声纹鉴权。

**交回什么结果（output）**

未登录、缺字段、重名、多名、未识别人脸、同脸异名、空座等分别失败或需补问。

**异常、限制与用户下一步（exception）**

字段不足先澄清，不猜名字/座位。身份记录成功还要验证乘客同步和后续记忆关联，不等于已有车辆高权限。

**适用范围与状态（status）**

标准化PRD必选；端侧生物特征和云端标识边界按项目。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 22 |
| name | "face_id_register" |
| label | "人脸身份注册与管理" |
| category | "身份与记忆" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","ACCOUNT-ONEPAGE"] |
| id | "TOOL21" |
| x | 190 |
| y | 40625 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL21 -->

<!-- tool-start:TOOL37 -->
### 表第 38 行 · 个性化技能规则记录

工具名：`personal_skill_record`

**接收什么（input）**

指南定义op=add/update/delete、skill_name、skill_content；修改/删除必须有真实skill_id，新增由系统分配。

**内部处理／能力边界（mechanism）**

记录用户未来交互规则，不等于立刻执行车控。skill_content应包含触发条件和执行规则；优先更新已有同类规则避免重复。工具表I/J空，但动态示例指南给出了提示词合同，不能据空表断言没有机制。

**交回什么结果（output）**

表输出栏空；新增ID返回、实际存储、生效时机与删除结果需接口确认。指南对更新完整内容/仅修改内容存在不一致。

**异常、限制与用户下一步（exception）**

别把用户临时指令全部沉淀成长期技能；身份、权限、重复规则冲突与未来执行触发路径未充分确认，需要专项评审。

**适用范围与状态（status）**

40行表有条目，指南有合同；实际发布、存储和生效链路未核实。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 38 |
| name | "personal_skill_record" |
| label | "个性化技能规则记录" |
| category | "身份与记忆" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","DYNAMIC-EXAMPLE"] |
| states | ["用户规则理解","操作受理","保存/更新/删除结果待接口确认","后续生效待验收"] |
| id | "TOOL37" |
| x | 190 |
| y | 44857 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL37 -->

## 内容生成与记录

<!-- tool-start:TOOL27 -->
### 表第 28 行 · 录音纪要

工具名：`audio_record`

**接收什么（input）**

开始、停止或查看录音纪要；具体会议/录音对象按当前会话状态确定。

**内部处理／能力边界（mechanism）**

Director下发控制→车端开始/停止采集→结束后上传离线音频→创建总结任务→生成结束/失败回传→卡片展示。录制中、音频上传、生成中、纪要可查看是不同阶段。端侧V2最多10个本地文件、上传成功才删除。

**交回什么结果（output）**

表列8类：开始成功/失败/已有录音，结束成功/失败/未录音，查看成功/失败；后续纪要生成状态另回。

**异常、限制与用户下一步（exception）**

老方案明确下电可能使文件未上传，分片上传仍TODO；不能把停止录音当纪要已生成。异步通知是否到手机在老方案有限制，按当前项目确认。

**适用范围与状态（status）**

标准化PRD可选；一期服务端方案为离线文件总结，不是实时全文纪要。

**后续交接（next）**

控制反馈走E；生成完成卡片/通知按项目异步链路，不以受理作最终完成。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 28 |
| name | "audio_record" |
| label | "录音纪要" |
| category | "内容生成与记录" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","AUDIO-SERVER","AUDIO-CLIENT"] |
| aliases | [{"name":"recording_minutes","evidence":"历史指南","status":"旧名/新名映射待核"}] |
| states | ["未录音","录音中","上传中","生成中","结果可见/失败"] |
| id | "TOOL27" |
| x | 7230 |
| y | 41683 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL27 -->

<!-- tool-start:TOOL28 -->
### 表第 29 行 · 图片生成与续改

工具名：`image_generate`

**接收什么（input）**

文生图描述；或基于此前图片继续编辑，需能定位实际图片资源与第几张。

**内部处理／能力边界（mechanism）**

外层Director交生图请求，Creation Agent内部选择文生图/编辑等工具；输入输出资源与历史关联。云方案要求即便本轮被打断，完成图片仍可经Frontier异步送端；端侧负责加载、放大、翻页和失败占位。

**交回什么结果（output）**

“这就生成”只是受理；后续生成成功、部分成功或失败，实际图片上屏才构成用户可见结果。

**异常、限制与用户下一步（exception）**

一期端上传图尚未覆盖；端方案同用户1任务，超时仍写X秒，不能编统一值。部分失败展示成功图及失败占位；网络异常要明确。

**适用范围与状态（status）**

标准化PRD可选；多图/图生图/多轮范围要按期次核实，不由能力调研结论推全上线。

**后续交接（next）**

阶段事实回D；异步资源走客户端展示并核验。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 29 |
| name | "image_generate" |
| label | "图片生成与续改" |
| category | "内容生成与记录" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","IMAGE-SERVER","IMAGE-CLIENT"] |
| states | ["请求受理","生成中","部分成功/全部成功/失败","图片已展示"] |
| id | "TOOL28" |
| x | 10750 |
| y | 41683 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL28 -->

<!-- tool-start:TOOL32 -->
### 表第 33 行 · AI播客生成

工具名：`ai_broadcast_generate`

**接收什么（input）**

指定主题或长文内容，描述播客生成诉求和必要范围。

**内部处理／能力边界（mechanism）**

下游生成新播客，不是检索已有节目。工具返回的生成/播放承诺可能仍是过程状态，具体生成任务、资源完成和播放启动需分开核验；不能因第一段话术就宣称用户已听到成品。

**交回什么结果（output）**

“正在生成并播放”是受理或处理中，还有错误返回；最终资源和播放状态合同待项目补齐。

**异常、限制与用户下一步（exception）**

生成失败、耗时、取消后是否继续生成以及通知方式，本表未给完整机制；标需接口确认，不填通用秒数或重试次数。

**适用范围与状态（status）**

标准化PRD可选；实际生成/播放闭环需专项验收。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 33 |
| name | "ai_broadcast_generate" |
| label | "AI播客生成" |
| category | "内容生成与记录" |
| sourceId | "TOOLS-IO" |
| id | "TOOL32" |
| x | 10750 |
| y | 42741 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL32 -->

<!-- tool-start:TOOL34 -->
### 表第 35 行 · 用车报告

工具名：`car_log`

**接收什么（input）**

明确时间范围或事件，如上个月通勤、某次旅行或最近一年用车报告。

**内部处理／能力边界（mechanism）**

下游按范围组织用车数据生成报告。时间、车辆和账号边界要匹配，不能把全车历史都当当前乘客个人经历；生成流程与数据完整度依项目实现。

**交回什么结果（output）**

“正在生成”是受理，另有错误；报告真正生成并可见才是完成。

**异常、限制与用户下一步（exception）**

本表未给生成终态、超时、通知与重试完整合同，需确认；不能用受理话术或空白卡片替代成品验收。

**适用范围与状态（status）**

标准化PRD为上汽定制；结果闭环按客户实现。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 35 |
| name | "car_log" |
| label | "用车报告" |
| category | "内容生成与记录" |
| sourceId | "TOOLS-IO" |
| id | "TOOL34" |
| x | 3710 |
| y | 43799 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL34 -->

## 感知与知识

<!-- tool-start:TOOL29 -->
### 表第 30 行 · 视觉问答

工具名：`visual_qa`

**接收什么（input）**

车内外指定方向的人、车、建筑或物体问题；使用当前项目支持的拍摄与识别范围。

**内部处理／能力边界（mechanism）**

工具获取所需图像再理解并返回视觉信息。当前工具表明确不做屏幕理解、不上网，长时观察视频上汽不支持；历史指南曾描述屏幕能力，须按新表与项目分层。视觉取色氛围灯由氛围灯工具内部做，不应先VQA再调灯。

**交回什么结果（output）**

拿不到图、不支持方向、无LBS、无法识别分别明确返回；正常回识别事实与相关限制。

**异常、限制与用户下一步（exception）**

模型超时或异常表要求执行失败且勿重复。不能用一次不确定识别当身份鉴权，也不能以看图代替联网事实。

**适用范围与状态（status）**

标准化PRD可选；车型/方向/屏幕/长时视频范围不同。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 30 |
| name | "visual_qa" |
| label | "视觉问答" |
| category | "感知与知识" |
| sourceId | "TOOLS-IO" |
| aliases | [{"name":"search_visual_info","evidence":"历史指南","status":"旧范围含屏幕，与当前表不同，不能无条件等价"}] |
| sourceIds | ["TOOLS-IO","DYNAMIC-EXAMPLE"] |
| id | "TOOL29" |
| x | 190 |
| y | 42741 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL29 -->

## 生态与交易

<!-- tool-start:TOOL35 -->
### 表第 36 行 · 停车查费与付款入口

工具名：`parking_fee_pay`

**接收什么（input）**

工具表仅接受车牌号。先确认当前要查哪块车牌，不能把整段不确定语义直接传给接口。

**内部处理／能力边界（mechanism）**

技术方案：车牌无注册记录先绑定；过期或7天内到期先续期；有效才查订单、时长与费用。注册/续期失败不继续查费。返回payUrl由客户端呈现微信/支付宝二维码，用户扫码支付，不是AI自动扣款。

**交回什么结果（output）**

停车场、时长、金额和二维码/付款链接；无缴费记录、车牌注册失败带原因。订单状态需区分未付和已付。

**异常、限制与用户下一步（exception）**

技术名search_and_pay_parking_fee与标准名映射待核；第三方错误码、超时以最终协议为准。拿到二维码不宣称支付完成。

**适用范围与状态（status）**

标准化PRD可选；具体停车场覆盖和车牌授权需项目确认。

**后续交接（next）**

模型解释停车事实；二维码→用户扫码，支付结果另核。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 36 |
| name | "parking_fee_pay" |
| label | "停车查费与付款入口" |
| category | "生态与交易" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","PARKING-TECH"] |
| aliases | [{"name":"search_and_pay_parking_fee","evidence":"停车技术方案","status":"技术方案名，实际注册映射待核"}] |
| states | ["车牌待确认","注册/续期","查到订单/无订单","待用户扫码付款","已支付待真实状态证据"] |
| id | "TOOL35" |
| x | 7230 |
| y | 43799 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL35 -->

<!-- tool-start:TOOL36 -->
### 表第 37 行 · 美团餐厅服务

工具名：`meituan_restaurant_service`

**接收什么（input）**

餐厅全名；预订须日期时间、人数、包间/大厅、联系人；排队须人数/桌型，不套预订时间联系人。

**内部处理／能力边界（mechanism）**

先把第几家映射为真实POI，再按预订、排队、查询、修改或取消进入相应流程。未登录交用户手机美团扫码；需要定金时用户手机支付。缺必填信息由Director补问，不能编联系人或默认代付。

**交回什么结果（output）**

订单已提交等待商家不是确认预订；还需真实商家确认。取消有明确结果，若干其他输出格式表仍待弋途提供。

**异常、限制与用户下一步（exception）**

登录、支付、商家接单都是独立节点。失败/拒绝/待确认不能统一播“已订好”。最新PRD名restaurant_reserve与本表名需核别名或能力范围变化。

**适用范围与状态（status）**

表有较完整业务合同；标准化PRD为可选，当前项目可用及发布版本待核。

**后续交接（next）**

缺字段/人工接管/商家状态反馈→Director，卡片按结果展示。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 37 |
| name | "meituan_restaurant_service" |
| label | "美团餐厅服务" |
| category | "生态与交易" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","DT-PRD"] |
| aliases | [{"name":"restaurant_reserve","evidence":"标准化PRD","status":"新标准名与本表餐厅服务范围对应待核"}] |
| states | ["资料待补","待登录","待支付定金","已提交待商家","已确认/失败/取消"] |
| id | "TOOL36" |
| x | 10750 |
| y | 43799 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL36 -->

## 任务与跟进

<!-- tool-start:TOOL38 -->
### 表第 39 行 · 持续目标管理（Goal渠道）

工具名：`goal_list_update`

**接收什么（input）**

新增只传目标描述；删除传真实goal_id，多ID用逗号分隔。不是即时聊天/一次性车控工具。

**内部处理／能力边界（mechanism）**

按旧Goal协议新增或删除持续/定时目标，不支持修改；本表不接依赖视觉VLM的看宝宝/看窗外目标。最小循环1分钟、分钟级、365天内，模糊日期追问。“开5分钟空调”先查并按需开，Goal只负责5分钟后关。

**交回什么结果（output）**

创建中不能承诺成功；删除成功/失败要用实际目标ID。删除失败提示任务中心手动处理，不说已取消。

**异常、限制与用户下一步（exception）**

不能把新TaskService可更新/视觉任务能力套到本行。创建成功仅代表目标保存，后续条件生效、触发、执行、用户结果仍需跟进。

**适用范围与状态（status）**

适用于Goal渠道；最新PRD与task_agent并列一业务行，二者不是串行必经。

**后续交接（next）**

任务域按渠道接管；后续建议/触发结果回M→D。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| row | 39 |
| name | "goal_list_update" |
| label | "持续目标管理（Goal渠道）" |
| category | "任务与跟进" |
| sourceId | "TOOLS-IO" |
| sourceIds | ["TOOLS-IO","DT-PRD"] |
| states | ["目标待澄清/合理性检查","创建中","已创建待条件","触发后执行/失败","删除成功/失败"] |
| relatedDefinitions | ["task_agent"] |
| id | "TOOL38" |
| x | 3710 |
| y | 44857 |
| w | 2760 |
| h | 908 |

<!-- tool-end:TOOL38 -->

## 补充定义（6 项，不计入工具表 40 行）

<!-- tool-start:SUP01 -->
### 新任务管理工具

工具名：`task_agent`

**接收什么（input）**

完整时间/条件/持续目标，包含用户想何时做什么；更新取消指向已有任务。

**内部处理／能力边界（mechanism）**

最新Director PRD明确由task_agent解析条件与动作、向触发器注册；条件满足后带任务原文及触发事实回Director，更新时按需改注册/动作，取消时解注册并删除。详细生命周期交新TaskService，不能把旧Goal不支持修改/视觉的约束强套。

**交回什么结果（output）**

任务创建/更新/取消结果与后续触发、执行结果分开；具体状态枚举见任务域正式方案。

**异常、限制与用户下一步（exception）**

条件不可感知、不合理、动作不可执行或冲突时由Director先拦截/澄清；注册成功不等于目标完成。

**适用范围与状态（status）**

标准化PRD与goal_list_update合一业务行，按渠道新旧体系；上线以项目确认。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| name | "task_agent" |
| label | "新任务管理工具" |
| category | "PRD标准化补充，不计40行" |
| sourceId | "DT-PRD" |
| id | "SUP01" |
| x | 190 |
| y | 46115 |
| w | 2760 |
| h | 943 |

<!-- tool-end:SUP01 -->

<!-- tool-start:SUP02 -->
### 新标准化行程规划

工具名：`trip_planning`

**接收什么（input）**

行程规划诉求；具体参数合同需对应实现。

**内部处理／能力边界（mechanism）**

PRD列主线/赛力斯可选能力。与旧表trip_plan_record记录行程是否为替代或上层工具关系，现有证据不足，不仅凭名字认定同一实现。

**交回什么结果（output）**

具体阶段状态、候选、行程保存与异步任务完成回包待接口确认。

**异常、限制与用户下一步（exception）**

不能将口头规划等同保存，也不能将行程计划等同启动导航。

**适用范围与状态（status）**

PRD存在标准定义，完整工具协议待补，不宣称全部已上线。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| name | "trip_planning" |
| label | "新标准化行程规划" |
| category | "PRD标准化补充，不计40行" |
| sourceId | "DT-PRD" |
| id | "SUP02" |
| x | 3710 |
| y | 46115 |
| w | 2760 |
| h | 943 |

<!-- tool-end:SUP02 -->

<!-- tool-start:SUP03 -->
### 节目编排

工具名：`customised_playlist`

**接收什么（input）**

节目编排诉求，具体请求字段待正式tool合同核验。

**内部处理／能力边界（mechanism）**

PRD列主线/赛力斯可选；不是简单音乐搜索别名。当前未从已审正文取得编排状态、计划存储、播放接管和异常的完整机制，不做推测。

**交回什么结果（output）**

编排方案、消费调度、执行进度的具体格式待确认。

**异常、限制与用户下一步（exception）**

不能把推荐一组内容当已排入队列并开始按计划播放。

**适用范围与状态（status）**

标准化PRD列出；实现/发布和端到端结果待核。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| name | "customised_playlist" |
| label | "节目编排" |
| category | "PRD标准化补充，不计40行" |
| sourceId | "DT-PRD" |
| id | "SUP03" |
| x | 7230 |
| y | 46115 |
| w | 2760 |
| h | 943 |

<!-- tool-end:SUP03 -->

<!-- tool-start:SUP04 -->
### 餐厅订座标准名称

工具名：`restaurant_reserve`

**接收什么（input）**

PRD未给完整合同；表第37行meituan_restaurant_service提供预订/排队等详细定义。

**内部处理／能力边界（mechanism）**

不以拼写相似直接认定映射。需当前Agent注册配置确认是改名、范围收窄还是多个实现；复用第37行业务状态时保留版本依据。

**交回什么结果（output）**

提交等待商家与商家确认必须区分。

**异常、限制与用户下一步（exception）**

登录/定金由用户完成，不能自动代付或把待处理播成已订好。

**适用范围与状态（status）**

PRD标准化可选名，表名对应关系待核。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| name | "restaurant_reserve" |
| label | "餐厅订座标准名称" |
| category | "标准化名/别名待核，不计40行" |
| sourceId | "DT-PRD" |
| id | "SUP04" |
| x | 10750 |
| y | 46115 |
| w | 2760 |
| h | 943 |

<!-- tool-end:SUP04 -->

<!-- tool-start:SUP05 -->
### 实时卡片页面操作

工具名：`current_page_specific`

**接收什么（input）**

实时卡片id、标题、内容、按钮名、原因，由端侧请求带入。

**内部处理／能力边界（mechanism）**

每轮先检查real_time_card条件，存在时动态加载工具，Director选择真实按钮，返回select_button给端侧操作；一期条件源仅param，未来统一Context/Trigger不是现状。

**交回什么结果（output）**

透传选择结果；具体agent_id仍TBD。

**异常、限制与用户下一步（exception）**

当前卡片不存在、已变化、按钮不合法或权限不足不得猜；运行版本需核。

**适用范围与状态（status）**

10/22技术设计，不能据文档宣称全车型已上线。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| name | "current_page_specific" |
| label | "实时卡片页面操作" |
| category | "动态设计补充，不计40行" |
| sourceId | "DYNAMIC-TOOLS" |
| id | "SUP05" |
| x | 190 |
| y | 47208 |
| w | 2760 |
| h | 908 |

<!-- tool-end:SUP05 -->

<!-- tool-start:SUP06 -->
### 内心世界状态更新

工具名：`inner_thought_update`

**接收什么（input）**

type+content，类型包括价值观、人格特质、社会关系、近期目标、环境背景、当前情绪。

**内部处理／能力边界（mechanism）**

更新对应inner_thought变量用于后续Director推理与跨会话人格连续性；不是写用户基础记忆，也不是重新训练底层模型。

**交回什么结果（output）**

变量更新与后续推理使用；持久化/冲突/回滚等合同未明确。

**异常、限制与用户下一步（exception）**

本轮只证实工程需求定义，实际工具注册和上线、何时更新及与用户隐私边界需确认。

**适用范围与状态（status）**

独立工程需求，未计入工具表40行部署清单。

原始字段与来源（值按原 JSON 保留）：

| 原字段 | 原值 |
|---|---|
| name | "inner_thought_update" |
| label | "内心世界状态更新" |
| category | "工程需求补充，不计40行" |
| sourceId | "INNER-THOUGHT" |
| id | "SUP06" |
| x | 3710 |
| y | 47208 |
| w | 2760 |
| h | 908 |

<!-- tool-end:SUP06 -->

## 来源索引（保留原来源记录）

### DT-PRD · Director（对话推理引擎）PRD

[Director（对话推理引擎）PRD](https://bytedance.larkoffice.com/wiki/XRuKwJ0VPisdUhkxH0ecY1rRn9g)

**note**

v1.7，10/12；四输入、统一交互、33标准化业务行。需求与部署分开。

### MEMORY-ONEPAGE · Memory OnePage

[Memory OnePage](https://bytedance.larkoffice.com/wiki/KAAMwb7vsiHpd0k7PVPctGfKnHf)

**note**

区分已实现、规划、暂停；记忆服务独立与生命周期。

### MEMORY-PRD · 记忆系统

[记忆系统](https://bytedance.larkoffice.com/wiki/CbJVw4ACzilvvBkRxkqcQVfAnLh)

**note**

v1.11；v1.10于10/19新增语音删除要求，部署与旧表存在待对齐。

### MEMORY-TEST · AiCar 汽车记忆测试方案

[AiCar 汽车记忆测试方案](https://bytedance.larkoffice.com/wiki/MwYEwrYOMi5mfRkwqZHc1MyIn1e)

**note**

生成、打标、召回、删除、隐私和性能验收；目标待定项不补造。

### ACCOUNT-ONEPAGE · 账号/乘客 OnePage

[账号/乘客 OnePage](https://bytedance.larkoffice.com/docx/Y9sod55uXoWKkDxhDyMcRuNunid)

**note**

可信账号、车辆、乘客与权限边界；旧一对一绑定描述不可直接覆盖。

### DYNAMIC-TOOLS · 动态加载型工具

[动态加载型工具](https://bytedance.larkoffice.com/wiki/T8jDwzwO9iiNF0kbFEVc1uyrnIf)

**note**

10/22技术方案，一期param条件、实时卡片工具；agent_id等仍TBD。

### DYNAMIC-EXAMPLE · 动态示例解 bug 指南

[动态示例解 bug 指南](https://bytedance.larkoffice.com/wiki/LKSKwWCoJiE4SHk8xb7c842Dnrf)

**note**

静态/动态示例分工；附工具别名与personal_skill_record合同，不代表全部当前发布。

### MANUAL-TECH · 车书 QA 技术方案

[车书 QA 技术方案](https://bytedance.larkoffice.com/wiki/Vp7cwOgx5i49s8kIxHacd9Ggnkd)

**note**

Context前置Top3并禁用旧工具方案；与标准化PRD按项目/版本区分。

### PARKING-TECH · 停简单停车缴费工具技术方案

[停简单停车缴费工具技术方案](https://bytedance.larkoffice.com/wiki/M4MCwk9V0ihhETknqKtcYHiuneu)

**note**

注册/续期/查单/二维码；技术名search_and_pay_parking_fee与新标准化名映射待核。

### AUDIO-SERVER · 录音纪要接入技术方案

[录音纪要接入技术方案](https://bytedance.larkoffice.com/wiki/W5OewmeRJiqp9nk37P1cRCFYnKe)

**note**

录制、上传、异步总结、通知；下电丢上传与分片TODO。

### AUDIO-CLIENT · 录音纪要车控端技术方案 V2

[录音纪要车控端技术方案 V2](https://bytedance.larkoffice.com/wiki/Ul6HwfRV4iO3hbkH31JczjEenus)

**note**

3/11版本；开始/停止/查看，10个本地文件与上传后删除。

### IMAGE-SERVER · 生图云端技术方案

[生图云端技术方案](https://bytedance.larkoffice.com/wiki/MWVgwmcA9iq1KTk7yHZcWTgvnQh)

**note**

Creation Agent子流程、图片资源历史、打断后异步Frontier。

### IMAGE-CLIENT · 生图车机端技术方案

[生图车机端技术方案](https://bytedance.larkoffice.com/wiki/Rdd6wM1F8iT1iQkVpTdcdkmEnVg)

**note**

部分失败/全失败、单用户1任务，超时仍写X秒；不补造。

### CONTROL-DYNAMIC · 上汽车控动态参数

[上汽车控动态参数](https://bytedance.larkoffice.com/wiki/T8aPwWfBxipoZHk4MhGcrHKRnwf)

**note**

用户词典按车/渠道/车型，分隔符存在冲突。

### INNER-THOUGHT · 增加inner thought部分

[增加inner thought部分](https://bytedance.larkoffice.com/wiki/MkXMwWUari3Lmekc7Picurmwn7g)

**note**

人格变量更新工程需求；不纳入当前40行业务工具统计。

### TOOLS-IO · AI汽车下游工具输入输出整理

[AI汽车下游工具输入输出整理](https://bytedance.larkoffice.com/wiki/NxMVwYmqLijlubkKE54cVHfrnib?sheet=a471b5)

**note**

根代理10/23浏览器公式栏逐格核表第2–41行业务定义/反馈；40行含重复ID和弃用，不等于当前可调用工具数。

### DT-MEETING · AI汽车-产品宣讲3-DT 10/22文字记录

[AI汽车-产品宣讲3-DT 10/22文字记录](https://bytedance.larkoffice.com/docx/Is0mdygy3oQmEixHRUNcolvXnRb)

**note**

由根代理与旧研究逐字稿交叉使用：人人对话未接入、高德两项测试中；不据此泛化所有后续部署。
