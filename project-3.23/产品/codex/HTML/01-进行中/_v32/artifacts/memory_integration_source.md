<title>豆包记忆和车机记忆打通方案</title>

#  变更日志

<table><colgroup><col/><col/><col/><col/></colgroup><tbody><tr><td><b>时间</b></td><td><b>版本号</b></td><td><b>变更人</b></td><td><b>主要变更内容</b></td></tr><tr><td>20261021</td><td>V1.0</td><td><cite type="user" user-id="ou_89b52c057e0f0e16948b362fc0d6ec17" user-name="薛灵钥"></cite></td><td>新创建</td></tr><tr><td>20261029</td><td>V1.1</td><td><cite type="user" user-id="ou_89b52c057e0f0e16948b362fc0d6ec17" user-name="薛灵钥"></cite></td><td>需求补充</td></tr></tbody></table>

# 相关文档/沟通记录

<table><colgroup><col/><col/></colgroup><thead><tr><th>文档名称</th><th>文档链接</th></tr></thead><tbody><tr><td>记忆和车机同步方案</td><td><cite doc-id="N2uLwZYAgisDSakvYx4ckplTnvh" file-type="wiki" title="记忆和车机POI同步方案" type="doc"></cite>by<cite type="user" user-id="ou_58617a9e5a540a4c77227064fe7912b3" user-name="郝晓伟"></cite></td></tr><tr><td>20261021：<br/> <cite type="user" user-id="ou_89b52c057e0f0e16948b362fc0d6ec17" user-name="薛灵钥"></cite><cite type="user" user-id="ou_c1a12f27b58f517e0b83f2dc6147c7f7" user-name="杨世龙"></cite>讨论纪要</td><td><cite doc-id="AWPVdGTHSoJ98exkaKtcfjkjnmh" file-type="docx" title="智能纪要：讨论 2026年10月21日" type="doc"></cite><ol><li seq="1">座椅位置数据透传赛力斯反馈</li></ol><ul><li>座椅位置数据仅保存在车机本地账号体系</li><li>数据不向云端同步，也不开放给豆包侧</li><li>仅支持调用车机提供的位置原子能力接口</li></ul><ol><li>驾驶关联功能现状：方向盘调节、后视镜调节功能均无账号绑定记忆能力，调节后仅保留当前车辆的临时设置，不随账号迁移。</li><li>【保持登录】开关开启，陌生人脸不会退登账号；【保持登录】开关关闭，每次下电会退出账号</li></ol></td></tr><tr><td>20261028：<br/>现有BUG</td><td><cite doc-id="DZlSdYlEDomI1Fxp9Nrcjfdfnlv" file-type="docx" title="设置家、公司和常用地址问题梳理" type="doc"></cite></td></tr><tr><td>20261029：<br/><cite type="user" user-id="ou_89b52c057e0f0e16948b362fc0d6ec17" user-name="薛灵钥"></cite><cite type="user" user-id="ou_58617a9e5a540a4c77227064fe7912b3" user-name="郝晓伟"></cite><cite type="user" user-id="ou_f3a0c1feba9fa48213c4d0b8e1c07bab" user-name="张嘉锋"></cite>讨论纪要</td><td>https://bytedance.larkoffice.com/minutes/obcnwjjn8b1pg2e126pj768p<ol><li seq="1">设置家/公司/常用地址落地走记忆，不再走FC调接口实现。（车机不再存家、公司，数据全部来自豆包）</li><li>车机豆包记忆同步一期内容：</li></ol><ul><li>导航相关：设置家/公司/常用地址</li><li>驾驶相关：座椅位置/方向盘调节/后视镜调节</li></ul></td></tr><tr><td>20261103 <cite type="user" user-id="ou_c1a12f27b58f517e0b83f2dc6147c7f7" user-name="杨世龙"></cite><cite type="user" user-id="ou_063000b063567827f46d0d1ec3bb6989" user-name="潘伟俊"></cite>补充结论</td><td><ul><li>方向盘/后视镜的位置数据也是绑定账号的，可以和座椅位置配套。可以理解座椅位置1之下可以有这3个数据<ol><li seq="1">暂定方案是座椅位置1默认驾驶位，不可编辑</li><li>方向盘/后视镜位置调节自动保存至位置1驾驶位</li><li>座椅、PHUD、方向盘、后视镜位置数据打包</li></ol></li></ul><br/>下周会议形成最终结论和方案同步</td></tr><tr><td>20261104会议纪要</td><td><cite doc-id="BNxndo83SoGP3VxaUf3cMYLbnAb" file-type="docx" title="智能纪要：车机AI核心事项专项讨论会 2026年11月4日" type="doc"></cite><br/>https://bytedance.larkoffice.com/minutes/obcn1li22e78xd6qzn2f6od2</td></tr></tbody></table>

