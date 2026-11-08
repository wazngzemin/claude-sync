from pathlib import Path
import xml.etree.ElementTree as ET
import re,json
base=Path('/Users/bytedance/Desktop/3.23/产品/codex/上汽定时任务-v03-delivery')
src=(base/'current.xml').read_text()
root=ET.fromstring('<root>'+src+'</root>')
byid={e.get('id'):e for e in root.iter() if e.get('id')}
updates={
'doxcn6H5Hu7q3eN7fZWHyl7Icjd':'支持用户创建“到点做”“条件满足再做”和“按周期重复做”的任务。系统保存执行内容与触发规则，到点或条件命中后交给 Planner 执行，并同步任务状态与实际结果。',
'doxcn1PU7QpolUHqFyoXjs9ugRb':'范围：定时任务、用户条件任务、后台预置场景，以及创建、执行、修改、取消和状态展示。',
'doxcnexkzFHHG0TqQygnjpwWW6g':'车型范围、动作权限、跨下电与错过策略',
'doxcnSMnKPP7O62Al2xXiXOcb7b':'时间与条件解析、任务托管、建议、修改取消',
'doxcnGty1FMfBMxHOJUFgX9ReRl':'时间登记、到点通知、循环安排',
'doxcnwClmvjxCpAV0Uvym3kchef':'条件场景注册、车辆范围、条件判断与命中通知',
'doxcnUNQr964BxYJ4kFMpg9c4xe':'理解与澄清用户需求，安排触发后的执行',
'doxcnn9yLzR1y4BiPEfc9T0i2vc':'卡片、查询、状态记录、取消回调与倒计时',
'doxcnQjQJOUYjxMporYX31e7Mmf':'提供车辆状态、执行动作并回传结果',
'doxcn0M6XNkGxJy58ZaJ26K70Xg':'“十分钟后关闭座椅加热”需要等时间；“副驾上车时提醒系安全带”需要等车辆条件。上汽定时由弋途闭环，火山触发器负责条件触发与后台预置场景，两条等待路径共用任务管理和执行链路。',
'doxcnWDYRBx0JhhgKbkXWz3NgZP':'用户能够创建未来任务，并确认系统保存的时间、条件、对象与执行内容。',
'doxcnlFKJfstDyPzD9bSctPQtfb':'弋途等时间；火山触发器判断车辆条件；动态 Advisor 托管任务并提出建议；Planner 安排执行；任务中心展示状态。',
'doxcnhXPjsomTef8bJgEJA1tq3d':'创建、修改和取消按实际处理结果反馈；到点、条件命中或指令送达均不等于任务完成。',
'doxcnIm7uRcs6lelAQlR3lnaWRc':'创建前校验动作和条件能力。不支持的条件明确拒绝或澄清，不替换成含义不同的信号；定时按分钟粒度处理，不支持“每 5 秒提醒一次”。',
'doxcnIKtJzOX3JwkuhZeKenxpoh':'任务保留座位、对象和动作信息。执行时重新检查当前车况与权限，例如主驾加热是否仍开启。',
'doxcnbHxK5ztwd60vCTBMR3I19g':'<b>定时任务：</b>保存执行内容与时间规则，由弋途定时能力在相对延时、指定时刻或周期到达时唤醒执行链路。',
'doxcnUlGapah1O7YkvnA7F6P4kg':'<b>条件任务：</b>动态 Advisor 解析用户条件并向火山触发器注册场景。受支持的车辆条件命中后，触发器通知动态 Advisor。',
'doxcnj33ExR3I9yjWKUydrWYcAf':'<b>后台预置场景：</b>产品人员配置适用范围、条件和下游动作，由触发器运行，无需用户创建任务。',
'doxcnGLp7fYHrE6gbTNf6zW7sJf':'<b>任务与本轮执行：</b>“每天 9 点提醒喝水”是一条循环任务，每天提醒是一个轮次。本轮结果和整条任务是否继续分别记录。',
'doxcnIgRFembbGIlMZP8JMDBtDh':'理解与澄清需求、创建目标；触发后安排动作并根据工具结果反馈',
'doxcnEFjoPcGLtGXXKrpftzcB3c':'解析时间 / 条件、托管任务；被唤醒后提出执行建议',
'doxcnY9sk1C3mwKE3h8aNbCrdDX':'登记时间规则、等待到点、安排循环下一轮',
'doxcnn2HiArrV0wZMq4Qz2HgddW':'运行注册条件，判断车辆信号，命中后通知登记下游',
'doxcnCcZtRuItt98g8XbhcSGFkd':'任务接入、查询、状态和卡片管理；取消时回传业务事件',
'doxcntNxxmZgoAxyuH1FRKH1d9e':'执行车控或提醒，回传结果并展示',
'doxcnsO1ZWJvsn1FSyXzXS186Vg':'<b>理解请求：</b>Planner 区分立即执行与未来任务；时间、对象或动作不明确时先澄清，未来任务交给动态 Advisor。',
'doxcnoGq46TFJHdpmFhXiVJ8Hve':'<b>解析校验：</b>动态 Advisor 提取内容、对象、时间 / 条件和周期；校验日期、动作权限与上汽可用条件。不支持时返回原因。',
'doxcnkavcVJmLIyFwBZvGK42Y0d':'<b>任务分流：</b>明确时间登记弋途定时能力；车辆条件注册火山触发器；模糊日期按 7.4 转换。',
'doxcn4NAs93N04E9Xr4fjk96f1b':'<b>接入登记：</b>任务中心校验接入资格、容量与卡片信息；等待模块登记规则，并返回登记结果。',
'doxcnAa9H8WYIhtWzZkpgDsrc6b':'<b>结果反馈：</b>登记成功后反馈规则并展示任务卡片；失败说明原因。任务接入与等待登记的顺序、部分失败的清理方式待确认。',
'doxcn0PXF97YmWupPPRQUE3ftLh':'<b>到点通知：</b>弋途定时能力向动态 Advisor 发送本轮到点事件。',
'doxcnialMzY1lVPXF8pW4Es0kgb':'<b>执行建议：</b>动态 Advisor 找到对应任务，确认任务有效，向 Planner 提交执行内容与建议。',
'doxcnVgHzVq7syjcEu1mtF3hiPe':'<b>执行反馈：</b>Planner 检查当前状态、动作权限及确认要求，调用车控或提醒链路，根据实际结果反馈。',
'doxcnPnQk9nwBXPAIq4op5aNWJh':'<b>任务收尾：</b>一次性任务执行后结束；循环任务记录本轮结果并继续等待。跨下电、错过与循环续跑规则待确认。',
'doxcnZPwmOyPjyam35nDSRNmhtd':'动态 Advisor 从用户请求中提取条件、对象、内容和次数，例如“副驾上车时提醒他系安全带”。',
'doxcnAjnI6ZhOsXprjNUtnlhrmb':'校验上汽可用条件；不支持时由 Planner 澄清或拒绝。“副驾上车”不能直接替换成“车门打开”。',
'doxcni6aVOrpOIer2rEh4D9EpEb':'向火山触发器注册条件场景，指定上汽渠道 / 车辆和动态 Advisor 回调。注册失败反馈原因。',
'doxcneouXz7PavfVj90i9y9h0ue':'车端上报相关信号，触发器按注册条件判断；未满足继续等待。',
'doxcnyCPkxtsOhcVJXfu4oOzoHc':'条件满足且符合场景有效性、频控要求时回调动态 Advisor；动态 Advisor 确认任务有效后向 Planner 提建议。',
'doxcnqErJ6tQCjzI5c2LVh02mwb':'Planner 按当前状态执行、反馈并回写结果。一次性任务结束后停止监听；循环任务按再次命中规则继续，具体规则待确认。',
'doxcnDJHVLovuNqrpHSd15w4sqd':'任务取消、达成或失效时联动停用 / 删除场景；只隐藏卡片不能代替停止监听。',
'doxcnsG8XULoaYwhhHagyWnwPLy':'任务中心负责接入校验、创建结果、状态查询、卡片更新与取消回调。具体状态名称和展示入口按上汽任务中心版本确认。',
'doxcnb4lIAYqVNfWWVqyTA3qfnb':'展示具体动作',
'doxcnEfBtVVU1JXhVi5C9BbJhrb':'展示解析后的时间或条件',
'doxcnRrsMxTt7cAOgftpKPVNEZg':'明确执行或提醒对象',
'doxcnAYujX2oiUXR6fWNkXTcYId':'区分一次性与循环',
'doxcn28NgANsEgUUeNQPGGjWBkd':'按分钟更新，不保留过期倒计时',
'doxcndFQMnbuRuksRWq0A0QTbwh':'与业务进度一致，状态映射待确认',
'doxcnXLllBj4MN1JnO0IlE3GdZz':'与未来是否继续分别展示',
'doxcn2rUATRtoWU46HzeSGTDaEb':'显示实际原因，不提前报完成',
'doxcnOP7ilqC1hVcA0GUBwaCb3e':'按目标版本提供操作',
'doxcnpAmtgcTQVYa5xApJq2xHHn':'下一轮安排更新后同步展示',
'doxcnv6MZ0x4ai8IP26Rgoc8Q33':'边界 / 待确认',
'doxcnebIj7YLA3lyp6kssYlpfAh':'重复识别规则待确认',
'doxcn9GC9NcqMO622C6jSxoBOxc':'更新失败如何保留旧规则待确认',
'doxcnSobeeNxuJZDc7B6E7Nubbe':'执行内容与卡片同步',
'doxcnD5WpmhACEnEj1MTITD5uUO':'避免新旧条件同时有效',
'doxcn1EoVvBZclnh4m9IgypuC0u':'切换顺序与失败处理待确认',
'doxcnrnN5OxKSCH3ih7wvGoEngb':'晚到事件的拦截方式待确认',
'doxcnSoPq8xQwqyVlMq9yszmfrh':'已下发动作能否撤回待确认',
'doxcngtUpLtFpmMRTuCRwUVxVSg':'是否支持单轮取消待确认',
'doxcnlQpTLu3cg1Pe9wADWl71uc':'开关语义及恢复方式待确认',
'doxcncoDn8gDXIihjnY1vmDFHug':'不展示创建成功',
'doxcnlhSTfhnAzyGhMHbbKOzuXg':'展示规则并等待触发',
'doxcnnzjXgu2m6qwaWEsM8aeRUe':'展示处理中',
'doxcn5H3JnQGYyFIXRtwvgmQi6l':'一次性结束；循环记录本轮结果',
'doxcnKzO8r7mItZwS4YvmEhqoNf':'显示失败环节与原因',
'doxcnptApaqLashzkB55XLsUaeg':'记录目标已达成，不重复执行',
'doxcnumXT9CtDwoog6ZHa1Bt4Jc':'不报完成；结果等待期限待确认',
'doxcnUT6Id7fqmLg9yyvItoh5pe':'更新卡片，停止定时 / 条件等待',
'doxcnBKUoBV5Ine80hQYkCNchHL':'任务中心状态和定时 / 条件场景状态分别管理。一次性任务结束需停止对应等待；后台场景停用不等于用户取消任务。',
'doxcnJkBRzkV0oaYwo4i1r76b58':'提醒以实际交互结果、车控以工具结果及必要的车辆状态确认完成；结果未知不报成功。',
'doxcn1oyRybO73wcr5TLiiV8tfb':'动态 Advisor 解析主驾、关闭加热和十分钟后，由弋途登记时间；任务中心展示内容与倒计时。到点后 Planner 检查加热状态，执行关闭并反馈结果。',
'doxcnWLlNYY3bQ8xivJFYN1eluh':'加热已关闭则无需重复控车；取消后停止等待。车辆下电或无人时是否执行，按上汽规则确认。',
'doxcnnNdTg3cPYqx1ttf9RTYBzg':'动态 Advisor 解析明天 09:00 与提醒内容，由弋途登记时间。到点后向 Planner 提醒建议，实际提醒后记录结果。',
'doxcnhd6dYqK3pqfdOEzrwwCDsg':'提醒出发不自动等于启动导航。错过触发时间进入任务记录；允许延迟、离线补发和跨端通知方式待确认。',
'doxcnqSUhlkKK76UWpdJM97nDmc':'先校验车型按摩能力，再创建每小时循环任务。弋途逐轮唤醒，Planner 检查当前状态并执行，本轮结果回写任务中心。',
'doxcntUsD5CoV8ZclvGpqbEpCZT':'循环计时锚点、最长时长、结束条件，以及手动关闭按摩是否影响后续轮次待确认。',
'doxcnkdRxrNBZGfYB8jtmoF9tPW':'弋途动态 Advisor 按分钟组织观察，取得当前视觉结果；宝宝睡着后向 Planner 提出提醒建议。观察能力需先确认，“每分钟看看”不等于每分钟提醒。',
'doxcnftmxWnASBg9Mf25p2Kn9vg':'看不清或未取得图像记为未知。是否只提醒一次、最长观察时长及取消后的采样停止方式待确认。',
'doxcn6sR0YPP4yxSoe94zD5gWbP':'由弋途登记每天 09:00 的循环安排。每轮唤醒 Planner，实际提醒后记录本轮结果，再等待下一次。',
'doxcncFKtLd9ZjxPNGE14E51hmh':'取消整条任务停止未来轮次。单轮取消、错过后是否续跑及跨下电保留规则待确认。',
'doxcnUnAyZFQlJ9saPSUZovq1id':'无具体时刻，转为“目标日期首次有人上车”的一次性条件任务。动态 Advisor 注册日期窗口与上车条件，命中后交给 Planner 提醒。',
'doxcn94drodxnlyhklu1BBJ2BRe':'今天上车不提醒，明天首次上车提醒后结束。目标日未上车的过期处理、跨午夜已在车内的判断待确认。',
'doxcnOYCuEJ2Ox09eC60Y1IA8Kf':'',
}
for id,txt in updates.items():
    el=byid[id]
    frag=ET.fromstring('<fragment>'+txt+'</fragment>')
    for ch in list(el):el.remove(ch)
    el.text=frag.text
    for ch in list(frag):el.append(ch)
