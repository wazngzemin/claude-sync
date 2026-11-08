from pathlib import Path
from markdown_it import MarkdownIt
from html import escape
import base64, json, re

ROOT=Path(__file__).resolve().parent
main=ROOT/"PRD-新手引导触发链路-晚间会议修订稿.md"
md=main.read_text()
diagrams=re.findall(r"!\[([^]]+)\]\((diagrams/[^)]+)\)", md)
assert len(diagrams)==7
for _,image_path in diagrams:
    assert (ROOT/image_path).exists(), image_path
    assert (ROOT/Path(image_path).with_suffix(".svg")).exists(), image_path

feishu=re.sub(r"!\[([^]]+)\]\((diagrams/[^)]+)\)",
              lambda m: "**"+m.group(1)+"**\n\n<whiteboard type=\"blank\"></whiteboard>",md)
(ROOT/"feishu-main.md").write_text(feishu)

for alt,path in diagrams:
    src=(ROOT/Path(path).with_suffix(".svg")).read_bytes()
    md=md.replace(f"![{alt}]({path})",
                  f"![{alt}](data:image/svg+xml;base64,{base64.b64encode(src).decode()})")
parser=MarkdownIt("commonmark",{"html":False}).enable("table")
tokens=parser.parse(md)
toc=[]
for i,t in enumerate(tokens):
    if t.type=="heading_open":
        title=tokens[i+1].content
        sid="section-"+str(len(toc)+1)
        t.attrSet("id",sid)
        toc.append((int(t.tag[1:]),title,sid))
content=parser.renderer.render(tokens,parser.options,{})
content=re.sub(r"<table>.*?</table>",lambda m:'<div class="table-scroll">'+m.group(0)+'</div>',content,flags=re.S)
nav="".join(f'<a class="level-{level}" href="#{sid}">{escape(title)}</a>'
            for level,title,sid in toc if level in (2,3))