# 车机豆包记忆同步需求

## 需求1：导航相关记忆同步

- 支持用户query设置、记忆、修改家/公司/常用地址
- 支持用户后续“导航回家/公司/常用地址”**无需二次选点**，直接发起导航

<table><colgroup><col/><col/></colgroup><tbody><tr><td>一期记忆范围</td><td>家、公司、常用地址</td></tr><tr><td>背景</td><td>设置家/公司/常用地址当前走FC输出“常用地址设置”函数调接口实现，地址存储在车机导航应用内</td></tr><tr><td>优化方案</td><td><ul><li>设置家/公司/常用地址落地走豆包记忆，不再走FC调接口实现</li><li>车机不再存家、公司，数据全部来自豆包记忆</li></ul></td></tr><tr><td>家/公司/常去地址记忆存储需求</td><td><ul><li>记忆以结构化POI数据为准，支持后续直接发起导航，无需用户二次选点<ul><li>完整POI名称（必选）</li><li>城市（必选）</li><li>POIID</li><li>经纬度</li><li>地址</li></ul></li></ul></td></tr><tr><td>用户query触发时的记忆写入需求</td><td><blockquote><p>Query：“记下我家是麦当劳”“设置我公司是漕河泾B座”“修改我家地址为肯德基”</p></blockquote><br/><b>核心原则：记忆写入位置信息时需包含</b><b>POI名称</b><b>，包含时可直接写入记忆，不包含时需借助POI search工具明确POI名称</b><ul><li>方案一：DT判断是否包含核心信息，不包含先调POI search工具（输入query导航去XXX），获取POI name后再调记忆工具，包含则直接调记忆工具</li></ul><br/>【不包含】query-dt-poi tool-dt-记忆tool<br/>【包含】query-dt-记忆tool<ul><li>方案二：DT直接调记忆工具，记忆工具判断是否包含核心信息，不包含则记忆工具调POI search工具补全后记忆，包含则直接记忆</li></ul><br/>【不包含】query-dt-记忆tool &lt;--&gt;poi tool <br/>【包含】query-dt-记忆tool<ul><li>方案三：DT直接调记忆工具，DT靠记忆工具msg返回判断是否需要调POI search工具补全信息</li></ul><br/>【不包含】query-dt-记忆tool-dt-poi tool-dt-记忆tool：记忆工具返回msg“需先输入query导航去XXX调POI search工具，用户选点后，获取详细POI名称后再记忆”<br/>【包含】query-dt-记忆tool</td></tr><tr><td>用户后续消费需求（语音发起）</td><td><blockquote><p>Query：“导航回家”“导航去公司”</p></blockquote><ol><li seq="1">记忆工具检索用户家=麦当劳，城市名：上海市，poi名称：麦当劳AAA</li><li>DT根据记忆信息改写query=<b><u>“导航去{城市名}{完整POI名称}，直接开始导航”</u></b>，如“导航去上海市麦当劳AAA，直接开始导航”</li><li>调用Navi工具，根据POI名称精准定位麦当劳详细位置，无需用户二次选点，发起导航</li></ol></td></tr><tr><td>待定项<figure view-type="Preview"><source name="赛力斯导航逻辑.mp4" mime="video/mp4" origin-height="1200.000000" origin-width="1920.000000" size="13714623" token="CyWtbKEYSodLvXx51K1cFfz2ncc"/></figure></td><td><ul><li>导航内的设置家/公司入口还在吗？<ul><li><del>在，是否支持用户手动填入/修改导航内地址？</del><ul><li><del>支持，</del><del>由“麦当劳”修改为“肯德基”</del><del>，后续怎么同步到豆包记忆？（是获取数据同步还是通过mock query）</del></li><li><del>支持，但只支持文本形式填入，mock query=“记下用户xxx家的地址是肯德基”，调记忆工具闭环</del></li><li>不支持，只支持显示位置，和已有位置的情况下点击直接发起导航<ul><li>已有位置的情况下点击直接发起导航，点击事件mock query=“导航回家”？</li></ul></li></ul></li><li><del>不在，是否和车企达成一致？以及和用户长期使用习惯不一致</del></li></ul></li><li>上面query触发的设置/记忆/修改，是否都能满足实时更新+长期存储？</li><li>记忆开关关闭，用户query“把家设成麦当劳”怎么实现？<ul><li>提示用户先打开记忆开关<del>？是否有点太霸王条款了</del></li></ul></li><li><del>记忆开关关闭，如果导航内的设置家/公司入口还在，且支持用户手动填入/修改，怎么调记忆工具实现？交互流程</del></li></ul></td></tr><tr><td>用户后续消费需求（手动点击）（如有）<img name="image.png" alt="图片展示了车机导航界面中“家”“公司”及“常去地点”的设置情况。左侧显示“家”为人民公园（北门），用时1小时9分钟；右侧显示“公司”为香域中央，用时1小时22分钟。下方有“常去地点”按钮，点击可设置。该图片与文档中“需求1：导航相关记忆同步”上下文相关，用于说明导航内的设置家/公司入口情况，以及支持用户手动填入/修改的交互流程。" mime="image/png" scale="1.000000" src="Oj3lbfmKdo72mMxHdhrc6RosnIc"/></td><td><ul><li>点击事件mock query=“导航回家”</li></ul></td></tr></tbody></table>

