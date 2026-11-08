from pathlib import Path
import json, xml.etree.ElementTree as E, re, copy
p=Path(__file__).parent
old=E.fromstring('<root>'+(p/'current.xml').read_text()+'</root>')
new=E.fromstring('<root>'+(p/'revised.xml').read_text()+'</root>')
oid={x.get('id'):x for x in old.iter() if x.get('id')}
nid={x.get('id'):x for x in new.iter() if x.get('id')}
assert set(oid)==set(nid), 'Changed block IDs'
assert [x.get('token') for x in old.findall('whiteboard')]==[x.get('token') for x in new.findall('whiteboard')]
assert [''.join(x.itertext()) for x in old if re.fullmatch(r'h\d',x.tag)]==[''.join(x.itertext()) for x in new if re.fullmatch(r'h\d',x.tag)]
def elements(x):
    out=[]
    def emit(text,style):
        if not text:return
        if out and out[-1]['text_run'].get('text_element_style',{})==style:
            out[-1]['text_run']['content']+=text;return
        out.append({'text_run':{'content':text,**({'text_element_style':style.copy()} if style else {})}})
    def walk(n,style):
        st=style.copy()
        if n.tag=='b':st['bold']=True
        if n.tag=='i':st['italic']=True
        emit(n.text,st)
        for c in n:walk(c,st);emit(c.tail,st)
    walk(x,{})
    return out
text_edits=[]; headings=[];deletes=[]
for id,x in nid.items():
    before=oid[id]
    if re.fullmatch(r'h\d',x.tag):
        assert x.tag!=before.tag
        c=copy.deepcopy(x);c.attrib.pop('id',None);c.tail=None
        headings.append({'block_id':id,'content':E.tostring(c,encoding='unicode')})
    elif x.tag in ['p','li'] and elements(x)!=elements(before):
        if not ''.join(x.itertext()).strip() and ''.join(before.itertext()).strip():deletes.append(id)
        else:text_edits.append({'block_id':id,'update_text_elements':{'elements':elements(x)}})
plan={'text_batches':[text_edits[i:i+40] for i in range(0,len(text_edits),40)],'headings':headings,'deletes':deletes,'expected_whiteboards':[x.get('token') for x in new.findall('whiteboard')]}
(p/'edit-plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2))
print({'text_updates':len(text_edits),'batches':len(plan['text_batches']),'headings':len(headings),'deletes':deletes})
