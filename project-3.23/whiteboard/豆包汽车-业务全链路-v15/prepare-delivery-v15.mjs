import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const v=read('verification-v15.json'),layout=read('layout-report.json');
if(v.status!=='PASS'||v.issues.length||layout.labelWarnings.length)throw Error('Validation must pass before local delivery');
// Offline conversion only. This script neither obtains credentials nor changes any Feishu document.
execFileSync('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/.bin/whiteboard-cli',[
  '-i','./业务全链路-v15.svg','--to','openapi','--format','json','-o','./native-v15.json'
],{cwd:dir,maxBuffer:32*1024*1024,timeout:60000,stdio:['ignore','pipe','pipe']});
const native=read('native-v15.json');
const types=native.nodes.reduce((a,n)=>(a[n.type]=(a[n.type]||0)+1,a),{});
const arrows=native.nodes.filter(n=>n.type==='connector'&&n.connector?.end?.arrow_style!=='none').length;
if(!types.text_shape||!types.connector||arrows<v.edges)throw Error('Native text, connectors or arrowheads missing');
const text=native.nodes.filter(n=>n.type==='text_shape').map(n=>n.text?.text||'').join('');
for(const term of ['语音','输入管理','Director','tool_feedback','任务','记忆','40'])if(!text.includes(term))throw Error('Missing native text '+term);
const source='/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包汽车-业务全链路-v15.html';
const destination='/Users/bytedance/Desktop/3.23/产品/codex/HTML/02-已交付/豆包汽车-业务全链路-v15.html';
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if(fs.existsSync(destination)){
  if(hash(source)!==hash(destination))throw Error('A different v15 delivery exists; preserve it and create another version');
}else fs.copyFileSync(source,destination,fs.constants.COPYFILE_EXCL);
const stats={html:destination,sha256:hash(destination),modules:v.modules,nodes:v.processNodes,edges:v.edges,
  toolRows:v.tools,supplementalDefinitions:v.supplementalTools,questions:v.questions,metrics:v.metrics,sources:v.sources,
  nativeNodes:native.nodes.length,types,arrowheads:arrows,feishuChanged:false,
  feishuBlocker:'lark-cli user authorization absent; run lark-cli auth login before any native write',
  browserVisualTest:v.browserVisualTest};
fs.writeFileSync(path.join(dir,'delivery-v15.json'),JSON.stringify(stats,null,2));
fs.writeFileSync(path.join(dir,'交付说明-v15.md'),`# 豆包汽车业务全链路 v15

本地 HTML：${destination}

本版为一张连通的可缩放业务流程图，包含 ${v.modules} 个业务分区、${v.processNodes} 个详细节点、${v.edges} 条有向关系；保留原图 30 个区块的对应入口。每个节点直接显示结构化要点和完整业务解释，不必点开才能看到基本机制；侧栏提供精确上下游、来源、问题和笔记。页面可按主链向前或向后阅读、只看当前分区相关连线，也可切回全部连线及总览。

## 本次内容增量

语音、ASR/VAD、免唤醒、可见即可说、端云采信、输入管理、Context、Director 多轮判断、工具准入与执行、身份与记忆、任务管理、云端与端侧触发、Advisor、视觉观察、配置生效、卡片/任务岛/PHUD、TTS/播放/打断与真实结果均接回同一张图。业务工具表有 40 行、39 个不同标识，其中 6 行带停用或弃用说明；另列 6 项专项定义，不相加冒充当前可调用工具总数。

保留 4 个贯穿案例、${v.questions} 个产品自测问题及 ${v.metrics} 项验收指标口径。指标是评审建议，历史目标和当前验收结果分开，不宣称团队已达成。

## 阅读与验证

结构与离线 DOM 测试 ${v.checks} 项通过：节点无重叠、线不穿过无关节点、线标不遮挡节点、来源引用均可解析。已生成实际 SVG 栅格预览进行阅读检查。浏览器对本次本地 file URL 访问有策略限制，因此不能把离线验证说成真实浏览器或实车验收。

## 飞书状态

现有飞书画板未改动。beautiful-feishu-whiteboard 所需的 lark-cli 用户授权缺失，原生发布暂停。请运行 lark-cli auth login 完成授权；后续写入前仍需备份原画板，写入后在线回读和检查。native-v15.json 是已转换的原生可编辑文字、形状与连线，不是已发布证明。

## 资料范围

豆包汽车关键词完整扫描 17 页，获得 322 条去重命中元数据；不是 322 篇正文全部读完。按语音、Director/Context/记忆/工具、任务/触发/感知/展示专题进一步阅读全文和核验原图。各领域重复来源不相加冒充独立篇数。宽泛查询受分页和频率限制，部分文档无权限或仅返回部分表格；具体状态见 research-coverage.json 及各领域台账。

图内 ${v.sources} 条来源记录用于追溯业务机制，不构成所有车型当前已上线清单。规划、旧版、10 月新增需求、待核协议、项目专属能力都保留状态边界。工具执行成功、真实车辆结果、用户实际听到/看到与模型输出分别验收。
`);
console.log(JSON.stringify(stats,null,2));
