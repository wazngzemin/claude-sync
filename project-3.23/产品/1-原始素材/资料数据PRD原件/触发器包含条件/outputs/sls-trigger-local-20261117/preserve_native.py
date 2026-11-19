"""Transfer scoped Artifact Tool edits while retaining unrelated native XLSX parts.

Artifact import has an empty shared-string round-trip issue with this Feishu export.
Keep source XML/package features intact instead of re-exporting the whole workbook.
Authoring, layout and recalculation are performed in build.mjs.
"""
import copy,json,re,zipfile,posixpath,os
from pathlib import Path
from lxml import etree as E
import openpyxl

B=Path(__file__).resolve().parent
source=B/'赛力斯端状态信号库-原始下载-20261117.xlsx'
v2=os.environ.get('SLS_DRAFT_VERSION')=='v02'
v3=os.environ.get('SLS_DRAFT_VERSION')=='v03'
authored=B/('v03-authored.xlsx' if v3 else 'v02-authored.xlsx' if v2 else 'authored-cells.xlsx')
target=B/('赛力斯端状态v1.3-待新增及逻辑表达式-v03.xlsx' if v3 else '赛力斯端状态v1.3-Trigger本地任务表-v02.xlsx' if v2 else '赛力斯端状态v1.3-Trigger本地核对稿-v01.xlsx')
plan=json.loads((B/('v03-data.json' if v3 else 'v02-data.json' if v2 else 'final-edits.json')).read_text())
NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main'
REL='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
T=lambda tag:f'{{{NS}}}{tag}'
def root(z,name):return E.fromstring(z.read(name))
def sheetpart(z,title):
    wb=root(z,'xl/workbook.xml');rels=root(z,'xl/_rels/workbook.xml.rels')
    rid=next(x.get(f'{{{REL}}}id') for x in wb.find(T('sheets')) if x.get('name')==title)
    p=next(x.get('Target') for x in rels if x.get('Id')==rid)
    return posixpath.normpath(posixpath.join('xl',p)) if not p.startswith('/') else p[1:]
def colnum(cell):
    n=0
    for c in re.match('[A-Z]+',cell).group():n=n*26+ord(c)-64
    return n
def semantic(el):
    return (el.tag,tuple(sorted(el.attrib.items())),el.text or '',tuple(semantic(c) for c in el))

