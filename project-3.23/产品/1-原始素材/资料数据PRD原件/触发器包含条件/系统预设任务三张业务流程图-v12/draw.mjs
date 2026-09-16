import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const here=path.dirname(fileURLToPath(import.meta.url));
const require=createRequire(import.meta.url);
const sharp=require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const template=await fs.readFile('/Users/bytedance/.codex/skills/baoyu-diagram/references/svg-template.md','utf8');
const boilerplate=template.match(/  <style>[\s\S]*?<\/defs>/)[0];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const graphs=[];

class Flow {
  constructor(slug,title,subtitle){this.slug=slug;this.title=title;this.subtitle=subtitle;this.nodes=[];this.edges=[];this.phases=[];this.notes=[];graphs.push(this);}
  phase(y,text){this.phases.push({y,text});}
  box(id,y,title,body=[],o={}){const n={id,x:o.x??90,y,w:o.w??350,h:o.h??(48+body.length*18),title,body,color:o.color??'blue',gate:!!o.gate,pending:!!o.pending};this.nodes.push(n);return n;}
  gate(id,y,title,body,o={}){return this.box(id,y,title,body,{h:124,color:'amber',gate:true,...o});}
  side(id,y,title,body,o={}){return this.box(id,y,title,body,{x:510,w:130,color:'gray',...o});}
  edge(a,b,label='',o={}){this.edges.push({a,b,label,...o});}
  note(y,lines){this.notes.push({y,lines});}
  get(id){return this.nodes.find(n=>n.id===id);}
  points(e){
    const a=this.get(e.a),b=this.get(e.b),side=e.side??'down';
    if(e.points)return e.points;
    if(side==='right')return [[a.x+a.w,a.y+a.h/2],[b.x-10,b.y+b.h/2]];
    if(side==='left')return [[a.x,a.y+a.h/2],[b.x+b.w+10,b.y+b.h/2]];
    const ax=a.x+a.w/2,bx=b.x+b.w/2,ay=a.y+a.h,by=b.y-10;
    if(ax===bx)return [[ax,ay],[bx,by]];
    const mid=e.mid??(ay+by)/2;
    return [[ax,ay],[ax,mid],[bx,mid],[bx,by]];
  }
  mermaid(){
    const out=['flowchart TB'];
    for(const n of this.nodes){const label=[n.title,...n.body].join('<br/>').replaceAll('"','「');out.push(`    ${n.id}${n.gate?'{"':'["'}${label}${n.gate?'"}':'"]'}`);}
    for(const e of this.edges)out.push(`    ${e.a} ${e.dash?'-.->':'-->'}${e.label?`|${e.label.replaceAll('|','／')}|`:''} ${e.b}`);
    out.push('    classDef business fill:#E6F1FB,stroke:#185FA5,color:#0C447C;','    classDef screen fill:#E1F5EE,stroke:#0F6E56,color:#085041;','    classDef decision fill:#FAEEDA,stroke:#854F0B,color:#633806;','    classDef cloud fill:#EEEDFE,stroke:#534AB7,color:#3C3489;','    classDef neutral fill:#F1EFE8,stroke:#5F5E5A,color:#444441;');
    for(const [c,cl] of Object.entries({blue:'business',teal:'screen',amber:'decision',purple:'cloud',gray:'neutral'})){const ids=this.nodes.filter(n=>n.color===c).map(n=>n.id);if(ids.length)out.push(`    class ${ids.join(',')} ${cl};`);}
    return out.join('\n');
  }
  async save(){
    // Put branch captions beside vertical stems, never directly over them.
    for(const edge of this.edges){if(edge.labelAnchor==='middle' && edge.labelPos){edge.labelPos[0]+=12;edge.labelAnchor='start';}}
    const h=Math.max(...this.nodes.map(n=>n.y+n.h),...this.notes.map(n=>n.y+n.lines.length*18))+32;
    const text=(x,y,s,cl='ts',anchor='middle')=>`<text class="${cl}" x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central">${esc(s)}</text>`;
    let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 ${h}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif">\n${boilerplate}\n`;
    svg+='<style>.c-amber&gt;polygon{fill:#FAEEDA;stroke:#854F0B;stroke-width:.8}@media(prefers-color-scheme:dark){.c-amber&gt;polygon{fill:#633806;stroke:#EF9F27}}</style>\n';
    for(const e of this.edges){const p=this.points(e);svg+=`<path data-from="${e.a}" data-to="${e.b}" class="${e.dash?'arr-alt':'arr'}" d="${p.map((q,i)=>`${i?'L':'M'}${q[0]} ${q[1]}`).join(' ')}" fill="none" marker-end="url(#arrow)"/>\n`;}
    for(const n of this.nodes){
      const cx=n.x+n.w/2,cy=n.y+n.h/2;
      svg+=`<g class="c-${n.color}" data-node="${n.id}">`;
      if(n.gate)svg+=`<polygon points="${cx},${n.y} ${n.x+n.w},${cy} ${cx},${n.y+n.h} ${n.x},${cy}"/>`;
      else svg+=`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.color==='gray'?14:6}"${n.pending?' stroke-dasharray="5 4"':''}/>`;
      const top=n.gate?cy-(n.body.length*18)/2:n.y+23;
      svg+=text(cx,top,n.title,'th');
      n.body.forEach((s,i)=>svg+=text(cx,top+22+i*18,s));svg+='</g>\n';
    }
    svg+=text(340,34,this.title,'title')+text(340,63,this.subtitle);
    svg+=text(40,90,'读图：沿实线往下；虚线是条件退出；「待确认」不是已接通。','ts','start');
    svg+=text(40,111,'蓝色：任务业务　绿色：用户交互　紫色：云端协作　菱形：业务判断','ts','start');
    for(const p of this.phases){svg+=text(40,p.y,p.text,'eyebrow','start');}
    for(const e of this.edges){if(!e.label)continue;const p=this.points(e),pos=e.labelPos??(e.side==='right'?[(p[0][0]+p.at(-1)[0])/2,p[0][1]-12]:[p[0][0]+12,p[0][1]+18]);svg+=text(pos[0],pos[1],e.label,'ts',e.labelAnchor??(e.side==='right'?'middle':'start'));}
    for(const note of this.notes)note.lines.forEach((s,i)=>svg+=text(40,note.y+i*18,s,'ts','start'));
    svg+='</svg>\n';
    const dir=path.join(here,this.slug);await fs.mkdir(dir,{recursive:true});
    for(const ext of ['svg','png','mmd']){const dest=path.join(dir,`diagram.${ext}`);if(!process.argv.includes('--replace-generated')){try{await fs.access(dest);throw Error(`Refuse overwrite ${dest}`);}catch(e){if(e.code!=='ENOENT')throw e;}}}
    await fs.writeFile(path.join(dir,'diagram.svg'),svg);
    await fs.writeFile(path.join(dir,'diagram.mmd'),this.mermaid()+'\n');
    await sharp(Buffer.from(svg),{density:144}).flatten({background:'#ffffff'}).png().toFile(path.join(dir,'diagram.png'));
    await fs.writeFile(path.join(dir,'plan.md'),`# ${this.title}\n\n类型：自上而下业务流程图；${this.nodes.length} 个节点；画布 680 × ${h}。\n\n${this.nodes.map(n=>`- ${n.id}：${[n.title,...n.body].join('；')}。位置 (${n.x},${n.y})，尺寸 ${n.w}×${n.h}。`).join('\n')}\n\n箭头：${this.edges.map(e=>`${e.a} → ${e.b}（${e.label||'继续'}）`).join('；')}。\n`);
    return {slug:this.slug,nodes:this.nodes.length,edges:this.edges.length,height:h};
  }
}

