import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const template = await fs.readFile('/Users/bytedance/.codex/skills/baoyu-diagram/references/svg-template.md', 'utf8');
const boilerplate = template.match(/```svg\n([\s\S]*?)\n```/)[1].split('  <!--')[0].replace('680 H','680 2480');
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const nodes=[], paths=[], extras=[];
const text=(x,y,s,cls='ts',anchor='start')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central">${esc(s)}</text>`;
function node(id,x,y,w,h,title,lines=[],color='gray') {
  nodes.push(`<g class="c-${color}" data-node="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>${text(x+16,y+22,title,'th')}${lines.map((s,i)=>text(x+16,y+46+18*i,s)).join('')}</g>`);
}
function arrow(d,label,x,y,dashed=false) {
  paths.push(`<path d="${d}" class="${dashed?'arr-alt':'arr'}" fill="none" marker-end="url(#arrow)"/>`);
  if(label) extras.push(text(x,y,label));
}
function phase(y,title){ extras.push(text(60,y,title,'eyebrow')); }
extras.push(text(340,42,'端侧天气任务：从开关到执行结果','title','middle'));
extras.push(text(340,70,'一个任务中心 · 本车长期开关 · 端侧天气闭环 · DT 不参与','ts','middle'));
node('prep',40,100,600,112,'接入前先对齐三类信息（不是运行时的三个步骤）',[
  '① 展示信息：名称、说明、适用车辆、排序；来源与排序策略待确认。',
  '② 端侧规则：本地天气脚本；列清天气任务对应的全部受控规则。',
  '③ 本车开关：按车保存选择；与展示项、规则使用同一任务对应关系。'
],'amber');
phase(242,'一｜开关接入');
node('center',60,264,330,80,'01 任务中心展示天气任务',[
  '接入本车适用的任务列表，查询当前开关',
  '读取前不猜开关；端云任务在同一任务中心'
],'blue');
node('user',60,382,330,64,'02 用户点击开启／关闭',[
  '提交：本车、哪项任务、目标开关状态'
],'blue');
node('state',60,484,330,110,'03 开关状态管理与通知【接入待定】',[
  '按最终方案保存本车选择，提供查询与恢复',
  '向 Trigger 提供初始状态及后续变化',
  '这是职责占位，不代表新建独立服务'
],'amber');
node('uiresult',450,484,190,110,'任务中心回显',[
  '按可确认的真实状态显示',
  '失败提示，未知不报成功',
  '生效反馈方式待确认'
],'blue');
node('consume',60,632,330,80,'04 端侧 Trigger 读取／订阅开关',[
  '只消费状态，不单独持久保存一份开关',
  '初始化与变化通知都要覆盖，不靠页面常驻'
],'blue');
extras.push(text(450,648,'候选路径：现有开关回调','anno'));
extras.push(text(450,666,'或数据中心，会上尚未选定','anno'));
extras.push(text(450,684,'保存成功不等于已生效','anno'));
arrow('M225 344 V372');
arrow('M60 304 H40 V540 H50','初次查询',46,362,true);
arrow('M225 446 V474');
arrow('M390 540 H440','结果',399,527);
arrow('M225 594 V622','初始值／变化',237,610);
phase(750,'二｜Trigger 判断');
node('gate',60,772,330,124,'05 结合开关与本地数据判断',[
  '任务已开启，所需信号与识别结果可用',
  '已有天气规则满足，且符合原提醒策略',
  '例：路面湿滑、车速达到规则阈值',
  '当前未处于目标模式；条件以正式规则为准'
],'blue');
node('data',450,772,190,96,'本地状态更新',[
  '车况、天气／路面识别',
  '更新后仍要检查任务开关',
  '不绕过开关直接触发'
]);
node('event',60,940,330,80,'06 Trigger 发出天气业务事件',[
  '标明哪项任务、哪次命中、相关场景信息',
  '交给天气业务，不把用户选择再送回 Trigger'
],'blue');
node('wait',450,940,190,80,'本次不产生新提醒',[
  '关闭／条件不符／重复命中',
  '等待下一次有效状态更新'
]);
arrow('M225 712 V762');
arrow('M450 814 H400','输入',405,801);
arrow('M225 896 V930','命中',237,916);
arrow('M390 874 H420 V978 H440','未命中',453,919,true);
phase(1070,'三｜卡片与本地确认');
node('register',60,1090,330,114,'07 天气业务确定建议并注册卡片',[
  '例：“当前路面湿滑，是否切换湿滑模式？”',
  '提供文案、播报、确认／取消按钮和回调',
  '绑定本次建议，并接入本地按钮语音表达',
  '有效范围与结果展示按场景接入要求定义'
],'teal');
node('show',60,1240,330,86,'08 即时交互卡排队并真正展示',[
  '展示询问和按钮，按语音状态播放播报',
  '语音不可用时仍保留手动操作'
],'teal');
node('failedshow',450,1240,190,86,'未展示或已失效',[
  '仍排队：等待，不能执行',
  '失败／过时：结束本次'
]);
node('click',60,1370,250,86,'09a 用户点击确认／取消',[
  '调用这张卡绑定的业务回调',
  '不是任务中心的长期开关'
],'teal');
node('voice',390,1370,250,86,'09b 用户说支持的按钮表达',[
  '本地“可见即可说”匹配按钮',
  '走同一按钮处理；不经过 DT'
],'teal');
node('choice',60,1500,330,106,'10 天气业务处理本次选择',[
  '核对属于当前建议，区分确认与取消',
  '明确有效确认：提交本次确定动作',
  '重复回应只忽略，不终止已受理的动作'
],'teal');
node('duplicate',450,1500,190,64,'重复／旧卡回应',[
  '忽略，不再次调用车控'
]);
node('cancel',450,1610,190,100,'本次不执行车控',[
  '取消／关闭卡片／无回应',
  '不改变任务长期开关',
  '结束并清理本次交互绑定'
]);
arrow('M225 1020 V1080');
arrow('M225 1204 V1230');
arrow('M390 1280 H440','未就绪',398,1265,true);
arrow('M225 1326 V1346 H185 V1360','已展示',67,1349);
arrow('M225 1346 H515 V1360');
arrow('M185 1456 V1480 H205 V1490');
arrow('M515 1456 V1480 H245 V1490');
arrow('M390 1532 H440');
arrow('M390 1578 H420 V1650 H440','拒绝',426,1631,true);
arrow('M390 1306 H420 V1334 H658 V1670 H650','关闭／超时',530,1590,true);
phase(1708,'四｜执行与结果');
node('execute',60,1730,330,100,'11 天气业务提交确定的车辆动作',[
  '执行层按已有车控限制处理，允许才执行',
  '不回 Trigger 重新跑整套触发规则',
  '开关关闭时的在途处理策略另行确认'
],'teal');
node('denied',450,1730,190,82,'执行条件不允许',[
  '不发车控，返回未执行原因',
  '由天气业务结束本次'
]);
node('control',60,1866,330,64,'12 赛力斯车控执行动作',[
  '例如切换到湿滑模式'
],'teal');
node('result',60,1966,330,100,'13 天气业务取得实际执行结果',[
  '结合车控反馈和实际车辆状态确认',
  '区分：成功／失败／暂不能确认',
  '更新或关闭卡片，清理本次按钮语音绑定'
],'teal');
node('end',60,2102,330,80,'14 本次处理结束',[
  '确认或取消均不修改任务中心长期开关',
  '后续状态更新仍回到步骤 05，先检查开关'
]);
extras.push(text(450,1993,'“请求已收到”不等于','anno'));
extras.push(text(450,2013,'“车辆已完成动作”','anno'));
extras.push(text(450,2033,'结果接口与更新能力需核实','anno'));
arrow('M225 1606 V1720','有效确认',237,1650);
arrow('M390 1780 H440','不允许',396,1765,true);
arrow('M225 1830 V1856','允许',237,1843);
arrow('M225 1930 V1956');
arrow('M225 2066 V2092');
node('review',40,2220,600,240,'评审还要收口的内容｜不冒充已确定的实现',[
  '① 列表来源与稳定排序；一项天气任务如何对应全部正式天气规则。',
  '② 开关由谁保存、查询和恢复；Trigger 最终读哪里、订阅哪里。',
  '③ 操作成功如何确认已生效；失败、未知、重启后如何回显与恢复。',
  '④ 关闭任务时，已排队卡、已展示卡和已发出的动作分别怎样处理。',
  '⑤ 正式天气场景联合验收：开关 → 命中 → 询问 → 确认 → 执行结果。',
  '',
  '分工：汪帅对接开关到 Trigger；任务中心需姜锋、楷朋、王梦尧参与。',
  '状态通道结合李鑫及仁杰、徐燃相关能力确认；具体接口与排期另行收口。',
  '已有测试链路基础，不等于正式天气任务已验收。'
],'amber');
const svg=boilerplate+paths.join('\n')+nodes.join('\n')+extras.join('\n')+'\n</svg>\n';
await fs.writeFile(path.join(dir,'diagram.svg'),svg);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1360,height:900},deviceScaleFactor:1,colorScheme:'light'});
await page.setContent(`<html><body style="margin:0;background:white">${svg}</body></html>`);
await page.evaluate(()=>document.fonts.ready);
const checks=await page.evaluate(()=>{
 const problems=[];
 for(const group of document.querySelectorAll('[data-node]')){
  const r=group.querySelector('rect').getBBox();
  for(const t of group.querySelectorAll('text')){if(!t.textContent)continue; const b=t.getBBox(); if(b.x<r.x+5||b.x+b.width>r.x+r.width-5||b.y+b.height>r.y+r.height-5) problems.push({node:group.dataset.node,text:t.textContent,box:r.toJSON?.(),bounds:{x:b.x,y:b.y,w:b.width,h:b.height}});}
 }
 return problems;
});
console.log(JSON.stringify({overflow:checks,nodeCount:nodes.length}));
await page.locator('svg').screenshot({path:path.join(dir,'diagram.png')});
await page.addScriptTag({path:'/tmp/edge-diagram-render.TPFQCi/node_modules/mermaid/dist/mermaid.min.js'});
const source=await fs.readFile(path.join(dir,'flow.mmd'),'utf8');
console.log(JSON.stringify({mermaid:await page.evaluate(async s=>{mermaid.initialize({startOnLoad:false});return await mermaid.parse(s);},source)}));
await browser.close();
