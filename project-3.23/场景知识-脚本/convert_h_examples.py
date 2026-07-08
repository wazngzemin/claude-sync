import openpyxl

wb = openpyxl.load_workbook('场景知识（saic）_数据总览.xlsx')
ws = wb.active

h_new = {}

# ============================================================
# ROW 2: DRV-01-01-01 陪伴安抚 (原8条→3条)
# ============================================================
h_new[2] = """1. 获取信息：
从用户语音提取孩子称呼和位置，结合记忆中孩子年龄、偏好匹配内容。缺少关键信息只补问一句。
2. 判断可用娱乐方式：
前排推荐语音游戏、儿歌、故事等不依赖屏幕的内容。后排有屏可推动画、短视频。位置不明不假设屏幕能力，推荐通用音频内容。给出1-2个选项。
3. 确认后执行：
明确指定内容直接执行。涉及视频/大音量简短确认。孩子安静后减少打扰，保持轻量播放。

示例1：
input:{"query":"给我儿子放点东西看","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"[温柔] 宝贝喜欢恐龙对吧，后排屏给他放一集益智恐龙动画，音量调低不影响你导航。","actions":[{"id":"1","params":{"query":"搜索恐龙益智动画 后排屏播放"},"tool":"search_and_control_short_video"},{"id":"2","params":{"query":"后排音量调低到10"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"query":"孩子闹着太无聊了","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"[温柔] 副驾不能看屏幕哦，我来给他出几个简单小谜语，轻松玩一会安静下来吧。","actions":[]}

示例3：
input:{"query":"放个汪汪队","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好嘞，后排屏给宝贝播上了。","actions":[{"id":"1","params":{"query":"搜索汪汪队动画 后排屏播放"},"tool":"search_and_control_short_video"}]}"""

# ============================================================
# ROW 3: DRV-01-01-02 后排观影 (原8条→3条)
# ============================================================
h_new[3] = """1. 获取信息：
识别用户娱乐需求和位置，查询记忆中观影偏好。缺少偏好仅做单次补问。
2. 生成方案：
基于偏好推荐或精选1-2部适配后排大屏的内容，严格排除快速剪辑、眩晕感强的内容。
3. 确认执行：
明确指定直接播放。不满意换全新内容。关屏直接执行不追问。

示例1：
input:{"query":"帮我找点片子打发下路上时间","speaker":"小慧","zone":"二排右"}
output:{"speak":"yes","content":"你平时喜欢科幻类，给你选一部口碑不错的科幻大片，后排屏直接放？","actions":[]}

示例2：
input:{"query":"打开后排屏看点综艺","speaker":"小慧","zone":"二排右"}
output:{"speak":"yes","content":"好嘞，给你放热门慢节奏综艺，适配后排大屏。","actions":[{"id":"1","params":{"query":"搜索热门慢节奏综艺"},"tool":"search_and_control_short_video"}]}

示例3：
input:{"query":"关掉后排屏幕，不看了","speaker":"小慧","zone":"二排右"}
output:{"speak":"yes","content":"好的。","actions":[{"id":"1","params":{"query":"关闭后排屏幕"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 4: DRV-01-01-03 前排观影驻车 (原8条→3条)
# ============================================================
h_new[4] = """1. 获取信息→判断条件：
明确驻车观影意图，确认车辆驻车安全条件。行驶中拒绝前排视频。
2. 生成方案→执行：
有偏好匹配推荐，无偏好给1-2个选项。驻车可同步营造环境（遮阳帘+氛围灯）。
3. 播放中监测：
驻车制动解除或挡位切换→立即暂停播放并提示。

示例1：
input:{"query":"等人无聊，放部电影打发时间","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"[开心] 驻车状态安心看，座椅微调一下，遮阳帘拉上，你想看什么类型？","actions":[{"id":"1","params":{"query":"关闭遮阳帘"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"query":"前排能看视频吗","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"行驶中前排不能播放视频哦，等车辆停稳驻车后再看，先给你放点音乐？","actions":[]}

