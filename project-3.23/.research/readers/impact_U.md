# impact_20U（用户账号与乘客识别）——资料有、副本缺

来源：AI 汽车账号与乘客 One Page（全文+4画板已看）、多模态人物记忆需求（全文+2画板已看）、D6X机器人PRD（角色层画板已看）。

## 缺：8 个 ID 的分工表
资料给出完整 ID 表：
- vehicle_id（VIN 或加密映射，数据所属车辆）
- device_id（车机消息通道，**仅用于消息路由，不等于用户身份**，不直接信客户端公参）
- login_doubao_uid（豆包 A 类应用真实 ID，不建议下游直接当长期数据主键）
- account_id（车企 OEM 账号，承载车辆所有权/授权角色/车控权限）
- volcano_account_id（统一火山账号，屏蔽豆包/非豆包 IP 差异，任务和账号配置的稳定键）
- face_id（注册车辆内唯一，**只作识别因子不含生物信息**，映射 VehicleUserID）
- voiceprint_id（声纹，FaceID 补充因子）
- vehicle_user_id（车内可持续识别的人，承接 faceid/声纹/昵称/关系/乘客类型）
- 链接：https://bytedance.larkoffice.com/wiki/QRhWwLLShiF5jIkuygfcc353nje ｜ 状态：全文 ｜ 车型：上汽DNA+赛力斯

## 缺：双账号同登同退
车机同时存在 OEM 账号和豆包账号，不强制一一绑定；车机保存多组 OEM↔豆包登录关系；切 OEM 账号跟随切关联豆包账号，无关联进未登录态；**单车只保留一个前台豆包登录态**；解绑注销联动退登和数据清理。登录退登换登先同步云端，云端成功端侧再切换。
- 画板（账号架构5层）：身份来源层→账号基础能力层→安全与身份层（IdentityResolver）→统一身份中心 VolcanoAccountID（豆包IP: doubao_uid→ID；非豆包IP: account_id→ID）→业务关联层（任务配置跟ID/车配置跟VehicleID/记忆=ID+VehicleUserID）。
- 链接同上。

## 缺：请求鉴权主链路 6 步
画板：1进入AIDV→2入口认证调用方ACL→3车企可信校验（vehicle_id+account_id 验证人车关系返回 role；失败=拒绝请求记审计，不接受客户端自报 role）→4登录态校验→5解析业务身份（渠道账号→VolcAccountID；account_id 内解析 VehicleUserID；乘客查询必须带 account_id，禁止跨账号复用映射）→6 Agent权限判断（Agent策略×role×登录态，必要叠加 FaceID 和行车条件；不满足=阻断执行返回登录引导）。Fail Closed：关系或角色无法确认时拒绝高权限能力。
- 链接同上，画板 token BVXiwJULnhIJJFbOZ2tcLlaDnyc。

## 缺：乘客注册与同步规则
注册入口：车企 DMS/HMI + 家庭组/专属或共享乘客同步 + AI 语音注册；车机上报位置/face_id/失败原因，云端统一映射 VehicleUserID。云端关系数据**不直接等价写入车机 FaceDB**，注册删除槽位/LRU 按车企能力执行。上汽 FamilyList=OEM 账号下家庭成员关系；赛力斯区分专属乘客（只归属一个账号）与共享乘客（车主/长期授权账号可见）。同一 face_id 在不同 OEM 账号下可有不同昵称称呼。
- 数据边界表：登录态与角色=channel+vehicle_id+account_id；任务与账号配置=VolcAccountID；乘客资料=channel+vehicle_id+account_id+VehicleUserID；乘客私有记忆=可信 account_id 边界内的 VolcAccountID+VehicleUserID。
- 链接同上。

## 缺：豆包与用车人的从属关系
D6X PRD：每台车在登录账号模式下对应**一个**豆包；已登录=该账号用户的豆包；访客模式=无从属豆包；车内唯一豆包可与不同用户交互。角色层画板：车内用户↔（交互）↔豆包↔（从属）↔用车人；豆包被硬件承载（常态=机器人屏幕，瞬态=氛围灯，暂态=中控屏/后排屏）。
- 链接：https://pq3b44yw2t9.feishu.cn/wiki/MGyDwXANqi4ELqkNaX0cveLOnPc ｜ 状态：全文 v13.1 ｜ 车型：上汽 D6X。

## 缺：上车识别的端侧触发时机
多模态人物记忆：每次**车门关闭且其他车门全关**时进行车舱不同位置人物更新上报【1-张航，2-alex，3-未知】；faceid 走云（量产再考虑端），200万摄像头贴挡风玻璃，位置判断结合 VLM，注册前需裁剪只留一张人脸。后续才做声纹注册、关系推理代指（"给我爸开窗"）。
- 链接：https://bytedance.larkoffice.com/docx/SvTfd0XIIoDailx1ViHciIIun4f ｜ 状态：全文 ｜ 车型：incar 0.5 通用。
