import json, re, sys, copy, html
from pathlib import Path
ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))
import content_v39 as content
HTML = ROOT.parents[2] / 'HTML' / '01-进行中'
BASE = HTML / '豆包汽车-业务学习站-v33.html'
OUT = HTML / '豆包汽车-业务学习站-v41.html'

RENDER = r"""
 function renderVoiceV34(page,module){
  const v=page.v34;
  function body(h){
   return h.replace(/<!--fig:([\w-]+)\|([^>]*?)-->/g,(m,key,title)=>figure({key,title,svg:DATA.diagrams[key],pageId:'V',voiceLesson:true}))
    .replace('<!--original-->',()=>'<details class="voice-original" id="detailed-flow"><summary>展开原始 18 节点全图</summary>'+figure({key:'base-V',title:'V 章原始完整节点图',svg:DATA.originalSvg,crop:[module.x-35,module.y-35,module.w+70,module.h+70],pageId:'V'})+'</details>');
  }
  let out=heading(page.title,'',{crumbs:[{label:'语音输入与业务交接'}]});
  out+='<nav class="v34-toc" aria-label="本章目录"><b>本章目录</b><ol>'+v.sections.map(s=>'<li><a href="#'+esc(s.id)+'">'+esc(s.title)+'</a></li>').join('')+'</ol></nav>';
  out+='<article class="voice-lesson v34" id="chapter-reading"><div class="voice-opening">'+v.intro+'</div>';
  out+=v.sections.map(s=>section(s.id,s.title,'<div class="voice-prose">'+body(s.html)+'</div>')).join('');
  return out+'</article>';
 }
"""

CSS = """
.v39-h3{font-size:20px;color:#1f4565;margin:30px 0 10px}
.v39-hand{margin:24px 0 8px;padding:12px 16px;border-left:4px solid #4a9670;background:#f1f8f4;font-size:16px;line-height:1.8;color:#1d4b35;font-weight:600}
.v39-note{margin:18px 0;padding:12px 16px;border-left:4px solid #c8873a;background:#fff8ef;font-size:16px;line-height:1.85}

.v38-deep{background:#fbf9ff;border-color:#ddd3f2}.v38-deep>.v36-blk-h{color:#4b2f7a;font-size:16px}
.v38-sub{font-weight:700;color:#3a2a63;margin:16px 0 6px}

.v36-blk{margin:20px 0;padding:14px 18px;border-radius:8px;border:1px solid #dce5ed;background:#fbfdff;font-size:16px;line-height:1.9}
.v36-blk p{margin:0 0 12px!important}.v36-blk p:last-child{margin-bottom:0!important}
.v36-blk-h{font-weight:700;margin-bottom:6px;font-size:15px}
.v36-scene{background:#fff8ef;border-color:#f0d9b5}.v36-scene .v36-blk-h{color:#8a5a0f}
.v36-how{background:#ffffff}.v36-how .v36-blk-h{color:#1f4565}
.v36-pm{background:#f2f7fd;border-color:#c9daee}.v36-pm .v36-blk-h{color:#245a8f}
.v36-debug{background:#fdf5f5;border-color:#f0d0d0}.v36-debug .v36-blk-h{color:#8f2f2f}
.v36-metric{background:#f4faf6;border-color:#cfe6d7}.v36-metric .v36-blk-h{color:#1f6b42}
.v36-status{background:#f6f6f8;border-color:#dcdde3}.v36-status .v36-blk-h{color:#4b5560}
.v36-ul{margin:4px 0 0;padding-left:20px}.v36-ul li{margin:4px 0}
.v36-debug .v34-table{margin:6px 0 0}

.v34 .voice-prose p{margin:0 0 20px}
.v34-toc{max-width:1080px;margin:8px 0 28px;padding:16px 20px;border:1px solid #dce5ed;border-radius:8px;background:#f8fbfd;font-size:15px;line-height:1.9}
.v34-toc ol{margin:6px 0 0;padding-left:22px;columns:2;column-gap:32px}
.v34-toc a{color:#2e5878;text-decoration:none}.v34-toc a:hover{text-decoration:underline}
.v34-tag{display:inline-block;font-size:12px;line-height:1.6;padding:0 7px;margin:0 3px;border-radius:10px;font-weight:600;vertical-align:2px}
.v34-on{background:#e3f4ea;color:#1f6b42}.v34-set{background:#e4eefb;color:#245a8f}.v34-dev{background:#fff0d9;color:#8a5a0f}
.v34-talk{background:#f1e8fb;color:#5f3a8c}.v34-tbd{background:#fde8e8;color:#8f2f2f}.v34-old{background:#eceff2;color:#56616b}
.v34-card{margin:26px 0;border:1px solid #c9d8e5;border-radius:8px;overflow:hidden}
.v34-card-head{background:#eef4f9;padding:10px 16px;font-size:15px;color:#1f4565}
.v34-card table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.8}
.v34-card th{width:128px;text-align:left;vertical-align:top;padding:10px 14px;background:#f8fbfd;color:#254358;border-top:1px solid #e2e9ef;font-weight:650}
.v34-card th small{display:block;font-weight:400;color:#6b7d8d;font-size:12px}
.v34-card td{padding:10px 14px;border-top:1px solid #e2e9ef;vertical-align:top}
.v34-howto{margin:-8px 0 30px;padding:16px 20px;background:#f7faf7;border-left:3px solid #4a9670;border-radius:0 6px 6px 0;font-size:16px;line-height:1.9}
.v34-howto p{margin:0 0 10px!important}.v34-howto-h{font-weight:700;color:#1d4b35;margin-bottom:6px}
.v34-say{margin:22px 0;padding:14px 18px;background:#fffaec;border:1px solid #ecd9a0;border-radius:8px;font-size:16px;line-height:1.9}
.v34-say-h{font-weight:700;color:#6a5310;margin-bottom:4px}
.v34-table{max-width:100%;overflow:auto;margin:22px 0;border:1px solid #dce5ed;border-radius:7px}
.v34-table table{width:100%;min-width:680px;border-collapse:collapse;font-size:15px;line-height:1.75}
.v34-table th{background:#f0f5f9;text-align:left;padding:11px 13px;color:#254358}
.v34-table td{padding:11px 13px;border-top:1px solid #e2e9ef;vertical-align:top}
.v34-retell{padding:18px 22px;border:1px solid #c9d8e5;border-radius:8px;background:#fbfdff}
.v34-src{font-size:12px!important;line-height:1.9;color:#778797;margin-top:20px!important;padding-top:10px;border-top:1px solid #e8edf1}
.v34-src a{color:#597388;text-decoration:none}
.v34-new{background:#f6f3fd;border-color:#d8ccef}.v34-new .v34-say-h{color:#4b2f7a}
.v34-fold{margin:18px 0;border:1px solid #dce5ed;border-radius:7px;padding:10px 14px;font-size:15px}.v34-fold summary{cursor:pointer;color:#2e5878;font-weight:600}
@media (max-width:760px){.v34-toc ol{columns:1}.v34-card th{width:86px}}
"""

