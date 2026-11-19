import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import{createRequire}from'node:module';const require=createRequire(import.meta.url),{JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');const D=path.dirname(fileURLToPath(import.meta.url)),read=f=>JSON.parse(fs.readFileSync(path.join(D,f)));const old=read('baseline-data.json').pages.find(x=>x.id==='V').v34,next=read('candidate-data.json').pages.find(x=>x.id==='V').v34,ledger=read('preservation-ledger.json');
let md='# v52 独有信息去向清单\n\n以 v50 为底稿。原展开项的正文逐项保留；合并后原标题作为展开内的小标题，原 ID 保留为定位锚点。正文只移出核验插话，业务解释不作压缩。\n\n| 原所在段 | 原展开项 | v52 去向 |\n|---|---|---|\n';
for(const s of old.sections){const d=new JSDOM(s.html).window.document,n=new JSDOM(next.sections.find(x=>x.id===s.id).html).window.document;for(const item of d.querySelectorAll('details')){const target=n.getElementById(item.id),detail=target.closest('details');md+=`| ${s.title} | ${item.querySelector('summary').textContent} | ${next.sections.find(x=>x.id===s.id).title} → ${detail.querySelector('summary').textContent}（\`${detail.id}\`） |\n`;}}
md+='\n## 正文核验插话\n\n以下原句/分句逐条保存在相应段末“本段尚未确认的事项”；涉及段号的引用随新顺序更新。\n\n| 段落 | 保留的原句/分句 | 正文留下的业务边界 |\n|---|---|---|\n';for(const row of ledger.filter(x=>x.type==='caveat'))md+=`| ${next.sections.find(s=>s.id===row.section).title} | ${row.original} | ${row.replacement||'移入展开项，正文继续原讲解'} |\n`;
fs.writeFileSync(path.join(D,'information-destinations.md'),md);
const r=read('verification.json');const report=`# v52 自查记录

交付：${read('baseline-integrity.json').output}

## 按“怎么改”1～6 的改动

1. 直接读取 v50 HTML 中的 DATA 和页面脚本；未读取或复用 v51 改写正文。保留 v50 业务讲解；无新增导语框、记住三句框、30 秒版。
2. 将 ${ledger.filter(x=>x.type==='caveat').length} 处核验句/分句原意归入五段各自的“本段尚未确认的事项”。影响业务判断的限制留一句普通说明，原话可展开追溯。
3. 段落顺序改为听清写字 → 判停和准备 → 接话与端云分工 → 补地点、搜索、仲裁、回写 → 播报中插话。目录、问题表、段号、段间引用、本页跳转顺序与复述顺序同步。
4. 五段开头均补普通交接段，原结尾交接改为普通段落；第四段结尾先收住找餐厅主线，再转入插话。没有另加总结框。
5. 同一机制小节的补充说明合并，原内部标题和正文保留；历史资料、指标与方案专题归并。总展开项 ${r.beforeDetails} → ${r.afterDetails}，均含原始全图。此前提到的 88 是 v50 的补充展开项数，另有 1 个原始全图。
6. 10 张 SVG 源内容保持一致；3 类模型表原样直接展示；原始 18 节点全图仍默认折叠。V 章之外的 23 章数据完整深比较通过。v52 使用独立修订版本和按文件路径隔离的编辑快照。

## A～H

| 项 | 自查结果 | 证据或边界 |
|---|---|---|
| A | 正文人工复述抽查 8/8 | 下表记录为什么、怎么做、做错后果；这是本轮自查，尚非 Claude 浏览器验收 |
| B | 通过结构及正文顺序自查 | 四段找餐厅主线先走完，第五段才切入座椅加热插话；保留 v50 各机制的短反例用于说明错误后果 |
| C | 5/5 | 五段均有普通开头交接和结尾交接 |
| D | 通过 | 正文非空白字符 ${r.bodyCharacters}；排除折叠、流程图及段标题，包含小节标题和正文表格；四类核验词 ${r.caveats} 处 |
| E | 通过 | 展开项 ${r.afterDetails}；笼统标题 0；h3/h4 后直接接 details 为 0 |
| F | 通过 | v51-guide、v51-takeaway、v51-short 均为 0；构建底稿为 v50 |
| G | 部分完成 | JSDOM 搜索命中展开项并自动打开、47 个补充展开目标、24 章渲染、编辑/保存/重载/导出重开、快照隔离通过，脚本错误 0；真实浏览器及 375px 横向滚动未验证 |
| H | 通过 | 10 张 SVG 源内容逐项一致；渲染 SVG 仅归一化随段序生成的 DOM 唯一 ID 后比较一致；23 章数据深比较一致；v50 SHA-256 与原始记录一致 |

## A：只读正文的 8 个复述样本

| 小节 | 为什么需要 | 收到什么 → 判断什么 → 交出什么 | 做错后用户看到什么 |
|---|---|---|---|
| 收音、回声消除和音区 | 噪声、自播和其他座位声音会混进请求 | 麦克风声音 → 压噪、减自播回声、定位说话座位 → 处理后的声音和音区 | 自己跟自己说话、漏掉句首、替错人办事 |
| 热词 | 人名、地名和专用词容易写成同音字 | 联系人、地点、页面等词表 → 识别时优先考虑候选词 → 更可能写对的文字，地点指代仍交后面解决 | 配过词仍写错；若直接当成地点确认，会找错地方 |
| 过程文字 | 等整句才出字会失去提前判断的机会 | 连续声音 → 逐次补长或修正识别 → 可用于显示和准备的过程文字 | 把前半句当定稿，会先导航到游泳馆，漏掉餐厅 |
| 固定判停 | 太早结束会截话，太晚会慢 | 停顿 → 300 毫秒准备、补话清零、600 毫秒收尾 → 整段定稿机会 | 需求被拆开、没反应，或用户长时间等待 |
| 预请求及复用 | 可利用停顿省计算时间，但不能据半句执行 | 过程文字和关联请求 → 先算判断与背景，正式提交核对归属和匹配 → 可复用结果或重算 | 补了餐厅却继续用去游泳馆的旧判断；多算但没省等待 |
| 最终拒识与本地能力 | 是否在找豆包与能否在本地办是两件事 | 定稿及历史/本地文字 → 云端判接话，本地判能办、不该接、办不了 → 接住请求并分流 | 乘员聊天被插话，或把本地办不了误当成产品不响应 |
| 补地点、搜索和列表 | 昨天那家与第二个都缺少独立可用的对象 | 请求和背景 → 缺地点则查记忆或澄清，明确地点再搜索 → 工具真实列表及顺序 | 按当前位置搜错餐厅、编造地点、第二个选错 |
| 流式打断 | 一直播报会抢话，见人声就停会误打断 | 满足触发条件的过程文字及历史 → 判断召回、拒识或继续等 → 停播或继续播，并继续收音 | 乘员聊天让播报误停，或主驾说话却迟迟不停；停播不能当作座椅已打开 |

## 独有信息保留与未完成项

- v50 原有 ${r.preservedOriginalDetails} 个补充展开项的正文全部通过逐项内容包含检查；跨段引用只更新段号。
- 详细迁移表见 information-destinations.md；机器记录见 preservation-ledger.json。核验原句及合并正文共 ${r.preservedMoves} 条保留检查通过。
- 不新增业务事实、不改业务数值；新增内容仅为从既有正文归纳的交接句和阅读顺序说明。
- 浏览器自动化初次缺少匹配的 Chromium 可执行文件；改用已安装 Chrome 后以 SIGABRT 退出。备用 CUA 返回 browser access host unavailable。未通过提权绕过限制，未打开可验收的浏览器标签页。
- **未完成：真实浏览器控制台、375px 无横向滚动及视觉验收。** JSDOM 结果不替代这三项。

## 验证复现

- 构建：node build_v52.mjs
- 已完成离线交互校验：node verify_dom.mjs
- 预留浏览器校验：node verify_v52.mjs（本环境无法启动浏览器；无通过报告）
`;
fs.writeFileSync(path.join(D,'delivery-review.md'),report);console.log('wrote review and complete destinations');