with zipfile.ZipFile(source) as zs,zipfile.ZipFile(authored) as za:
    sp=sheetpart(zs,plan['sheet']);ap=sheetpart(za,plan['sheet'])
    sr=root(zs,sp);ar=root(za,ap)
    st=root(zs,'xl/styles.xml');at=root(za,'xl/styles.xml')
    srdata=sr.find(T('sheetData')); ardata=ar.find(T('sheetData'))
    rows={int(r.get('r')):r for r in srdata}
    arows={int(r.get('r')):r for r in ardata}
    cells={c.get('r'):c for r in srdata for c in r if c.tag==T('c')}
    acells={c.get('r'):c for r in ardata for c in r if c.tag==T('c')}
    ass=[]
    if 'xl/sharedStrings.xml' in za.namelist():
        ass=list(root(za,'xl/sharedStrings.xml'))
    cache={}
    def component(kind,idx):
        key=(kind,idx)
        if key in cache:return cache[key]
        node=copy.deepcopy(at.find(T(kind))[idx]); dest=st.find(T(kind))
        # Cell style XFs share the same component references as regular XFs.
        if kind=='cellStyleXfs':remap_xf(node,False)
        sig=semantic(node)
        found=next((i for i,c in enumerate(dest) if semantic(c)==sig),None)
        if found is None:
            found=len(dest);dest.append(node);dest.set('count',str(len(dest)))
        cache[key]=found;return found
    numcache={}
    def numfmt(idx):
        if idx in numcache:return numcache[idx]
        nf=at.find(T('numFmts'))
        n=next((x for x in nf or [] if int(x.get('numFmtId'))==idx),None)
        if n is None:return idx
        d=st.find(T('numFmts'))
        if d is None:d=E.Element(T('numFmts'),count='0');st.insert(0,d)
        same=next((x for x in d if x.get('formatCode')==n.get('formatCode')),None)
        if same is not None:out=int(same.get('numFmtId'))
        else:
            out=max([163]+[int(x.get('numFmtId')) for x in d])+1
            nn=copy.deepcopy(n);nn.set('numFmtId',str(out));d.append(nn);d.set('count',str(len(d)))
        numcache[idx]=out;return out
    def remap_xf(node,include_parent=True):
        for attr,kind in [('fontId','fonts'),('fillId','fills'),('borderId','borders')]:
            if attr in node.attrib:node.set(attr,str(component(kind,int(node.get(attr)))))
        if 'numFmtId' in node.attrib:node.set('numFmtId',str(numfmt(int(node.get('numFmtId')))))
        if include_parent and 'xfId' in node.attrib:
            node.set('xfId',str(component('cellStyleXfs',int(node.get('xfId')))))
    stylecache={}
    def style(idx):
        if idx in stylecache:return stylecache[idx]
        node=copy.deepcopy(at.find(T('cellXfs'))[idx]);remap_xf(node)
        d=st.find(T('cellXfs'));sig=semantic(node)
        found=next((i for i,c in enumerate(d) if semantic(c)==sig),None)
        if found is None:found=len(d);d.append(node);d.set('count',str(len(d)))
        stylecache[idx]=found;return found
    def getcell(addr):
        if addr not in cells:
            rn=int(re.search('[0-9]+',addr).group())
            if rn not in rows:
                row=E.Element(T('row'),r=str(rn));srdata.append(row);rows[rn]=row
            c=E.Element(T('c'),r=addr);row=rows[rn]
            following=next((x for x in row if x.tag==T('c') and colnum(x.get('r'))>colnum(addr)),None)
            if following is None:row.append(c)
            else:row.insert(list(row).index(following),c)
            cells[addr]=c
        return cells[addr]
    for p in plan['patches']:
        addr=p['cell'];c=getcell(addr);a=acells.get(addr)
        for child in list(c):
            if child.tag in [T('v'),T('is'),T('f')]:c.remove(child)
        c.attrib.pop('t',None)
        if a is not None:
            if not v3:c.set('s',str(style(int(a.get('s','0')))))
            if a.get('t')=='s':
                index=int(a.find(T('v')).text);node=copy.deepcopy(ass[index]);node.tag=T('is')
                c.set('t','inlineStr');c.append(node)
            else:
                if a.get('t'):c.set('t',a.get('t'))
                for child in a:
                    if child.tag in [T('v'),T('is'),T('f')]:c.append(copy.deepcopy(child))
    # The new notes column extends adjacent formatting; no other columns restyled.
    for rn in ([] if v3 else range(1,386)):
        addr=f'AW{rn}';a=acells.get(addr)
        if a is not None:getcell(addr).set('s',str(style(int(a.get('s','0')))))
    for rn in ([] if v3 else plan['rows']):
        if rn in arows and arows[rn].get('ht'):
            rows[rn].set('ht',arows[rn].get('ht'));rows[rn].set('customHeight','1')
    acols=ar.find(T('cols'));scols=sr.find(T('cols'))
    newcol=None if v3 else next(c for c in acols if int(c.get('min'))<=49<=int(c.get('max')))
    for c in ([] if v3 else list(scols)):
        lo,hi=int(c.get('min')),int(c.get('max'))
        if lo<=49<=hi:
            pos=list(scols).index(c);scols.remove(c)
            if lo<49:
                left=copy.deepcopy(c);left.set('max','48');scols.insert(pos,left);pos+=1
            mid=copy.deepcopy(c);mid.set('min','49');mid.set('max','49');mid.set('width',newcol.get('width'));mid.set('customWidth','1');scols.insert(pos,mid);pos+=1
            if hi>49:
                right=copy.deepcopy(c);right.set('min','50');scols.insert(pos,right)
            break
    else:
        if not v3:
            c=E.Element(T('col'),min='49',max='49',width=newcol.get('width'),customWidth='1');scols.append(c)
    modified={sp:E.tostring(sr,xml_declaration=True,encoding='UTF-8',standalone=True)}
    extra={}
    if v2:
        # Append Artifact-authored task/comparison sheets without round-tripping native sources.
        wroot=root(zs,'xl/workbook.xml');wr=root(zs,'xl/_rels/workbook.xml.rels')
        ct=root(zs,'[Content_Types].xml');act=root(za,'[Content_Types].xml')
        sheets=wroot.find(T('sheets'));orig_count=len(sheets)
        content_ns='http://schemas.openxmlformats.org/package/2006/content-types'
        rel_ns='http://schemas.openxmlformats.org/package/2006/relationships'
        rid_count=max(int(x.get('Id').replace('rId','')) for x in wr if x.get('Id','').startswith('rId'))
        sheet_id=max(int(x.get('sheetId')) for x in sheets)
        def save_xml(el):return E.tostring(el,xml_declaration=True,encoding='UTF-8',standalone=True)
        def add_content(part,typ):
            E.SubElement(ct,f'{{{content_ns}}}Override',PartName='/'+part,ContentType=typ)
        for i,title in enumerate(['Trigger任务表','参数能力对照'],1):
            apart=sheetpart(za,title);outpart=f'xl/worksheets/sls_v02_{i}.xml';nr=root(za,apart)
            for cell in nr.iter(T('c')):
                if cell.get('s') is not None:cell.set('s',str(style(int(cell.get('s')))))
                if cell.get('t')=='s':
                    vi=cell.find(T('v'));nn=copy.deepcopy(ass[int(vi.text)]);nn.tag=T('is')
                    cell.remove(vi);cell.set('t','inlineStr');cell.append(nn)
            # Copy the new sheet's table relationships and content; source objects remain untouched.
            arel=posixpath.dirname(apart)+'/_rels/'+posixpath.basename(apart)+'.rels'
            if arel in za.namelist():
                rroot=root(za,arel)
                for j,r in enumerate(rroot,1):
                    assert r.get('Type').endswith('/table'),r.attrib
                    srcpart=posixpath.normpath(posixpath.join(posixpath.dirname(apart),r.get('Target')))
                    if r.get('Target').startswith('/'):srcpart=r.get('Target')[1:]
                    destpart=f'xl/tables/sls_v02_{i}_{j}.xml'
                    tr=root(za,srcpart)
                    # The authored workbook already assigns table IDs across all sheets.
                    extra[destpart]=save_xml(tr)
                    r.set('Target',posixpath.relpath(destpart,posixpath.dirname(outpart)))
                    typ=next(x.get('ContentType') for x in act if x.get('PartName')=='/'+srcpart)
                    add_content(destpart,typ)
                extra[posixpath.dirname(outpart)+'/_rels/'+posixpath.basename(outpart)+'.rels']=save_xml(rroot)
            extra[outpart]=save_xml(nr)
            rid=f'rId{rid_count+i}'
            E.SubElement(sheets,T('sheet'),name=title,sheetId=str(sheet_id+i),attrib={f'{{{REL}}}id':rid})
            E.SubElement(wr,f'{{{rel_ns}}}Relationship',Id=rid,Type=REL+'/worksheet',Target=posixpath.relpath(outpart,'xl'))
            add_content(outpart,'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml')
        views=wroot.find(T('bookViews'))
        if views is not None:
            for view in views:view.set('activeTab',str(orig_count))
        modified.update({'xl/workbook.xml':save_xml(wroot),'xl/_rels/workbook.xml.rels':save_xml(wr),'[Content_Types].xml':save_xml(ct)})
    if not v3:modified['xl/styles.xml']=E.tostring(st,xml_declaration=True,encoding='UTF-8',standalone=True)
    with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED) as out:
        for info in zs.infolist():out.writestr(info,modified.get(info.filename,zs.read(info.filename)))
        for part,data in extra.items():out.writestr(part,data)

