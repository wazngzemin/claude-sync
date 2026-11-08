import fs from 'node:fs';
import path from 'node:path';

const omittedTables=new Set(['R-version-separation','E-driver-version-correction','DR-version','DR-boundaries','F-coverage-prompt-version-contract','F-concept-prd-release-evidence','K-phone-variant-comparison','K-project-month-privacy-scope','T-october-delivery-is-not-one-switch','P-template-package-and-acceptance','EV-register-scope','EV-register-empty','EL-register-contract-audit','se-evidence']);
const tableCells={
 'C-knowledge-versus-state.3.1':'只使用当前项目、车型和身份允许访问的内容',
 'E-driver-handoff-boundary.5.3':'按该车智驾接口约定检查停稳、挡位和灯光等实际终态',
 'DR-poi.0.1':'保留原 A/B/C 及 A/B 的临停要求，另检查模型是否遗失前面的点',
 'K-types.1.2':'这套摘要方案从第 3 轮开始逐轮压缩，最多保留 22 轮、最长 500 token；以项目生效配置为准',
 'K-diagnosis.0.1':'原始请求、采集授权和事件内容',
 'A-caption-rule-options.1.2':'取字段后按规则判断，取字段的责任方仍需明确'
};
const columnNames={
 '资料明确的工作':'负责的工作','已读文档主控':'负责的模块','文档给出的处理/现象':'处理方式与可能的问题','材料或状态':'设计或状态','资料或事实':'信息类型','记录什么与原文字段':'记录内容与字段','模板、生产与消费口径':'产生和使用方式','事件 / 原表位置':'事件及编号','资料中的集合':'测试集合','资料中的标签线索':'问题分类线索','已读材料中的问题':'需要检查的问题'
};
const subtitles={
 V:'先收音并保留说话位置，识别与判停并行，最终文字确认后再交办。',
 R:'区分已激活与免唤醒入口，在各路候选之间确定实际执行者。',
 I:'分别处理停播、输入合并、旧计算和已发动作，拒识后的恢复按项目策略办理。',
 W:'页面词表与当前界面绑定，命中后执行对应操作，失效词不能继续接管请求。',
 M:'把用户新话、建议和工具反馈安排到合适轮次，再分别控制计算与发布。',
 C:'按本轮需要准备当前事实、历史和身份信息，缺失与过期状态明确交给决策。',
 D:'明确目标和未知事实，决定说什么、调什么工具，再根据反馈继续判断。',
 E:'动作清单交给对应实现，跟踪实际结果并回到下一轮判断。',
 K:'识别信息属于谁，按授权生成和使用记忆，并让删除与关闭实际生效。',
 F:'确认当前能力与参数，调用正确 Agent，再把结果交回原业务。',
 T:'保存未来安排，条件到达后恢复处理，取消时切断后续活动。',
 G:'结合信号与运行策略判断条件，命中后通知原业务继续处理。',
 L:'本地规则命中后，由原业务接住确认、执行和真实反馈。',
 S:'从当前环境发现值得关注的情况，再决定是否建议、如何触达和怎样继续。',
 P:'把适用范围、条件和出口配置清楚，发布后验证车辆实际生效及退出。',
 A:'分别处理默认观察、任务专属观察和用户问图，结果送回正确的消费方。',
 H:'条件成立后分路发送文字与动效，再分别确认用户是否真实看见。',
 O:'回复、声音、卡片和车辆结果各自推进，最后对应到同一次用户请求。',
 B:'持续提供有归属、有时间的事实，分别供上下文、规则和主动服务使用。',
 U:'让用户看见安排、确认操作或取消任务，并与后台真实状态同步。'
};

