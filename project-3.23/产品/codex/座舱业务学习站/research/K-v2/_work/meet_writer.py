import json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parent
class Batch:
 def __init__(self,name,lines):
  self.name=name;self.base='chapters/K/raw/'+name;self.data={'source':self.base+':L1-L'+str(lines),'read_note':'已逐段全文阅读；文字记录优先，区分讨论、现状与实际问题','facts':[],'cases':[],'components':[]}
 def fact(self,theme,text,lines):self.data['facts'].append({'theme':theme,'text':text,'source':self.base+':L'+lines})
 def case(self,title,text,lines):self.data['cases'].append({'title':title,'text':text,'source':self.base+':L'+lines})
 def comp(self,title,text,lines):self.data['components'].append({'title':title,'text':text,'source':self.base+':L'+lines})
 def save(self):
  p=ROOT/('batch-meet-'+self.name+'.json');p.write_text(json.dumps(self.data,ensure_ascii=False,indent=2));subprocess.run(['python3','-I',str(ROOT/'append_research.py'),str(p)],check=True)
