const fs = require('fs');
const path = require('path');
const out = __dirname;
const B='#185DB7', T='#0D4FA8', G='#73978A';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
class Canvas {
  constructor(title,h){this.h=h;this.bg=[];this.edges=[];this.nodes=[];this.labels=[];this.boxes={};this.text(55,60,title,36,true);}
  text(x,y,s,size=22,bold=false,group=this.labels){group.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${bold?600:400}" fill="${T}">${esc(s)}</text>`);}
  band(y,h,title){this.bg.push(`<rect x="40" y="${y}" width="1620" height="${h}" rx="16" fill="#F7F9FC" stroke="${B}" stroke-width="1.3"/>`);this.text(65,y+36,title,28,true);}
  box(id,x,y,w,title,lines=[],kind='normal',h=null){h=h||75+lines.length*32;this.boxes[id]={x,y,w,h,cx:x+w/2,cy:y+h/2};const color=kind==='note'?G:B, fill=kind==='focus'?'#EAF3FF':kind==='note'?'#F2F7F5':'#FFFFFF';this.nodes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${color}" stroke-width="${kind==='focus'?2.3:1.5}"/>`);this.text(x+20,y+35,title,26,true,this.nodes);lines.forEach((s,i)=>this.text(x+20,y+70+i*32,s,22,false,this.nodes));return this.boxes[id];}
  line(points,label='',lx=null,ly=null,dashed=false){this.edges.push(`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${B}" stroke-width="2.2"${dashed?' stroke-dasharray="7 5"':''} marker-end="url(#arrow)"/>`);if(label){const m=points[Math.floor(points.length/2)];this.text(lx??m[0],ly??m[1]-12,label,21,false);}}
  v(a,b,label=''){a=this.boxes[a];b=this.boxes[b];this.line([[a.cx,a.y+a.h],[a.cx,(a.y+a.h+b.y)/2],[b.cx,(a.y+a.h+b.y)/2],[b.cx,b.y]],label,a.cx+15,(a.y+a.h+b.y)/2-10);}
  hline(a,b,label=''){a=this.boxes[a];b=this.boxes[b];this.line([[a.x+a.w,a.cy],[b.x,b.cy]],label,(a.x+a.w+b.x)/2-40,a.cy-14);}
  save(name){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1700" height="${this.h}" viewBox="0 0 1700 ${this.h}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="${B}" stroke-width="1.4"/></marker></defs><rect x="0" y="0" width="1700" height="${this.h}" fill="#FFFFFF"/>${this.bg.join('')}${this.edges.join('')}${this.nodes.join('')}${this.labels.join('')}</svg>`;fs.writeFileSync(path.join(out,name+'.svg'),svg);}
}

const a=new Canvas('触发器后台：配置、判断、下游与记录的完整关系',1660);
a.band(100,280,'一、配置态｜配置人员把业务需求变成可发布的场景');
a.box('list',70,175,280,'场景管理',['筛选、详情、新建、复制','区分来源、类型、分类']);
a.box('mode',390,175,280,'判断定义',['简单：复用现有配置','Workflow：条件与推理']);
a.box('act',710,175,280,'下游与运行策略',['建议 Query、带卡、按钮','已有次数、间隔与范围']);
a.box('valid',1030,175,280,'校验与发布',['节点、依赖、输入合法','检查渠道与能力适用']);
a.box('def',1350,175,280,'生效的场景定义',['场景 ID 与 Workflow ID','动作、策略与适用范围'],'focus');
a.hline('list','mode');a.hline('mode','act');a.hline('act','valid');a.hline('valid','def');
a.band(420,255,'二、用户状态｜每车任务选择与 AI 设置不是同一层级');
a.box('tc',70,490,360,'任务中心',['查询本车任务与真实开关','用户选择开启或关闭']);
a.box('switch',510,490,620,'云端单车场景状态：Trigger 保存',['trigger_scene_effective_scope_vin','按车辆与场景读取；无记录沿现有 ON 规则'],'focus');
a.box('ai',1210,490,420,'AI 设置与能力开关',['独立提供总体与能力许可','按具体任务依赖读取']);
a.hline('tc','switch','设置');
a.line([[820,629],[820,653],[250,653],[250,629]],'真实状态及操作结果',385,645);
a.band(715,345,'三、运行态｜更新启动检查，全部判断通过后才交下游');
a.box('input',70,790,300,'实际输入',['端状态与 Context','VLM、任务及能力开关']);
a.box('wake',420,790,320,'Trigger 入口',['按信号更新找候选场景','采用范围与本车状态']);
a.box('wf',790,790,410,'按 workflow_id 唯一分流',['空：现有简单链路','非空：Workflow 判断','新路不重复执行旧判断'],'focus');
a.box('dispatch',1280,790,350,'既有动作分发',['仅判断满足才进入','策略 → 场景锁 → Action','Advisor/Recommend/Callback'],'focus');
a.hline('input','wake');a.hline('wake','wf');a.hline('wf','dispatch','PASS');
a.line([[820,675],[820,700],[580,700],[580,790]],'本车真实状态',840,700);
a.line([[1420,629],[1420,695],[220,695],[220,790]],'能力许可',1050,689);
a.line([[1490,314],[1648,314],[1648,760],[1190,760],[1190,790]],'读取发布定义',1390,747);
a.text(80,1028,'条件节点读真实数据；推理节点理解已有 VLM 内容。Trigger 不调用 DT / VQA 工具。',23,true);
a.band(1100,275,'四、下游业务｜三项云端任务沿主动推荐与 DT 处理询问和执行');
a.box('dt',70,1170,440,'主动推荐 → DT',['儿童锁、后视镜无需设备识别','充电口盖需先识别充电设备']);
a.box('vqa',630,1170,380,'充电专属：DT 调 VQA',['未发现或未知：不问开盖','明确发现设备：再交询问']);
a.box('card',1130,1170,500,'接入业务与主动服务卡',['按现有协议注册、下发卡片','处理确认/取消与车辆动作','Planner 不直接注册或拉起卡片']);
a.line([[1455,961],[1455,1080],[20,1080],[20,1239],[70,1239]],'按动作配置提交',640,1073);
a.hline('dt','vqa','充电');a.hline('vqa','card','发现设备');
a.line([[290,1170],[290,1150],[1380,1150],[1380,1170]],'儿童锁 / 后视镜',1200,1142);
a.band(1415,205,'五、可解释记录｜判断结果与下游结果分开，不把下游返回当成车辆成功');
a.box('run',70,1480,730,'Workflow Run / NodeRun',['每次运行与各节点：输入快照、阶段、结果、原因','PASS、REJECT、UNKNOWN 都有判断记录'],'focus');
a.box('history',860,1480,770,'History 与下游 Action 汇总',['策略允许后预创建；全部 Action 结束后统一更新','查看 Run 时关联；卡片和车控结果由下游联合验收'],'focus');
a.save('A1-总体架构');

const b=new Canvas('配置人员怎样新建、验证、发布与替换场景',2260);
b.band(100,380,'一、进入与选择｜先分清新建和已有 Workflow 修改');
b.box('start',610,165,480,'进入场景列表',['按渠道、环境、来源、类型、分类筛选'],'focus');
b.box('new',70,320,450,'新建场景',['选择简单或 Workflow 模式']);
b.box('old',610,320,480,'已有 Workflow 详情',['判断流程只读，当前不支持原地编辑']);
b.box('copy',1200,320,430,'复制重建',['复制原定义，独立修改','不改变原场景']);
b.v('start','new');b.v('start','old');b.text(420,292,'新建',21);b.text(870,307,'调整已有规则',21);b.hline('old','copy');
b.band(495,455,'二、定义判断｜字段、节点与依赖都要能解释清楚');
b.box('base',70,565,430,'基础信息与适用范围',['名称、分类、关联任务','渠道、车型、版本、车辆','显示实际部署环境']);
b.box('simple',590,565,450,'简单模式',['复用现有条件 / 推理配置','不生成 workflow_id']);
b.box('canvas',1130,565,500,'Workflow 画板',['仅添加条件或推理节点','连接依赖，单一终点','真实目标节点选 AND / OR']);
b.hline('base','simple','简单');b.line([[500,625],[550,625],[550,535],[1380,535],[1380,565]],'Workflow',920,526);
b.line([[295,427],[295,482],[295,565]]);b.line([[1415,459],[1415,482],[295,482],[295,565]]);
b.box('node',70,780,600,'每一项判断具体填什么',['条件：信号＋对象位置＋运算符＋值','推理：VLM 输入＋目标＋原始描述','无空白 Join、工具或车控节点']);
b.box('wake',790,780,840,'页面显示实际启动信号',['有动态条件：其信号更新启动；无动态：全部条件信号','推理入口：配置的 VLM ID；启动后仍完整判断','混合入口汇总、迟到输入与重复启动策略需收口'],'focus');
b.v('simple','node');b.v('canvas','node');b.hline('node','wake');
b.band(990,320,'三、配置出口｜判断、建议与执行限制分开填写');
b.box('out',70,1060,470,'选已有下游动作',['主动推荐带交互卡或已有出口','未接入的动作不能作为可用项']);
b.box('param',590,1060,500,'填写与预览下游参数',['建议 Query、带卡与协议按钮','不伪称 DT 生成正文是自由编辑','预览输入不等于最终卡片效果']);
b.box('policy',1210,1060,420,'填写已有执行策略',['次数、周期、间隔与单位','明确统计对象和起点','未确认策略不写默认承诺']);
b.v('wake','out');b.hline('out','param');b.hline('param','policy');
b.band(1350,355,'四、完整校验与验证｜能保存不等于真实业务能跑通');
b.box('check',70,1420,470,'完整校验',['字段合法、边有效、无环','全部节点可到达且可到终点','唯一终点与下游参数合法'],'focus');
b.box('save',610,1420,480,'保存有效定义',['Workflow 通过后才生成 ID','非法返回全部 issues，不写库','系统异常与配置问题分开']);
b.box('test',1170,1420,460,'真实测试环境联调',['输入、节点、策略、下游分别验证','带卡动作不能只看模拟器','缺能力或验证失败：先修正']);
b.v('policy','check');b.hline('check','save','通过');b.hline('save','test');
b.text(80,1653,'不通过：定位全部问题后返回对应字段或节点；新规则准备失败时保留原有效规则。',22,true);
b.band(1745,450,'五、发布与替换｜规则发布不能覆盖用户选择');
b.box('publish',70,1820,450,'新任务发布',['确认环境、适用范围与真实能力','发布状态 ≠ 本车任务状态']);
b.box('replace',610,1820,480,'替换已有任务：先确认方案',['旧新场景如何关联到同一任务','用户开关如何保持','避免同时生效并可失败回退'],'focus');
b.box('live',1180,1820,450,'发布后核对',['核对实际范围及任务中心状态','首条运行与下游反馈可追溯','历史查询使用当次定义']);
b.line([[1400,1591],[1400,1720],[295,1720],[295,1820]],'新任务',610,1710);
b.line([[1400,1591],[1400,1700],[850,1700],[850,1820]],'替换旧规则',1020,1687);
b.line([[295,1959],[295,2025],[1405,2025],[1405,1991]],'新任务发布后核对',640,2017);b.hline('replace','live','切换后');
b.box('limit',70,2045,1560,'当前限制与待确认',['已有 Workflow 不支持原地编辑；混合判定暂不开放定时；不承诺跨模式无损转换。','复制、选择保持、切换与回退是拟补产品方案；研发确认前不直接替换或默认覆盖。'],'note');
b.save('A2-配置发布流程');

const c=new Canvas('一次场景更新如何完成判断、拦截与下游提交',3440);
c.band(100,580,'一、启动与分流｜信号更新决定开始，不代表条件已经满足');
c.box('report',70,175,420,'端状态或 VLM 更新',['更新已配置输入信号','不是每条更新都执行车辆动作']);
c.box('wake',610,175,480,'确定实际启动信号',['动态：动态条件涉及的 ID','无动态：全部条件信号 ID','推理：配置的 VLM ID']);
c.box('candidate',1210,175,420,'获取候选场景',['按既有 Signal / VLM 入口','采用范围与本车实际状态']);
c.hline('report','wake');c.hline('wake','candidate');
c.box('route',610,410,480,'按 workflow_id 唯一路由',['空：继续旧判断；非空：新判断','新 Workflow 不进 runStatic / runDynamic'],'focus');
c.box('old',70,410,420,'简单模式：旧链路保持',['条件：现有静态 / 动态判断','推理：现有 InferenceTrigger','只有既有判断命中才进下游']);
c.box('snapshot',1210,410,420,'Workflow：建立本次上下文',['场景、车辆、启动方式','输入、动作、执行策略快照','创建 Run 与 NodeRun']);
c.v('candidate','route');c.line([[610,490],[490,490]],'空',525,477);c.hline('route','snapshot','非空');
c.text(80,641,'本期混合定时不开放；混合信号汇总与迟到输入处理待收口，不默认每条静态更新都会启动。',22,true);
c.band(720,750,'二、调度与单节点判断｜只支持条件节点和推理节点');
c.box('pending',70,795,420,'选择待处理节点',['无前驱的来源节点可直接就绪','有前驱的节点按汇合规则等待']);
c.box('join',610,795,480,'实际目标节点的前驱汇合',['AND / OR 配在这个节点上','只有前驱允许才进入 READY','不是新增一个空白汇合节点'],'focus');
c.box('ready',1210,795,420,'READY：执行自身判断',['汇合通过不等于自身 PASS','根据节点类型选择判断器']);
c.hline('pending','join','有前驱');c.hline('join','ready','允许');
c.line([[1415,581],[1415,700],[20,700],[20,848],[70,848]],'开始新路',720,692);
c.line([[280,795],[280,770],[1415,770],[1415,795]],'无前驱',635,758);
c.box('condition',70,1040,680,'条件节点：读取并完整判断',['规整信号、补齐 Context、查询旧值','检查本节点全部静态与动态条件','命中 PASS；未命中 REJECT；缺失或异常 UNKNOWN']);
c.box('inference',890,1040,740,'推理节点：理解已有 VLM 描述',['目标 goal ＋ 原始描述 original_query ＋ 本次输入','复用已有模型推理；不调用 DT / VQA 获取新信息','明确达成 PASS；未达成 REJECT；异常或不明 UNKNOWN']);
c.v('ready','condition','条件');c.v('ready','inference','推理');
c.box('state',70,1300,1560,'节点阶段与业务结果必须分开记录',['FINISHED：执行正常返回，仍可为 PASS / REJECT / UNKNOWN；FAILED：执行异常，结果 UNKNOWN。','SKIPPED：根本没有执行该节点，保存由 REJECT 或 UNKNOWN 阻断的原因；终态不可倒退。'],'focus');
c.v('condition','state');c.v('inference','state');
c.band(1510,655,'三、汇合与整图收敛｜OR 提前就绪，其他分支继续执行');
c.box('and',70,1580,730,'AND：全部满足后才能运行目标节点',['全部前驱 PASS → 目标 READY','任一前驱 REJECT → 立即跳过目标，阻断为 REJECT','全部前驱终态，无 REJECT 但有 UNKNOWN → 未知跳过'],'focus');
c.box('or',900,1580,730,'OR：任一满足即可运行目标节点',['任一前驱 PASS → 目标立即 READY','全前驱终态且无 PASS：有 UNKNOWN 则未知跳过','全前驱 REJECT 才按不满足跳过；其他分支不取消'],'focus');
c.box('all',70,1840,640,'持续调度并记录所有节点',['尚有节点未终态：继续依赖判断与执行','全部节点终态后才收敛本次 Workflow']);
c.box('sink',850,1840,780,'最终结果只取唯一终点',['终点 FINISHED：用自己的业务结果','终点 FAILED：UNKNOWN；SKIPPED：用阻断结果','不按全图多数投票，也不把任意前驱 PASS 当整体通过'],'focus');
c.line([[850,1439],[850,1490],[20,1490],[20,1895],[70,1895]]);c.hline('all','sink','全节点终态');
c.text(80,2110,'例：儿童识别 PASS、宠物识别 UNKNOWN，目标儿童锁条件节点按 OR 可运行；它仍要自行判断。',22,true);
c.band(2205,690,'四、通过后的动作出口｜PASS 之后仍可能被策略或场景锁拦截');
c.box('decision',610,2275,480,'Workflow 唯一终点结果',['PASS：进入共用动作分发','REJECT / UNKNOWN：只记录结束'],'focus');
c.line([[1630,1925],[1680,1925],[1680,2335],[1090,2335]],'唯一终点结果',1360,2320);
c.box('stop',70,2460,420,'不满足或无法判断',['保存 Run / NodeRun 与原因','不提交下游、不预创建 Action History'],'note');
c.box('policy',610,2460,480,'检查执行策略 → 取得场景锁',['两关都允许后才向下游提交','策略 / 锁失败：记录对应拦截','run_id 不是去重或车辆成功凭据']);
c.box('history',1210,2460,420,'允许后预创建 History',['关联本次场景与运行','按配置并发执行已有 Action']);
c.line([[610,2350],[280,2350],[280,2460]],'REJECT / UNKNOWN',90,2338);c.v('decision','policy','PASS');c.hline('policy','history','允许');
c.line([[280,584],[20,584],[20,2440],[850,2440],[850,2460]],'旧链路仅命中后进入',50,2430);
c.box('action',70,2670,630,'Advisor / Recommend / Callback',['不在判断图中新增执行车辆的工具节点','策略或锁拦截不写成模型 REJECT']);
c.box('finish',850,2670,780,'Action 全部结束后统一汇总',['一次更新 History.execute_result','查询 Run 时关联本次 Action 结果','下游调用返回成功不等于卡片展示或车辆成功'],'focus');
c.v('history','action');c.hline('action','finish','各项返回');
c.band(2935,450,'五、任务业务闭环｜这里只解释下游边界，不重新实现卡片与车控');
c.box('dt',70,3005,460,'三项云端任务经主动推荐 → DT',['儿童锁、后视镜不需额外设备识别','三项询问任务不是静默执行']);
c.box('vqa',630,3005,410,'充电口盖：DT 调 VQA',['先判断是否明确发现充电设备','无设备或未知：不发开盖询问']);
c.box('card',1150,3005,480,'接入业务按既有卡片协议处理',['注册、下发、询问与用户回应','用户确认后沿既有业务执行车控','Trigger 不拉卡，不调车控工具']);
c.line([[385,2809],[385,2910],[20,2910],[20,3058],[70,3058]]);c.hline('dt','vqa','充电');c.hline('vqa','card','明确发现');
c.line([[300,3005],[300,2990],[1390,2990],[1390,3005]],'儿童锁 / 后视镜',1260,2981);
c.text(80,3342,'对外解释：判断通过、策略允许、下游提交、卡片显示、用户确认、车辆成功，是不同的业务阶段。',23,true);
c.save('A3-运行判定与下游');