## 需求2：驾驶相关记忆同步

- 只记忆相关位置ID，不记忆具体数据
- 通过调赛力斯接口实现

<table><colgroup><col/><col/></colgroup><tbody><tr><td>赛力斯提供能力和功能实现</td><td><ol><li seq="1">座椅位置数据透出原则和原子能力：</li></ol><ul><li>座椅位置数据仅保存在车机本地账号体系</li><li>数据不向云端同步，也不开放给豆包侧</li><li>可以给豆包提供对应位置ID</li><li>仅支持调用车机提供的位置原子能力接口<ul><li>接口1：座椅保存到指定位置（“座椅位置保存在坐姿1”）</li><li>接口2：座椅位置保存到当前位置（“座椅位置保存”）</li><li>接口3：指定位置改名（“坐姿1改成小猪佩奇”）</li><li>接口4：座椅位置调整（“座椅位置调整到坐姿1”）</li></ul></li></ul><ol><li>每次调节位置后，都会弹出座椅保存弹窗，用户点击保存后会在对应坐姿下保存位置位置</li><li>驾驶关联功能现状：</li></ol><ul><li>方向盘/后视镜的位置数据也是绑定账号的，可以和座椅位置配套。可以理解座椅位置1之下可以有这3个数据</li></ul></td></tr><tr><td>一期记忆范围</td><td>座椅位置、方向盘调节、后视镜调节</td></tr><tr><td>需求内容<img name="image.png" alt="这是一个主驾坐姿覆盖保存的选择界面，界面顶部提示需从三个主驾坐姿中选择一个进行覆盖保存，当前选中的是“坐姿1（当前）”，该选项为浅色亮块突出显示，界面提供“保存”和“恢复至调节前”两个操作按钮，适配驾驶场景下用户保存或重置坐姿记忆的需求，和文档中驾驶相关记忆同步的需求内容对应，用于支撑将用户指定的坐姿存入记忆的操作环节。" mime="image/png" scale="1.000000" src="D4H6bqmgwox5Rfx0gkjcO5zInQb"/></td><td>用户场景1：<ul><li>调节座椅位置后，说“帮我把这个位置保存，这是我的驾驶位置”</li><li>通过FC下发，调用接口2保存位置，同时获取当前位置ID，存入记忆：<ul><li>seat_pos_1：<ul><li>名称：坐姿1</li><li>场景：驾驶位</li></ul></li></ul></li><li>后续用户说“把位置调整到我的驾驶位置”，DT结合记忆，改写query为“把座椅位置调整成坐姿1”，调用接口4</li></ul><br/><del>用户场景2：</del><ul><li><del>用户调节座椅位置后，说</del><del>“帮我保存下这个位置到坐姿2”</del></li><li><del>通过FC下发，调用接口1保存位置到坐姿2，同时获取当前位置ID，存入记忆</del></li><li><del>用户后续说“座椅调到坐姿2”，通过FC下发，调用接口4</del></li></ul><br/><del>用户场景3：</del><br/><del>用户</del><del>手动点击保存</del><del>，mock query“你记一下这个位置到坐姿X”调记忆工具</del></td></tr><tr><td>讨论点</td><td>除了上述用户场景1，还有哪些场景能消费这块的记忆？<br/>当前只有用户主动表达哪个位置代表哪个场景（驾驶/休憩/舒躺）才能将位置ID和座椅位置关联上？</td></tr></tbody></table>