// 01: explicit manual coordinates, business lifecycle rather than infrastructure layers.
const g=new Flow('01-总业务框架','01｜系统预设任务总业务流程','一项长期服务怎样从产品定义，走到用户真正得到结果');
g.phase(146,'一、定义并接通任务');
g.box('P',170,'字节产品＋赛力斯需求方', ['写清场景、触发条件、交互方式、车辆动作','同时写清：何时不处理、怎样算成功、何时再触发']);
g.box('CAP',310,'各能力团队确认能否承接',['信号／识别、触发器、任务中心、卡片／语音、车控','确认各自提供什么、交给谁、还缺什么']);
g.gate('OK',450,'关键能力接齐了吗？',['每一段有人接、规则可执行']);
g.side('GAP',450,'未齐：先补缺口',['补信号或功能','明确承接团队','补齐后再检查'],{h:124});
g.box('PUB',630,'配置／端侧研发完成接入与发布',['任务中心拿到：名称、说明、开关、操作接收方','运行方拿到：条件、后续处理、交互与结果要求','现状：云端配置已有能力；端侧仍有按需求开发'],{h:106});
g.edge('P','CAP','完整需求');g.edge('CAP','OK','能力与缺口');g.edge('OK','GAP','否',{side:'right',dash:true});g.edge('OK','PUB','是');
g.phase(788,'二、用户启停整项服务');
g.box('TC',816,'任务中心展示任务；用户开启或关闭',['展示内容来自任务接入方','把“哪项任务、要开还是关”交给指定接入方'],{color:'teal'});
g.box('BIZ',958,'任务接入方处理启停并保存真实状态',['真正使任务生效／停用，再反馈成功或失败','天气／充电由谁承接这段：待研发认领']);
g.side('UI',958,'任务中心回显',['按真实结果','更新开关状态','失败不显示成功'],{color:'teal',h:106});
g.gate('ON',1108,'任务已有效开启吗？',['触发器拿真实状态，不读按钮颜色']);
g.side('OFF',1108,'关闭／状态未知',['不启动新处理','撤销未执行建议','恢复真值后再判断'],{h:124});
g.edge('PUB','TC','展示与接入资料');g.edge('TC','BIZ','用户操作');g.edge('BIZ','UI','结果',{side:'right'});g.edge('BIZ','ON','可读取的任务状态');g.edge('ON','OFF','否',{side:'right',dash:true});
g.phase(1278,'三、端侧或云端判断');
g.box('ROUTE',1306,'按任务定义选择判断链路',['端侧／云端说的是处理位置，不是公司归属','所需规则和后续能力须已接入；不随网络随意切换']);
g.edge('PUB','ROUTE','任务规则与处理定义',{points:[[90,683],[30,683],[30,1348],[80,1348]],labelPos:[40,1250]});
g.box('EDGE',1460,'端侧触发器',['读取本地车况和视觉结果','检查场景条件、数据可用、防重复','例：天气保护'],{x:50,w:260,h:106});
g.box('CLOUD',1460,'云端触发器',['读取已上行的状态','检查启动条件、时效、防重复','例：充电前置条件'],{x:370,w:260,h:106,color:'purple'});
g.box('ET',1630,'端侧任务业务确定处理目标',['明确规则已能确定建议／动作','例：建议切换湿滑模式'],{x:50,w:260,h:100});
g.box('AI',1630,'云端业务补充判断',['规则足够则直接明确处理目标','否则交主动推荐／模型工具','例：继续识别充电设备'],{x:370,w:260,h:100,color:'purple'});
g.gate('TARGET',1800,'本次处理目标明确吗？',['条件满足、结果有效且未重复']);
g.side('WAIT',1800,'不进入后续处理',['条件未满足就等','识别不明不猜测','等下次有效更新'],{h:124});
g.edge('ON','ROUTE','是');g.edge('ROUTE','EDGE','端侧任务',{labelPos:[180,1431],labelAnchor:'middle',mid:1420});g.edge('ROUTE','CLOUD','云端任务',{labelPos:[500,1431],labelAnchor:'middle',mid:1420});g.edge('EDGE','ET','符合条件');g.edge('CLOUD','AI','值得继续处理');g.edge('ET','TARGET','明确建议',{labelPos:[110,1749]});g.edge('AI','TARGET','明确结果',{labelPos:[430,1749]});g.edge('TARGET','WAIT','否',{side:'right',dash:true});
g.phase(1972,'四、按任务约定交互');
g.box('MODE',2000,'查这项任务约定的交互方式',['本次允许静默执行，还是需要先询问用户？']);
g.box('SILENT',2134,'静默任务',['当前表：儿童锁、后视镜加热','不出卡、不播语音','端云部署和执行规则仍须会签'],{x:40,w:180,h:118,color:'gray'});
g.box('EASK',2134,'端侧询问（图二）',['天气业务提供卡片内容','用户点击／本地按钮语音','选择回到天气业务'],{x:240,w:180,h:118,color:'teal'});
g.box('CASK',2134,'云端询问（图三）',['云端业务组织卡片','点击／语音走约定路线','本例由 Planner 承接'],{x:440,w:180,h:118,color:'teal'});
g.gate('CONSENT',2330,'这次得到有效确认吗？',['两条询问链路分别校验当前选择']);
g.side('CANCEL',2330,'未获有效确认',['本次不操作车辆','拒绝／关闭／超时','不等于关闭整项任务'],{h:124});
g.edge('TARGET','MODE','是');g.edge('MODE','SILENT','静默',{labelPos:[130,2109],labelAnchor:'middle',mid:2089});g.edge('MODE','EASK','本地询问',{labelPos:[330,2109],labelAnchor:'middle',mid:2089});g.edge('MODE','CASK','云端询问',{labelPos:[530,2109],labelAnchor:'middle',mid:2089});g.edge('EASK','CONSENT','本次选择',{labelPos:[270,2270]});g.edge('CASK','CONSENT','本次选择',{labelPos:[463,2270]});g.edge('CONSENT','CANCEL','否',{side:'right',dash:true});
g.phase(2504,'五、执行与真实结果');
g.gate('PRE',2532,'端侧执行前复核通过吗？',['任务仍有效、车况允许、没有重复']);
g.side('ABORT',2532,'不执行新动作',['过期／任务已关闭','车况不再允许','告知本次未执行'],{h:124});
g.box('CAR',2716,'赛力斯车控执行明确动作',['端侧执行逻辑提交目标动作','收到请求不等于车辆已完成'],{color:'gray'});
g.box('READ',2856,'执行业务读取真实车辆状态',['达到目标：成功；明确未完成：失败','状态无法确认：结果暂不能确认'],{color:'gray'});
g.box('RESULT',2996,'任务业务反馈结果并结束本次',['有有效卡片才更新；按约定回传任务状态／记录','整项任务仍开启：等待下一次符合规则的场景','关闭任务不自动恢复已经改变的车辆功能'],{h:106});
g.edge('CONSENT','PRE','是');g.edge('SILENT','PRE','静默策略允许',{points:[[130,2252],[65,2252],[65,2594],[80,2594]],labelPos:[72,2480]});g.edge('PRE','ABORT','否',{side:'right',dash:true});g.edge('PRE','CAR','是');g.edge('CAR','READ','实际执行后');g.edge('READ','RESULT','真实结果');
g.note(3154,['评审方案，不表示已全部上线；完整性、过期撤销、复核和结果反馈须逐项会签。','“任务业务”是必须有人负责的工作，不意味着新增一个同名系统。','依据：任务全集、任务中心 PRD、VUI、9月1日评审；详见同目录来源说明。']);

