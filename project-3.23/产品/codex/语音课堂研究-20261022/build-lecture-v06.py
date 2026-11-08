from pathlib import Path
import importlib.util,re,json,html,base64,zipfile
import lesson_flows as lf
R=Path(__file__).parent
sp=importlib.util.spec_from_file_location('base',R/'build-classroom.py');base=importlib.util.module_from_spec(sp);sp.loader.exec_module(base)
OUT=R.parent/'HTML/01-进行中';OUT.mkdir(parents=True,exist_ok=True)
def build(version=6):
 source=R/'课堂讲稿-v06.md'
 if not source.exists():raise SystemExit('等待完整讲稿')
 raw=source.read_text();marks=re.findall(r'<!-- FLOW:(\w+) -->',raw)
 assert sorted(marks)==sorted(lf.F),marks
 article=base.render_md(raw)
 headings=[]
 def h(m):
  title=re.sub('<[^>]+>','',m[1]);id='course-'+str(len(headings));headings.append((id,title));return f'<h2 id="{id}">{m[1]}</h2>'
 article=re.sub(r'<h2>(.*?)</h2>',h,article,flags=re.S)
 vselect='<label>场景 <select id="vad-choice"><option value="pause">没说完，继续说</option><option value="revise">二遍修正，旧准备失效</option><option value="same">文字相同，复用准备</option></select></label>'
 iselect='<label>分支 <select id="interrupt-choice"><option value="valid">有效新需求：重新组织</option><option value="reject">最终拒识：事件衔接</option><option value="no">单人直接打断：不恢复</option></select></label>'
 demos={'hearing':base.sim('vad-demo','停下来操作一次：短停顿、继续说、最终定稿',vselect),'planner':base.sim('planner-demo','停下来操作一次：结果不同，下一步就不同'),'interrupt':base.sim('interrupt-demo','停下来操作一次：三种打断后续',iselect)}
 for k in marks:
  figure=lf.render(k)
  if k in demos:figure+='<details class="practice"><summary>展开这个场景的逐步动效演示</summary>'+demos[k]+'</details>'
  article=article.replace('<!-- FLOW:'+k+' -->',figure)
 # Preserve the proven full board and research sources, moving them after the class.
 previous=(R.parent/'HTML/02-已交付/豆包座舱语音闭环-图文课堂版-v05.html')
 if not previous.exists():previous=R.parent/'HTML/03-历史版本/豆包座舱语音闭环-图文课堂版-v05.html'
 old=previous.read_text()
 board=old.split('<section class="section" id="map">',1)[1].split('<section class="section" id="demos">',1)[0]
 board='<section class="section" id="map">'+board
 board=board.replace('-v05.svg',f'-v{version:02d}.svg').replace('完整大画板：每条线，都有一个流转理由','学完以后，用大画板查每一站的位置')
 evidence='<section class="section" id="evidence">'+old.split('<section class="section" id="evidence">',1)[1].split('</main>',1)[0]
 # Original itemized detail is available for reference without interrupting narration.
 detail=base.render_md((R/'课堂正文.md').read_text())
 detail=re.sub(r'<!-- FIG:[\w-]+ -->','',detail)
 evidence=evidence.replace('<h3>核心一手来源</h3>','<details><summary>展开逐项规则与版本详解：保留上一版完整内容</summary><article>'+detail+'</article></details><h3>核心一手来源</h3>',1)
 toc=''.join(f'<a href="#{id}">{html.escape(title)}</a>' for id,title in headings)
 # Clear, sequential handoffs between lectures.
 for i,(id,title) in enumerate(headings[1:],1):
  prev=('<a class="backlink" href="#'+id+'">接下来：'+html.escape(title)+' →</a>')
  article=article.replace(f'<h2 id="{id}">',prev+f'<h2 id="{id}">',1)
 hero='''<section class="hero" id="start"><div class="eyebrow">产品培训讲稿 · 沿着一次真实场景讲完整</div><h1>一句“去昨天那家游泳馆”，<br>豆包是怎么把它办成的？</h1><p class="lede">我们从用户开口开始，跟着同一条请求往下走。每到一站，先看用户在等什么，再看系统凭什么判断、下一步交给谁，以及哪里可能出错。</p><div class="tagrow"><span class="tag">14 张可逐步讲解的流程图</span><span class="tag">7 讲连贯讲稿</span><span class="tag">3 组场景动效</span><span class="tag">原图、详细规则与大画板保留</span></div><div class="route"><a href="#course-0"><small>顺着故事开始</small><b>从头上这堂课</b>先看完整请求，再逐站展开</a><a href="#flow-hearing"><small>听清与判停</small><b>ASR / VAD</b>两路并行，准备与正式处理分开</a><a href="#flow-planner"><small>把事情办成</small><b>规划与反馈</b>先查、再确认、再执行</a><a href="#flow-interrupt"><small>用户又说话了</small><b>插话与恢复</b>先停哪里，再决定怎么接</a></div></section>'''
 header='<header><strong>豆包座舱语音 · 连贯讲稿版</strong><nav><a href="#start">课程导览</a><a href="#classroom">顺着讲稿读</a><a href="#map">全链路画板</a><a href="#evidence">原图与来源</a></nav></header>'
 body=header+'<main class="wrap">'+hero+'<section class="section reading" id="classroom"><div class="section-kicker">按顺序上课，每讲都接着上一讲往下走</div><h2>先读主线，遇到疑问再展开细节</h2><p>图里的黄色框表示需要判断，绿色框表示得到结果。点任一节点可以看说明，也可以点击“下一步”，顺着箭头听这一段讲解。每讲末尾保留专题展开，方便需要时回看具体车型和历史规则。</p><div class="toc">'+toc+'</div><article>'+article+'</article></section>'+board+evidence+'</main><footer>豆包座舱语音闭环 · 连贯讲稿版<br>教学案例与动画不代表实车录屏；历史方案、车型规则与拟改造均单独标明。</footer><div class="modal" id="image-modal"><button onclick="closeImage()">关闭原图 ×</button><img id="full-image" alt="原图放大查看"></div>'
 script=base.JS.replace('__NODES__',json.dumps(base.N,ensure_ascii=False)).replace('__EDGES__',json.dumps(base.E,ensure_ascii=False)).replace('__SOURCES__',json.dumps(base.SOURCES,ensure_ascii=False))+'\n'+lf.JS.replace('__FLOWS__',json.dumps(lf.F,ensure_ascii=False))
 page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>豆包座舱语音闭环 · 连贯讲稿版</title><style>'+base.CSS+lf.CSS+'</style></head><body>'+body+'<script>'+script+'</script></body></html>'
 target=OUT/f'豆包座舱语音闭环-图文课堂版-v{version:02d}.html'
 with target.open('x') as f:f.write(page)
 base.export_board_svg(OUT/f'豆包座舱语音闭环-完整大画板-v{version:02d}.svg')
 with zipfile.ZipFile(OUT/f'豆包座舱语音闭环-教学流程图-v{version:02d}.zip','x',compression=zipfile.ZIP_DEFLATED) as z:
  for k in lf.F:z.writestr(k+'.svg',lf.svg(k,True))
 (R/f'课堂-v{version:02d}脚本检查.js').write_text(script)
 print(json.dumps(dict(path=str(target),flowcharts=len(lf.F),chapters=len(headings),bytes=target.stat().st_size),ensure_ascii=False))
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--version',type=int,default=6);a=p.parse_args();build(a.version)