# 车企车机记忆能力补充描述

## 赛力斯座椅位置记忆

### 座椅记忆页面ui

![图片展示的是赛力斯汽车中控屏界面，显示导航信息，包括距离242米、剩余24米等。画面右上角弹出座椅记忆保存提示框，内容为“选择以下主驾坐姿进行覆盖保存（8s）”，有座椅1（当前）、座椅2、座椅3三个选项，其中座椅1（当前）被蓝色边框突出显示，下方有“保存”和“恢复至调节前”两个按钮。该图片与文档中座椅记忆策略中保存逻辑部分相关，直观呈现了座椅记忆保存时的提示界面。](https://feishu.cn/file/KpenbnpAkoIZvyxs6ADcwPwXnrc)

### 座椅记忆策略

#### 保存逻辑

用户（主驾&副驾）上车 → 调整座椅位置 → 中控屏弹窗提示保存 → 用户保存

> Face id&账号切换逻辑：
> 
> - 若A注册了face id并存在关联账号，主驾A上车后会自动切换A的账号
> - 若车机已登录账号A，B注册了face id并存在关联账号，主驾B上车后会自动切换B的账号
> - 若车机已登录账号A，B未注册face id，主驾B上车后A账号不会退登

#### 保存查看与切换

主驾侧/副驾侧下拉栏块控图标，点击显示3套座椅位置，点击后直接执行对应座椅位置切换

#### 用户编辑

可选择编辑当前座椅位置的名称

### 竞品座椅位置设置参考

<table><colgroup><col/><col/></colgroup><thead><tr><th>车企</th><th>图片</th></tr></thead><tbody><tr><td>蔚来</td><td><img name="image.png" alt="图片展示的是蔚来汽车的座椅位置调节界面。界面上方显示“位置调节”，下方有“主驾位置”“副驾位置”选项。主驾位置有“驾驶”“休息”“舒躺”“默认”四种模式，每种模式下方均有“保存”按钮。副驾位置同样有“驾驶”“休息”“舒躺”“默认”四种模式，但只有“舒躺”模式下方有“保存”按钮。该图片与文档中“赛力斯驾驶关联功能现状”部分内容相关，用于说明蔚来汽车的座椅位置设置情况。" mime="image/png" scale="0.353887" src="HtzHbFKFHoROBex1sx9cQt1inDh"/></td></tr></tbody></table>

## 赛力斯驾驶关联功能现状

方向盘调节、后视镜调节功能均无账号绑定记忆能力，调节后仅保留当前车辆的临时设置，不随账号迁移。

## 赛力斯导航设置关联功能

![图片展示的是赛力斯导航设置关联功能中家/公司/常去地点的手动设置流程界面。界面上方显示“家”为人民公园（北门），用时1小时9分钟；“公司”为香域中央，用时1小时22分钟。下方有“常去地点”区域，点击“点击设置”可进行手动设置。该图片与上下文紧密相关，直观呈现了导航设置中家/公司/常去地点的手动设置操作界面，帮助用户了解如何进行相关设置。](https://feishu.cn/file/OzxKbAyTLogEVjxaOftcyll4n2d)

- 家/公司/常去地点的手动设置流程；以及已有地址情况下，点击直接发起导航流程

<figure view-type="Preview"><source name="赛力斯导航逻辑.mp4" mime="video/mp4" origin-height="1200.000000" origin-width="1920.000000" size="13714623" token="LTcYb7KyBoidk5x0qJxcC8WLnxb"/></figure>