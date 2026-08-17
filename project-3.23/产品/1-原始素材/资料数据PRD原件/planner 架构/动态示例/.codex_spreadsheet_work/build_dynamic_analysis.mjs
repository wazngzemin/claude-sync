import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/bytedance/Desktop/工作簿1.xlsx";
const outputDir = process.env.DYNAMIC_OUTPUT_DIR ?? "/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/planner 架构/动态示例/outputs/019fc6a1-b054-7f62-9424-21e3390f9d18";
const outputPath = process.env.DYNAMIC_OUTPUT_PATH ?? outputDir + "/工作簿1-全部114条动态示例.xlsx";
const mainPreviewPath = outputDir + "/全部114条动态示例-preview.png";
const auditPreviewPath = outputDir + "/全部114条动态示例-复核-preview.png";

const decisionsByRawRow = new Map([
  [1, '先结合历史对话和user_memory_search确认“那个车站”是否已有明确指代；没有就一次性追问“周六几点、去哪个车站接父母”，信息补齐后调用goal_list_update创建接站提醒，不重复追问同一信息。'],
  [66, '结合goal_list中“持续讲笑话直到用户开心”的目标，直接讲一个新的完整短笑话，不只承诺“再讲一个”；用户明确表示好笑后再调用goal_list_update结束该目标。'],
  [159, '结合上一轮会议录音状态，将“会议结束”改写为“结束录音并生成会议纪要”，调用audio_record；工具返回后反馈录音是否保存及纪要生成结果。'],
  [206, '拆分处理：env_info显示主驾阅读灯已开则无需重复操作，按speaker_position关闭对应车窗并调用vehicle_basic_control；本车未配置香氛系统，直接说明香氛无法调整。'],
  [379, '结合阅读灯状态：当前关闭就调用vehicle_basic_control打开；本车未配置香氛系统，直接说明无法关闭香氛，不生成香氛动作。'],
  [557, '能力边界未列明儿童危险动作检测，不把它改写成儿童锁；保留原话调用vehicle_basic_control尝试关闭，并按工具实际返回反馈。'],
  [698, '天窗是实体天窗，语音无法控制开合比例；直接告诉用户通过车顶物理按键把天窗开到一半，不调用工具。'],
  [777, '先调用user_memory_search查询用户已记录的奶粉快递状态；只能复述记忆中的状态并说明无法实时查物流，不能承诺到件提醒，用户提供到件信息和取件点后再处理导航。'],
  [889, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键打开，不调用工具，结论不受N档影响。'],
  [943, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键关闭，不调用工具，结论不受D档影响。'],
  [997, '“关闭天窗通风”仍是天窗开合意图，直接告诉用户通过车顶物理按键关闭，不调用工具；如果用户只是想减少通风，再单独处理车窗或空调。'],
  [1051, '无需改写，调用vehicle_system_settings打开导航账号登录页；若需要扫码、验证码或隐私确认，按工具返回引导用户在屏幕完成，操作不受说话人位置限制。'],
  [1114, '结合speaker_position和车门锁状态：主驾发话时调用vehicle_basic_control锁车门；右后等非主驾发话时提示车门锁由主驾操作，若env_info已有锁止状态则同时告知当前状态。'],
  [1193, '这是关闭系统弹窗，不是调整镜面角度：改写为“关闭后视镜方向调节弹窗”，调用vehicle_system_settings；若工具只返回设置页，按结果引导用户用方向盘按键调节镜面。'],
  [1247, '结合speaker_position定位座椅：主驾、副驾或后排分别改写为对应座椅加热调到1档，调用vehicle_basic_control；座椅加热最低为1档。'],
  [1324, '结合上一轮正在执行的尾门动作，将“暂停吧”改写为“暂停电动尾门”，调用vehicle_basic_control；没有明确进行中的设备动作时再追问要暂停什么。'],
  [1383, '结合档位状态：D档时不下发，告知需先停车挂P档；P档时改写为“打开雨刮维修模式”，调用vehicle_basic_control并按工具返回反馈。'],
  [1494, '结合speaker_position将目标定位为左后座椅；能力边界未列明形体自适应，无需推断前后排是否支持，保留原话调用vehicle_basic_control并按工具返回反馈。'],
  [1573, '这是政治历史问答，不调用车控；用中性、事实性语言解释“打倒共产党”作为反共政治口号的含义和历史语境，不延伸为现实行动动员，用户追问具体事件时再调用web_search核实。'],
  [1622, '改写为“查询以色列阻挡援助物资进入巴勒斯坦的最新事实与各方说法”，调用web_search；返回后区分已确认事实、争议说法和观点，保持中立并简要回答。'],
  [1671, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键打开，不调用工具。'],
  [1798, '这是通用用车方法问答，改写为“换季车内异味如何排查和处理”，调用vehicle_manual_qa；根据工具结果回答通风、滤芯和清洁建议，不虚构香氛或智能除味功能。'],
  [1893, '改写为“搜索徒步旅行攻略视频”，调用video_search；端状态未提供行车视频限制时不自行拦截，按工具返回播放或推荐第一条。'],
  [2021, '改写为“搜索扣篮教学视频”，调用video_search；端状态明确前排行驶受限时只完成搜索，不播放也不引导用户手动点击，停车后再播放。'],
  [2160, '结合当前选中视频和行车视频限制状态：限制未开启或未提供时改写为“播放当前视频”，调用media_basic_control；明确前排行驶受限时告知停车后播放。'],
  [2271, '把“喷跑吧兄弟”纠正为《奔跑吧兄弟》，改写为“用抖音搜索《奔跑吧兄弟》高能片段”，调用video_search；只有端状态明确前排视频受限时才转为先搜索、停车后播放。'],
  [2382, '这是车辆使用方法问答，改写为“雨刮器怎么打开和调节档位”，调用vehicle_manual_qa；按本车说明引导使用方向盘左侧拨杆，不调用车控。'],
  [2493, '结合上一轮image_generate的原始提示词和已生成图片：有明确上下文时改写为“按上一轮主题再生成几张不同构图”，调用image_generate；没有图片生成上下文时先问想继续生成什么，不凭记忆补画面风格。'],
  [2588, '“侧方停车”在本场景指一键贴边，改写为“帮我一键贴边”，调用auto_drive；工具成功后再反馈车辆已贴边停好。'],
  [2731, '先读env_info中的智驾和巡航状态，缺失时调用vehicle_status_search；主驾且巡航已开启时改写为“巡航速度提高5km/h”，调用auto_drive，未开启或非主驾时分别提示先用方向盘按键开启或由主驾操作，巡航范围30–130km/h且按5km/h调整。'],
  [2842, '结合speaker_position定位车窗：主驾发话时改写为“打开主驾车窗”，调用vehicle_basic_control；只有用户明确说“全部车窗”时才打开全车。'],
  [2969, '先读取goal_list：找到唯一的“关闭座椅加热”任务时按goal_id调用goal_list_update删除；没有匹配任务就直接告知当前没有该任务，多个相似任务时再让用户确认具体一个。'],
  [3082, '拆分并行：打开主驾座椅加热、打开主驾座椅按摩、打开空调和打开主驾车窗调用vehicle_basic_control；天窗是实体天窗，直接告知通过车顶物理按键操作。'],
  [3375, '合并重复意图，将“打开车窗、打开全部车、打开全部车窗”规整为“打开全部车窗”并调用vehicle_basic_control；音乐调用media_basic_control继续播放，视频调用video_search，天窗通过车顶物理按键操作，视频是否播放按行车视频限制状态处理。'],
  [3617, '把“我们的座椅加热”改写为“打开主驾和副驾座椅加热”，连同打开主驾车窗调用vehicle_basic_control；副驾观影模式调用vehicle_system_settings，行驶受限时按工具反馈停车后开启；天窗通过车顶物理按键操作。'],
  [3860, '拆分执行：主驾车窗调用vehicle_basic_control，非P档跳过主驾座椅后移；周杰伦歌曲调用music_search，音量结合当前音源调用vehicle_system_settings，剩余电量调用vehicle_status_search；先用poi_search找最近充电站，再将最近结果串行传给route_planning导航。'],
  [4106, '打开空调和主驾座椅加热调用vehicle_basic_control；“打开音乐”优先调用media_basic_control继续上次播放，没有可继续内容时再调用music_search推荐并播放。'],
  [4271, '主驾座椅加热和按摩调用vehicle_basic_control，屏幕亮度改写为100%并调用vehicle_system_settings；副驾小桌板能力未列明，保留原话调用vehicle_basic_control并按工具返回反馈。'],
  [4406, '合并为“关闭主驾和副驾座椅按摩、关闭空调、打开主驾车窗”，调用vehicle_basic_control；“车窗”未指定范围时按speaker_position只处理主驾车窗。'],
  [4594, '“正常胎压是多少”是本车型说明书规格问答，调用vehicle_manual_qa查询冷态推荐胎压；若用户还问当前是否正常，再读取env_info或调用vehicle_status_search比较，不用通用区间代替本车标准。'],
  [4721, '结合档位和speaker_position：主驾行驶中改写为“主驾温度降低1℃、风量提高1档并吹脸”，调用vehicle_basic_control并提醒尽快安全停车休息；P档时才可建议小睡，并可用goal_list_update设置唤醒提醒。'],
  [4832, '结合上文确认要重播《逐玉》第二集，不重新搜索多条视频；前排行驶中先告知停车后播放，满足播放条件时改写为“重播《逐玉》第二集”并调用media_basic_control。'],
  [4959, '拆成四项并行处理：车外语音音效1调用vehicle_system_settings，乘客监测摄像头调用vehicle_basic_control，删除行车记录第三张照片保留原话调用vehicle_basic_control并按返回反馈，空调滤芯剩余使用时长调用car_care_qa。'],
  [5208, '无需主观判断日历能否打开，改写为“打开日历应用”，调用vehicle_system_settings；按工具实际返回反馈。'],
  [5271, '改写为“用抖音搜索有意思的短视频”，调用video_search；env_info未提供行车视频限制状态时不自行拒绝，工具返回受限时再提示停车后播放。'],
  [5366, '先读巡航状态，缺失时调用vehicle_status_search；主驾且巡航已开启时改写为“巡航速度降低5km/h”，调用auto_drive，未开启或非主驾时分别提示先开启巡航或由主驾操作，巡航范围30–130km/h且按5km/h调整。'],
  [5509, 'env_info显示车窗开启，结合speaker_position改写为“关闭主驾车窗”，调用vehicle_basic_control隔绝外部噪声；不改成调低音量或播放白噪音。'],
  [5706, '先调用user_memory_search查询“上周六下午吃了什么”；查到就按记忆回答，查不到就明确说没有记录，不补造餐厅或菜品。'],
  [5803, '车内不能直接完成外卖下单：调用vehicle_system_settings打开美团，并保留“砂锅土豆粉、漕溪北路401号”供用户在应用内下单；不擅自添加卤蛋、辣度或其他菜品。'],
  [5850, '改写为“用抖音搜索做菜教学视频”，调用video_search；env_info未提供行车视频限制状态时不自行拦截，工具返回受限时只搜索并提示停车后播放。'],
  [5913, '先结合车内成员位置、年龄和各区温度：老人所在区域设为约25℃并避人吹，孩子所在区域使用低风量，相关空调和座椅调用vehicle_basic_control；孩子状态不明时调用visual_qa查看，明显烦躁再用简短互动安抚，不承诺一定不闹。'],
  [6063, '先调用vehicle_status_search查询电量和剩余续航，再调用route_planning规划到太原的高速优先路线；路线建立后调用poi_search搜索续航范围内的沿途快充站，选定后再串行调用route_planning添加途经点。'],
  [6235, '无需绕到用户记忆，直接调用broadcast_search打开播客收藏列表并播放用户收藏的节目；返回多个节目时按返回顺序播放第一项并播报节目名。'],
  [6396, '将“取消静音”“关闭屏幕亮度自动调节”分别调用vehicle_system_settings，将“保存当前行车记录仪录像”调用vehicle_basic_control；“掉头”属于人工驾驶，只反馈需用户自行操作方向盘，四项按工具返回分别反馈。'],
  [6566, '车内不能直接完成外卖下单：调用vehicle_system_settings打开美团让用户自行下单；若改为到店自取，调用poi_search搜索公司附近美式咖啡，用户选定门店后再调用route_planning。'],
  [6629, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键打开，不调用工具。'],
  [6683, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键关闭，不调用工具。'],
  [6737, '“关闭天窗通风”仍是天窗开合意图，直接告诉副驾通过车顶物理按键关闭，不调用工具；如果只是想减少通风，再单独处理副驾车窗或空调。'],
  [6791, '这是关闭系统弹窗，不是调整镜面角度：改写为“关闭后视镜方向调节弹窗”，调用vehicle_system_settings；操作不受左后说话位置影响。'],
  [6838, '结合speaker_position定位座椅：主驾发话时改写为“主驾座椅加热调到1档”，调用vehicle_basic_control；座椅加热最低为1档。'],
  [6915, '无需改写，调用vehicle_basic_control关闭便利进出；该功能按工具实际返回反馈，不因左后发话而直接拒绝。'],
  [6962, '雨刮档位需要方向盘左侧拨杆操作，直接告诉用户向上逐级拨到高速档；需要详细操作说明时调用vehicle_manual_qa。'],
  [7041, '结合speaker_position：主驾调用vehicle_basic_control关闭舒适制动；副驾或后排发话时提示驾驶类设置由主驾操作。'],
  [7104, 'advisor建议要合并处理：先称呼“王总”打招呼，再改写为“播放王总收藏的歌单”，调用media_basic_control，不调用music_search。'],
  [7146, '结合行车视频限制和观看位置：允许播放或观看位置为后排时，改写为“用腾讯视频播放李现的电视剧”，调用video_search；明确前排行驶受限时先搜索内容，停车后再播放。'],
  [7305, '先读取env_info中的实时胎压，当前已有右前1.53bar就不再查一次；再调用car_care_qa查询胎压报警处理建议，调用poi_search搜索附近充气点，用户选定后再调用route_planning。'],
  [7448, '改写为“用抖音搜索周杰伦最新MV”，调用video_search；明确前排行驶受限时只搜索，不播放也不引导手动点击，停车后再播放。'],
  [7591, '改写为“搜索王者荣耀猴子英雄教学视频”，调用video_search；端状态未提供行车视频限制时不自行拒绝，工具返回受限时再转为停车后播放。'],
  [7702, 'env_info显示P档且车速0km/h，改写为“用抖音播放周杰伦演唱会搞笑剪辑”，调用video_search，不按行驶场景拒绝。'],
  [7797, '先读智驾巡航状态，缺失时调用vehicle_status_search；主驾且巡航已开启时改写为“巡航速度降低5km/h”，调用auto_drive，未开启时提示先用方向盘按键开启，巡航范围30–130km/h且按5km/h调整。'],
  [7908, '改写为“打开雨天影像辅助”，调用vehicle_basic_control，并按工具实际返回反馈。'],
  [8058, '结合speaker_position和各车窗状态：目标位置车窗开启时改写为“关闭对应位置车窗”，调用vehicle_basic_control；目标车窗已关闭就直接告知当前状态，不重复下发。'],
  [8208, '人数、时间和餐厅类型已齐，直接改写为“预订海底捞四人座今晚七点”，调用restaurant_reserve；返回多个门店时再报门店让用户选择，其他缺失信息按工具反馈补问。'],
  [8305, '拆分并行：打开空调、打开主驾座椅加热、打开主驾座椅按摩、关闭前排车窗调用vehicle_basic_control；天窗是实体天窗，直接告知通过车顶物理按键操作。'],
  [8577, '屏幕调到右侧调用vehicle_system_settings；后排遮阳帘、主副驾按摩和全车车窗调用vehicle_basic_control，前排遮阳帘和天窗通过物理操作，后排不生成按摩动作。'],
  [8806, '结合speaker_position将后视镜、车窗和座椅定位到主驾，连同关闭后备箱分别调用vehicle_basic_control；天窗通过车顶物理按键操作，后备箱按工具下发并以返回结果反馈。'],
  [9042, '合并重复意图：关闭主驾按摩和加热、打开副驾按摩各调用vehicle_basic_control一次；关闭天窗通过车顶物理按键操作。'],
  [9292, '播放邓紫棋《泡沫》调用music_search；主副驾按摩、前排通风和全车车窗调用vehicle_basic_control，后排不生成按摩动作。'],
  [9478, '将“风量最大”规整为11档，改写为“打开空调、温度25℃、风量11档”，调用vehicle_basic_control。'],
  [9612, '连续相反操作按最终状态处理：前排车窗最终为关闭，只调用vehicle_basic_control关闭前排车窗；天窗通过车顶物理按键操作。'],
  [9876, '改写为“查询今天当前位置天气、温度、降水和湿度”，调用weather_search；返回后结合具体作物给播种建议，缺少作物时再追问作物类型。'],
  [9994, '结合speaker_position和驾驶权限：左后发话时先改写为“左后座椅通风1档、空调24℃低风量并避人吹”调用vehicle_basic_control；驾驶模式和能量回收由主驾控制，提示主驾可切换晕动舒缓并把能量回收调低，主驾发话时再直接下发。'],
  [10208, '导航改写为“导航到广州植物园，路线偏好少收费”，调用route_planning；前向碰撞辅助界面和窄道辅助功能状态灯调用vehicle_system_settings，空调制冷调用vehicle_basic_control，窄道功能按工具实际返回反馈。'],
  [10375, '打开空调调用vehicle_basic_control；结合当前媒体、导航和语音播放状态，只有一种音源时把“音量太低”改写为对应音量调高并调用vehicle_system_settings，多种音源同时存在时再确认，均未播放时调整语音音量。'],
  [10598, '先调用user_memory_search查找“清凉套餐”；查到后按记忆内容调用vehicle_basic_control，查不到就一次性询问套餐包含哪些操作，用户补充后再执行并可按明确要求记录。'],
  [10735, '改写为“用抖音搜索周杰伦最新MV”，调用video_search；env_info显示前排行驶中时只搜索不播放，停车后再播放。'],
  [10894, '无需主观判断邮箱是否安装，改写为“打开邮箱应用”，调用vehicle_system_settings；按工具实际返回反馈。'],
  [10957, '改写为“用抖音搜索有意思的短视频”，调用video_search；env_info未提供行车视频限制状态时不自行拒绝，工具返回受限时再提示停车后播放。'],
  [11020, '先读智驾巡航状态，缺失时调用vehicle_status_search；主驾且巡航已开启时改写为“巡航速度提高5km/h”，调用auto_drive，未开启时提示先用方向盘按键开启，巡航范围30–130km/h且按5km/h调整。'],
  [11163, '先调用user_memory_search查找喜欢或常去的地点；查到具体地址后调用route_planning导航，查不到就询问用户想去公园、商圈还是景点，不凭空补地点。'],
  [11258, '车牌已知时直接将车牌传给parking_fee_pay查询；车牌未知先询问车牌号，再调用parking_fee_pay。'],
  [11304, '这是轮流对唱约定，先简短确认“明白，你先唱，我接下一句”，本轮不调用工具；用户唱完一句后再接一句，不抢唱或一次唱完整段。'],
  [11376, '先调用visual_qa查看前方树荫下的地面空车位，找到后调用auto_drive泊入；看不到车位时调用poi_search搜索附近停车场，用户选定后再调用route_planning。'],
  [11555, 'advisor描述的是环境事件：主驾在位时将“打开后雾灯”调用vehicle_basic_control，并把“打开湿滑模式”改写为“驾驶模式切换为雪地模式”后调用vehicle_basic_control；主驾不在位时只提醒，按工具返回反馈。'],
  [11836, '结合speaker_position改写为“打开主驾车窗”，调用vehicle_basic_control；本车未配置香氛系统，直接说明香氛无法调整，不追问开启、关闭或档位。'],
  [12006, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键打开，不调用工具。'],
  [12085, '先调用user_memory_search查询通勤时长和内容偏好；有明确偏好时按“播客用broadcast_search、音乐用music_search”编排并串行播放，没有偏好时一次性询问通勤时长和想听的内容，不承诺创建永久节目单。'],
  [12181, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键打开，不调用工具。'],
  [12235, '天窗是实体天窗，当前没有语音控制；直接告诉用户通过车顶物理按键关闭，不调用工具。'],
  [12289, '“打开天窗通风”仍是天窗开合意图，直接告诉右后乘客通过车顶物理按键操作，不调用工具；若只是想通风，可改为打开右后车窗或调整空调。'],
  [12336, '“天窗停一下”指暂停正在进行的实体天窗动作，语音无法控制；直接告诉用户通过车顶物理按键暂停，不调用工具。'],
  [12390, '人脸工具只支持注册和改名，不支持删除；不调用face_id_register，调用vehicle_system_settings打开账号与隐私设置，若工具没有对应入口则按返回引导用户在账号中心手动处理。'],
  [12675, '改写为“搜索鸽子消失魔术第三部解密视频”，调用video_search；env_info未提供行车视频限制状态时不自行拒绝，工具返回受限时再转为停车后播放。'],
  [12754, '结合speaker_position和档位：主驾且P档时改写为“关闭近光灯”，调用vehicle_basic_control；非P档或非主驾时分别提示先停车挂P档或由主驾操作。'],
  [12897, '把座椅定位到主驾，改写为“打开主驾座椅加热和按摩、空调26℃风量3档、打开主驾车窗”，调用vehicle_basic_control；天窗通过车顶物理按键操作。'],
  [13685, '打开主驾车窗、关闭主驾座椅按摩和加热调用vehicle_basic_control，氛围灯调成蓝色调用ambient_light_control；天窗通过车顶物理按键操作。'],
  [13922, '改写为“打开空调并调到25℃、打开主驾座椅按摩”，调用vehicle_basic_control；天窗通过车顶物理按键操作。'],
  [14079, '结合speaker_position改写为“打开主驾座椅按摩、主驾座椅通风和主驾车窗”，调用vehicle_basic_control；天窗通过车顶物理按键操作。'],
  [14268, '改写为“打开全部车窗、关闭空调送风”，调用vehicle_basic_control；天窗通风需要通过车顶物理按键操作。'],
  [14411, '改写为“查询当前位置今晚天气、云量和降水”，调用weather_search；根据返回的云量、能见度和天气判断能否看到月亮，不直接凭白天天气回答。'],
  [14554, '结合上一轮媒体类型和行车视频限制状态：若刚才是视频且前排行驶受限，提示停车后重播；其他情况改写为“重播当前媒体”，调用media_basic_control。'],
  [14681, '改写为“打开全部车窗”，调用vehicle_basic_control；天窗是实体天窗，直接告知通过车顶物理按键打开。'],
  [14831, '改写为“搜索川西自驾攻略视频”，调用video_search；env_info未提供行车视频限制状态时不自行拒绝，工具返回受限时先搜索并提示停车后播放。'],
  [14942, '先读智驾巡航状态，缺失时调用vehicle_status_search；主驾且巡航已开启时改写为“巡航速度提高5km/h”，调用auto_drive，未开启时提示先用方向盘按键开启，巡航范围30–130km/h且按5km/h调整。'],
]);

const inputBlob = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(inputBlob);
const rawSheet = workbook.worksheets.getItem("Sheet1");
const rawValues = rawSheet.getUsedRange().values;

const dynamicRecords = [];
for (let r = 0; r < rawValues.length; r++) {
  const row = rawValues[r] ?? [];
  if (row[2] !== "动态示例") continue;
  dynamicRecords.push({
    no: dynamicRecords.length + 1,
    rawRow: r + 1,
    query: String(row[0] ?? ""),
    decision: decisionsByRawRow.get(r + 1),
    issue: String(row[5] ?? ""),
    note: String(row[6] ?? ""),
    soundArea: String(row[14] ?? ""),
    env: String(row[17] ?? ""),
    logId: String(row[8] ?? ""),
  });
}

if (dynamicRecords.length !== 114) throw new Error("Expected 114 dynamic records, got " + dynamicRecords.length);
if (decisionsByRawRow.size !== 114) throw new Error("Expected 114 decisions, got " + decisionsByRawRow.size);
const missing = dynamicRecords.filter((record) => !record.decision);
if (missing.length) throw new Error("Missing decisions for raw rows: " + missing.map((r) => r.rawRow).join(", "));
const extra = [...decisionsByRawRow.keys()].filter((rawRow) => !dynamicRecords.some((record) => record.rawRow === rawRow));
if (extra.length) throw new Error("Decision rows not found in input: " + extra.join(", "));

const mainSheetName = "动态示例-决策分析";
const auditSheetName = "动态示例-复核";
for (const name of [mainSheetName, auditSheetName]) {
  const existing = workbook.worksheets.items.find((sheet) => sheet.name === name);
  if (existing) existing.delete();
}

const main = workbook.worksheets.add(mainSheetName);
main.showGridLines = false;
main.getRange("A1:B1").merge();
main.getRange("A1").values = [["全部114条动态示例决策分析"]];
main.getRange("A2:B2").merge();
main.getRange("A2").values = [["范围：工作簿1中全部 C列=动态示例 的记录，114/114 覆盖。每条只保留 Query 和可独立执行的决策分析；原始 Sheet1 保留不改。"]];
main.getRange("A4:B4").values = [["Query", "决策分析（入库原文）"]];
main.getRange("A5:B" + (4 + dynamicRecords.length)).values = dynamicRecords.map((record) => [record.query, record.decision]);
main.getRange("A1:B1").format = {
  fill: "#1F4E78",
  font: { typeface: "宋体", fontSize: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
main.getRange("A2:B2").format = {
  fill: "#EAF2F8",
  font: { typeface: "宋体", fontSize: 10, color: "#334155" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
};
main.getRange("A4:B4").format = {
  fill: "#5B9BD5",
  font: { typeface: "宋体", fontSize: 11, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};
main.getRange("A5:B" + (4 + dynamicRecords.length)).format = {
  font: { typeface: "宋体", fontSize: 10, color: "#1F2937" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } },
};
main.getRange("A1:B1").format.rowHeight = 30;
main.getRange("A2:B2").format.rowHeight = 42;
main.getRange("A4:B4").format.rowHeight = 30;
main.getRange("A5:A" + (4 + dynamicRecords.length)).format.columnWidth = 44;
main.getRange("B5:B" + (4 + dynamicRecords.length)).format.columnWidth = 108;
main.getRange("A5:B" + (4 + dynamicRecords.length)).format.rowHeight = 88;
main.freezePanes.freezeRows(4);
const mainTable = main.tables.add("A4:B" + (4 + dynamicRecords.length), true, "AllDynamicDecisionAnalysis");
mainTable.style = "TableStyleMedium2";

const audit = workbook.worksheets.add(auditSheetName);
audit.showGridLines = false;
audit.getRange("A1:H1").merge();
audit.getRange("A1").values = [["动态示例来源复核（114/114）"]];
audit.getRange("A2:H2").merge();
audit.getRange("A2").values = [["该表用于核对每条动态示例的原始行、质检问题和端状态，不作为 SP 入库内容。"]];
audit.getRange("A4:H4").values = [["序号", "原表行", "Query", "质检问题", "质检备注", "音区", "env_info", "log_id"]];
audit.getRange("A5:H" + (4 + dynamicRecords.length)).values = dynamicRecords.map((record) => [
  record.no,
  record.rawRow,
  record.query,
  record.issue,
  record.note,
  record.soundArea,
  record.env,
  record.logId,
]);
audit.getRange("A1:H1").format = {
  fill: "#1F4E78",
  font: { typeface: "宋体", fontSize: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
audit.getRange("A2:H2").format = {
  fill: "#EAF2F8",
  font: { typeface: "宋体", fontSize: 10, color: "#334155" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
};
audit.getRange("A4:H4").format = {
  fill: "#70AD47",
  font: { typeface: "宋体", fontSize: 11, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
audit.getRange("A5:H" + (4 + dynamicRecords.length)).format = {
  font: { typeface: "宋体", fontSize: 9, color: "#1F2937" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  wrapText: true,
  borders: { insideHorizontal: { style: "thin", color: "#E5E7EB" } },
};
audit.getRange("A1:H1").format.rowHeight = 30;
audit.getRange("A2:H2").format.rowHeight = 38;
audit.getRange("A4:H4").format.rowHeight = 30;
audit.getRange("A5:H" + (4 + dynamicRecords.length)).format.rowHeight = 60;
audit.getRange("A5:A" + (4 + dynamicRecords.length)).format.columnWidth = 7;
audit.getRange("B5:B" + (4 + dynamicRecords.length)).format.columnWidth = 10;
audit.getRange("C5:C" + (4 + dynamicRecords.length)).format.columnWidth = 42;
audit.getRange("D5:E" + (4 + dynamicRecords.length)).format.columnWidth = 28;
audit.getRange("F5:F" + (4 + dynamicRecords.length)).format.columnWidth = 10;
audit.getRange("G5:G" + (4 + dynamicRecords.length)).format.columnWidth = 42;
audit.getRange("H5:H" + (4 + dynamicRecords.length)).format.columnWidth = 27;
audit.freezePanes.freezeRows(4);
const auditTable = audit.tables.add("A4:H" + (4 + dynamicRecords.length), true, "AllDynamicDecisionAudit");
auditTable.style = "TableStyleMedium4";

await fs.mkdir(outputDir, { recursive: true });
const mainPreview = await workbook.render({ sheetName: mainSheetName, range: "A1:B14", scale: 1, format: "png" });
await fs.writeFile(mainPreviewPath, new Uint8Array(await mainPreview.arrayBuffer()));
const auditPreview = await workbook.render({ sheetName: auditSheetName, range: "A1:H12", scale: 1, format: "png" });
await fs.writeFile(auditPreviewPath, new Uint8Array(await auditPreview.arrayBuffer()));

const mainText = main.getUsedRange().values.flat().filter((value) => typeof value === "string").join("\n");
const checks = {
  sourceDynamicRows: dynamicRecords.length,
  decisionRows: decisionsByRawRow.size,
  missingRows: missing.length,
  extraRows: extra.length,
  forbiddenWordingCells: /勿|禁止/.test(mainText),
  formulaErrorText: /#REF!|#DIV\/0!|#VALUE!|#NAME\\?|#N\/A/.test(mainText),
  firstRawRow: dynamicRecords[0].rawRow,
  lastRawRow: dynamicRecords[dynamicRecords.length - 1].rawRow,
};
console.log("=== CHECKS ===");
console.log(JSON.stringify(checks, null, 2));

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: mainSheetName,
  range: "A1:B12",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 2,
  tableMaxCellChars: 320,
  maxChars: 16000,
});
console.log("=== INSPECT ===");
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log("=== FORMULA ERRORS ===");
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log("SAVED " + outputPath);
console.log("MAIN_PREVIEW " + mainPreviewPath);
console.log("AUDIT_PREVIEW " + auditPreviewPath);