html='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>新手引导触发链路 PRD · 晚间会议修订稿</title>
<style>
:root{--ink:#18334d;--blue:#0055a4;--line:#dce5ee;--soft:#f5f8fc;--lime:#dcf4a2}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:28px}
body{margin:0;background:#f6f8fb;color:var(--ink);font:16px/1.85 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
aside{position:fixed;inset:0 auto 0 0;width:300px;overflow:auto;padding:34px 24px;background:white;border-right:1px solid var(--line)}
.brand{font-size:20px;color:var(--blue);font-weight:750;line-height:1.5;margin-bottom:20px}.meta{font-size:13px;color:#60768b;margin-bottom:25px}
nav a{display:block;color:#38536b;text-decoration:none;line-height:1.6;padding:8px 10px;border-radius:5px;font-size:14px}
nav a:hover{color:var(--blue);background:#eff5fb}nav a.level-2{font-weight:650;margin-top:8px}nav a.level-3{padding-left:22px;font-size:13px}
main{max-width:1320px;margin:28px 34px 80px 334px;padding:48px 56px 80px;background:white;box-shadow:0 3px 18px #12304b08;border:1px solid #edf1f6;border-radius:8px}
h1,h2,h3,h4{color:var(--blue);line-height:1.5;scroll-margin-top:30px}h1{font-size:32px;margin:0 0 24px}h2{font-size:25px;margin-top:58px;padding-top:16px;border-top:2px solid var(--line)}h3{font-size:21px;margin-top:36px}h4{font-size:18px;margin-top:25px}
p{margin:15px 0}strong{font-weight:680}a{color:var(--blue);text-underline-offset:3px}blockquote{margin:18px 0 28px;padding:13px 20px;background:var(--soft);border-left:4px solid var(--blue);font-size:14px}blockquote p{margin:4px 0}
li{margin:7px 0}ul,ol{padding-left:25px}.table-scroll{overflow:auto;margin:22px 0}
table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.75;table-layout:fixed}th,td{padding:13px 14px;text-align:left;vertical-align:top;border:1px solid var(--line);overflow-wrap:anywhere}
th{background:#f0f5fb;color:var(--blue);font-weight:650}tr:nth-child(even) td{background:#fcfdff}
p:has(>img){margin:26px 0 32px;padding:15px;border:1px solid var(--line);border-radius:6px;background:white}
img{display:block;width:100%;height:auto;cursor:zoom-in}img:hover{outline:2px solid #dcf4a2}
.toolbar{position:fixed;right:22px;top:14px;display:flex;gap:8px;z-index:2}button{font:inherit;cursor:pointer;border:1px solid var(--line);background:white;color:var(--blue);border-radius:6px;padding:7px 13px;font-size:13px}
dialog{border:0;border-radius:10px;padding:0;width:96vw;max-width:1900px;height:94vh;max-height:94vh;background:white}dialog::backdrop{background:#10283bc4}
.dialogbar{height:60px;display:flex;align-items:center;gap:16px;padding:12px 22px;border-bottom:1px solid var(--line);position:sticky;top:0;background:white}.dialogbar span{flex:1;font-weight:650;color:var(--blue)}
#zoomarea{height:calc(94vh - 60px);overflow:auto;padding:24px}#zoomimage{width:100%;max-width:none;cursor:default}
@media(min-width:1800px){main{margin-right:auto}}
@media(max-width:1100px){aside{width:240px;padding:24px 15px}main{margin-left:260px;padding:32px 26px}.brand{font-size:18px}}
@media(max-width:800px){aside{position:relative;width:auto;height:auto;border-bottom:1px solid var(--line);padding:24px}nav{max-height:240px;overflow:auto}main{margin:16px 12px 50px;padding:26px 20px}h1{font-size:27px}table{min-width:680px}.toolbar{position:static;justify-content:flex-end;padding:10px 12px}}
@media print{aside,.toolbar,dialog{display:none}body{background:white;font-size:10pt}main{margin:0;padding:0;border:0;box-shadow:none;max-width:none}h2{break-before:page}h3,h4{break-after:avoid}table{font-size:9pt}tr{break-inside:avoid}img{max-height:240mm;object-fit:contain}a{color:inherit;text-decoration:none}}
</style>
<aside><div class="brand">新手引导触发链路<br>产品需求文档</div><div class="meta">v2.0 · 2026-11-05 · 待评审<br>点击链路图可放大查看</div><nav>'''+nav+'''</nav></aside>
<div class="toolbar"><button onclick="window.print()">打印 / 导出 PDF</button><button onclick="window.scrollTo({top:0,behavior:'smooth'})">回到开头</button></div>
<main>'''+content+'''</main>
<dialog id="diagramdialog"><div class="dialogbar"><span id="diagramtitle"></span><label>缩放 <input id="zoom" type="range" min="60" max="220" value="100" step="10"></label><button id="closedialog">关闭</button></div><div id="zoomarea"><img id="zoomimage" alt=""></div></dialog>
<script>
const dlg=document.getElementById('diagramdialog'),zi=document.getElementById('zoomimage'),range=document.getElementById('zoom');
document.querySelectorAll('main img').forEach(img=>img.addEventListener('click',()=>{zi.src=img.src;zi.alt=img.alt;document.getElementById('diagramtitle').textContent=img.alt;range.value=100;zi.style.width='100%';dlg.showModal()}));
range.addEventListener('input',()=>zi.style.width=range.value+'%');
document.getElementById('closedialog').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
</script></html>'''
(ROOT/"PRD-新手引导触发链路-晚间会议修订稿.html").write_text(html)
report={"title":"新手引导触发链路产品需求文档","version":"2.0","date":"2026-11-05","status":"review_draft","diagram_count":len(diagrams),"table_count":content.count("<table>"),"main_sections":8,"characters":len(main.read_text()),"originals_modified":False,"diagram_files":[x[1] for x in diagrams],"source_table_revision":1300}
(ROOT/"delivery-metadata.json").write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))