export function applyReaderEdition({root,base,pages,walkthroughs}){
 const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name+'.json'),'utf8'));
 const edits=read('reader-page-edits');
 const polish=read('reader-polish');
 const pageMap=new Map(pages.map(p=>[p.id,p]));
 for(const [key,value]of Object.entries({...edits.edits,...polish.edits})){
  const [module,...parts]=key.split('.');let target=pageMap.get(module);
  for(const part of parts.slice(0,-1))target=target?.[part];
  const field=parts.at(-1);if(!target||!(field in target))throw Error('Invalid reader edit '+key);
  target[field]=value;
 }
 const normalizeStatus=value=>{
  if(Array.isArray(value))return value.map(normalizeStatus);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,normalizeStatus(v)]));
  return typeof value==='string'?(polish.exactReplacements?.[value]??edits.exactStatusReplacements[value]??value):value;
 };
 for(const page of pages){
  for(const key of ['flows','cases','questions','metrics','roadmap','terms','related','sections','teaching'])page[key]=normalizeStatus(page[key]);
  const teaching=page.teaching;
  page.summary=teaching.intro[0];
  page.scenario=teaching.intro[0];
  delete page.why;
  page.legacyChapterTargets={};
  page.referenceTables=[];
  page.sections=page.sections.map(section=>{
   const lesson=teaching.lessons.find(l=>l.covers.includes(section.id));
   if(!lesson)throw Error('No lesson for legacy chapter '+section.id);
   page.legacyChapterTargets[section.id]=lesson.id;
   let table;
   if(section.table&&!omittedTables.has(section.id)){
    table={columns:section.table.columns.map(s=>columnNames[s]||s),rows:section.table.rows.map((row,i)=>row.map((v,j)=>tableCells[section.id+'.'+i+'.'+j]??v))};
    const title=section.title.replace(/原始|原文|资料|本次|本轮/g,'').replace(/逐表审读|完整性审计/g,'字段说明');
    page.referenceTables.push({id:section.id,title,table,sourceIds:section.sourceIds||[]});
   }
   // Stable chapter ids remain usable, but only the new teaching prose is shipped.
   return {id:section.id,title:lesson.title,paragraphs:lesson.paragraphs,teachingTarget:lesson.id,...(table?{table}:{}),sourceIds:section.sourceIds||[]};
  });
 }
 const replacements=[...read('reader-nodes-main').nodes,...read('reader-nodes-async').nodes];
 const byNode=new Map(replacements.map(n=>[n.id,n]));
 if(byNode.size!==291||replacements.length!==291)throw Error('Reader edition must rewrite all 291 nodes');
 for(const module of base.modules){
  module.subtitle=subtitles[module.id];
  module.questions=pageMap.get(module.id).questions;
  module.metrics=pageMap.get(module.id).metrics;
  for(const node of module.nodes){
   const replacement=byNode.get(node.id);
   if(!replacement||replacement.paragraphs?.length<2||replacement.lines?.length<3)throw Error('Incomplete reader node '+node.id);
   Object.assign(node,{title:replacement.title,lines:replacement.lines,paragraphs:replacement.paragraphs,detail:replacement.paragraphs.join('\n\n'),sourceIds:replacement.sourceIds});
  }
 }
 const edgeLabels={'V-14':'检查意思是否完整，按项目门控办理','I-11':'最终拒识后，按已选恢复策略处理','I-12':'允许恢复时，构造恢复事件','I-13':'采用不恢复策略：旧声音结束','X33':'轻量展示支路进入 H 模块'};
 for(const edge of base.edges)if(edgeLabels[edge.id])edge.label=edgeLabels[edge.id];
 for(const module of base.modules)for(const edge of module.edges||[]){
  const updated=base.edges.find(e=>edgeLabels[e.id]&&e.from===edge.from&&e.to===edge.to);
  if(updated)edge.label=updated.label;
 }
 const toolPack=read('reader-tools');const byTool=new Map(toolPack.tools.map(t=>[t.id,t]));
 if(byTool.size!==46)throw Error('Reader edition requires all 46 tool entries');
 for(const tool of [...base.tools,...base.supplementalDefinitions]){
  const replacement=byTool.get(tool.id);
  if(!replacement||replacement.paragraphs?.length<4)throw Error('Incomplete reader tool '+tool.id);
  for(const field of ['input','mechanism','output','exception','next','decision','execution','completionEvidence','successCriteria'])delete tool[field];
  Object.assign(tool,{intro:replacement.intro,paragraphs:replacement.paragraphs,status:replacement.status,sourceIds:replacement.sourceIds});
 }
 const walkthroughPack=read('reader-walkthroughs');const byWalkthrough=new Map(walkthroughPack.walkthroughs.map(w=>[w.id,w]));
 for(const item of walkthroughs){
  const replacement=byWalkthrough.get(item.id);
  if(!replacement||replacement.steps.length!==item.steps.length)throw Error('Incomplete scene '+item.id);
  item.intro=replacement.intro;item.closing=replacement.closing;
  item.scope='教学场景，按文中适用条件理解。';item.boundary='具体能力需要在项目接入后使用。';
  for(let i=0;i<item.steps.length;i++){
   const old=item.steps[i],next=replacement.steps.find(s=>s.id===old.id);
   if(!next||next.paragraphs?.length<2)throw Error('Missing scene narration '+old.id);
   item.steps[i]={id:old.id,title:next.title,paragraphs:next.paragraphs,moduleIds:old.moduleIds,sourceIds:old.sourceIds};
  }
 }
 delete base.researchCoverage;delete base.coverage;delete base.baseline;delete base.criticalUnknowns;
 base.title='豆包汽车 · 从语音到执行与反馈';
 base.toolCountExplanation='本页收录 40 行工具定义，去掉同名后有 39 个不同标识，另列 6 项专项能力。其中包含历史实现和停用入口；实际可调用哪些工具，要看这辆车已接入的能力、本轮权限和使用条件。';
 return {rewrittenNodes:byNode.size,rewrittenTools:byTool.size,rewrittenWalkthroughSteps:walkthroughs.reduce((n,w)=>n+w.steps.length,0),legacyChapters:pages.reduce((n,p)=>n+p.sections.length,0),referenceTables:pages.reduce((n,p)=>n+p.referenceTables.length,0)};
}
