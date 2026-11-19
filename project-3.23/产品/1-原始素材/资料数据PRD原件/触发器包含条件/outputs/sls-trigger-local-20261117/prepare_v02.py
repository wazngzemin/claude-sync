import json,re,copy,collections
from pathlib import Path

B=Path(__file__).resolve().parent
source=json.loads((B/'source-values.json').read_text())
cmp=json.loads(Path('/var/folders/1y/j3cg4jfs76nb6n2zgby4hvkr0000gn/T/sls-trigger-diff.4l002SCnwh/compared.json').read_text())
raw=source['【New】sls端状态v1.3']; oldraw=source['sls端状态v1.2']
trigger=json.loads((B/'trigger-source.json').read_text())['sls']
def norm(v):return re.sub(r'\s+','',str(v or ''))
def show(v):return '未标注' if v is None or v=='' else str(v)
def uniq(items):return list(dict.fromkeys(items))

# Preserve every source field; all new conclusions live in task/difference columns.
new=copy.deepcopy(cmp['new']);old=copy.deepcopy(cmp['old'])
for r,v in new.items():
    x=raw[int(r)-1]
    for key,idx in [('state',45),('ops',46),('tr_unit',47),('param',15),('param_cn',16),('type',18),('range',19),('multi',20),('unit',21)]:v[key]=x[idx]
for r,v in old.items():
    x=oldraw[int(r)-1]
    for key,idx in [('state',42),('ops',43),('tr_unit',44)]:v[key]=x[idx]
pair={b['row']:old[str(a['row'])] for a,b,_ in cmp['pairs'] if a}
old_index=collections.defaultdict(list)
for v in old.values():old_index[(norm(v['id']),norm(v['param']))].append(v)
for v in new.values():
    if v['row'] not in pair:
        matches=old_index[(norm(v['id']),norm(v['param']))]
        if len(matches)==1:pair[v['row']]=matches[0]

conditions=[];name=''
for i,r in enumerate(trigger[1:],2):
    if not any(r[:10]):continue
    if r[2]:name=str(r[2]).strip()
    conditions.append(dict(row=i,name=name,param=r[3],cn=r[4],type=r[5],values=r[6],ops=r[7],multi=r[8],unit=r[9]))

tasks=[]
for f in ['v02-car-tasks.json','v02-nav-tasks.json']:
    d=json.loads((B/f).read_text())
    tasks.extend(d if isinstance(d,list) else d['tasks'])

for t in tasks:
    if '结束导航' in t['title']:
        t['rows']=[59,64,160]
        t['target']='navigation_0001.status：导航中→未发起导航；档位非P→P。核对第59行旧 vehicle_control_0003.states 与第64行独立 vehicle.driving.gear.states，本次使用哪个由实际协议决定。'
    if '进入目的地1000' in t['title']:t['rows']=[160,171]
    if '导航回家' in t['title']:t['rows']=[160,162,164,165,170]
    if '空调原子拆分' in t['title']:
        t['current']=t['current'].replace('v01 是拟定迁移方案，不是已实施证据。','尚未取得本次独立信号已承接旧规则的证据。')
    if '香氛状态' in t['title']:
        t['blocker']='缺明确 Trigger 使用场景及参数/事件语义；先核实具体依赖，再确认哪些参数需要开发。'
    if '补齐手部温度' in t['title']:
        t['category']='需新增端状态'
        t['target']='补充真实手部温度的端状态字段或温区枚举，并明确座位/左右手范围；Trigger复用现有温度比较，增加已确认的手部映射。现有 temp/position 温区先回测，位置误填℃作为待修正项。'
    if '低电事件' in t['title']:
        t['rows']=[47,191]
        t['operators']='业务比较目标：当前电量 < 用户阈值。平台跨字段比较能力及配置方式待确认；不是已核实的运算符名称。'
    if '续航不足' in t['title']:
        t['rows']=[48,49,169,171]
        t['logic']='静态比较同一车辆、当前导航目的地对应的有效续航和距离，统一单位；两字段时效及更新不同步的处理待确认。一次上电周期仅一次。不能用固定低电阈值替代，can_arrive是否等价须核实。'
        t['operators']='业务比较目标：剩余续航 < 剩余距离。平台跨字段能力待确认；can_arrive等于不可达仅为待确认替代方案。'
        t['category']='需核实'
        t['blocker']='11/10当时优先级降低；本次是否恢复排期、续航口径及跨字段方案待确认。'
    if '危险提醒' in t['title']:
        t['category']='需核实'
        t['current']=t['current'].replace('11/8刘杨明确撤掉','11/8当时刘杨明确撤掉')+' 当前是否恢复须重新核实。'
        t['target']=t['target'].replace('、0002.level','、dangerous_reminder_0002.level').replace('；0003.behavior','；dangerous_reminder_0003.behavior')
    if '超长红灯' in t['title']:
        t['rows']=[60,194]
        t['target']='业务需要已等待时长，并关联第60行 vehicle_control_0004.velocity=0。先确认 nav.route.redlight_duration.duration 含义；若为剩余倒计时，另确认已等待时长来源或计时方案。E列车速ID是否采用取决于实际协议。'
    if 'VLM事件' in t['title']:
        t['target']='vlm_inside_001.result、vlm_inside_002.result、vlm_outside.result。按事件确认输入：睡着需带乘员位置的舱内数据；出地库、美景的舱外数据和可识别范围待核验。'
    t['evidence']=t['evidence'].replace('scene-source.json','静态Advisor事件表').replace('source-values.json','端状态原表').replace('历史compared.json','两版端状态原表').replace('compared.json','两版端状态原表')
    for field in ['current','evidence']:
        t[field]=t[field].replace('11 月 17 日正式后台','11/17前次正式后台只读记录').replace('正式后台只读核查 2026-11-17','前次后台只读记录（11/17，非本稿新增实测）')