示例3：
input:{"query":"换个轻松点的电影","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，给你换一部节奏舒缓的高分影片。","actions":[{"id":"1","params":{"query":"搜索轻松舒缓高分电影"},"tool":"search_and_control_short_video"}]}"""

# ============================================================
# ROW 5: DRV-01-01-04 急速降温 (原8条→3条)
# ============================================================
h_new[5] = """1. 启动降温流程：
检测车内温度超出舒适阈值，自动空调最大制冷+座椅通风+全车车窗天窗打开，强化对流散热。
2. 动态调整：
行车中根据车速区间调整车窗开度（低速大开，高速收窄），平衡降温与风噪。
3. 温度达标后：
车内温度降至舒适区间，自动关闭车窗天窗，空调切换恒温模式，座椅通风保持中档。

示例1：
input:{"query":"热死了，快降降温","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"[关心] 车里确实热，空调最大制冷和座椅通风全开了，窗户也打开对流，两分钟就凉快。","actions":[{"id":"1","params":{"query":"空调制冷最大风量16度"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"主驾座椅通风3档"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"全车车窗全开"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"query":"风噪太大了，把窗户关小一点","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好的，窗户给你调小了。","actions":[{"id":"1","params":{"query":"全车车窗调至10%开度"},"tool":"vehicle_basic_control"}]}

示例3：
input:{"advisor":"车内温度已降至26℃舒适区间"}
output:{"speak":"yes","content":"车内凉快了，窗户给你关上，切回正常制冷模式。","actions":[{"id":"1","params":{"query":"关闭全车车窗"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"空调自动模式24度"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 6: DRV-01-01-05 急速升温 (原4条→3条)
# ============================================================
h_new[6] = """1. 启动核心功能：
开启空调制热+座椅加热+方向盘加热，按车内初始温度分级适配参数，同步内循环加速升温。
2. 协同调节：
统筹空调、加热、风道、除雾多系统联动，关注启动顺序和强度调节。
3. 动态监控：
关注车内温度变化，适时调整参数，温度稳定后降档切换常规模式。

示例1：
input:{"query":"冻死了","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"[关心] 这也太冷了，暖气全开了，座椅加热和方向盘加热也给你安排上。","actions":[{"id":"1","params":{"query":"空调制热28度最大风量"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"主驾座椅加热3档"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"方向盘加热开启"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"query":"手好冰","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"方向盘加热给你开了，暖暖手。","actions":[{"id":"1","params":{"query":"方向盘加热开启"},"tool":"vehicle_basic_control"}]}

示例3：
input:{"advisor":"车内温度已升至22℃"}
output:{"speak":"yes","content":"暖和多了吧，座椅加热给你降到1档，空调调到24度保持着。","actions":[{"id":"1","params":{"query":"主驾座椅加热1档"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"空调24度自动模式"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 7: DRV-01-01-06 座椅调节 (原5条→3条)
# ============================================================
h_new[7] = """1. 获取信息：
识别座椅舒适诉求或抱怨，覆盖明确表达和模糊不适表达。
2. 确定调节方向：
基础物理调节（靠背角度、坐垫高度、腰部支撑等）+ 功能调节（按摩、通风、加热）组合方案。
3. 综合调节：
根据用户反馈微调，直到满意。

示例1：
input:{"query":"坐久了腰酸","speaker":"乘客","zone":"副驾驶位"}
output:{"speak":"yes","content":"按摩给你开着，腰部重点按一下。","actions":[{"id":"1","params":{"query":"副驾座椅按摩2档"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"query":"有点冷","speaker":"乘客","zone":"副驾驶位"}
output:{"speak":"yes","content":"座椅加热给你开了，暖一下。","actions":[{"id":"1","params":{"query":"副驾座椅加热2档"},"tool":"vehicle_basic_control"}]}

示例3：
input:{"query":"太热了屁股出汗","speaker":"乘客","zone":"副驾驶位"}
output:{"speak":"yes","content":"通风给你开了。","actions":[{"id":"1","params":{"query":"副驾座椅通风2档"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 8: DRV-01-01-07 5D影院 (原4条→3条)
# ============================================================
h_new[8] = """1. 获取信息：
实时采集影片音频信号与画面内容，解析剧情节奏、场景氛围、音效强弱。
2. 多系统联动：
联动座椅振子、氛围灯、香氛系统，调整影院音效，关闭车窗和遮阳帘，多设备一体化协同。
3. 精准匹配场景：
针对动作、悬疑、温情等不同场景，匹配对应震动幅度、灯光色彩、香氛香型及音效模式。

示例1：
input:{"query":"看个5D电影","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，车窗遮阳帘都给你关上，音效切影院模式了，准备好了吗？","actions":[{"id":"1","params":{"query":"关闭全车车窗"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"关闭遮阳帘"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"切换影院音效模式"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"advisor":"影片播放中出现爆炸场景"}
output:{"speak":"no","content":"","actions":[{"id":"1","params":{"query":"座椅振子强振动"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"氛围灯闪红色"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"音响低频增强"},"tool":"vehicle_basic_control"}]}

示例3：
input:{"query":"震得有点猛","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，振动给你调小点。","actions":[{"id":"1","params":{"query":"座椅振子强度降低一档"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 9: DRV-01-01-08 冥想空间 (原4条→3条)
# ============================================================
h_new[9] = """1. 获取信息：
识别用户压力大、疲惫、想放松等表述，明确对放松环境和引导的需求。
2. 提供冥想空间：
适配通勤驻车、午休小憩、工作减压等场景，联动座椅、灯光、音频营造环境。
3. 引导方式：
涵盖呼吸引导、渐进放松、正念冥想、自然声疗愈等，适配不同偏好。

示例1：
input:{"query":"好累啊想放松一下","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"[温柔] 帮你进入冥想模式，座椅放平一点，灯光调暗，放段引导音乐，跟着节奏呼吸就好。","actions":[{"id":"1","params":{"query":"氛围灯暖色低亮度"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"关闭车窗"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"座椅按摩1档"},"tool":"vehicle_basic_control"},{"id":"4","params":{"query":"搜索冥想引导音频"},"tool":"search_and_control_music"}]}

示例2：
input:{"query":"压力好大","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"[温柔] 那静一静，带你做个5分钟的呼吸练习，其他东西都关掉。","actions":[{"id":"1","params":{"query":"暂停当前媒体播放"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"氛围灯调暗"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"关闭车窗"},"tool":"vehicle_basic_control"}]}

示例3：
input:{"query":"好了差不多了","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，灯光慢慢调亮，座椅给你恢复。","actions":[{"id":"1","params":{"query":"氛围灯恢复正常亮度"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"座椅按摩关闭"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"停止冥想音频"},"tool":"search_and_control_music"}]}"""

# ============================================================
# ROW 10: DRV-01-01-09 车内小憩 (原5条→3条)
# ============================================================
h_new[10] = """1. 获取信息：
用户触发驻车休息需求，确认叫醒时间。
2. 调整环境：
座椅放平+关窗+遮阳帘+空调维持适宜温度+静音，营造私密昏暗环境。
3. 叫醒服务：
到时间渐进唤醒（灯光调亮+轻柔语音+座椅恢复），不突然惊醒。

示例1：
input:{"query":"我想眯一会","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，座椅给你放平，窗帘拉上，空调调到舒服的温度，你想睡多久？","actions":[{"id":"1","params":{"query":"关闭遮阳帘"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"关闭全车车窗"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"空调24度安静模式"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"query":"20分钟叫我","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，20分钟后叫你。","actions":[{"id":"1","params":{"goal":"20分钟后叫醒泽民","action":"add"},"tool":"goal_list_update"}]}

示例3：
input:{"advisor":"小憩20分钟时间到"}
output:{"speak":"yes","content":"[轻柔] 到时间了，该起来了。","actions":[{"id":"1","params":{"query":"氛围灯缓慢调亮"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"座椅恢复原位"},"tool":"vehicle_basic_control"},{"id":"3","params":{"goal":"叫醒泽民","action":"delete"},"tool":"goal_list_update"}]}"""

# ============================================================
# ROW 11: DRV-01-01-10 雨天关怀 (原7条→3条)
# ============================================================
h_new[11] = """1. 监测触发：
实时监测恶劣天气（下雨、起雾、下雪），或用户切换D挡时启动安全保障。
2. 执行安全操作：
自动开启雨刮、雾灯、后视镜加热、除雾等功能，同步语音简洁提醒。
3. 天气恢复：
雨停/雾散后静默关闭相关功能，不说话。

示例1：
input:{"advisor":"检测到开始下大雨，车窗未关闭"}
output:{"speak":"yes","content":"下雨了，雨刮和雾灯给你开了，注意路滑。","actions":[{"id":"1","params":{"query":"关闭全车车窗"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"开启自动雨刮"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"开启前雾灯"},"tool":"vehicle_basic_control"},{"id":"4","params":{"query":"开启后视镜加热"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"advisor":"检测到前方起雾，能见度下降"}
output:{"speak":"yes","content":"前面起雾了，雾灯给你打开了，慢点开。","actions":[{"id":"1","params":{"query":"开启前后雾灯"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"开启后挡风加热"},"tool":"vehicle_basic_control"}]}

示例3：
input:{"advisor":"雨已停，路面干燥"}
output:{"speak":"no","content":"","actions":[{"id":"1","params":{"query":"关闭自动雨刮"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 12: DRV-01-01-11 宠物关怀 (原4条→3条)
# ============================================================
h_new[12] = """1. 获取信息：
用户临时离车时长、宠物品种和状态。
2. 环境调节：
短时离开调空调+适当通风，较长离开确保空调持续运行+关窗防跳出+锁屏防误触。
3. 持续监控：
通过摄像头监测宠物状态，异常推送通知到车主APP。

示例1：
input:{"query":"我去便利店买个东西，狗留车上","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，空调给它保持24度，车窗锁上，屏幕也锁了防它乱按，你放心去。","actions":[{"id":"1","params":{"query":"空调24度持续运行"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"锁定车窗"},"tool":"vehicle_basic_control"},{"id":"3","params":{"goal":"监控车内宠物状态，离车中","action":"add"},"tool":"goal_list_update"}]}

示例2：
input:{"query":"我可能要半小时","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"半小时没问题，空调一直开着，我通过摄像头看着它，有异常马上通知你。","actions":[{"id":"1","params":{"query":"查看车内后排画面"},"tool":"search_visual_info"}]}

示例3：
input:{"query":"我就下去拿个快递","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"很快的话没问题，空调保持着，车窗别留缝，它可能会扒。","actions":[{"id":"1","params":{"query":"确认车窗全关"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 13: DRV-01-01-12 快速通风 (原5条→3条)
# ============================================================
h_new[13] = """1. 获取信息：
识别抽烟行为（PM2.5传感器）或用户通风需求，判断触发条件。
2. 控制通风：
根据车速和环境调整车窗开启方式，协调外循环+天窗+空气净化多系统配合。
3. 动态调整→闭环：
车速变化时自动调整开度控制风噪，空气质量恢复后自动关窗切回内循环。

示例1：
input:{"query":"车里有点闷，通下风","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好。","actions":[{"id":"1","params":{"query":"打开主驾侧车窗和对角车窗"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"空调切换外循环"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"天窗翘尾开启"},"tool":"vehicle_basic_control"}]}

示例2：
input:{"query":"风太大了","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"窗户给你关小点。","actions":[{"id":"1","params":{"query":"车窗调至30%开度"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"关闭天窗"},"tool":"vehicle_basic_control"}]}

示例3：
input:{"advisor":"车内空气质量已恢复正常"}
output:{"speak":"yes","content":"空气好多了，窗户给你关上了。","actions":[{"id":"1","params":{"query":"关闭全车车窗"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"空调切换内循环"},"tool":"vehicle_basic_control"}]}"""

# ============================================================
# ROW 14: DRV-01-01-13 后排勿扰 (原6条→3条)
# ============================================================
h_new[14] = """1. 获取需求：
用户提出后排安静环境需求，默认核心目标为不打扰后排休息。
2. 营造安静环境：
关闭后排扬声器+氛围灯+非必要提示音，启用儿童锁，开启后排摄像头卡片到前排。
3. 儿童安全+退出：
确认儿童锁和安全带。仅用户明确退出或后排无人时解除勿扰。

示例1：
input:{"query":"后面孩子睡着了，别吵到他","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，后排声音都关了，灯也关了，你放心。","actions":[{"id":"1","params":{"query":"关闭后排扬声器"},"tool":"vehicle_basic_control"},{"id":"2","params":{"query":"关闭后排氛围灯和阅读灯"},"tool":"vehicle_basic_control"},{"id":"3","params":{"query":"关闭后排遮阳帘"},"tool":"vehicle_basic_control"},{"id":"4","params":{"query":"开启儿童锁"},"tool":"vehicle_basic_control"},{"id":"5","params":{"goal":"后排勿扰模式，监控后排儿童状态","action":"add"},"tool":"goal_list_update"}]}

示例2：
input:{"query":"后面孩子醒了没","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"我看看……还在睡，安全带系着呢，安心开车。","actions":[{"id":"1","params":{"query":"查看后排儿童状态"},"tool":"search_visual_info"}]}

示例3：
input:{"advisor":"检测到后排儿童醒来活动"}
output:{"speak":"yes","content":"宝宝醒了，要不要恢复后排声音？","actions":[]}"""

# ============================================================
# ROW 15: DRV-01-01-14 陪伴安抚-系统触发 (原5条→3条)
# ============================================================
h_new[15] = """1. 获取信息：
监测到后排儿童信号（摄像头识别），确认多媒介手段可用性。
2. 互动内容：
发起适龄互动游戏（颜色识别、音乐猜歌、知识问答），后排屏显示，不推送前排。
3. 执行与反馈：
轻柔语音引导，每完成一环节正向鼓励。检测到情绪不佳立即切换安抚内容。

示例1：
input:{"advisor":"检测到后排有5岁儿童，行车中"}
output:{"speak":"yes","content":"小朋友，我们玩个游戏吧！你看窗外，能找到几辆红色的车？","actions":[{"id":"1","params":{"query":"后排屏幕显示计分板游戏界面"},"tool":"gui_agent_operation"}]}

示例2：
input:{"query":"我要看动画","speaker":"乐乐","zone":"二排左"}
output:{"speak":"yes","content":"好，给你放一集汪汪队。","actions":[{"id":"1","params":{"query":"搜索汪汪队动画 后排屏播放"},"tool":"search_and_control_short_video"}]}

示例3：
input:{"query":"别太吵了","speaker":"泽民","zone":"主驾驶位"}
output:{"speak":"yes","content":"好，后排声音小一点。","actions":[{"id":"1","params":{"query":"后排音量降低"},"tool":"vehicle_basic_control"}]}"""

for row_num, content in h_new.items():
    ws.cell(row=row_num, column=8).value = content

wb.save('场景知识（saic）_数据总览.xlsx')

for row_num in sorted(h_new.keys()):
    val = h_new[row_num]
    examples = val.count('示例')
    inputs = val.count('input:')
    print(f"ROW {row_num}: {len(val)} chars, {examples} examples, {inputs} input/output pairs")
print("\nDone - all 14 rows updated.")
