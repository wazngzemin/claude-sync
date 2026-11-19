import json
from pathlib import Path

BASE=Path(__file__).resolve().parent
src=json.loads((BASE/'source-values.json').read_text())['【New】sls端状态v1.3']
edits={}
for name in ['proposed-car.json','proposed-nav.json']:
    for item in json.loads((BASE/name).read_text()):
        edits[item['row']]=item

def setrow(row,aw,at=None,au=None,av=None,clear_unit=False):
    item=edits.setdefault(row,{'row':row,'at':src[row-1][45],'au':src[row-1][46],'av':src[row-1][47]})
    item['aw']=aw
    if at is not None:item['at']=at
    if au is not None:item['au']=au
    if av is not None:item['av']=av
    if clear_unit:item['av']=None

NUM='等于,大于,大于等于,小于,小于等于'
setrow(47,'原有数值比较保留。“车辆电量低”要求当前电量<用户设置阈值，事件表已标上线/通过。先核实现有事件怎样取阈值，不直接判定需新增跨字段能力；频控为每次上电一次。')
setrow(48,'原有数值比较保留。“无法到达目的地”需与第171行剩余距离比较，并统一km/m。使用总续航还是纯电续航待业务确认；11/10已降低该需求优先级，不能标已完成。')
setrow(49,'原有数值比较保留。若“当前电量无法到达目的地”采用纯电续航，本字段与第171行距离跨字段比较；与第48行二选一需确认，不能同时默认满足。')
setrow(51,'沿用数值五种比较、km。比较前先选择里程类型，值须来自同一类型；若确认接入纯电累计里程，再与第50行一起验收。')
setrow(60,'原有数值比较保留。事件表“超长红灯等待中”要求车速等于0，且红灯等待时长>90秒；不能省去停车条件。')
setrow(63,'已有时长数值比较入口。v1.2为h，v1.3协议为min；AU为适配目标，按分钟接入后换算旧阈值。Trigger当前默认单位尚待核实，不能仅改单位文字。',av='待确认')
setrow(64,'旧第59行档位拆为独立信号，AU保留。“结束导航”还要求导航中变为未导航且非P变为P；两项发生时序需核实，条件组“且”本身不表示先后顺序。')
setrow(160,'旧“巡航中”在新版删除，需迁移旧值。“发起导航”要求未导航→导航中；仅“变更为导航中”不限定旧值，首次上报等情况需回测。原有运算符保留。')
setrow(162,'原有类型等于家/公司保留，与同一收藏地址关联。“导航回家/公司”还需导航目的地匹配该收藏点；不能只判断收藏列表里有家或公司。')
setrow(164,'原有地址等于保留。“导航回家/公司”需要与当前目的地匹配；群里已安排相关事件复测，先核对现有实现，不重复新增。')
setrow(165,'旧“目的地位置”改名“目的地信息”，需保持名称映射。目的地变更要求旧地址非空且新旧不同；普通“有变更”是否排除首次赋值需验证。')
setrow(169,'候选方案：可达性等于“不可达”可用于“电量无法到达目的地”，但须确认端侧计算口径与原续航<剩余距离需求一致。AU为候选目标，未确认替代原跨字段开发。',at='待确认',au='等于',clear_unit=True)
setrow(170,'候选方案：收藏匹配状态等于“匹配家”或“匹配公司”。先核实现有导航回家/公司事件是否已使用此字段；若已实现则补标，不重复开发。当前是否接入待确认。',at='待确认',au='等于',clear_unit=True)
setrow(171,'原有数值比较和m保留。“即将到达”采用导航中且剩余距离≤1000m（用户已确认）；进入范围与范围内连续上报的重复触发需验证。跨续航比较另见48/49行。')
setrow(175,'路况从str改为enum，保留等于。与第176行预计拥堵时长>10分钟组合；“道路缓行”是否也算拥堵需业务确认。频控采用5分钟（用户已确认）。',clear_unit=True)
setrow(176,'拟新增“大于”判断：预计拥堵时长>10分钟，并满足拥堵路况。先确认duration表示预计时长；协议min，Trigger默认单位待确认。11/12事件表注明客户信号问题预计月底支持。',at='待新增',au='大于',av='待确认')
setrow(178,'原有地址变化判断保留。“途经点变更”按同一index比较地址；新增、删除及顺序调整的覆盖需分别回测，不能把不同序号地址直接互比。')
setrow(180,'原有序号等于保留，作为第178行地址变化的区分条件。上汽历史实现不能直接代替赛力斯验证；新增、删除、重排分别核对。')
setrow(183,'原有五种数值比较保留。协议单位m，Trigger旧默认km；核实换算路径后迁移，1km=1000m，不能直接覆盖原默认单位。')
setrow(191,'明确需求：当前电量<用户设置阈值（本字段，5–60%）。事件表“车辆电量低”已标上线/通过，先核实取阈值方式；本参数是否作为独立条件及其运算符待确认，不能让阈值自己与常量比较。',at='待确认',au='待确认',av='%')
setrow(194,'保留v1.2五种数值比较作为目标。11/15群称已在workflow环境修复，正式环境亦见入口，原“待开发”需核实更新。事件要求已等待>90秒且车速=0，不能用剩余倒计时替代。',at='待确认',au=NUM,av='s')
setrow(273,'已有静态等于。10/23要求position和face_id变化：动态“变更为/有变更”是否已实现需核验，未直接写成已支持。新版删除三排，需核对旧场景范围。')
setrow(279,'原有等于、变更为保留。上车按指定座位变为已占用。上汽历史问题提示需回测首次/全量上报重复触发；赛力斯是否需要上电前置条件另确认，不能直接套用上汽规则。')
setrow(360,'AU目标为等于指定疲劳等级，多个等级用“或”。9/22明确旧危险提醒不支持包含；11/8暂缓、11/12仍有客户接口问题，恢复待核实。动态进入状态的要求未确认，不自行新增变化运算。',at='待确认',au='等于',clear_unit=True)
setrow(361,'拟新增level等于指定分心等级，多个等级用“或”；明确中紧急/高紧急覆盖，未检测到不算分心。依赖端侧恢复，频控5分钟；未要求进入瞬间触发，不自行加变化运算。',at='待新增',au='等于',clear_unit=True)
setrow(362,'11/8要求等待dangerous_reminder_0001–0004接入后再支持，当前恢复情况待确认。若纳入Trigger，目标按behavior等于抽烟/打电话判断；单值枚举不直接使用包含。',at='待确认',au='等于',clear_unit=True)
for row in [363,364,365]:
    setrow(row,'原表等于/包含暂保留，需核实普通比较入口语义。11/12仅确认ppe_aidv_recommend_dev测试环境支持VLM推理触发；配置识别目标判断是否达成，不等同字符串包含或正式上线。')