for el in root.iter():
    if el.text:
        el.text=el.text.replace('Planner / Director','Director').replace('Planner','Director')
        if el.get('id') not in ['doxcncMPaycLlVRGYUbkvPbZdgc','doxcnMU2JVoqyOjUfZjEuxjYwWb']:
            el.text=el.text.replace('火山触发器','触发器')
    if el.tail:
        el.tail=el.tail.replace('Planner / Director','Director').replace('Planner','Director').replace('火山触发器','触发器')
    if el.tag in ['h2','h3','h4']:el.tag={'h2':'h1','h3':'h2','h4':'h3'}[el.tag]
out=''.join(ET.tostring(el,encoding='unicode',short_empty_elements=False) for el in root)
# Preserve each original whiteboard block exactly.
old_boards=re.findall(r'<whiteboard\b[^>]*>.*?</whiteboard>',src,re.S)
for old in old_boards:
    bid=re.search(r'id="([^"]+)"',old).group(1)
    out=re.sub(r'<whiteboard\b(?=[^>]*id="'+re.escape(bid)+r'")[^>]*>.*?</whiteboard>',lambda m:old,out,flags=re.S)
ET.fromstring('<root>'+out+'</root>')
(base/'revised.xml').write_text(out)
text_orig=''.join(root.itertext())
orig=ET.fromstring('<root>'+src+'</root>')
def measure(e):return len(re.sub(r'\s+','',''.join(e.itertext())))
oldh=[(''.join(e.itertext()),e.get('id')) for e in orig if re.fullmatch('h[234]',e.tag)]
newh=[(''.join(e.itertext()),e.get('id')) for e in root if re.fullmatch('h[123]',e.tag)]
assert oldh==newh
assert [e.get('id') for e in orig]==[e.get('id') for e in root]
assert old_boards==re.findall(r'<whiteboard\b[^>]*>.*?</whiteboard>',out,re.S)
assert len(list(orig.iter('table')))==len(list(root.iter('table')))
stat={'original_chars':measure(orig),'revised_chars':measure(root),'reduction_chars':measure(orig)-measure(root),'reduction_pct':round(100*(measure(orig)-measure(root))/measure(orig),1),'headings':len(oldh),'tables':len(list(root.iter('table'))),'whiteboards':len(old_boards),'changed_text_blocks':len(updates)}
(base/'revision-stats.json').write_text(json.dumps(stat,ensure_ascii=False,indent=2))
print(json.dumps(stat,ensure_ascii=False))