# Independent readback of saved native workbook, without authoring via openpyxl.
before=openpyxl.load_workbook(source);after=openpyxl.load_workbook(target)
assert before.sheetnames==after.sheetnames[:len(before.sheetnames)]
if v2:assert after.sheetnames[-2:]==['Trigger任务表','参数能力对照']
expected={p['cell']:p for p in plan['patches']};actual=[]
def eq(a,b):return (a in [None,''] and b in [None,'']) or a==b
for bs,fs in zip(before,after):
    assert bs.sheet_state==fs.sheet_state
    assert str(bs.freeze_panes)==str(fs.freeze_panes)
    assert set(map(str,bs.merged_cells.ranges))==set(map(str,fs.merged_cells.ranges))
    for row in bs:
        for c in row:
            v=fs[c.coordinate].value
            if not eq(c.value,v):
                assert bs.title==plan['sheet'] and c.coordinate in expected,(bs.title,c.coordinate,c.value,v)
                assert eq(v,expected[c.coordinate]['after']),(c.coordinate,v,expected[c.coordinate]['after'])
                actual.append(c.coordinate)
for addr,p in expected.items():assert eq(after[plan['sheet']][addr].value,p['after']),(addr,p['after'])
assert len(actual)==len(expected),(len(actual),len(expected))
with zipfile.ZipFile(source) as x,zipfile.ZipFile(target) as y:
    differing=[n for n in x.namelist() if x.read(n)!=y.read(n)]
    assert set(differing)==set(modified)
report={'output':str(target),'changed_cells':len(actual),'changed_rows':len(plan['rows']),
        'by_column':{c:sum(a.startswith(c) for a in actual) for c in ['AT','AU','AV','AW']},
        'preserved_sheets':len(before.sheetnames),'native_parts_changed':differing,
        'all_other_cells_and_parts_unchanged':True,'cloud_write_performed':False}
if v2:
    assert all(a.startswith('AW') for a in actual)
    for title,data in [('Trigger任务表',plan['tasks']),('参数能力对照',plan['comparison'])]:
        ws=after[title];assert ws.max_row>=8+len(data)
        assert len(ws.tables)==1
        assert ws.freeze_panes is not None
    for i,t in enumerate(plan['tasks'],9):
        ws=after['Trigger任务表'];assert ws.cell(i,1).value==t['id'];assert ws.cell(i,8).value==t['logic']
    report['added_sheets']=['Trigger任务表','参数能力对照']
    report['source_AT_AU_AV_preserved']=True
    report['coverage']=plan['record_counts']
if v3:
    assert before.sheetnames==after.sheetnames
    assert all(a.startswith(('AT','AU')) for a in actual)
    sh=after[plan['sheet']]
    pending=[r for r in range(2,sh.max_row+1) if sh.cell(r,46).value=='待新增']
    assert all(sh.cell(r,47).value for r in pending)
    assert sh['AU379'].value=='等于,大于,大于等于,小于,小于等于'
    assert set(differing)=={'xl/worksheets/sheet9.xml'}
    report['pending_rows']=pending
    report['all_pending_rows_have_operators']=True
(B/('v03-verification.json' if v3 else 'v02-verification.json' if v2 else 'verification.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
