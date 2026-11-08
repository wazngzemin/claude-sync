 function renderVoiceEdition(page,module) {
 const lesson=page.voiceEdition;
 const diagramTitles={
  'voice-parallel':'同一段音频怎样分成识别与判停两条线',
  'voice-timing':'第一次准备遇到补话，第二次怎样继续',
  'voice-memory':'当前请求、人人对话与后台记忆怎样接续',
  'voice-poi':'保存地点与以后导航，各自怎样完成'
 };
 function refs(ids){
  return '<p class="voice-citations">原文：'+unique(ids).filter(id=>sourceById.has(id)).map(id=>{
   const s=sourceById.get(id);return '<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a>';
  }).join('<span aria-hidden="true"> · </span>')+'</p>';
 }
 function block(b){
  if(b.type==='p')return para(b.text);
  if(b.type==='table')return '<div class="voice-table-scroll" tabindex="0" role="region" aria-label="本节对照表，可横向滚动"><table><thead><tr>'+b.headers.map(h=>'<th scope="col">'+fmt(h)+'</th>').join('')+'</tr></thead><tbody>'+b.rows.map(row=>'<tr>'+row.map((c,i)=>(i?'<td>':'<th scope="row">')+fmt(c)+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table></div>';
  if(b.type==='diagram')return figure({key:b.key,title:diagramTitles[b.key],svg:DATA.diagrams[b.key],pageId:'V',voiceLesson:true});
  if(b.type==='original')return '<details class="voice-original" id="detailed-flow"><summary>展开原始 18 节点全图，对照上面的交接说明</summary>'+figure({key:'base-V',title:'V 章原始完整节点图',svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:'V'})+'</details>';
  return '';
 }
 let html=heading(page.title,'',{crumbs:[{label:'语音输入与业务交接'}]});
 html+='<article class="voice-lesson" id="chapter-reading"><div class="voice-opening">'+lesson.intro.map(para).join('')+'</div>';
 html+=lesson.sections.map(s=>section(s.id,s.title,'<div class="voice-prose">'+s.blocks.map(block).join('')+'</div>'+refs(s.sourceIds))).join('');
 return html+'</article>';
 }