tasks.sort(key=lambda x:(min(x['rows']) if x['rows'] else 999,x['title']))
byrow=collections.defaultdict(list)
for i,t in enumerate(tasks,1):
    t['id']=f'T{i:02d}'
    for r in t['rows']:byrow[r].append(t['id'])
    t['parameters']='\n'.join(f"{r}行 {new[str(r)]['signal']}\n{new[str(r)]['id']}.{new[str(r)]['param'] or '参数未定义'}" for r in t['rows'] if str(r) in new)

reviews=[];patches=[];annotations=[];matched_conditions=set()
for key,b in new.items():
    row=b['row'];a=pair.get(row)
    names={norm(b['signal'])};params={norm(b['param'])}
    if a:names.add(norm(a['signal']));params.add(norm(a['param']))
    cs=[c for c in conditions if norm(c['name']) in names and norm(c['param']) in params]
    manual_map={47:(13,'剩余电量 percentage 对应 percentage_ev'),48:(15,'剩余总续航 mileage 对应 mileage_total'),49:(16,'旧表无参数key，按剩余电续航中文含义对应 mileage_ev'),52:(46,'旧表无参数key，按上下电含义对应旧版 states；高压范围需核实')}
    manual_reason=''
    if row in manual_map:
        cr,manual_reason=manual_map[row]
        cs=[c for c in conditions if c['row']==cr]
    # Repeated states in the old AC signal represent different fields.
    if len(cs)>1:
        numeric='大于' in str(b['ops'])
        exact=[c for c in cs if ('大于' in str(c['ops']))==numeric]
        cs=exact if len(exact)==1 else []
    c=cs[0] if len(cs)==1 else None
    if c:matched_conditions.add(c['row'])
    diffs=[]
    if a:
        for field,label in [('id','信号ID'),('param','参数'),('type','类型'),('range','取值'),('ops','表内运算符'),('tr_unit','Trigger单位'),('multi','协议多选主key')]:
            if norm(a.get(field))!=norm(b.get(field)):diffs.append(f"{label}：{show(a.get(field))} → {show(b.get(field))}")
        if norm(a['state'])!=norm(b['state']):diffs.append(f"支持标注：{show(a['state'])} → {show(b['state'])}")
    else:
        diffs.append('未建立v1.2唯一对应关系；不能据此判断Trigger需要新增。')
    conflict=bool(c and ((norm(c['ops'])!=norm(b['ops']) and b['ops']) or (c['unit'] and b['tr_unit'] and norm(c['unit'])!=norm(b['tr_unit']))))
    if conflict:diffs.append('独立触发器条件表与v1.3标注不一致，需核准当前能力。')
    if manual_reason:diffs.append('人工语义对应：'+manual_reason+'；不代表新协议已适配。')
    related=byrow[row]
    if related:result='见任务 '+','.join(related)
    elif conflict:result='核实能力记录冲突，不直接新增或删减运算符'
    elif a and a['state']==1 and diffs:result='核对旧规则迁移；沿用记录不代表已完成适配'
    elif a and a['state']==1:result='原表已标支持；未发现本次字段差异'
    else:result='本次未发现明确新增要求；不自动提开发'
    # New ID is a separate protocol version, not proof of Trigger migration.
    if row in [64,138,139,140,141,142,143]:result='旧能力拆分承接，见对应任务；不重复算全新能力'
    entries=[]
    if a:entries.append(f"v1.2 第{a['row']}行：支持={show(a['state'])}；逻辑={show(a['ops'])}；单位={show(a['tr_unit'])}")
    entries.append(f"v1.3 第{row}行：支持={show(b['state'])}；逻辑={show(b['ops'])}；单位={show(b['tr_unit'])}")
    if c:entries.append(f"触发器条件/sls 第{c['row']}行：{show(c['ops'])}；单位={show(c['unit'])}；多选主key={show(c['multi'])}")
    else:entries.append('独立触发器条件/sls 未唯一匹配；不等于平台不支持。')
    old_definition='无唯一对应' if not a else f"第{a['row']}行 {a['id']}.{a['param']}\n类型：{show(a['type'])}\n取值：{show(a['range'])}"
    new_definition=f"{b['id']}.{b['param'] or '参数未定义'}\n类型：{show(b['type'])}\n取值：{show(b['range'])}"
    provenance=f"v1.3!P{row}:V{row}、AT{row}:AV{row}"
    if a:provenance+=f"；v1.2!N{a['row']}:S{a['row']}、AQ{a['row']}:AS{a['row']}"
    if c:provenance+=f"；触发器条件/sls!D{c['row']}:J{c['row']}"
    reviews.append([row,b['signal'],b['param'] or '参数未定义',old_definition,new_definition,'\n'.join(entries),'\n'.join(diffs) or '两版已对齐字段无变化',result,','.join(related),provenance])
    if related or (a and a['state']==1 and diffs) or conflict:
        note=result+'。'
        short=[]
        for field,label in [('param','参数'),('type','类型'),('tr_unit','Trigger单位')]:
            if a and norm(a.get(field))!=norm(b.get(field)):short.append(f"{label}由{show(a.get(field))}改为{show(b.get(field))}")
        if a and norm(a.get('range'))!=norm(b.get('range')):short.append('取值范围有变化，需核对旧规则')
        if conflict:short.append('独立条件表与本表记录有差异')
        note+='；'.join(short)+('。' if short else '')
        note+='现有AT–AV保留原始记录，目标逻辑见本地任务表。'
        patches.append({'cell':f'AW{row}','before':raw[row-1][48],'after':note})
        annotations.append({'row':row,'aw':note})

