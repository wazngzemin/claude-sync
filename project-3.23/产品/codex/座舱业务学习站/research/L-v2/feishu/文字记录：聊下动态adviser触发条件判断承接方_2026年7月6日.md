# 文字记录：聊下动态adviser触发条件判断承接方 2026年7月6日（飞书原文转存；更新时间 2026-07-06T18:10:53+08:00）

来源链接：https://bytedance.larkoffice.com/docx/Ma5od46Leo7f37xDXEOchURhnjf

<quote-container>

会议主题：聊下动态adviser触发条件判断承接方

会议时间：2026年7月6日（周一） 17:19 - 18:08 （GMT+08）

智能纪要：[聊下动态adviser触发条件判断承接方 2026年7月6日](https://bytedance.larkoffice.com/docx/CcrKdc3SpofL0HxbWHMcnGrfnnd)
</quote-container>

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:32:34</text>

的某一个是给这个advisor的。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:32:43</text>

并不是把所有的视觉回来的东西都要给这个的外侧，这样对于他的推理的压力会小一点。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:32:49</text>

对，他要区分的呀，所以这个模块还是挺烦的，他得知道，比如说现在数量3个到没到，超没超，他得有策略管理。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:33:01</text>

比如说新来的，是要把老的任务替换掉，返回回来的信息1和2、3，应该把3给到动态的 value， 还是把2给到动态的 value？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:33:14</text>

对对，是的。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:33:15</text>

好，所以说这里，对呀，在云端啊，所以我是说你得有专门的一个动态感知的模块来支持这个事情嘛，所以我说这个不要跟，最好别跟定时器合，这样子不跟触发器合，不然触发器。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:33:16</text>

这个处理应该在云端吧，不应该在端侧 VLM 吧？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:33:31</text>

会太重了。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:33:33</text>

OK， 那就触发器还是原来的触发器，这个定时器呢，也是原来的定时器，比较简单的工作模式，有单独的一个动态感知的模块，是吧？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:33:42</text>

对，由他去来串这个事情。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:33:46</text>

那 advisor 的触发，还是由这个动态感知的模块来触发 advisor， 是吧？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:33:53</text>

就动态的，王子的推理，他可能来源于触发器回来的信号推理嘛，也可以来自于定时。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:33:59</text>

对对。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:34:01</text>

器触发的推理，也可能来自于你订阅的动态感知，它回来的信息的推理吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:34:02</text>

对，也可以来自这个。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:34:10</text>

OK， 接下来问题就这个模块是谁做啊？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:34:17</text>

而且但是这个模块它的我问一下那个西钺啊，西钺就是我们，哎西钺下了，哦没下，西钺就是。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:34:26</text>

我在呀我在呀。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:34:26</text>

诶，齐月，啊。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:34:31</text>

我们，比如说我要照看宝宝的话，其实推理频率我们是改不了的吧？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:34:38</text>

就不存在像刚才晓伟说我30秒去看一下那个，比如说晓伟有没有穿红衣服？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:34:48</text>

实际上我们把 SP 改好给你之后，你就是维持端上的那个推理频率，是吧？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:34:54</text>

对。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:34:59</text>

诶，你现在端上的特例品。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:34:59</text>

你那你现在端上的推理。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:01</text>

频率是什么样子啊？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:35:01</text>

是多少？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:35:02</text>

现在高频是5秒，低频是5分钟。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:35:07</text>

怎么区分高低频？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:07</text>

alwayson 是高频还是低频啊？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:35:08</text>

只有，有两个，它是交叉着来的，只有动作和神态在高频，其他都在低频。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:18</text>

其实大多数都是5分钟，其实。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:35:21</text>

对。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:23</text>

我们能，比如说有一些东西可能是需要频率高一点的，可能有，比如说给标签下去给你是放在，就。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:31</text>

我现在给你的 SP 里面，它都是默认在低频里吗？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:35</text>

还是说也可以在高频里推啊？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:35:37</text>

这个我们云端会去分辨，到底放低频还是高频。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:41</text>

所以说对啊，就说我这个动态感知订阅这个模块，我会区分出两种嘛，一种是走低频，一种是走高频，给到你这边嘛。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:35:50</text>

对对。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:35:51</text>

低频和高频是每个 SP 都能再额外支持三个动态，还是说一共共享的呀？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:35:59</text>

可以额外，我理解这。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:36:01</text>

都可以区分开，我们云端把这个对。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:36:02</text>

就是高低频每个，比如高频可能有三个，低频也有三个，相当于这样子。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:36:08</text>

诶，雪的。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:36:08</text>

就是实际上是那个，晓伟这个模块就得解析那个什么？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:36:13</text>

兰若你说。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:36:14</text>

对，我怎么感觉用户发起的动态 advisor 的任务，大概率全都会放在高频里面，不会有低频的呀，因为低频5分钟一次，对于用户提到的任何，不管条件类他想触发的，还是观测类想触发的频率都满足不了吧。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:36:26</text>

对，我觉得也是。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:36:31</text>

我想看他是不是当前脱衣服了，那我5分钟以后告诉他脱衣服了，这个感觉不太满足动态 advisor 的需求。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:36:39</text>

加一加一。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:36:40</text>

对对对，我觉得可能大狗。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:36:41</text>

但那种呢，你们现在有睡着了这个东西吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:36:42</text>

对。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:36:45</text>

有宝宝睡着了，对。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:36:45</text>

这个是默认任务里面的，我回答兰若那个问题啊，我觉得还是看任务的类型，我没办法想象云端会给我们下发哪些工作。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:36:56</text>

如果他只是判断，后排的人是否衣服已经换了，我觉得。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:37:01</text>

这个不一定要高频里去做啊，他低频的去判断也没啥问题啊。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:37:05</text>

如果他只是问属性信息，除非他说这个后排小孩打人了就怎样，对吧？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:37:10</text>

那肯定是得高频的去判断。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:37:13</text>

我理解还是得根据 by 任务去评估哪个会更多吧。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:37:18</text>

你比如我说那个天气放，我假如啊，比如天气放晴了，就怎么怎么样，那这种东西我觉得它就它的时效性就不是很高，5分钟延迟我觉得。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:37:31</text>

也能接受。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:37:34</text>

现在舱外应该是3秒一次，对，舱内舱外的任务是一共三个。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:37:41</text>

还区分了舱外，是吧？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:37:44</text>

对，现在那个还有一个。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:37:48</text>

哎，现在还有一路，我赛力斯，我可以那个屏幕嘛，屏幕理解可以 OI done 吗？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:37:58</text>

不冷，目前走的还是微。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:38:01</text>

QA 的链路，你传来干嘛呢？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:38:03</text>

我可以持续的给你传导航的页面吗？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:38:10</text>

你帮我把我前进方向上的周边的景点的名称给我识别出来。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:38:22</text>

我觉得你有动态任务的时候，我们再加吧，只是说看能不能加一个屏幕的识别，这个可以导入需求去做一下。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:38:31</text>

诶，嘉锋，沿途介绍风景的你赛力斯你能支持让他用屏幕理解的方式走吗？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:38:45</text>

因为我发现那样的真正的去搜是搜不好的，我还是想让他持续的去截，去理解你行进方向上周边的你你可以告诉他动态感知比。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:39:01</text>

比如说导航应用的时候，就固定一个比例池了。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:39:08</text>

对啊，我持续理解行进方向上，比如说有一些景点，我报上去之后，云端拿这些景点去走联网，再看哪些非常有价值，再来报。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:39:22</text>

对啊，就是在后台运行啊。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:39:32</text>

只有导航这一个场景，是吧？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:39:34</text>

就是屏幕 always on 的。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:39:37</text>

我觉得现在可能是导航，我觉得长期的这套框架嘉锋，我知道，我觉得这是一套标准框架，就是它可以动态感知很多 APP 的，就是比如把 APP 打开可以什么的。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:39:40</text>

ok。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:39:47</text>

看剧。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:39:55</text>

你比如陪我玩游戏，我就可以把游戏的界面去。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:40:01</text>

去动态的传过去，给他持续感知。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:40:05</text>

陪我看电影其实也是一样的嘛。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:40:15</text>

小张，你这块需求你记着呀，就是 APP 的那部分嘛。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:40:16</text>

诶，西钺。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:40:21</text>

但我觉得这个链路跟我们现有的 always on 的。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:40:25</text>

特殊的展示，还有别的场景。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:40:32</text>

我觉得你其他 APP 也可以给他动态感知用呀，而且你现在 always on 的那部分的视觉本来也得要考虑屏幕的，他现在车内车外还有屏幕那一路，我觉得你也应该考虑放进去。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:40:53</text>

这个一起实验先吧。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:40:55</text>

端端状态。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:40:56</text>

对。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:41:00</text>

好歹不要 M 先。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:41:01</text>

识别啊，识别之后通过端状态报，还是什么？

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:41:04</text>

那是他传的问题啊。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:41:06</text>

周六的时候，研发把端状态这条路给否了，他们不希望走那边，他们希望走触发器或单独拉一个链路来。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:41:16</text>

那就，那个是再说的事情。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:41:24</text>

西钺，我问一下，你刚说的这边可以支持动态的识别，是说还是在5秒跟5分钟这两个里。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:41:31</text>

里面二选一，还是说支持他，比方定一个30秒钟的任务？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:41:36</text>

只能二选一，你说的30秒是说你云端已经判断了，我只用识别30秒这个周期，从30秒过后我就不用识别了，是吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:41:47</text>

就是不是，每30秒识别一次，相当于这个模块来判断的嘛？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:41:50</text>

或者说 advisor 在给的时候，他就会给你，每一分钟给我报一下什么什么。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:41:57</text>

我理解你不能改变他的已有的判断的。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:42:01</text>

节律，但是你可以给到任务管理，如果任务管理认为你可以被拆解下来，比如说把你插入到两个动态任务里面，那它就可以动态的去加载你这个任务。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:42:02</text>

我可以听到，可以听到。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:42:04</text>

明白， OK， 那比如说用户讲的是，啊啊， OK OK， 我的我想。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:42:12</text>

如果你的粒度要求比它更细，那肯定是做不到的，更粗可以。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:42:18</text>

另外我想强调一个点，就是我希望一个动态任务结束之前不要改变，因为端侧也有 catch 的原理，如果你频繁变更的话，它的效率会更低。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:42:31</text>

还想问的一个是，比方说用户说每一分钟怎么怎么样，在你这边就会被分到5秒检测一次，是吧？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:42:37</text>

会分到这个里面。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:42:38</text>

我不会根据你的任务时长来判断，我只会根据你的 query 到底是识别什么内容来判断。

<mention-user id="ou_552053008ee6746a3e0420f414cb0fab"/> <text color="gray">00:42:45</text>

其实我觉得前面说的那些点都。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:42:53</text>

那这样的话不就相当于满足不了用户需求了吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:42:56</text>

他可能注意到视觉的条件已经发生了变化了，但是举个极端。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:01</text>

一点例子，4分钟了，你的这个都没有变化。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:43:05</text>

要不这样，我们一期做，我们动态和高频和低频，我们都统一拼同一个动态任务进去，我们去识别看效果，可能最后，可以。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:43:16</text>

我觉得打通链，其实打通链路比较重要，其实能放到高频就能放到低频，我们可以是不是先都放到高频试一下？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:19</text>

对啊，因为我觉得这个根本就不存在。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:43:26</text>

就是就TOP3不放到低频，就放到高频，你就你能。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:26</text>

嗯，对。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:30</text>

我们现在。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:43:31</text>

兼容三个，这样可以。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:33</text>

对，我也比较支持都放到高频，要不先试试，反正打通链路阶段嘛。

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:43:38</text>

你们你们之前是买的时候就都是那种这样的，带带大的。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:43:38</text>

嗯，行吧，我们先试试呗。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:42</text>

OK。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:45</text>

我其实还有一个问题，但是航哥好像开别的会去了。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:51</text>

诶，泽铭，我先问一下你，这个模块是谁来做？

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:43:57</text>

不太清楚哎，这个不是现在没有吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:43:58</text>

你知道吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:44:00</text>

行，那让航哥。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:44:01</text>

来定吧。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:44:01</text>

现在不是待定吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:44:03</text>

对啊，那让他来定吧。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:44:09</text>

可以啊，那是不是没有啥其他讨论的了？

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:44:09</text>

之前如果说打算把，之前如果说把动态 SP 拼到在触发器里边的话，肯定是这一块是肯定是我来做。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:44:26</text>

全进行高频。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:44:30</text>

OK。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:44:32</text>

西钺、兰若，你们看还有其他要讨论的话题不？

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:44:36</text>

诶，我想问一下，诶，西钺，诶，对，西钺，就是刚才讲的和当前我发给你的链路，它是一样吗？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:44:36</text>

对，其实我们也，丁彬你先说。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:44:45</text>

还是说是不同的链路啊？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:44:47</text>

我理解还没有定论，我们目前判断，单独的一个链路嘛，至少不走端状态的链路，但是它是单独拉一个动态感知的链路呢？

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:44:56</text>

触发器。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:45:00</text>

还是走出。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:45:01</text>

触发限流的这个还没有定论。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:01</text>

哦哦，那行，那我们，因为我们今天下午也讨论了一下嘛，当天锁定了一版方案，那我们就继续先按那个去推吧，这边再等你们的讨论，是吧？

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:45:15</text>

是端侧的，跟云端我理解没有太大的关系吧？

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:45:18</text>

他这个云端动态感知怎么也得下发到端侧触发器，再给 BLM 吧？

<mention-user id="ou_a3e66115c55e8b2b782a57f8bfcbd47b"/> <text color="gray">00:45:24</text>

应该没有其他的端侧可触发的模块了。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:26</text>

对。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:45:27</text>

只，对，这个只需要对云端的把 SP。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:45:31</text>

下发到端侧就可以了，透传给端侧的就可以了，其他没有什么太多跟端侧有联系的吧。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:38</text>

对，因为今天不是端侧讨论要坨上去的那三坨的输出里头，刚好就是把 the weather 给隔离出去了嘛，不包含在内。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:45:47</text>

你说动态 SP 那块是吧？

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:45:49</text>

啊，不仅仅，不好意思啊，我想插一下，我想插一下，不好意思啊，我觉得可能是这样子的，第一个，现在讨论的只是跟 context 达成共识的。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:45:49</text>

对，那第十行，

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:46:01</text>

三个模块的或者说三类的数据，这个数据的话就按照今天下午讨论的产，整个链路已经对齐了，咱明天该评审评审，因为它这是被提前到804里面的，我们就往前去推。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:46:13</text>

然后第二块就是现在讨论的这些，产品同学就不要去决策到底是端侧触发器还是还是云端触发器去做。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:46:22</text>

既然咱们之前两次评估都被挑战的是端侧器触发器接不接，云端触发器接不接这个事，那咱就把需求聊清楚了，那。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:46:31</text>

让这个开发和对应的模块的产品一起聊，他们觉得是新建链路还是在某个里面去做，让技术去定好了。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:37</text>

对对，嗯。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:46:44</text>

好，你们继续。

<mention-user id="ou_b0132cdc6c6ad5889b25389173f99340"/> <text color="gray">00:46:48</text>

行，那我没问题。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:46:50</text>

我这边也没了。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:46:54</text>

诶，所以现在其实卡就卡在这个动态感知模块，谁来做，是吧？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:46:59</text>

对对对。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:46:59</text>

我们缺一个。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:47:01</text>

对对对，你指的是就这个任务的结束，是吧？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:47:01</text>

决策，诶，晓伟，我想问一下，你下发的任务会带时间吗？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:47:07</text>

比如说我要观察某个东西多长时间？

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:47:14</text>

对。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:47:16</text>

我可以要求就是 advisor 判断这个目标结束的时候，来你这边，他怎么跟你通信，可以要他去取消这个，因为强行拍做强制的逻辑，这个确实不好定。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:47:32</text>

就他自己判断任务目标结束之后，他可以自己来取消这个感知的任务。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:47:38</text>

对，我觉得这样根据条件来管理任务是最合理的，因为我觉得根据时间他可能下发的也不一定能满足用户的需求。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:47:46</text>

对，嗯，对。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:47:50</text>

那我们再等等张航，看他派一个人来负责这个事。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:47:56</text>

行，或者我们这个会可以先结束了，我来跟他确认一下人之后，信息发。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:48:01</text>

发给你们。

<mention-user id="ou_1883019f892771d6ebe48a86ef751013"/> <text color="gray">00:48:03</text>

嗯，好的，行，那先这样。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:48:04</text>

好。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:48:06</text>

这个模块如果上的话，是804吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:48:06</text>

那先这样。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:48:11</text>

你们肯定要争取不要往804啊，804没几天了，804没几天了，这个需求的链路都还没讨论清楚，你们真的敢放吗？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:48:13</text>

是804，啊？

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:48:26</text>

时间也让他们来定一下吧。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:48:30</text>

对，我觉得你们对外和对内可能是两个口径啊，对内可以严要求，对外的话还是争取一下吧。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:48:39</text>

好好好，明白了。

<mention-user id="ou_3baf7833d83aa407032f6eef9f6fa18a"/> <text color="gray">00:48:45</text>

行，那先这样，好，拜拜。

<mention-user id="ou_0faa7dbeb66d9a507e9934c1f1024f49"/> <text color="gray">00:48:47</text>

好，拜拜，谢谢。

<mention-user id="ou_d35304ddd7e37a06ebac58f7f60b6522"/> <text color="gray">00:48:48</text>

好好，拜拜。
