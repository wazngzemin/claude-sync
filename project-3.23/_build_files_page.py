#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Aggregate ALL of the user's document files by category, detect exact duplicates
(md5) and version families (.bak/_副本/(1)/vN), mark keep/delete candidates.
NOTHING is deleted — output is an interactive page + a cleanup plan the user confirms.
Protected (never delete): raw/ (immutable schema), Recordly/ & video-panel/ (external)."""
import os, hashlib, re, json, time
from collections import defaultdict

ROOT="/Users/bytedance/Desktop/3.23"
EXTERNAL={"Recordly","video-panel"}
SKIP_DIRS=EXTERNAL|{".git","node_modules","__pycache__",".venv",".trae",
                    ".whiteboard-build","video-out","tool-results"}
SKIP_FILES={".DS_Store"}
DOC_EXT={"md","html","htm","docx","xlsx","xls","pdf","svg","png","jpg","jpeg",
         "txt","csv","srt","json","canvas","pptx","key","doc","ppt"}
PROTECT_PREFIX=("raw/","raw_cleaned/")

# ---- theme mapping: top-level dir -> (category label, color) ----
THEME={}
def setT(names,label,color):
    for n in names: THEME[n]=(label,color)
setT(["planner 架构","产品-Planner-Prompt","产品-Planner-Prompt"],"Planner / Director","blue")
setT(["场景知识-Selector-SP版本","场景知识-Optimized-Selector-Prompt","场景知识-场景分类器SP变体",
      "场景知识-多轮对话示例","场景知识-测试与评测","场景知识-架构与逻辑图","场景知识-脚本",
      "场景知识-数据表","场景知识-资产","场景知识-其他"],"场景知识 / Selector","teal")
setT(["产品-端侧触发器","reqs"],"触发器","green")
setT(["advisor 架构"],"Advisor","indigo")
setT(["wiki"],"Wiki 知识库","purple")
setT(["产品-培训资料"],"培训 / 讲义","orange")
setT(["raw","raw_cleaned"],"原始素材 raw（保护）","slate")
setT(["对话 context","产品-会议纪要","元数据-方法论"],"会议 / 方法论","amber")
setT(["脚本-article-forker","脚本-feishu","脚本-fork-memo","脚本-skills"],"脚本 / 工具","gray")
setT(["whiteboard",".whiteboard","产品-图表资产"],"白板 / 图表","pink")
setT(["Prompts-草仓","Prompts-翻译","Prompts-小红书HTML替代Markdown"],"Prompts","rose")
setT(["产品-AI-Car架构解读","产品-ainavi司机助手","产品-车书QA冲突修复","产品-术语字典",
      "产品-司机Agent评测集","产品-临停需求PRD"],"其他产品","violet")
COLORS=["blue","teal","green","indigo","purple","orange","slate","amber","gray","pink","rose","violet","dark"]

def theme_for(top, rel):
    if top=="(根目录)": return ("根目录成品","dark")
    if top in THEME: return THEME[top]
    return ("其他","gray")

SUFFIX_RE=[
    (re.compile(r'\.bak\d*(-\d{6,8}[a-z]*)?$'),''),
    (re.compile(r'[-_ ]?(备份|副本)$'),''),
    (re.compile(r'_[^_]*?前备份$'),''),
    (re.compile(r'[-_ ]?before[-\w]*$',re.I),''),
    (re.compile(r'[-_ ]?\(\d+\)$'),''),
    (re.compile(r'[-_ ]?-\d{8}(pm|am)?$'),''),
    (re.compile(r'[-_ ]?(终版|最终版|完整重制版|重制版|最终|final|FINAL)$'),''),
    (re.compile(r'[-_ ]?[vV]\d+$'),''),
    (re.compile(r'-\d{9,}$'),''),   # feishu export timestamp ids
]
def normstem(stem):
    s=stem
    for _ in range(3):
        for rgx,rep in SUFFIX_RE: s=rgx.sub(rep,s)
    return s.strip(' -_')
def has_suffix(name):
    stem=name.rsplit('.',1)[0]
    return normstem(stem)!=stem.strip(' -_')

# ---- walk ----
files=[]
for dp,dns,fns in os.walk(ROOT):
    dns[:]=[d for d in dns if d not in SKIP_DIRS and not d.startswith('.git') and not d.startswith('.')]
    rel0=os.path.relpath(dp,ROOT)
    top=rel0.split(os.sep)[0] if rel0!='.' else '(根目录)'
    for fn in fns:
        if fn in SKIP_FILES or fn.startswith('._') or fn.startswith('.~'): continue
        full=os.path.join(dp,fn); rel=os.path.relpath(full,ROOT)
        try: sz=os.path.getsize(full); mt=os.path.getmtime(full)
        except: continue
        ext=fn.rsplit('.',1)[-1].lower() if '.' in fn else ''
        if ext not in DOC_EXT: continue
        lab,col=theme_for(top,rel)
        protected=rel.startswith(PROTECT_PREFIX)
        files.append({"rel":rel,"name":fn,"ext":ext,"size":sz,"mt":mt,"top":top,
                      "cat":lab,"color":col,"protected":protected,
                      "dir":os.path.dirname(rel) or "(根)","flag":"normal","grp":None,"fam":None})
byrel={f["rel"]:f for f in files}

# ---- exact duplicates (md5) ----
h2f=defaultdict(list)
for f in files:
    if f["size"]>40*1024*1024: continue
    try:
        with open(os.path.join(ROOT,f["rel"]),'rb') as fh:
            f["md5"]=hashlib.md5(fh.read()).hexdigest()
        h2f[f["md5"]].append(f)
    except: pass
def clean_score(f):
    # lower = more "canonical": protected first, then no-suffix, then shorter path, older
    return (0 if f["protected"] else 1, 1 if has_suffix(f["name"]) else 0, len(f["rel"]), -f["mt"])
dup_groups=[]
gid=0
for h,g in h2f.items():
    if len(g)<2: continue
    g=sorted(g,key=clean_score)
    keeper=g[0]
    all_protected=all(x["protected"] for x in g)
    members=[]
    for i,x in enumerate(g):
        if x["protected"]:
            mflag="protected" if x is not keeper else "keep"
        else:
            mflag="keep" if (x is keeper and not all_protected) else "delete"
        if all_protected: mflag="protected"
        x["grp"]=gid
        if x["flag"]=="normal": x["flag"]=mflag
        members.append({"rel":x["rel"],"name":x["name"],"size":x["size"],"mt":x["mt"],
                        "dir":x["dir"],"cat":x["cat"],"protected":x["protected"],"mflag":mflag})
    dup_groups.append({"id":gid,"kind":"exact","size":g[0]["size"],"name":g[0]["name"],
                       "count":len(g),"members":members,
                       "reclaim":sum(m["size"] for m in members if m["mflag"]=="delete")})
    gid+=1

# ---- version families ----
fam_map=defaultdict(list)
for f in files:
    key=(f["dir"],normstem(f["name"].rsplit('.',1)[0]),f["ext"])
    fam_map[key].append(f)
fam_groups=[]
fid=0
for key,g in fam_map.items():
    if len(g)<2: continue
    if len(set(f.get("md5") for f in g))==1: continue   # identical -> already exact dup
    g=sorted(g,key=lambda x:-x["mt"])
    latest=g[0]
    members=[]
    for i,x in enumerate(g):
        if x["protected"]: mflag="protected"
        elif x is latest: mflag="keep"
        else: mflag="delete"
        x["fam"]=fid
        if x["flag"]=="normal": x["flag"]="fam-"+mflag
        members.append({"rel":x["rel"],"name":x["name"],"size":x["size"],"mt":x["mt"],
                        "dir":x["dir"],"cat":x["cat"],"protected":x["protected"],"mflag":mflag})
    fam_groups.append({"id":fid,"kind":"family","name":normstem(g[0]["name"].rsplit('.',1)[0]),
                       "count":len(g),"members":members,
                       "reclaim":sum(m["size"] for m in members if m["mflag"]=="delete")})
    fid+=1

# ---- deletable set (union, excludes protected) ----
deletable={}
for grp in dup_groups+fam_groups:
    for m in grp["members"]:
        if m["mflag"]=="delete": deletable[m["rel"]]=m["size"]
del_count=len(deletable); del_bytes=sum(deletable.values())

# ---- external blobs ----
def dirstat(d):
    tot=0;n=0
    for dp,dns,fns in os.walk(os.path.join(ROOT,d)):
        for fn in fns:
            try: tot+=os.path.getsize(os.path.join(dp,fn)); n+=1
            except: pass
    return n,tot
externals=[]
for d in EXTERNAL:
    if os.path.isdir(os.path.join(ROOT,d)):
        n,tot=dirstat(d)
        externals.append({"name":d,"files":n,"bytes":tot})

# ---- category counts ----
cat_files=defaultdict(list)
for f in files: cat_files[f["cat"]].append(f)
cat_order=[]
seen=set()
for f in files:
    if f["cat"] not in seen: seen.add(f["cat"]); cat_order.append((f["cat"],f["color"]))

stats={"total_files":len(files),
       "total_bytes":sum(f["size"] for f in files),
       "dup_groups":len(dup_groups),"fam_groups":len(fam_groups),
       "del_count":del_count,"del_bytes":del_bytes,
       "cats":len(cat_order)}

# strip md5 for payload size
for f in files: f.pop("md5",None)
DATA=json.dumps({"files":files,"dupGroups":dup_groups,"famGroups":fam_groups,
                 "externals":externals,"stats":stats,"catOrder":cat_order},ensure_ascii=False)

print("files:",len(files),"| dup groups:",len(dup_groups),"| families:",len(fam_groups),
      "| deletable:",del_count,"(%.1f MB)"%(del_bytes/1024/1024))

# ============================================================ HTML
HTML=r"""<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>文件聚合 · 去重清理</title>
<style>
:root{--bg:#fff;--panel:#fafafa;--line:#ececec;--line2:#f2f2f2;--tx:#1c1c1e;--tx2:#6b6b70;--tx3:#9a9aa0;
--accent:#111;--hov:#f6f6f6;--chip:#f3f3f4;--del:#dc2626;--delbg:#fbe9e9;--keep:#16a34a;--keepbg:#e7f6ec;
--prot:#7c3aed;--protbg:#f0e9fc;
--green:#16a34a;--greenbg:#e7f6ec;--blue:#2563eb;--bluebg:#e7eefc;--gray:#6b7280;--graybg:#eef0f2;
--purple:#7c3aed;--purplebg:#f0e9fc;--amber:#b45309;--amberbg:#fbf0dd;--teal:#0d9488;--tealbg:#dcf3f0;
--indigo:#4f46e5;--indigobg:#e8e7fb;--pink:#db2777;--pinkbg:#fbe6f1;--slate:#475569;--slatebg:#eaeef2;
--violet:#7c3aed;--violetbg:#f0e9fc;--rose:#e11d48;--rosebg:#fce7ec;--orange:#ea580c;--orangebg:#fdecdf;--dark:#111827;--darkbg:#e8e9eb;}
.dark{--bg:#0f0f10;--panel:#161617;--line:#262628;--line2:#1f1f21;--tx:#ececee;--tx2:#9a9aa2;--tx3:#6b6b72;
--accent:#fff;--hov:#1b1b1d;--chip:#222224;--delbg:#371a1a;--keepbg:#16331f;--protbg:#251a3a;
--greenbg:#16331f;--bluebg:#162236;--graybg:#26282c;--purplebg:#251a3a;--amberbg:#352616;--tealbg:#0f2e2b;
--indigobg:#1d1c36;--pinkbg:#34162a;--slatebg:#22282f;--violetbg:#251a3a;--rosebg:#34161f;--orangebg:#3a2413;--darkbg:#22242a;}
*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%}
body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Segoe UI",sans-serif;
background:var(--bg);color:var(--tx);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
.app{display:flex;height:100vh;overflow:hidden}
.topbar{position:fixed;top:0;left:0;right:0;height:52px;display:flex;align-items:center;padding:0 22px;
border-bottom:1px solid var(--line);background:var(--bg);z-index:30}
.logo{width:26px;height:26px;border-radius:7px;background:var(--accent);color:var(--bg);display:flex;
align-items:center;justify-content:center;font-weight:700;font-size:13px;margin-right:10px}
.brand{font-weight:650}.crumb{color:var(--tx3);margin:0 10px}.crumb-cur{color:var(--tx2)}
.topright{margin-left:auto;display:flex;align-items:center;gap:16px;color:var(--tx2);font-size:12.5px}
.iconbtn{cursor:pointer;color:var(--tx2);font-size:15px;background:none;border:none;padding:4px;border-radius:6px}
.iconbtn:hover{background:var(--hov);color:var(--tx)}
.side{width:236px;flex:0 0 236px;border-right:1px solid var(--line);background:var(--panel);padding:64px 12px 20px;overflow-y:auto}
.sec-h{font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.5px;padding:0 10px;margin:14px 0 5px}
.navitem{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:8px;cursor:pointer;color:var(--tx2);
font-size:13px;margin-bottom:1px;user-select:none}.navitem:hover{background:var(--hov);color:var(--tx)}
.navitem.on{background:var(--chip);color:var(--tx);font-weight:550}.navitem .ic{width:15px;text-align:center;opacity:.85}
.navitem .ct{margin-left:auto;font-size:11.5px;color:var(--tx3);font-variant-numeric:tabular-nums}
.navitem .dot{width:7px;height:7px;border-radius:2px;flex:0 0 7px}
.main{flex:1;overflow-y:auto;padding:64px 28px 60px}
.h-title{font-size:25px;font-weight:700;letter-spacing:-.5px}
.h-sub{color:var(--tx2);margin-top:6px;font-size:13.5px;max-width:880px}
.banner{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:20px 0 8px}
.bcard{border:1px solid var(--line);border-radius:12px;padding:14px 16px;background:var(--panel)}
.bcard .n{font-size:24px;font-weight:750;letter-spacing:-.5px}.bcard .l{font-size:12px;color:var(--tx2);margin-top:3px}
.bcard.warn .n{color:var(--del)}
.toolbar{display:flex;align-items:center;gap:10px;margin:18px 0 12px;flex-wrap:wrap}
.search{flex:1;min-width:220px;display:flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid var(--line);
border-radius:10px;background:var(--panel)}.search input{flex:1;border:none;background:none;outline:none;color:var(--tx);font-size:13.5px}
.chip{padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--tx2);font-size:12.5px;cursor:pointer;white-space:nowrap}
.chip:hover{background:var(--hov)}.chip.on{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.thead{display:grid;grid-template-columns:1fr 150px 150px 78px 64px;gap:12px;padding:9px 14px;border-bottom:1.5px solid var(--line);
color:var(--tx3);font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;position:sticky;top:0;background:var(--bg);z-index:5}
.row{display:grid;grid-template-columns:1fr 150px 150px 78px 64px;gap:12px;padding:11px 14px;border-bottom:1px solid var(--line2);align-items:center}
.row:hover{background:var(--hov)}
.fname{font-weight:550;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:8px}
.fext{font-size:10px;font-weight:700;padding:2px 6px;border-radius:5px;letter-spacing:.3px}
.fdir{color:var(--tx2);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.muted{color:var(--tx2);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sz{color:var(--tx3);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}
.tag{font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:20px;white-space:nowrap}
.t-del{color:var(--del);background:var(--delbg)}.t-keep{color:var(--keep);background:var(--keepbg)}
.t-prot{color:var(--prot);background:var(--protbg)}
.c-green{color:var(--green);background:var(--greenbg)}.c-blue{color:var(--blue);background:var(--bluebg)}
.c-gray{color:var(--gray);background:var(--graybg)}.c-purple{color:var(--purple);background:var(--purplebg)}
.c-amber{color:var(--amber);background:var(--amberbg)}.c-teal{color:var(--teal);background:var(--tealbg)}
.c-indigo{color:var(--indigo);background:var(--indigobg)}.c-pink{color:var(--pink);background:var(--pinkbg)}
.c-slate{color:var(--slate);background:var(--slatebg)}.c-violet{color:var(--violet);background:var(--violetbg)}
.c-rose{color:var(--rose);background:var(--rosebg)}.c-orange{color:var(--orange);background:var(--orangebg)}
.c-dark{color:var(--dark);background:var(--darkbg)}.dark .c-dark{color:#cbd5e1}
/* groups */
.grp{border:1px solid var(--line);border-radius:12px;margin-bottom:12px;overflow:hidden;background:var(--panel)}
.grp-h{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--bg);border-bottom:1px solid var(--line)}
.grp-h .gt{font-weight:650;font-size:13.5px}.grp-h .gm{color:var(--tx2);font-size:12px}
.grp-h .rc{margin-left:auto;font-size:12px;color:var(--del);font-weight:600}
.gmember{display:flex;align-items:center;gap:11px;padding:10px 16px;border-bottom:1px solid var(--line2)}
.gmember:last-child{border-bottom:none}.gmember:hover{background:var(--hov)}
.gmember input{width:16px;height:16px;accent-color:var(--del);cursor:pointer}
.gmember .mp{flex:1;min-width:0}.gmember .mn{font-weight:550;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gmember .md{color:var(--tx2);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.gmember.del{background:linear-gradient(0deg,var(--delbg),transparent 60%)}
.barfix{position:fixed;bottom:0;left:236px;right:0;background:var(--bg);border-top:1px solid var(--line);
padding:12px 24px;display:flex;align-items:center;gap:14px;z-index:20;box-shadow:0 -6px 20px rgba(0,0,0,.05)}
.barfix .s{font-size:13px;color:var(--tx2)}.barfix .s b{color:var(--del);font-weight:700}
.btn{padding:9px 16px;border-radius:9px;border:1px solid var(--line);background:var(--panel);cursor:pointer;font-size:13px;color:var(--tx)}
.btn:hover{background:var(--hov)}.btn.primary{background:var(--accent);color:var(--bg);border-color:var(--accent);font-weight:600}
.btn.danger{background:var(--del);color:#fff;border-color:var(--del);font-weight:600}
.scrim{position:fixed;inset:0;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:.18s;z-index:60}
.scrim.show{opacity:1;pointer-events:auto}
.modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.97);width:760px;max-width:92vw;max-height:84vh;
background:var(--bg);border:1px solid var(--line);border-radius:16px;z-index:70;opacity:0;pointer-events:none;transition:.18s;
display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.modal.show{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
.modal h3{padding:18px 22px 6px;font-size:16px}.modal .mh{padding:0 22px 14px;color:var(--tx2);font-size:12.5px;border-bottom:1px solid var(--line)}
.modal textarea{flex:1;margin:14px 22px;padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--panel);
color:var(--tx);font-family:"SF Mono",ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.6;resize:none;min-height:280px}
.modal .mf{padding:0 22px 18px;display:flex;gap:10px;align-items:center}
.empty{text-align:center;color:var(--tx3);padding:60px 0}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--line);border-radius:6px;border:3px solid var(--bg)}
</style></head><body>
<div class="topbar"><div class="logo">⊟</div><span class="brand">文件聚合</span><span class="crumb">/</span>
<span class="crumb-cur">去重 · 清理</span>
<div class="topright"><span id="topstat"></span><button class="iconbtn" id="themeBtn">◐</button></div></div>
<div class="app">
<aside class="side">
<div class="navitem on" data-view="all" data-cat="all"><span class="ic">▦</span>全部文件<span class="ct" id="cAll"></span></div>
<div class="sec-h">🔁 清理</div>
<div class="navitem" data-view="dup"><span class="ic">⧉</span>精确重复<span class="ct" id="cDup"></span></div>
<div class="navitem" data-view="fam"><span class="ic">⎘</span>版本族<span class="ct" id="cFam"></span></div>
<div class="navitem" data-view="delete"><span class="ic">🗑</span>建议删除<span class="ct" id="cDel"></span></div>
<div class="sec-h">📁 按分类</div>
<div id="navCats"></div>
<div class="sec-h">外部项目（保护）</div>
<div id="navExt"></div>
</aside>
<main class="main" id="main"></main></div>
<div class="barfix" id="bar" style="display:none">
<span class="s">已选 <b id="selN">0</b> 个待删 · 释放 <span id="selSz">0</span></span>
<span style="margin-left:auto"></span>
<button class="btn" id="selExact">仅选精确重复</button>
<button class="btn" id="selAll">全选建议</button>
<button class="btn" id="selNone">清空</button>
<button class="btn danger" id="genBtn">生成删除命令 →</button>
</div>
<div class="scrim" id="scrim"></div>
<div class="modal" id="modal">
<h3>删除命令（移入回收站，可恢复）</h3>
<div class="mh">下面命令把选中文件 <b>移动到一个带日期的回收文件夹</b>（不是直接 rm，随时能找回）。已自动排除 raw/ 与外部项目。复制到终端执行，或让我替你执行。</div>
<textarea id="cmd" readonly></textarea>
<div class="mf"><button class="btn primary" id="copyBtn">复制命令</button>
<span class="s" id="copyHint" style="color:var(--tx2);font-size:12px"></span></div>
</div>
<script id="data" type="application/json">__DATA__</script>
<script>
const DB=JSON.parse(document.getElementById('data').textContent);
const {files,dupGroups,famGroups,externals,stats,catOrder}=DB;
const ROOT="/Users/bytedance/Desktop/3.23";
function fmtSz(b){return b>=1048576?(b/1048576).toFixed(1)+' MB':b>=1024?(b/1024).toFixed(0)+' KB':b+' B';}
function fmtDate(t){const d=new Date(t*1000);return ('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function esc(s){return(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
let state={view:"all",cat:"all",q:"",sel:new Set()};
// default selection = all delete candidates
[...dupGroups,...famGroups].forEach(g=>g.members.forEach(m=>{if(m.mflag==='delete')state.sel.add(m.rel);}));
document.getElementById('topstat').textContent=stats.total_files+' 文件 · '+fmtSz(stats.total_bytes);
document.getElementById('cAll').textContent=stats.total_files;
document.getElementById('cDup').textContent=stats.dup_groups;
document.getElementById('cFam').textContent=stats.fam_groups;
document.getElementById('cDel').textContent=stats.del_count;
// build category nav
const catN={};files.forEach(f=>catN[f.cat]=(catN[f.cat]||0)+1);
document.getElementById('navCats').innerHTML=catOrder.map(([c,col])=>
`<div class="navitem" data-view="all" data-cat="${esc(c)}"><span class="dot c-${col}" style="background:currentColor"></span>${esc(c)}<span class="ct">${catN[c]||0}</span></div>`).join('');
document.getElementById('navExt').innerHTML=externals.map(e=>
`<div class="navitem" style="cursor:default"><span class="ic">📦</span>${esc(e.name)}<span class="ct">${e.files}</span></div>
<div style="font-size:11px;color:var(--tx3);padding:0 10px 4px 34px">${fmtSz(e.bytes)} · 不去重</div>`).join('');
document.querySelectorAll('.navitem[data-view]').forEach(el=>el.onclick=()=>{
  state.view=el.dataset.view;state.cat=el.dataset.cat||'all';
  document.querySelectorAll('.navitem').forEach(n=>n.classList.remove('on'));el.classList.add('on');render();});
const themeC={};catOrder.forEach(([c,col])=>themeC[c]=col);
const TAGMAP={'delete':'<span class="tag t-del">建议删</span>','keep':'<span class="tag t-keep">保留·正本</span>',
'protected':'<span class="tag t-prot">保护</span>','fam-keep':'<span class="tag t-keep">最新</span>',
'fam-delete':'<span class="tag t-del">旧版</span>'};
function fileRow(f){const col=f.color;
let tag=TAGMAP[f.flag]||'';
if(!tag&&f.protected)tag='<span class="tag t-prot">保护</span>';
return `<div class="row"><div class="fname"><span class="fext c-${col}">${f.ext.toUpperCase()}</span>${esc(f.name)} ${tag}</div>
<div class="fdir" title="${esc(f.rel)}">${esc(f.dir)}</div>
<div class="muted">${esc(f.cat)}</div><div class="sz">${fmtSz(f.size)}</div><div class="sz">${fmtDate(f.mt)}</div></div>`;}
function groupView(groups,kind){
  let h='';
  groups.forEach(g=>{
    const dels=g.members.filter(m=>m.mflag==='delete').length;
    h+=`<div class="grp"><div class="grp-h"><span class="gt">${esc(g.name)}</span>
    <span class="gm">${g.count} 个${kind==='exact'?' · MD5 相同':' · 版本族'} · ${fmtSz(g.size||g.members[0].size)}</span>
    <span class="rc">可释放 ${fmtSz(g.reclaim)}</span></div>`;
    g.members.forEach(m=>{
      const checked=state.sel.has(m.rel)?'checked':'';
      const cls=m.mflag==='delete'?'del':'';
      const badge=m.mflag==='keep'?'<span class="tag t-keep">★ 保留</span>':m.mflag==='protected'?'<span class="tag t-prot">保护·raw</span>':'<span class="tag t-del">可删</span>';
      const cb=m.mflag==='delete'?`<input type="checkbox" data-rel="${esc(m.rel)}" ${checked}>`:'<span style="width:16px"></span>';
      h+=`<div class="gmember ${cls}">${cb}<div class="mp"><div class="mn">${esc(m.name)} ${badge}</div>
      <div class="md">${esc(m.dir)} · ${esc(m.cat)} · ${fmtSz(m.size)} · ${fmtDate(m.mt)}</div></div></div>`;
    });
    h+='</div>';
  });
  return h||'<div class="empty">无</div>';
}
function render(){
  const m=document.getElementById('main');
  document.getElementById('bar').style.display=(state.view==='dup'||state.view==='fam'||state.view==='delete')?'flex':'none';
  if(state.view==='all'){
    let fs=files.slice();
    if(state.cat!=='all')fs=fs.filter(f=>f.cat===state.cat);
    if(state.q){const q=state.q.toLowerCase();fs=fs.filter(f=>(f.rel).toLowerCase().includes(q));}
    fs.sort((a,b)=>a.cat.localeCompare(b.cat)||a.rel.localeCompare(b.rel));
    m.innerHTML=`<div class="h-title">${state.cat==='all'?'全部文件':esc(state.cat)}</div>
    <div class="h-sub">${state.cat==='all'?'你的全部工作文档（已排除 Recordly / video-panel 两个外部项目与缓存）。按分类浏览，到左侧"清理"区做去重。':'分类：'+esc(state.cat)}</div>
    `+banner()+`<div class="toolbar"><div class="search"><span style="color:var(--tx3)">⌕</span>
    <input id="q" placeholder="按路径搜索…" value="${esc(state.q)}"></div></div>
    <div class="thead"><span>文件</span><span>所在目录</span><span>分类</span><span>大小</span><span>更新</span></div>
    <div>${fs.length?fs.map(fileRow).join(''):'<div class="empty">无</div>'}</div>`;
    const qi=document.getElementById('q');if(qi){qi.oninput=e=>{state.q=e.target.value;render();qi2();};}
    function qi2(){const x=document.getElementById('q');if(x){x.focus();x.setSelectionRange(x.value.length,x.value.length);}}
  } else if(state.view==='dup'){
    m.innerHTML=`<div class="h-title">精确重复 · ${stats.dup_groups} 组</div>
    <div class="h-sub">内容字节完全相同（MD5 一致）。每组已选好"★保留正本"（优先 raw/ 或无后缀名），其余勾选为可删。raw/ 内的文件受保护，仅作正本不删。</div>
    ${groupView(dupGroups,'exact')}`;
    bindCb();
  } else if(state.view==='fam'){
    m.innerHTML=`<div class="h-title">版本族 · ${stats.fam_groups} 族</div>
    <div class="h-sub">同目录下同一文件的多个版本/备份（.bak / _副本 / (1) / vN）。默认保留 mtime 最新一个，其余旧版勾为可删——但版本族不一定内容包含关系，删前请扫一眼。</div>
    ${groupView(famGroups,'family')}`;
    bindCb();
  } else if(state.view==='delete'){
    // flat list of all delete candidates grouped by source group
    const all=[...dupGroups.map(g=>({...g,kind:'exact'})),...famGroups.map(g=>({...g,kind:'family'}))]
      .filter(g=>g.members.some(x=>x.mflag==='delete'));
    m.innerHTML=`<div class="h-title">建议删除清单 · ${stats.del_count} 个</div>
    <div class="h-sub">所有去重后冗余的文件汇总（${fmtSz(stats.del_bytes)}）。已排除 raw/ 与外部项目。勾选确认后点右下「生成删除命令」。</div>
    ${groupView(all,'mix')}`;
    bindCb();
  }
  updBar();
}
function banner(){return `<div class="banner">
<div class="bcard"><div class="n">${stats.total_files}</div><div class="l">文档文件</div></div>
<div class="bcard"><div class="n">${stats.cats}</div><div class="l">分类</div></div>
<div class="bcard warn"><div class="n">${stats.dup_groups}</div><div class="l">精确重复组</div></div>
<div class="bcard warn"><div class="n">${stats.fam_groups}</div><div class="l">版本族</div></div>
<div class="bcard warn"><div class="n">${fmtSz(stats.del_bytes)}</div><div class="l">可释放（${stats.del_count} 个）</div></div>
</div>`;}
function bindCb(){document.querySelectorAll('.gmember input').forEach(cb=>cb.onchange=()=>{
  if(cb.checked)state.sel.add(cb.dataset.rel);else state.sel.delete(cb.dataset.rel);
  cb.closest('.gmember').classList.toggle('del',cb.checked);updBar();});}
function updBar(){let n=0,sz=0;const all={};[...dupGroups,...famGroups].forEach(g=>g.members.forEach(m=>all[m.rel]=m.size));
  state.sel.forEach(r=>{if(all[r]!=null){n++;sz+=all[r];}});
  document.getElementById('selN').textContent=n;document.getElementById('selSz').textContent=fmtSz(sz);}
document.getElementById('selAll').onclick=()=>{[...dupGroups,...famGroups].forEach(g=>g.members.forEach(m=>{if(m.mflag==='delete')state.sel.add(m.rel);}));render();};
document.getElementById('selNone').onclick=()=>{state.sel.clear();render();};
document.getElementById('selExact').onclick=()=>{state.sel.clear();dupGroups.forEach(g=>g.members.forEach(m=>{if(m.mflag==='delete')state.sel.add(m.rel);}));render();};
const scrim=document.getElementById('scrim'),modal=document.getElementById('modal');
document.getElementById('genBtn').onclick=()=>{
  const rels=[...state.sel];
  const dir='_重复文件_待清理_'+new Date().toISOString().slice(0,10);
  let cmd='# 把选中的 '+rels.length+' 个冗余文件移入回收文件夹（可恢复，不是直接删除）\n';
  cmd+='cd '+q(ROOT)+'\nmkdir -p '+q(dir)+'\n';
  rels.forEach(r=>{cmd+='mkdir -p '+q(dir+'/'+r.split('/').slice(0,-1).join('/'))+' 2>/dev/null; ';
    cmd+='mv '+q(r)+' '+q(dir+'/'+r)+'\n';});
  cmd+='\n# 确认无误后，再彻底删除：  rm -rf '+q(dir)+'\n';
  document.getElementById('cmd').value=cmd;
  scrim.classList.add('show');modal.classList.add('show');};
function q(s){return "'"+s.replace(/'/g,"'\\''")+"'";}
document.getElementById('copyBtn').onclick=()=>{const t=document.getElementById('cmd');t.select();
  navigator.clipboard.writeText(t.value).then(()=>document.getElementById('copyHint').textContent='已复制 ✓');};
scrim.onclick=()=>{scrim.classList.remove('show');modal.classList.remove('show');};
document.getElementById('themeBtn').onclick=()=>document.body.classList.toggle('dark');
render();
</script></body></html>"""
out=HTML.replace("__DATA__",DATA)
op=os.path.join(ROOT,"文件聚合-去重清理.html")
open(op,"w",encoding="utf-8").write(out)
print("WROTE",op)