def strip(h):
    return html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'<!--.*?-->', '', h)))

def build():
    raw = BASE.read_text()
    m = re.search(r'<script>\s*const DATA=([\s\S]*?);\s*</script>', raw)
    d = json.loads(m[1]); old = copy.deepcopy(d)
    v = next(p for p in d['pages'] if p['id'] == 'V')
    v['title'] = 'V · 一句话从开口到交给 DT：沿链路讲一遍'
    v['summary'] = '用“泳馆附近找餐厅”一句话，按 5W2H 讲清热词、ASR、VAD、预请求、拒识、1.7B 与 30B 模型、端云仲裁、历史输入与摘要记忆、人人对话上报、AI Launcher 和记忆车机打通。'
    v['v34'] = dict(intro=content.INTRO, sections=content.SECTIONS)
    v['sections'] = [dict(id=s['id'], title=s['title'], paragraphs=[strip(x) for x in re.findall(r'<p>(.*?)</p>', s['html'])], sourceIds=[]) for s in content.SECTIONS]
    diagrams = json.loads((ROOT / 'v34-diagrams.json').read_text())
    d['diagrams'].update(diagrams)
    d['meta'].update(version='v41-v-lesson', asOf='2026-11-06', previousVersion='v40', refinement='V 章改为按 6 个问题组织的产品视角讲法：每节含用户场景、系统怎么做、产品规则、排查表、建议指标、现状；研发用语移至附录；其他章节不变。')
    assert [x for x in d['pages'] if x['id'] != 'V'] == [x for x in old['pages'] if x['id'] != 'V']
    app = re.search(r'</script>\s*<script>([\s\S]*?)</script>\s*</body>', raw)[1]
    app = app.replace(' function renderModule(id) {', RENDER + '\n function renderModule(id) {', 1)
    hook = 'if(page.voiceEdition)return renderVoiceEdition(page,module);'
    assert hook in app
    app = app.replace(hook, 'if(page.v34)return renderVoiceV34(page,module);\n  ' + hook, 1)
    prefix = raw[:re.search(r'<script>\s*const DATA=', raw).start()]
    prefix = prefix.replace('</style>', CSS + '\n</style>', 1)
    prefix = re.sub(r'<title>[^<]*</title>', '<title>豆包汽车业务学习站 v41</title>', prefix, count=1)
    payload = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    result = prefix + '<script>\nconst DATA=' + payload + ';\n</script>\n<script>' + app + '</script>\n</body>\n</html>'
    mode = 'w' if '--overwrite' in sys.argv else 'x'
    with OUT.open(mode) as f: f.write(result)
    print(OUT, len(result))

if __name__ == '__main__':
    build()
