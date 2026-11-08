import fs from 'node:fs';
const here=new URL('.',import.meta.url);
let script=fs.readFileSync(new URL('baseline-app.js',here),'utf8');
function replaceFunction(name,nextName,body){const start=script.indexOf('  function '+name+'('),end=script.indexOf('  function '+nextName+'(',start);if(start<0||end<0)throw Error(name+' not found');script=script.slice(0,start)+body+'\n\n'+script.slice(end);}
replaceFunction('renderModule','renderFlow',String.raw`  function renderModule(id) {
    if (!pageIds.includes(id)) return renderMissing('没有这个模块', '请从目录选择已有模块。');
    const page=pageOf(id), module=moduleById.get(id), teaching=page.teaching;
    let html=heading(page.title,'',{crumbs:[{label:titleOf(id)}],actions:module?'<a class="button-link" href="'+routeHref('module',id,'section','detailed-flow')+'">查看本章流程图</a>':''});
    if (teaching) {
      html+='<div class="lecture-opening lecture-prose" data-teaching-intro="'+esc(id)+'">'+teaching.intro.map(para).join('')+'</div>';
      html+=teaching.lessons.map(lesson=>section(lesson.id,lesson.title,'<div class="lecture-prose" data-teaching-lesson="'+esc(lesson.id)+'">'+lesson.paragraphs.map(para).join('')+'</div>')).join('');
    }
    if (module && DATA.originalSvg) html+=section('detailed-flow','本章流程图',figure({key:'base-'+id,title:page.title,svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:id})+renderGuide(page,'base'));
    if (arr(page.flows).length) html+=section('flows',module?'分支流程':'本章业务流程',page.flows.map(flow=>renderFlow(page,flow)).join(''));
    if (teaching?.closing?.length) html+='<div class="lecture-prose chapter-ending" data-teaching-closing="'+esc(id)+'">'+teaching.closing.map(para).join('')+'</div>';
    return html;
  }`);
replaceFunction('renderFlow','renderNodeDisclosure',String.raw`  function renderFlow(page,flow) {
    const flowId=flow.id,diagram=DATA.diagrams?.[flowId];
    if (!diagram) return '';
    return '<div class="flow-section" id="flow-'+uid(flowId)+'">'+figure({key:flowId,title:flow.title,svg:diagram,pageId:page.id,flowId})+renderGuide(page,flowId)+'</div>';
  }`);
replaceFunction('figure','teachingText',String.raw`  function figure(options) {
    const key=(options.key||'diagram')+'-'+(++diagramSequence);
    diagramRegistry.set(key,options);
    return '<figure class="flow-figure" data-diagram="'+esc(key)+'" data-diagram-theme="'+(options.svg===DATA.originalSvg?'original':'adaptive')+'"><figcaption class="figure-header"><h3>'+esc(options.title)+'</h3><div class="figure-tools"><button type="button" data-figure-zoom="out" aria-label="缩小此图">−</button><output aria-label="图形缩放比例">100%</output><button type="button" data-figure-zoom="in" aria-label="放大此图">+</button><button type="button" data-figure-mode="fit">看全宽</button><button type="button" data-figure-mode="readable">读细节</button><button type="button" data-open-diagram="'+esc(key)+'">放大阅读</button></div></figcaption><div class="svg-shell" tabindex="0" role="region" aria-label="'+esc(options.title)+'，可滚动并点击节点"></div></figure>';
  }`);
replaceFunction('teachingText','renderGuide',String.raw`  function teachingText(value) { return fmt(value); }`);
replaceFunction('renderTool','sourceConsumers',String.raw`  function renderTool(id) {
    const tool=toolById.get(id)||allTools.find(item=>item.name===id);
    if (!tool) return renderMissing('找不到这个工具','请搜索英文标识或中文用途。');
    let html=heading(tool.label||tool.name,'',{crumbs:[{label:'工具与执行机制',href:'#tools'},{label:tool.label||tool.name}],meta:'<code>'+esc(tool.name)+'</code>'});
    const reading=tool.reading;
    if(reading){html+='<div class="lecture-prose">'+arr(reading.intro).map(para).join('')+'</div>';html+=arr(reading.lessons).map(l=>section(l.id,l.title,'<div class="lecture-prose">'+arr(l.paragraphs).map(para).join('')+'</div>')).join('');}
    else{html+='<div class="lecture-prose">'+para(tool.intro)+arr(tool.paragraphs).map(para).join('')+para(tool.status)+'</div>';}
    return html;
  }`);
// Remove the repeated chapter appendices from navigation and search too.
script=script.replace("${navItem('#walkthrough', '同一句话完整走查', '', currentRoute.name === 'walkthrough')}",'');
script=script.replace("    if (walkthroughs.length) html += section('walkthrough-entry', '贯穿案例', renderWalkthroughList(walkthroughs, true));\n",'');
script=script.replace(/      arr\(page\.terms\)\.forEach\([^\n]+\n/g,'');
script=script.replace(/      arr\(page\.metrics\)\.forEach\([^\n]+\n/g,'');
script=script.replace(/    walkthroughs\.forEach\(item => \{[\s\S]*?\n    \}\);\n    nodes\.forEach/,'    nodes.forEach');
script=script.replace("if (p[1] === 'node') return `base-node-${uid(p[2])}`;","if (p[1] === 'node') return 'detailed-flow';");
script=script.replace("if (p[1] === 'flow' && p[3] === 'step') return `step-${uid(p[2])}-${uid(p[4])}`;","if (p[1] === 'flow' && p[3] === 'step') return `flow-${uid(p[2])}`;");
script=script.replace("if (p[1] === 'term') return `term-${p[2]}`;","if (p[1] === 'term') return null;");
// Source entries remain available in the global document directory, outside the lessons.
script=script.replaceAll('图下有连续讲解，可对照编号沿箭头阅读。放大阅读可查看图中文字。','');
// Retired reading aids should not survive through old deep links or empty filters.
script=script.replace("case 'walkthrough': content = currentRoute.parts[0] ? renderWalkthrough(currentRoute.parts[0]) : renderWalkthroughIndex(); break;", "case 'walkthrough': content = renderHome(); break;");
script=script.replace("walkthrough:'完整场景',",'').replace("term:'术语',metric:'指标',",'');
script=script.replace(/    html \+= `<details class="reference-archive source-appendix">[^\n]+\n/g,'');
// Old links to retired generic figures land at the full module diagram.
script=script.replace("if (p[1] === 'flow') return `flow-${uid(p[2])}`;","if (p[1] === 'flow') return document.getElementById(`flow-${uid(p[2])}`) ? `flow-${uid(p[2])}` : 'detailed-flow';");
fs.writeFileSync(new URL('candidate-app.js',here),script);
console.log('case reader written');