// 02: weather stays local; manual and VAS return to the same business handler.
const e=new Flow('02-端侧天气','02｜端侧天气保护业务流程','例：下雨时建议切湿滑模式；确认、执行、结果都在本地衔接');
e.phase(146,'一、任务生效与数据接入');
e.box('TC',170,'用户在任务中心开启天气保护',['任务中心转发开启操作；不直接切驾驶模式'],{color:'teal'});
e.box('ENABLE',292,'天气任务接入方处理真实开启',['保存结果，返回任务中心，并让本地触发器可读取','开关状态如何同步、具体由谁承接：待会签']);
e.box('DATA',432,'端侧触发器收到相关数据更新',['赛力斯提供：车速、驾驶模式等真实车况','字节视觉能力提供：天气／路面结构化识别结果','相关条件更新后重新判断，不只等天气变化'],{h:106});
e.gate('VALID',594,'任务有效且数据可用吗？',['状态不明、识别过时都不能当满足']);
e.side('WAIT',594,'暂不发起建议',['不开卡、不车控','等待有效更新','任务关闭则停用'],{h:124});
e.edge('TC','ENABLE','开启操作');e.edge('ENABLE','DATA','真实有效状态');e.edge('DATA','VALID','当前数据');e.edge('VALID','WAIT','否',{side:'right',dash:true});
e.phase(764,'二、判断是否发起建议');
e.box('RULE',792,'触发器检查这条湿滑建议的规则',['天气下雨／路面湿滑，且车速大于30 km/h','驾驶模式还不是湿滑；识别稳定、本次没有重复','并且／或者、稳定与频控参数：按评审结论落地'],{h:106});
e.gate('HIT',954,'场景规则全部满足吗？',['例：车速46，仍下雨，普通模式']);
e.side('NOTYET',954,'继续等待更新',['例：下雨但车速20','此时不出卡','之后车速满足再判断'],{h:124});
e.box('ASKDEF',1134,'天气任务业务准备本次询问',['告诉卡片：建议切湿滑模式；确认／取消按钮','提供播报文本、允许的按钮表达、建议有效范围','说明这次询问对应哪个任务、哪个建议'],{h:106});
e.edge('VALID','RULE','是');e.edge('RULE','HIT','逐项判断');e.edge('HIT','NOTYET','否',{side:'right',dash:true});e.edge('HIT','ASKDEF','是');
e.phase(1290,'三、出卡并接收用户回应');
e.box('CARD',1318,'天气业务请求本地即时交互卡',['卡片负责接收、按优先级排队、展示和反馈','此处不经过 Planner；请求受理不等于已显示'],{color:'teal'});
e.gate('SHOWN',1458,'卡片已真正展示了吗？',['仍在排队时，不能当作用户已看见']);
e.side('QUEUE',1458,'未展示：等待',['轮到且有效再显示','过期、失败或任务关','撤销本次，不车控'],{h:124});
e.box('VISIBLE',1640,'车机展示“是否切换湿滑模式？”',['确认／取消按钮；按语音策略播报提示文本','卡片接入方注册当前按钮词，结束时注销','禁播音／禁识别的降级方式需交互团队确认'],{h:106,color:'teal'});
e.box('CLICK',1820,'用户手动点击',['确认／取消原按钮','直接触发原按钮处理'],{x:50,w:260,h:124,color:'teal'});
e.box('VAS',1820,'用户说出支持的按钮表达',['可见即可说：语音匹配当前按钮','语音能力返回命中的按钮','注册方模拟同一个原按钮点击'],{x:370,w:260,h:124,color:'teal'});
e.box('CHOICE',2020,'天气业务收到本次交互结果',['确认或取消；关联当前这一次有效询问','卡片另行反馈关闭／超时／被替换等生命周期','同次点击与语音只处理一次，不直接重复车控'],{h:106});
e.edge('VISIBLE','CHOICE','关闭／超时',{points:[[90,1693],[25,1693],[25,2073],[80,2073]],labelPos:[40,2000],dash:true});
e.gate('YES',2182,'是这次有效的确认吗？',['当前询问未过期，且尚未处理']);
e.side('NO',2182,'未获有效确认',['取消／关闭／超时','旧卡／重复回应','结束本次，不执行'],{h:124});
e.edge('ASKDEF','CARD','本次询问内容');e.edge('CARD','SHOWN','展示状态');e.edge('SHOWN','QUEUE','否',{side:'right',dash:true});e.edge('SHOWN','VISIBLE','是');e.edge('QUEUE','VISIBLE','可展示',{points:[[575,1582],[575,1611],[455,1611],[455,1681],[450,1681]],labelPos:[493,1626]});e.edge('VISIBLE','CLICK','手动',{mid:1775,labelPos:[180,1793],labelAnchor:'middle'});e.edge('VISIBLE','VAS','语音',{mid:1775,labelPos:[500,1793],labelAnchor:'middle'});e.edge('CLICK','CHOICE','原按钮结果',{mid:1980,labelPos:[75,1965]});e.edge('VAS','CHOICE','同一按钮结果',{mid:1980,labelPos:[418,1965]});e.edge('CHOICE','YES','核对用户选择');e.edge('YES','NO','否',{side:'right',dash:true});
e.phase(2354,'四、复核、执行与反馈');
e.gate('PRE',2382,'最新任务和车况仍允许吗？',['任务未关、建议有效、车辆允许']);
e.side('ABORT',2382,'取消本次执行',['条件已变／已处理','返回未执行原因','不重复发车控'],{h:124});
e.box('EXEC',2564,'天气执行业务请求切换湿滑模式',['端侧执行逻辑调用赛力斯车控','“收到请求”仅是过程，尚不能报切换成功'],{color:'gray'});
e.box('READ',2704,'读取当前真实驾驶模式',['实际已是湿滑：成功；明确失败：失败','无法获取可信状态：暂不能确认成功'],{color:'gray'});
e.box('RESULT',2844,'天气业务把真实结果交回卡片',['卡片显示本次成功／失败／暂不能确认','结束本次，取消旧确认按钮词，按规则继续等待','用户取消这次建议，不等于关闭天气保护'],{h:106,color:'teal'});
e.edge('YES','PRE','是');e.edge('PRE','ABORT','否',{side:'right',dash:true});e.edge('PRE','EXEC','是');e.edge('EXEC','READ','车辆处理后');e.edge('READ','RESULT','实际结果');
e.note(3000,['职责边界：触发器判断场景；天气业务提供建议并承接选择；卡片不判断天气。','上图只展开湿滑分支；雾天建议开后雾灯、冰雪建议切雪地应分别确认动作。','恢复天气后是否再次询问恢复模式，另按恢复规则处理；不自动沿用旧确认。','评审方案：条件组合、排队撤销、复核条件、离线全链路及个人承接方仍须会签。']);