setrow(366,'原有温度比较保留。E列将车内/车外拆成两个2.0 ID；若本次启用2.0，应按第367行位置路由。v1.3表升级本身不代表已经切换2.0。')
setrow(367,'原有位置等于车内/车外保留，需与第366行对应温度关联。位置是枚举，无温度单位；若切2.0，确认由独立ID承接该位置选择。',clear_unit=True)
setrow(368,'已有数值比较入口，AU保留。旧Trigger使用“档”，新版协议为μg/m³；档位不是浓度单位，不能直接换算。需端侧确认实际值和等级阈值后适配。',at='待适配',au=NUM,av='待确认')
setrow(372,'已有温度数值比较入口，AU保留。按第373行温区取同一对象温度；核对新版ID接入。11/15群称已修复温度问题，需按实际环境回测，不能笼统视为从零新增。',at='待适配',au=NUM,av='℃')
setrow(373,'补“等于”选择温区，与第372行温度组合；温区是枚举，删除误填的℃。11/12低温暖手依赖手部温度，现表只有面部/左臂/右臂，不能把手直接当手臂，需补正确字段或枚举。',at='待适配',au='等于',clear_unit=True)
setrow(374,'已有座椅温度比较入口，AU保留；与第375行同座椅关联。若切2.0，先修复E374/E377重复映射。D列1.0信号是否受影响另核验，不直接把E列问题当当前接入阻塞。',at='待适配',au=NUM,av='℃')
setrow(375,'补“等于”选择指定座椅，例如主驾座椅；再比较同一座椅的温度。位置无℃单位，不能把不同座椅温度混在一条条件里。',at='待适配',au='等于',clear_unit=True)
setrow(377,'2.0映射问题：E377与座椅温度共用ID，切2.0前需修复；不等于D列1.0信号不可用。若确认需Trigger接入，AU为辐照度比较目标，W/m²；本行未确认必须新增。',at='待确认',au=NUM,av='W/m²')
setrow(378,'随第377行确认接入范围。若接入，目标为光照位置等于left或right，并与同侧辐照度组合；位置无单位。不能拿左右两侧值交叉比较。',at='待确认',au='等于',clear_unit=True)
setrow(379,'补回温度五种比较和℃，已有前风挡入口。v1.3名称变为玻璃温度但说明仍是前挡风玻璃；先按前挡范围适配，不能默认为所有车窗玻璃。',at='待适配',au=NUM,av='℃')
setrow(381,'已有AQS等于六档等级入口。v1.2写过大小比较，当前枚举仅确认等于；需筛“中度及以上”时将中度/重度/严重污染用“或”组合，不能擅自按文字排序。',at='待适配',au='等于',clear_unit=True)
setrow(382,'11/10明确舱外大件行李依赖，11/16群称VLM已实现、Trigger未接。拟按完整result串等于匹配；若只关心大件物品，需枚举组合或拆字段，不能直接填“包含大件”冒充已支持。',at='待新增',au='等于',clear_unit=True)

# Only actual changed values are written. Empty text and None are equivalent for this source.
def eq(a,b):return (a in [None,''] and b in [None,'']) or a==b
patches=[]
for row,item in sorted(edits.items()):
    for col,key,idx in [('AT','at',45),('AU','au',46),('AV','av',47),('AW','aw',48)]:
        before=src[row-1][idx]
        after=item.get(key)
        if not eq(before,after):patches.append({'cell':f'{col}{row}','before':before,'after':after})
patches.insert(0,{'cell':'AW1','before':src[0][48],'after':'Trigger差异说明（本地核对稿）'})
result={'sheet':'【New】sls端状态v1.3','patches':patches,'rows':sorted(edits),'review':list(edits.values()),
        'source':'https://bytedance.larkoffice.com/wiki/QtDrwVdOcibytwkhzNYcrmRjnfh?sheet=gtHr8Y',
        'date':'2026-11-17','meaning':'AT=1沿用已支持标注；待新增/待适配行的AU为本次目标，待确认行不得当成已上线。未改动的空白不等于本次全部需要新增。'}
(BASE/'final-edits.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({'reviewed_rows':len(edits),'changed_cells':len(patches),'by_column':{c:sum(p['cell'].startswith(c) for p in patches) for c in ['AT','AU','AV','AW']}},ensure_ascii=False))
