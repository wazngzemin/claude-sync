# 文字记录：804：端侧触发至VLM数据上报context评审（第三轮） 2026年7月8日（飞书原文转存；更新时间 2026-07-08T14:56:25+08:00）

来源链接：https://bytedance.larkoffice.com/docx/IxcodLbCvoFPXgxp4F4cV6k1nuc

<quote-container>

会议主题：804：端侧触发至VLM数据上报context评审（第三轮）

会议时间：2026年7月8日（周三） 13:58 - 14:54 （GMT+08）

智能纪要：[804：端侧触发至VLM数据上报context评审（第三轮） 2026年7月8日](https://bytedance.larkoffice.com/docx/WlVHdrjOToZcp6xdm2ccyEJanMd)
</quote-container>

<mention-user id="ou_83c82f6c4e3c059e4fe6bc71f5d8cea6"/> <text color="gray">00:34:31</text>

是，我就给他开开，有高优任务来了之后，我就丢高优任务过去，但是 alwayson 舱内这一块不动。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:34:40</text>

对，其实目前来看，就当前我们评审的这块文档里头，这三个就是同时都打开了，高优任务插的话并不是由咱们触发器这边来插的，而是可能是由赛力斯那边插进来的。插进来以后，这个优先级的管理是在V2M SDK， 就斯华那边去管理的。

<mention-user id="ou_83c82f6c4e3c059e4fe6bc71f5d8cea6"/> <text color="gray">00:35:02</text>

为什么。可能是赛力斯来查，就比如说 VQA 这种任务也是吗？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:35:07</text>

我们今天没有评 VQA 任务嘛，也就先没说的，啊嗯。

<mention-user id="ou_83c82f6c4e3c059e4fe6bc71f5d8cea6"/> <text color="gray">00:35:11</text>

好好好。

<mention-user id="ou_7b916b9e85fa43222c35d88255ff6b95"/> <text color="gray">00:35:13</text>

这个大概是这样，就相当于说本身任务那块有个优先级嘛，就相当于说前面的优先级低的任务，被插队进来了过后，会把 VIT 的，这块去做一个缓存。如果是，比如说视频帧案，比如说 FPS 等于1，3秒。然后我在第二帧的时候，被高优任务插进来了，会被缓存量，就优先处理高优任务。

<mention-user id="ou_7b916b9e85fa43222c35d88255ff6b95"/> <text color="gray">00:35:39</text>

所以说我就回到刚才的问题，其实本身那块哪个先执行，这块应该是外部事件本身的优先级，这块来决定的。对，如果同样优先级，就先来，就先来后到，这种方式。对，然后那个接着刚才蒋文这个问题啊，丁彬我再问一下，就相当于说现在的一个 always on， 就不管是舱内舱外。像那个持续5秒，持续3秒，这种任务的话，都是触发器这边一触发了过后， box 这边就按照固定频率，去运行，是吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:36:14</text>

对，是的。

<mention-user id="ou_7b916b9e85fa43222c35d88255ff6b95"/> <text color="gray">00:36:17</text>

这块我们后面会不会有相当于说频率调整的一些需求啊？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:36:25</text>

这个频率调整应该也是相对而言，就是固定的，调好的，就不会动态的去调，或者去下发之类。应该是会约定好，要调是约定好的。

<mention-user id="ou_7b916b9e85fa43222c35d88255ff6b95"/> <text color="gray">00:36:35</text>

我明白，因因为这块的话就这个固定频率的话，就相当于说 Web 那块，不管是 Web 那块自己去实现，还是说触发器这边来控制它的频率，然后这一块应该都是 OK， 就相当于说一个定时器嘛。但是就是说从后面本身根据那个效果，然后去调试这种的话，就是说要不要考虑就是触发器，因为它还有一个接口是能够去云端，然后去下发嘛。对。因为你放到 box 里面，就相当于说就已经固定住了，这块我觉得可以考虑一下，实现的话两个应该都可以实现。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:37:08</text>

嗯嗯，明白明白。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:37:28</text>

那我们大家还有什么问题吗？关于触发器的。场内和场外的。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:37:44</text>

如果没有的话，荣姐看一下呢？

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:37:47</text>

你的专项。诶，帅哥还有问题吗？刚才还有刘杨你们这一块，嗯嗯嗯。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:37:51</text>

我感觉，我有一个问题啊，这个上电，其实我个人觉得没什么意义吧，你的程序能跑起来，不就，车子肯定上电了呀。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:38:05</text>

也就，对，大概就这个意思吧，就希望它一启动就开起来了。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:38:07</text>

是吧？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:38:09</text>

我刚才就这意思啊，我说这意，就默认开机就是舱内舱外的舱内的不行啊，舱外的默认210就就就就跑起来呗，然后舱内的当然我可以后续给你触发那个 button， 开还是没关，开还是关，就。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:38:09</text>

本来你的，对啊，就对，其实就没有所谓的，当然你就主动地给他开一下就好，他其实没有什么观测的东西。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:38:11</text>

上电问题。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:38:32</text>

可以了，这其实实现起来相对很轻量。

<mention-user id="ou_39cfcaef3083bb436bffe4b975d1067e"/> <text color="gray">00:38:36</text>

但我觉得需要回应我刚才那个问题，因为我刚才查了一下信息，不是说完全不用管这个动力电池是否供电的情况。就如果你已经行驶，对，它也不是这个，就说如果你上车之后，你不踩那个刹车，它其实靠的是蓄电池在供电，它是第一。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:38:50</text>

如果说需要端状态上报，那我觉得有必要。

<mention-user id="ou_39cfcaef3083bb436bffe4b975d1067e"/> <text color="gray">00:39:02</text>

压点，压电能支撑我们多少场景？假设它支持不了的话，我们的逻辑是什么？以及客户是不是对这个 box 有功耗的约束？

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:39:12</text>

我。

<mention-user id="ou_39cfcaef3083bb436bffe4b975d1067e"/> <text color="gray">00:39:18</text>

策略是什么？

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:39:21</text>

我理解晓杰，我理解你的这个需求其实是对产品这边，我理解可能不是关注这个上下电，而是关注一些其他的条件，做一些约束，作为他的使能的一个条。

<mention-user id="ou_39cfcaef3083bb436bffe4b975d1067e"/> <text color="gray">00:39:33</text>

我是想知道这个上下电，它到底的具体含义指的是什么？

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:39:34</text>

嗯，有点模糊。如果是简单粗暴的话，确实开机，开机本身就，你的程序能运行就已经开机了，所以这个等于是没有意义，对，可能要找其他的条件，更多的约束条件。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:40:02</text>

听起来。来，就是对于触发器要做触发 VLM， 似乎是可，这条链路是可行。但是对于现在这里面列出来两个场景，舱内 Orison 的高低频和舱外的 Orison， 它的触发条件是没有形成共识的，是吗？是要还确认上游什么条件去触发，对吗？

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:40:26</text>

对的，龙姐，其实我理，我们理解应该是，至少我跟晓杰的理解应该是，或者是，就是更。具体一点的信号，因为上下电这个东西本身就是比较含糊一点的，比较含糊吧，很含糊的一个东西。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:40:43</text>

那个泽民和丁彬，现在提出来上电去触发的，这是需求来源于哪里啊？找源头吧，咱们。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:40:51</text>

和这样子吧，我们可以约定一下，我们其实希望的是一上车了以后，比如说 AI Box 工作起来的话，就把功能打开，就默认打。开的，大家也可以统一一下，觉得哪个信号是最稳健的，我们可以对，按照这个来。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:41:13</text>

也就这块我们是定义好了，去跟赛力斯提需求，他们给我们加信号，对吗？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:41:18</text>

我觉得其实到不了加信号那边，理论上我们希望就是 AI Box 其实就是可以理解为，帅哥刚才说的，默认开， AI Box 那边启动以后就默认打开，就想要的是这种效果。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:41:30</text>

如果是这样子的话，甚至可能都不需要。到触发器了，我们这里的 agent-service 可能这个程序启动就默认就认为就 always on 的，已经就开着的，就。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:41:39</text>

啊，那我是不就可以直接加，比如说我这样子，我稍微抢一下屏哈，我再回到我这块定义里头。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:41:46</text>

这样子，如果是这样子的话，可能就不存在一个关的一个情况了，关或者说被抢占，就是看其他任务有没有更高优的任务被把它给它霸占了而已。它就是始终的一个背景的一个运行的这样一个状态。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:41:59</text>

那你看这样写行不行，斯华？是 AI Box 启动默认打开，这样子。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:42:14</text>

丁彬，我问一个问题啊，这两个场景的触发是你能够去决策它的链路的，是吗？这块也不涉及到跟赛力斯去讨论，我们自己定义就行，对吗？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:42:25</text>

对，这个目前看是这样子的。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:42:26</text>

OK。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:42:31</text>

那底下那个也。后，也就是说 AI- Box 启动后，同时满足设置中的 button 开的话就打开，你这样子看的那个斯华， AI- Box 下电，那我就不叫，这也就下电是吧？

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:42:52</text>

你后面后面是有一个 button 的，是吧？舱内的是有 button 的吗？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:42:57</text>

Always 就是舱内才会有这个 button。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:43:01</text>

你说 HMI 上面。有一个 button 的，是吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:43:04</text>

对，是的。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:43:06</text>

那那个 button 你就需要帅哥这边可能要要通过他们那个渠道，嗯。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:43:07</text>

嗯，你如果用其他的网站。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:43:10</text>

我可以调你 Vrm sdk init 的时候，我给你传入一个 enable 的字段，相当于仓内是否 enable 这么一个变量就行了。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:43:21</text>

嗯，我们有一个设置的，往下行的一个设置的。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:43:29</text>

任意，那你设定给你。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:43:31</text>

那我这么表述行吗？就直接报。Box 启动和关闭，舱外的来说，就启动后打开，关了后就关了就行了。舱内的要求呢，就是在软 button 开了以后，同时 AI Box 启动了，这两个都满足了以后才能打开。如果这两个条件，比如 AI Box 关关闭了，或者软。Button 也给关的话，就把它关掉，舱内这个关掉就可以了，这是个火的。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:44:05</text>

因为这个啊，那个丁彬啊，就是 airbox 关啊开啊，其实对于座舱这边的叫 agent-service 那玩意，他他可能都不关心，他只是对他来讲，他就是就，就，或者关闭。比如舱外可能就是默认就是的，他根本就不存在关闭这个一说，对吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:44:21</text>

明白。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:44:25</text>

就是我前面讲，就是被其他任务给他把抢占了，他他就没有运行而已。第二个的话，其实我是。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:44:31</text>

对，是的。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:44:32</text>

关心这个 button， 只会关心这个 button 下来了，只要下来了， enable 我们就会开的。因为如果说 box， 如果说本身那个 box 没有上线啊什么的，其实它调不通嘛，对吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:44:38</text>

嗯嗯，对。明白。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:44:45</text>

当然它也不会调，这个是本身它固有的机制里面的，就是跟这个本身这个是不是死人啊，或具体的场景是没有关系，因为模型等于是它没有，是它的一个模型的一个服务嘛，它没调调不了，它就不调嘛。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:44:59</text>

那我这么表述可以吗？你看一下，我从。定义的这么，行，那这里就不是触发器触发了哈，那其实就是开启了，任务的开启了，周期类任务的开启了。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:45:03</text>

可以可以。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:45:13</text>

第二个可能，这个设置怎么来？可能是触发器吧，还是什么样子的？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:20</text>

就是这个信号是刚才帅哥说的，由他来给你传入嘛，是吧？

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:45:24</text>

对，这个东西传入是不是触发器，我其实有很多方式去实现嘛，不知道赛克那边是不是用。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:45:31</text>

你指的 button 的传入，对？吧。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:45:33</text>

对对。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:33</text>

对， button 状态，包括 button 状态发生变化了以后，也需要及时告知给诗华那边。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:45:35</text>

这其实就是个。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:45:41</text>

可能都不是一个触发器，它就是一个，对，我监听不了。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:45:43</text>

这个不是个触发器。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:45</text>

那你诗华去自己监听这个信号，行吗？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:45:48</text>

我们可以，不用，可以我们自己接听到S塞力斯肯定得给我们 SDK 的，对吧？这个 button 是做在塞力斯的页面上，对吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:57</text>

嗯，对。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:46:00</text>

那他给我们 SDK， 我们接听到之后调一下。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:46:01</text>

对呀。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:46:02</text>

斯华的接口就行了。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:04</text>

行，那就是 AlwaysOn Button 是由 AlwaysOn Button 的状态是由端侧触发器提供。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:46:18</text>

不是触发器提供，反正是是赛哥那边提供，哈哈哈，反正以赛哥提供。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:46:18</text>

不，它不一定是触发器，你就留端侧提供就行了。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:22</text>

由端侧提供。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:46:24</text>

对，我不一定会把它做触发器里。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:25</text>

我要 at 一下帅哥吗？在这把人写下来吗？我对，其实。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:46:32</text>

是一个。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:32</text>

这不是明确到模块，就是明确到人嘛。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:46:37</text>

那个帅哥可能是个什么模块啊？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:40</text>

要不先写一个模块名，我大概写。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:46:42</text>

现在不好说，你可以写人。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:46:44</text>

OK。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:44</text>

那我先 at 你吧，回头你确定了换一下，行吗？

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:46:45</text>

帅哥你的意思是说，也有可能不在端侧触发器，在其他途径做，是吗？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:46:52</text>

对呀。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:46:55</text>

这个。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:56</text>

帅哥，我先 at 一下你，确定了把替换成模块名，你看行吗？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:47:03</text>

我理解这个东西是个数据链路，如果是个数据链路，可能是李鑫来做，他不过触发器，他就是接听一个东西转发给别人。

<text color="gray" bgcolor="gray">@Walter</text> <text color="gray">00:47:16</text>

嗯，对的。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:47:16</text>

那李鑫在吗？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:47:19</text>

先待定吧，你先写我和他都可以，我们自己下来商量。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:47:22</text>

行行行行，太好。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:47:28</text>

帅哥，今天可以商量一个结论吗？因为这涉及到端侧触发器。如果不存在的话，那就不需要把他需求再提到804了。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:47:37</text>

你单纯这个按钮，我觉得我现在就可以给你结论，我觉得单纯一个按钮的状态，我可以不过触发器，我没觉得它过触发器能有十足的理由来说服我自己。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:47:50</text>

那也就现在如果不过触发器，后续如果讨论到别的，你们如果判断还，再聚焦到同一个模块去做，到时候大不了就把它再拿到触发器去，对吧？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:47:59</text>

对，这是技术实现上的事。嗯，外界不。感知。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:48:08</text>

可以，那这样的话，泽民，我们就把触发器的P0的需求给他删了吧。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:48:16</text>

OK， 那下边但是在订阅这一块，我们还是需要，在下周吧，下周评预设任务的时候，在订阅数据中心可能需要。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:48:16</text>

那你看现在对触发器就没有依赖了，在这块啊。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:48:30</text>

那个再单聊，对。看来目前这个就是开关就不在这放着了，周期类任务的开关就是 VLM SDK 负责了，这三个任务的开关逻辑就按照这个来啊。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:48:42</text>

我再提问，舱外 AlwaysOn， 如果是默认打开的话，一个是刚才晓杰提到的问题，我们是直接默认直接打开，还是说这需要跟前游的系统再去确认在什么条件下可以打开？比如上电、低压电这种情况，需要确认吗？还是说这个事先把链路先这么做了，后面你们再。带着任务去确认。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:49:05</text>

我理解啊，这就是本身它的电源状态跟底头的应用就是隔离的，比如说你说那个 APP 这个事吧。那也行，那辛苦晓杰也沟通一下吧。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:49:18</text>

嗯，好，第二个事情，舱内 AlwaysOn 默认打开这件事还需要跟赛力斯去同步吗？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:49:18</text>

我们先把链路先打通。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:49:25</text>

会不会涉及到舱外的隐私问题、法务问题？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:49:30</text>

这个当时聊过。只有舱内才会涉及到控制，舱外的这种呢，是不受开关节制的。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:49:37</text>

好的。嗯，好的。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:49:40</text>

诶，那我理解是不是关于停车驻车，看 AI， always on AI box 这一块的需求的话，是不是如果说需要放在触发器去做的话，是不是需要早点提出来？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:50:01</text>

我先把这块修改。改一下哈，那这里就不是触发器了，而是就把这个开关状态自己就直接传上去就行了。传到这里。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:50:16</text>

你可以，你可以把刚才的端侧触发器那一块打个问号，看到底是，如果是在李鑫那，那不就是还是 AI service 吧？如果不是不是 AI service， 那可能再是某个链路，这不存在一个直接传过去的链路，一定会经过我们的豆包的。对吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:50:36</text>

先挂在这块。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:50:38</text>

我觉得你可以把端侧触发器几个字给他打个问号，等帅哥确认，可以。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:50:41</text>

你挂在 AI service 里面就行了，至于 AI service 哪个模块我们自己定，可以不？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:50:48</text>

行。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:50:49</text>

首先数据中心是个确定的事件，这个没问题。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:50:53</text>

对，那就是这样子了，是吧？他把这个给到 AI service， AI service 再把这个怎么给到 AI box， AI box 拿到这个开关，这都是开关。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:51:00</text>

对，可以，但他可能不一定是。在 AI Service 里面的数据中心啊，我确认好。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:51:06</text>

明白啊。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:51:09</text>

你可以再挪一个小方块过来，你把你这个绿块再复制一个出来，就叫 AI Service， 把数据中心几个字删掉，先待定吧。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:51:13</text>

在哪里啊？在底下吗？

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:51:16</text>

那分离，定，定。哎，丽娜。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:51:22</text>

啊，理解意思了，这样子来就行了。

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:51:22</text>

对，啊，对，这样就对了，没问题。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:51:29</text>

对，然后这里头负责这个模块的开关任务了啊。行，这个也就比较通畅了啊，这块其实也就通过了这一块哈，我把这个颜色就改回来了。这块我们就不涉及到这一块了啊，触发异常这个事情了。好的，那开关问题也解决了，我感觉这边就 OK 了。都都 OK 了，梦洁你看一下下一步。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:52:10</text>

改变差异。那下一步，帅哥跟李鑫，你们先对一下方案，咱们再看这个需求怎么串。还有斯华，咱们这边如果是默认打开的话，待会下午5点钟那场需求里面，这个需要加进去，需要单独去做。我先说这里面我已经看见的风险啊，先和大家同步一下。首先第一个 VLM 的模型，是，哦，正式的版本是没有办法提供的。所以我们现在需要先通过链路的方式，或者说 mock 方式，先去打通我们内部，整个火山内部，这个 VLM 的 evt 的联调测试方案，打通以后，到时候可以在字节，在火山内部可以去联调和验证。但是。是这个方法不会给到赛力斯，这是第一，第二个， always on 舱内的高低频两个算法需求没有评审完，今天晚上才会评审，所以有可能会导致这个场景的算法这一块接下来是怎么做？是通过 PE 加确认的一个中间版的一个 SP 的方式去实施，还是传的是正式的方案？这个是未待定的。所以这块的话，产品同学。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:53:33</text>

也可能要有一个预期，接下来我们在这三个场景当中，优先级怎么排？目前在我看来，舱外 AlwaysOn 现在整个依赖已经全部没有了，所以相当于我们可以排着去做了。那个玲磊还有斯华，咱们可以去做了。舱外的 AlwaysOn 现在有两个依赖，一个是帅哥这边去确认触发的，就是形式或者传这个参数的形式。如果没有办法传，我不确定啊，现在台架上是不是已经有这个开关？如果没有这个开关，那。是谁去 mock 这个数据先去联调，这个是在会上是不是可以先确认一下方向？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:54:11</text>

我觉得联调都不是事，发个广播都能触发，这都很简单的事。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:54:14</text>

好， OK， OK， 那我们就是如果没有，就是通过 mock 的方式去联调，好吧？

<mention-user id="ou_6b2f14e2cde9e5296f8b926dc8cd2d0e"/> <text color="gray">00:54:19</text>

对对。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:54:20</text>

然后下一步就是到了 OS 到了 VRM 这一块， VRM 这块的算法模型是不具备的情况下，咱们需要 mock 还是怎么去联调？这块到时候丁彬我们。需要在 VLM 模块去确认，好吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:54:35</text>

嗯，好的。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:54:37</text>

好的，看大家对这块还有没有问题？如果整个链路没有问题的话，那咱们就开始，该提 meego 提 meego， 该去单，就是小范围拉了去串链路排期的就排期了。那今天的结论就是端侧触发器的。需求取消， VRM 上报到 context 的需求评审通过，舱内 AlwaysOn 由 AI Service 来触发，舱外 AlwaysOn 由端侧的 vlm agent 自行处，默认打开，好吧？大家看看还有补充要提问的吗？

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:55:30</text>

如果没有的话，那咱评审就到这了，我们接下来就做相应的前期的一些工作，以及技术同学开始对协议，我这边开始拉大家排期了，好吧？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:55:44</text>

的。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:55:47</text>

好，那谢谢大家，拜拜。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:55:50</text>

拜拜。