// 03: keep endpoint DT-result retrieval and explicitly expose the unresolved confirmation handoff.
const c=new Flow('03-云端充电','03｜云端充电口盖业务流程','先判断值得检查，再识别、询问；最后仍由车辆端复核和执行');
c.phase(146,'一、检查本次停车条件');
c.box('TC',170,'用户开启充电口预设任务',['任务中心转发操作；充电任务接入方保存真实结果','真实任务状态提供给云端触发器；开关不等于授权'],{color:'teal'});
c.box('UP',310,'车端上报已接入的车辆信息',['例：档位由D变P、电量18%、充电口盖关闭','同时提供任务有效状态、AI主动服务开关状态','P挡连续上报多次，仍然只算同一次停车'],{h:106});
c.gate('HARD',646,'本次充电前置条件满足吗？',['满足只代表值得检查']);
c.side('WAIT',646,'不满足：继续等',['不启动设备检查','不出开盖卡','等待下次适用事件'],{h:124});
c.box('COND',472,'云端触发器检查充电规则',['任务有效＋AI主动服务开＋非P变P','电量≤20%＋口盖关闭＋本次停车未重复','此时还不知道旁边有没有充电设备'],{h:106,color:'purple'});
c.box('QUERY',814,'触发器发起一次主动推荐请求',['交给主动推荐：本次停车场景＋设备检查目标','Query示例：看看有无充电桩，有的话打开充电口','这是系统检查请求，不是用户本次开盖授权'],{h:106,color:'purple'});
c.edge('TC','UP','任务状态已可读取');c.edge('UP','COND','本次停车与当前状态');c.edge('COND','HARD','逐项检查');c.edge('HARD','WAIT','否',{side:'right',dash:true});c.edge('HARD','QUERY','是，只启动检查');
c.phase(970,'二、识别设备并形成建议');
c.box('DT',998,'主动推荐调用 DT 协作判断',['DT接收场景问题，按现有能力请求视觉问答','端侧视觉问答基于当前画面判断有无设备'],{color:'purple'});
c.box('OBS',1138,'端侧视觉能力返回观察结果',['区分：有设备、无设备、不能判断、调用失败','结果必须对应本次停车，不能拿旧观察充数']);
c.box('FETCH',1278,'端侧按现有链路上行获取 DT 结果',['保留原链路的“端侧取到推理结果”这一步','取到结果后，不能绕过新增的二次确认直接执行']);
c.gate('FOUND',1418,'当前明确发现设备了吗？',['推理结果有效，仍是这次停车']);
c.side('NOCARD',1418,'无／未知／失败',['过时也不能继续','不出开盖确认卡','不打开充电口'],{h:124});
c.box('HANDOFF',1598,'待确认：谁把结果转成开盖建议？',['端侧结果接入方 → 充电建议承接方 → Planner','需会签接收方、当前建议关联、确认前拦截执行','此箭头表达必须补齐的交接，不表示已经接通'],{h:106,color:'amber',pending:true});
c.edge('QUERY','DT','检查请求');c.edge('DT','OBS','观察问题');c.edge('OBS','FETCH','DT协作得到判断');c.edge('FETCH','FOUND','本次推理结果');c.edge('FOUND','NOCARD','否',{side:'right',dash:true});c.edge('FOUND','HANDOFF','是，形成待确认建议');
c.phase(1754,'三、云端询问与用户回答');
c.box('PLANNER',1782,'沿静态 Advisor 询问链路交 Planner',['Advisor是主动推荐；Planner承接当前建议和对话','带上本次停车、要打开的口盖、建议有效范围','本任务最终选用此卡片路线，仍须接入会签'],{h:106,color:'purple'});
c.box('CARD',1948,'Planner给车机即时卡发送询问内容',['问“要打开充电口吗？”；提供按钮与播报内容','车机卡片／VUI负责受理、排队和真正显示'],{color:'teal'});
c.gate('SHOW',2088,'本次卡片已展示且有效吗？',['排队未显示，不等于用户已看见']);
c.side('QUEUE',2088,'暂未展示',['排队且有效则等待','过期／失败则终止','没有确认不开盖'],{h:124});
c.box('VOICE',2270,'用户语音回答',['当前语音＋当前卡片上下文','一起交给 Planner','理解这次说的是哪个建议'],{x:50,w:260,h:106,color:'teal'});
c.box('CLICK',2270,'用户点击确认或取消',['静态 Advisor 卡：模拟 Query','带上当前按钮和建议的对应关系','发给 Planner；不直接车控'],{x:370,w:260,h:106,color:'teal'});
c.box('INTENT',2452,'Planner处理本次回应',['明确同意才进入开盖；明确拒绝则结束本次','关闭或超时没有授权；其他诉求转正常对话','例：“不要，帮我找充电站”不算同意开盖'],{h:106,color:'purple'});
c.edge('SHOW','INTENT','关闭／超时',{points:[[90,2150],[25,2150],[25,2505],[80,2505]],labelPos:[40,2431],dash:true});
c.gate('CONSENT',2614,'明确同意这一次开盖吗？',['回应未过期，当前建议未被消费']);
c.side('CANCEL',2614,'不执行本次开盖',['拒绝／关闭／超时','旧卡／不明确回应','新诉求另走正常对话'],{h:124});
c.box('REQUEST',2794,'Planner请求端侧执行本次开盖',['带上本次任务、停车与建议的关联信息','不能只发一个脱离场景的“确认”']);
c.edge('HANDOFF','PLANNER','待接入会签');c.edge('PLANNER','CARD','当前建议与询问');c.edge('CARD','SHOW','展示结果',{labelPos:[277,2042]});c.edge('SHOW','QUEUE','否',{side:'right',dash:true});c.edge('SHOW','VOICE','是，语音回答',{mid:2230,labelPos:[180,2250],labelAnchor:'middle'});c.edge('SHOW','CLICK','是，手动点击',{mid:2230,labelPos:[500,2250],labelAnchor:'middle'});c.edge('QUEUE','SHOW','可显示再检查',{points:[[575,2212],[575,2240],[660,2240],[660,2056],[265,2056],[265,2078]],labelPos:[490,2042]});c.edge('VOICE','INTENT','语音与上下文',{mid:2408,labelPos:[55,2393]});c.edge('CLICK','INTENT','模拟的 Query',{mid:2408,labelPos:[390,2393]});c.edge('INTENT','CONSENT','判断用户意图');c.edge('CONSENT','CANCEL','否',{side:'right',dash:true});c.edge('CONSENT','REQUEST','是');
c.phase(2934,'四、端侧复核与开盖结果');
c.gate('PRE',2962,'端侧最新状态允许开盖吗？',['任务有效、仍是本次停车、仍在P挡']);
c.side('ABORT',2962,'不发新开盖请求',['车况变化／已失效','已经处理／已经打开','回传原因或当前状态'],{h:124});
c.box('GUARD',3142,'端侧执行逻辑复核完整适用范围',['口盖仍关闭、结果和确认未过期、没有重复','遵守车辆动作限制；未知状态不当作允许','启动阈值哪些也要用于复核，由业务与车控会签']);
c.box('EXEC',3300,'赛力斯车控打开充电口盖',['端侧提交明确开盖动作；车控处理请求','请求返回成功，不等于口盖实际已打开'],{color:'gray'});
c.box('REAL',3440,'端侧读取充电口盖真实状态',['已打开：成功；明确无法打开：失败','真实状态无法确认：暂不能确认成功'],{color:'gray'});
c.box('RESULT',3580,'回传本次结果，更新卡片与云端上下文',['端侧把真实结果给本次充电业务／Planner','有有效卡片再更新；按约定保存本次处理记录','本次结束，长期任务继续等下一次合适停车'],{h:106,color:'teal'});
c.edge('REQUEST','PRE','执行请求');c.edge('PRE','ABORT','否',{side:'right',dash:true});c.edge('PRE','GUARD','是，继续核对');c.edge('GUARD','EXEC','全部通过');c.edge('GUARD','ABORT','任一不通过',{points:[[440,3193],[470,3193],[470,3024],[500,3024]],labelPos:[477,3115]});c.edge('EXEC','REAL','车辆处理后');c.edge('REAL','RESULT','真实结果');
c.note(3736,['本图是充电任务的云端协作方案，不代表所有云端任务都必须经过 DT 或视觉问答。','云端卡仍显示在车机；本例点击模拟 Query，不能混成其他卡片类型的直接回调。','断网／过期结果不能用于新开盖；已发出的动作应继续核对真实状态，不伪报未执行。','依据：当前任务全集、原充电链路、评审逐字稿及 VUI 静态 Advisor 卡；交接待会签。']);

const reports=[];
for(const graph of graphs){reports.push(await graph.save());}
await fs.writeFile(path.join(here,'三张业务流程图-Mermaid.md'),`# 系统预设任务：三张业务流程图\n\n> 业务评审方案，不代表已全部上线；每张图的待确认项请按图注会签。\n\n${graphs.map(g=>`## ${g.title}\n\n${g.subtitle}。\n\n\`\`\`mermaid\n${g.mermaid()}\n\`\`\`\n`).join('\n')}\n`);
await fs.writeFile(path.join(here,'render-report.json'),JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports,null,2));