unmatched=[c for c in conditions if c['row'] not in matched_conditions]
# Show unmapped capability records explicitly in the same detail table, not silently discarded.
for c in unmatched:
    reviews.append([None,c['name'],c['param'] or c['cn'],'独立触发器条件记录未建立唯一映射','需核对赛力斯信号参数',f"触发器条件/sls 第{c['row']}行：{show(c['ops'])}；单位={show(c['unit'])}；多选主key={show(c['multi'])}",'名称或参数可能改名；未映射不等于不支持','补充唯一映射，不能强行关联','',f"触发器条件/sls!C{c['row']}:J{c['row']}"])

patches.insert(0,{'cell':'AW1','before':raw[0][48],'after':'Trigger差异说明（本地任务表v02）'})
payload={'sheet':'【New】sls端状态v1.3','patches':patches,'rows':[x['row'] for x in annotations],'review':annotations,'tasks':tasks,'comparison':reviews,'record_counts':{'v13_records':len(new),'v13_parameters':sum(bool(x['param']) for x in new.values()),'v12_records':len(old),'trigger_conditions':len(conditions),'trigger_matched':len(matched_conditions),'trigger_unmatched':len(unmatched),'task_count':len(tasks),'annotated_rows':len(annotations)},'source_urls':['https://bytedance.larkoffice.com/wiki/QtDrwVdOcibytwkhzNYcrmRjnfh?sheet=gtHr8Y','https://bytedance.larkoffice.com/wiki/QtDrwVdOcibytwkhzNYcrmRjnfh?sheet=RdQC48','https://bytedance.larkoffice.com/wiki/RskXwNWmEi0EQ3kaZPUcES9BnSg','https://pq3b44yw2t9.feishu.cn/base/FsQWbFf1aa0SJus7m6gcKQhynuh?table=tblftOpLtzGhkQdN&view=vew8OCrYsY']}
(B/'v02-data.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2))
print(json.dumps(payload['record_counts'],ensure_ascii=False))
