# Meego badcase 统计：未取得数据

检查日期：2026-11-17，Asia/Shanghai（UTC+08:00）。本轮检查时间约 15:00–15:06。

目标空间入口：`telematics`。用户提供的样例：[issue 7246040529](https://meego.larkoffice.com/telematics/issue/detail/7246040529)。

**结果状态：failed。没有成功取得 Meego 工单列表、样例详情、空间字段元数据或王泽民的 Meego user_key，因此本文件没有可报告的实际业务统计数字。所有“未取得”均不代表 0。本地 193 条表、138 条 CSV、飞书通知数量和用户口述的“好几千条”均未用于估算全量。**

本轮未启动任何浏览器，没有执行登录流程，没有更改工单、凭证、简历 HTML 或简历来源表。以下区分已执行的访问检查与尚未执行的统计查询。

## 1. 请求的统计结果与筛选口径

下列为待执行口径。实际字段、状态选项和人员身份必须先从目标空间回读，尚未执行这些业务筛选。

| 统计项 | 结果 | 待执行筛选条件／计算方式 |
|---|---|---|
| 空间 issue 总条数 | 未取得 | 解析 `telematics` 对应的内部 `project_key`；确认缺陷类型；枚举当前身份可见的全部 issue，不设创建日期限制，按工作项 `id` 去重。不能把一页长度当总量。 |
| badcase 总条数 | 未取得 | 先核对该空间 issue 是否全部属于本次 badcase；如还包括其他团队缺陷，须按真实产品／项目／标签字段另建 badcase 集合，不能默认全空间 issue 都是用户经手的 badcase。 |
| 最早、最晚创建日期 | 未取得 | 对上面经确认的 badcase 集合取 `created_at` 的 min／max；先核验时间戳单位，再按 Asia/Shanghai 展示。 |
| 经办人包含王泽民 | 未取得 | 精确核验王泽民的 Meego `user_key`；从角色元数据确认“经办人”字段；人员集合包含该 user_key，按 `id` 去重。当前经办人不自动等于历史经手人。 |
| 创建人是王泽民 | 未取得 | 同一 badcase 集合中，`created_by` 等于精确 user_key，按 `id` 去重。 |
| 关注人包含王泽民 | 未取得 | 同一 badcase 集合中，`watchers` 包含精确 user_key，按 `id` 去重；实际承载位置仍需字段元数据核对。 |
| 三种人员口径的去重并集 | 未取得 | 经办／创建／关注三集合做并集；三项分别报告，不能直接相加。此项用于补充理解“经手”，不代替上述三项。 |
| 已关闭条数 | 未取得 | 回读状态选项，将真实“已关闭”状态映射到 `work_item_status.state_key` 后统计。 |
| 已修复条数 | 未取得 | 按空间真实“已修复／已解决”等状态分别映射，不凭状态名猜是否已验证或已关闭。 |
| 已验证条数 | 未取得 | 按空间真实“已验证”状态映射；若不存在独立状态，须注明并使用真实验收字段，不能编造。 |
| 未关闭条数 | 未取得 | 集合总条数减去真实已关闭条数；“已修复未关闭”是否仍在此集合须按状态映射保留。 |
| 关闭率 | 未取得 | 已关闭的唯一 issue 数 ÷ 同一筛选集合的唯一 issue 总数；当前无分子、无分母，未计算百分比。不能默认关闭都代表修复，或把无效／重复关闭计为修复。 |
| P0 总条数／已关闭条数 | 未取得／未取得 | 从优先级真实选项获取 P0 的 option key，再筛 P0；已关闭数与同一状态集合取交集。 |
| P1 总条数／已关闭条数 | 未取得／未取得 | 从优先级真实选项获取 P1 的 option key，再筛 P1；已关闭数与同一状态集合取交集。 |
| 上汽、赛力斯及其他车企／项目条数 | 未取得 | 回读项目／车企字段及选项；按真实值分组，缺失值单列；多选字段另标可重复计数，不根据标题批量猜车企。 |
| 主要问题类型分布 | 未取得 | 回读问题类型／模块／根因等真实字段后分组；如不存在结构化字段，明确缺失，不用本地打标分类冒充 Meego 统计。 |

状态、关闭率、P0／P1、项目／车企及问题类型拟分别输出两套结果：①已确认的全部 badcase 集合；②王泽民经办／创建／关注的去重并集。所有分母必须随表注明，不能把全空间与个人口径混用。

归档、终止、删除与关闭是不同维度。若采用 Meegle CLI 的 MQL 路线，官方说明默认排除已终止项，全量查询须显式考虑 `features={"FindAborted":"true"}`；接口返回范围、归档与回收站边界仍需实际回读。未取得查询结果前，无法确认当前账号的可见性边界或管理员全量。

## 2. 实际执行的访问检查与原始错误

### 2.1 飞书只读 MCP 与连接器发现

- 调用 `feishu_capabilities`：返回可读取飞书消息、云文档、表格、日历、会议与妙记；未提供 Meego 工作项查询能力。
- 调用 `feishu_read_link`，URL 为用户提供的完整 issue 链接。实际返回：

```json
{
  "status": "failed",
  "tool": "feishu_read_link",
  "error": "这不是可识别的飞书 Wiki、文档、表格、多维表格、文件或幻灯片链接",
  "rule": "工具读取失败，不能把本结果解释为资料不存在。"
}
```

- 分别搜索连接器 `Meego 飞书项目`、`Meegle`，均返回 `{"plugins":[]}`；当前没有找到可调用的 Meego 专用连接器。这不证明该产品不存在 OpenAPI。

### 2.2 已安装的飞书 CLI

`command -v lark-cli` 找到 `/Users/bytedance/.npm-global/bin/lark-cli`，版本提示为 1.0.21。`lark-cli --help` 的命令表未提供 Meego／飞书项目工作项资源。

实际执行：

```sh
lark-cli auth status
```

退出码为 1，原始错误为：

```json
{
  "ok": false,
  "error": {
    "type": "config",
    "message": "keychain Get failed: keychain not initialized",
    "hint": "The keychain master key may have been cleaned up or deleted. If running inside a sandbox or CI environment, please ensure the process has the necessary permissions to access the keychain, you can try running this outside the sandbox. Otherwise, please reconfigure the CLI by running lark-cli config init."
  }
}
```

没有执行 `config init`、清理或覆盖旧凭证。普通飞书文档 OAuth 凭证也不能未经确认就当作 Meego 用户 token。

### 2.3 Meegle 专用 CLI、环境与凭证

- `command -v meegle meegle-cli meego-cli` 退出码为 1，未找到对应命令。
- `~/.meegle/` 只有旧的 `cache/tools.json` 工具 schema 缓存，没有 `config.json`、`credentials.enc` 或 `credentials-*.enc`。
- 未发现 MEEGO／MEEGLE 环境变量。缓存中的工具描述不代表工具当前可调用，也不是工单数据。
- 只读查询 macOS Keychain 的 `meegle-cli` 服务，退出码为 44：

```text
security: SecKeychainSearchCreateFromAttributes: One or more parameters passed to a function were not valid.
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
```

该结果只说明当前执行环境无法取得凭证，不足以判断整台电脑或目标账号从未登录。

### 2.4 既有登录 cookie：仅在磁盘读取，未启动浏览器

以 SQLite 只读模式检查：

```text
~/Library/Application Support/Google/Chrome/Default/Cookies
```

目标域存在加密的 `passport_app_access_token`，明文值为空。元数据到期时间为 **2026-11-18 02:26:45 +08:00**；未过期的元数据不保证服务端会接受该凭证。

尝试从系统 Keychain 读取 `Chrome Safe Storage` 解密密钥，退出码为 44，错误同上。因无法取得密钥，没有解密或使用该 cookie，没有输出任何 cookie、token、密钥或 secret 的值；没有写入或修改 Cookie 数据库。

### 2.5 直接 HTTP 连接检查

用 Python `urllib.request` 向用户提供的 URL 发起普通 HTTP GET，未使用浏览器、未执行网页 JavaScript、未携带登录 cookie，超时设置为 20 秒：

```text
https://meego.larkoffice.com/telematics/issue/detail/7246040529
```

实际结果：

```text
URLError: <urlopen error [Errno 8] nodename nor servname provided, or not known>
```

请求在当前命令执行环境的域名解析阶段失败，没有收到 Meego HTTP 响应。因此不能据此声称空间无权限、返回空列表、工单不存在，或账号没有经手记录；也没有 Meego 业务错误码可报告。

## 3. 尚未执行的接口与字段核验方案

以下来自官方 SDK／CLI 文档，仅用于复查访问恢复后应查什么；**本轮没有成功执行这些业务接口**。

首先要将 URL 的空间简名 `telematics` 映射为真实 `project_key`，不能把简名未经核对直接当作内部 key。OpenAPI 插件路线还需要可用插件鉴权以及有该空间权限的用户身份；用户 OAuth CLI 则使用 Meegle 专用 token。这两条路线均尚未获得可用凭证。

| 顺序 | 只读接口 | 用途 |
|---|---|---|
| 1 | `GET /open_api/{project_key}/work_item/all-types` | 确认工作项类型和缺陷 type key。 |
| 2 | `POST /open_api/{project_key}/field/all`，body `{"work_item_type_key":"issue"}` | 确认 issue 类型后获取字段名称、key、类型、枚举选项。 |
| 3 | `GET /open_api/{project_key}/flow_roles/issue` | 核对经办人角色；不能用当前状态操作人代替。 |
| 4 | `POST /open_api/{project_key}/work_item/issue/query`，body `{"work_item_ids":[7246040529]}` | 核验样例详情及实际字段承载方式。 |
| 5 | `POST /open_api/{project_key}/work_item/filter` | 不限时间分页读取，逐页保存并按 id 去重，校验 `pagination.total`。 |

官方 SDK 的 filter 请求示例（只作待执行模板，非实际请求日志）：

```json
{
  "work_item_type_keys": ["issue"],
  "page_num": 1,
  "page_size": 100,
  "expand": {
    "need_user_detail": true,
    "need_workflow": true
  }
}
```

待核字段：

| 维度 | 官方字段／查询概念 | 本空间核验状态 |
|---|---|---|
| 唯一工单 | `id` | 未取得实际值；样例 URL ID 不作为列表统计结果。 |
| 创建人／创建时间 | `created_by`、`created_at` | 字段结构来自官方 SDK；实际 user_key 和时间单位未取得。 |
| 经办人 | 真实角色／人员字段；CLI 中可能为 `__经办人` | 未取得角色定义；`current_status_operator` 不自动等于经办人。 |
| 关注人 | `watchers` | 来自官方 CLI 人员说明，实际字段元数据未取得。 |
| 状态 | `work_item_status.state_key` | 关闭／修复／验证对应选项未取得；`is_archived_state` 不能直接等同已修复。 |
| 优先级 | 优先级字段及 P0／P1 的真实 option key | 未取得，不猜数字编码。 |
| 车企／项目／问题类型 | 实际 `fields` 及选项映射 | 未取得，不自行创建字段 key。 |

如果改用 Meegle CLI 的 MQL：首查保存 `session_id`、`list[0].count`、`group_id`，再按 session 分页；翻页不得重新携带 MQL，否则可能重复第一页。官方说明单页上限为 50，不能把首屏 50 条当作总数，也不能通过搜索命中数代替工作项全量。

官方依据：[Meegle CLI](https://github.com/larksuite/meegle-cli)、[CLI 查询与分页说明](https://raw.githubusercontent.com/larksuite/meegle-cli/main/skills/meegle/SKILL.md)、[MQL 基础与终止项范围](https://raw.githubusercontent.com/larksuite/meegle-cli/main/skills/meegle/references/mql-basics.md)、[人员及角色](https://raw.githubusercontent.com/larksuite/meegle-cli/main/skills/meegle/references/mql-people-roles.md)、[OpenAPI 接口源码](https://raw.githubusercontent.com/larksuite/project-oapi-sdk-golang/main/v2/service/workitem/api.go)、[请求结构](https://raw.githubusercontent.com/larksuite/project-oapi-sdk-golang/main/v2/service/workitem/builder.go)、[响应字段](https://raw.githubusercontent.com/larksuite/project-oapi-sdk-golang/main/v2/service/workitem/model.go)。

## 4. 本次可确认的结论

本轮卡在有效 Meego 身份取得与本地 HTTP 域名解析阶段，尚未到达工单分页读取和字段映射阶段。请求中的总量、个人三种角色数量、时间范围、状态、关闭率、P0／P1、车企／项目与问题类型全部未取得。未计算任何百分比，未输出估算数字。
