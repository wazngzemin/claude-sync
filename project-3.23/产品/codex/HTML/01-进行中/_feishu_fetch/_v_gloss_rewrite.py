#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rewrite V chapter: visible markers + 名词解释 glosses. Never touch v29."""
import json, re, copy
from pathlib import Path

HTML = Path("/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/豆包汽车-业务学习站-v30-工作副本.html")
REPORT = Path("/Users/bytedance/Desktop/3.23/产品/codex/HTML/01-进行中/_feishu_fetch/_v_gloss_report.json")

def cn_len(s):
    return len(re.sub(r"\s+", "", str(s or "")))

def sum_paras(arr):
    return sum(cn_len(x) for x in (arr or []))

# --- Gloss helpers: ensure parenthesis gloss on first-ish mention patterns ---
# We'll rewrite paragraphs wholesale for lessons/intro/closing; for guides/nodes prepend boxes.

GLOSS_BOX_GLOBAL = (
    "【名词解释｜开章必读】下面这些词后面整章都会反复出现，先用白话钉死："
    "ASR（语音识别）=把你说的话写成字；"
    "VAD（语音活动检测）=看你还在不在说、停了多久；"
    "Soft VAD（软判停）=短停顿先做准备、麦克风不停；"
    "Hard VAD（硬判停）=较长停顿结束本段收音；"
    "partial（过程文字）=边听边出、还能改的字；"
    "final（定稿文字）=二遍识别后本段最终采用的字；"
    "热词（hotword）=交给识别服务的人名/地点/按钮等候选；"
    "预请求（pre_query）=短停顿时提前跑无状态准备；"
    "request_id（请求编号）=同一次说话的身份证；"
    "round_id（轮次编号）=同一次说话里第几次准备或提交；"
    "音区=声音来自哪一座，不等于认出是谁；"
    "Planner（规划器；对内同职能也称 Director）=决定查什么、做什么、要不要问你；"
    "AIDV（座舱云）=车端与识别/对话云之间的座舱服务；"
    "TTS（语音合成播报）=车机把回复念出来；"
    "CER（字错误率）=错字比例；"
    "流式拒识=播报中边听边判断是不是在跟助手说话；"
    "复用=正式定稿与上一份预请求全文一样时，沿用已算好的准备；"
    "端云=车端设备与云端服务。"
)

INTRO = [
    "【本轮可见改写】这一章刚按你的反馈重写：①每课开头用「本课新增/改写要点」标出改了什么；②整章加「名词解释」白话框，英文/代码词每次都带中文括注；③Soft VAD（软判停）/Hard VAD（硬判停）数值冲突处继续标【待核】。打开任意一课，第一段就能看见改动。",
    GLOSS_BOX_GLOBAL,
    "用户说「带我去昨天那家游泳馆」，停了一下，又补充「附近的餐厅」。最终要去的是餐厅；游泳馆只是找餐厅的位置参照。如果前半句一出现就导航，速度再快也是办错事；如果整句说完才做任何准备，用户又会觉得慢。语音这一章要同时做到三件事：听完整、用停顿提前准备、按最终意思交出正式请求。",
    "几件事在同一段声音里并行。车端先确认能不能用语音，再采集原声与扬声器参考音、定音区；云端在识别建联时注入热词（hotword，专有名候选）；一遍 ASR（语音识别，把声音写成字）边听边出 partial（过程文字，还能改）；VAD（语音活动检测，看停了多久）盯停顿——Soft VAD（软判停，短停顿先准备）先发预请求（pre_query），Hard VAD（硬判停，较长停顿收尾）才结束本段收音。屏幕上闪过的「去昨天那家游泳馆」只是到这一刻听到的内容，后面补上餐厅，整句意思会变。",
    "音区说明声音从哪一座来，不等于已经认出是谁，更不等于已经打开这个人的私人记忆；记忆怎么授权、怎么召回，后面身份与记忆章再讲。自进化、长期反思也不在本轮必经路径上。语音章交出去的是：final（定稿文字）、来源音区、request_id（请求编号），以及仍适用的预准备。该不该由豆包接、端云（车端与云端）信谁、查昨天地址、要不要导航——交给入口和 Planner（规划器；对内同职能也称 Director）。",
    "四课按图顺序串：先能用并留音区，再讲过程字与定稿，再讲 Soft VAD（软判停）准备与 Hard VAD（硬判停）收尾，最后讲交出去什么。每一课都用同一句游泳馆补餐厅；机制以 OnePager（一页纸总览）与车内语音 PRD（产品需求文档）为准。Soft VAD（软判停）≈300 ms / Hard VAD（硬判停）≈600 ms 与旧稿 Soft/Hard/语义 500/1000 冲突处标【待核】。",
]

LESSONS = [
  {
    "id": "V-L1",
    "title": "先让系统收到可用的声音，并保留谁在说话",
    "sourceIds": [],
    "paragraphs": [
      "【本课新增/改写要点】①开头加名词解释框，把麦克风权限、AEC（回声消除）、音区、热词（hotword）、request_id（请求编号）讲成人话；②把「能用」和「听清」拆成两条验收；③强调音区≠身份记忆，失败停在入口不能记成 Planner（规划器）听不懂。",
      "【名词解释｜本课】麦克风权限=系统允不允许录音；互斥=电话/手机助手/OTA/CarPlay 等占着麦或规则禁止进语音；AEC（回声消除）=用扬声器参考音，把车机自己播的声音从麦克风里减掉；音区=声音来自主驾/副驾/后排哪一座；热词（hotword）=人名、地点、按钮等专有名候选，帮 ASR（语音识别）少写错字；request_id（请求编号）=同一次说话的身份证，后面过程字、预请求、正式提交都要对上它；AIDV（座舱云）=车端与识别云之间的座舱服务。",
      "场景：用户还没开口，车端先回答另一个问题——现在允不允许用语音。麦克风没授权，ASR（语音识别）服务就没有有效音频；界面要说清原因，并给「去设置」入口。授权回来后，还要验证语音能否重新初始化。蓝牙电话、手机助手、OTA、CarPlay 等互斥场景各有提示或静默规则——上汽 DNA 电话场景里，喊唤醒词可以提示不可用，但不应继续进问答。用户感知是「喊了没反应」；系统决定是「这一轮根本不进识别」。这类失败停在输入入口，不能记成 Planner（规划器；对内同职能也称 Director）听不懂。",
      "机制：入口放行后，麦克风采到的从不是纯净人声。空调、轮胎、风雨，后排聊天，再加上扬声器里正在播的导航或音乐，一起涌进来。声学前端先降噪；AEC（回声消除）再用扬声器参考音，把车机自己发出的声音从麦克风里减掉。否则豆包正在说「打开车窗」，麦克风又把这句话认回来，就可能把自己的播报当成用户新指令。处理后越安静不等于越好——「昨天那家」被削掉，后面目的地一定错。手机外放等电子设备抑制有需求也有支持缺口，不能因为写了「回声消除」就承诺一切外源都能隔离。",
      "例子：主驾说「打开副驾座椅加热」。来源音区是主驾，控制对象是副驾：前者管交互归属和上下文，后者来自句子含义。两字段混成一个，车控可能打到主驾，机器人转向、上屏和多轮继承也会错。靠背放得很低时仍应归属原座位，不能因为声源靠近后排就换成后排。音区也不是身份：知道副驾有人，不等于知道是谁，更不等于已经获得读私人记忆的授权——记忆链路归后面章节；本章只把「从哪一座说的」留清楚。",
      "热词（hotword）机制：听专有名时，要把本车当前相关的词交给 ASR（语音识别）服务。OnePager（一页纸总览）把热词分成七类并给出数量量级：人名约 1000、导航地点约 500、媒体约 1000、可见即可说页面词约 500，以及车控、地区与对话语境等增强。PRD（产品需求文档）要求热词总量至少约 3000 个。人名、POI（兴趣点，如商场餐厅）、媒体、页面词、车控词由云端维护，在 ASR（语音识别）建联与上行注入才生效。",
      "边界：热词（hotword）提高「虹梅路」「某位联系人」写对的机会，但 OnePager（一页纸总览）写明不保证百分百生效。配置台保存成功，不等于本次识别请求真正注入了词；切页后旧按钮词要更新或注销。听准「开始导航」不等于找到了当前按钮——页面对象匹配是另一条链。热词回流冷热处理细节有权限缺口时标【待核】，不编造命中率。",
      "按语音基础体验链路 OnePager（一页纸总览），云端识别链路以约 200 ms 一帧上送音频。200 ms 只是分片节奏，不代表 200 ms 内完成回答，也不代表声音已作为正式业务请求提交。本轮要挂上说话音区与 request_id（请求编号），让后面的 partial（过程文字）、预请求（pre_query）和正式请求能对上同一次说话。",
      "验收：要同时拿得出原始音频、处理后的音频、音区结果、最终文字。才能分清是没收进来、声学损坏、音区错位，还是识别写错。用户只说「没反应」时，产品要先问：权限过了没有、互斥有没有挡住、参考音对不对——再决定找语音、找入口，还是找后面的理解团队。",
      "产品拆分：「能用」解决权限与互斥——电话占线时再聪明的模型也接不了；「听清」解决声学与音区——参考音不对，后面流式拒识再准也会被脏音频带偏。游泳馆这句话还没进入理解层之前，这两层已经能单独验收。车外唤醒抑制、电子设备音频抑制若供应商暂不支持，标成缺口，不讲成已经全量具备。",
      "接到下一课前先钉死边界：本课交出的是可用音频、音区与 request_id（请求编号），以及已注入的热词（hotword）候选；还不交出 partial（过程文字）定稿，更不交出导航。下一课才讲：一遍 ASR（语音识别）如何边听边出过程字，二遍如何用同一段录音出 final（定稿文字）。",
    ],
  },
  {
    "id": "V-L2",
    "title": "识别先给过程文字，再用整段声音确定最终文字",
    "sourceIds": [],
    "paragraphs": [
      "【本课新增/改写要点】①把 partial（过程文字）与 final（定稿文字）画成「快 vs 对」两条账；②流式拒识四前提用白话重写；③离线 ASR（语音识别）有网偶发切入标成独立断点【待核】。",
      "【名词解释｜本课】partial（过程文字）=边听边出、屏幕可闪、后面还能改的字；final（定稿文字）=本段收音结束后，二遍 ASR（语音识别）用同一段录音校正后的最终字；流式拒识=TTS（语音合成播报）正在念的时候，边听边判断你是不是在跟助手说话，够条件就打断播报；CER（字错误率）=错字比例，材料口径约 7%～10%；AIDV（座舱云）=车端把音频交给 Speech（语音识别服务）的中转；TTS（语音合成播报）=车机把回复念出来。",
      "场景：当前汽车文本链路里，车端把音频经 AIDV（座舱云）交给 Speech（语音识别服务）。识别一边收音频，一边返回文字；AIDV（座舱云）再送回车端。这种尚可修订的结果叫 partial（过程文字）。已经激活的交互可以按规则上屏；免唤醒尚未激活时，并不把全部车内聊天流式打到屏幕上。用户继续说，文字会增长，也可能把先前听错的词改掉——先写成「虹煤路」，后面改成「虹梅路」，是正常现象。",
      "机制：partial（过程文字）有真实用途，但每条用途都有门槛。免唤醒可以用它判断要不要提前把音频送云端；播报中满足条件时，可以据此做流式拒识并打断 TTS（语音合成播报）；Soft VAD（软判停）出现后，可以拿当前文字发预请求（pre_query）。不能因为 partial（过程文字）里已经有完整地点名，就当成已经确认的导航目的地。当前字看起来像一句话，用户仍可能追加「附近的餐厅」、否定词或另一个动作。用户感知是字幕在跳、系统好像听懂了；系统决定是：允许用未定稿做准备，绝不授予执行。",
      "流式拒识边界（OnePager 一页纸总览写得很窄）：多人场景、ASR（语音识别）大于两个字、ASR（语音识别）前缀不含「豆包」、且 TTS（语音合成播报）正在播放——四条同时满足才启动流式拒识模型。车内单人且 ASR（语音识别）大于两字时，常见策略是直接打断当前 TTS（语音合成播报）（SingleInterrupt，单人直接打断），不做拒识判断。细节状态机归插话章；语音章只留边界：过程字可以提前停播，结论仍看 final（定稿文字）与最终拒识。",
      "例子：本段音频收尾后，二遍 ASR（语音识别）用同一段已采集的录音再校正，给出 final（定稿文字）。用户不用把话重说一遍。一遍追求低延迟，方言与强口音较弱；二遍侧重高精度，覆盖粤语、上海话、闽南语及部分强口音，整体 CER（字错误率）材料口径约 7%～10%。正式请求必须用最终采用的文字，不能沿用屏幕上曾经闪过的旧结果。",
      "边界：final（定稿文字）只表示这次识别定稿：不保证每个字正确，不表示已经解析「昨天那家」地址，不是 Planner（规划器；对内同职能也称 Director）的答案，更不是导航已启动。车内语音 PRD（产品需求文档）还给出延迟目标量级：首字延迟、尾字延迟有明确上限（材料常见首字 ≤200 ms、尾字 ≤500 ms 的目标口径）；这是目标不是实测通过证明——实测报告若未达标，验收时要分开写目标与现状。",
      "端云（车端与云端）可能各自产字。车内语音 PRD（产品需求文档）允许先显示离线 partial（过程文字），再用在线 final（定稿文字）刷新；无网时用离线结果。上屏策略和执行采信要分开：看见离线字先上屏，不能据此判断本地模型已经获得车辆执行权。若 final（定稿文字）之后用户又说「是梅花的梅」，那是新的有效输入，结合前一句纠正目的地；原先识别记录仍保留，方便解释为什么第一次搜错——这是业务纠正，不是把历史识别记录偷偷改掉。",
      "离线 ASR（语音识别）有独立验收账。材料里思必驰离线句准曾测到明显低于量产目标（导航场景更差），出厂检查点也曾 Fail（未通过）；有网时偶发切到离线 ASR（语音识别），会让后续推理整段错。产品上要把「有网却走了离线」单独当断点，不要和「识别模型不聪明」混成一件事。具体供应商与版本以项目 FeatureList（功能清单）为准，冲突处标【待核】。",
      "没有有效音频、识别超时、最终文字为空时，不能把残缺 partial（过程文字）补成正式指令。「关……」既可能关窗也可能关音乐，信息不够就不能动作。该轮停在语音失败出口，或按项目策略提示重试，并留下失败原因。若仍塞进业务链路执行，后面 Planner（规划器）再精细也补不回输入本身的缺失。",
      "串起来想：partial（过程文字）服务「快」和「可准备」，final（定稿文字）服务「对」和「可交办」。产品验收不要只问识别率，要问三笔账——原声清不清、处理后关键字还在不在、定稿有没有把补话收进来。字幕对了却办错事，多半是拿过程字执行了；字幕错了模型也错，先沿同一段音频找最早变错点，再决定是热词（hotword）、声学还是识别模型。",
      "接到下一课：过程字与定稿都清楚之后，才谈得上 Soft VAD（软判停）用哪一份文字去准备、Hard VAD（硬判停）何时收尾。下一课把停顿时间线、预请求（pre_query）三不、复用条件钉死。",
    ],
  },
  {
    "id": "V-L3",
    "title": "短停顿提前准备，较长停顿收尾；补话期间仍继续听",
    "sourceIds": [],
    "paragraphs": [
      "【本课新增/改写要点】①用一条时间线把 Soft VAD（软判停）≈300 ms 与 Hard VAD（硬判停）≈600 ms「同起点」讲死，反对加成 900；②预请求（pre_query）「三不」+不抢跑 FC（功能调用）/Planner（规划器）/DM（对话管理）用白话重写；③复用三条件强调「差一字就重算」。",
      "【名词解释｜本课】VAD（语音活动检测）=看你有没有在说话、停了多久；Soft VAD（软判停）=短停顿触发预请求（pre_query），麦克风不停、ASR（语音识别）不结束；Hard VAD（硬判停）=较长停顿结束本段收音，等二遍出 final（定稿文字）；预请求（pre_query）=只跑无状态前置准备，不进正式历史、不播答案、不下导航/车控；request_id（请求编号）=同一次说话；round_id（轮次编号）=同一次说话里第几次准备；Context（上下文）=组织本轮背景，不创造缺失事实；FC（功能调用）=真正调工具；DM（对话管理）=管对话轮次与状态；复用=正式文字与上一份预请求全文相同且同 request_id（请求编号）时，沿用已算好的准备。",
      "场景：VAD（语音活动检测）回答的是——用户这一段话是否说完。声音里出现停顿时，先到较短门槛，再到较长门槛。OnePager（一页纸总览）口径：Soft VAD（软判停）约 300 ms 触发预请求（pre_query），Hard VAD（硬判停）约 600 ms 结束本段音频；二者从同一次停顿的零点起算，不是先等 300 再额外等 600、总共 900。这是该链路的配置口径；具体车型还要结合语义判停（语义 VAD，看意思说全了没有）版本。旧稿 Soft/Hard/语义约 500/1000 ms 与语义延长属演进资料，与 OnePager（一页纸总览）300/600 并列【待核】，不能拼成全车型唯一现行值。",
      "机制：短停顿先触发预请求（pre_query）。用户刚说完「去昨天那家游泳馆」，车端拿当前文字向 AIDV（座舱云）提交准备，同时继续收音。OnePager（一页纸总览）支持预跑拒识和 Context（上下文）：拒识问这句像不像在向助手说话；Context（上下文）组织本轮背景，但不创造缺失事实——「昨天游过泳」不能改写成「昨天去过某某馆」，缺地址仍缺地址。抢跑范围只做前置无状态任务，材料写明不抢跑到 FC（功能调用）/Planner（规划器；对内同职能也称 Director）/DM（对话管理）。",
      "预请求（pre_query）有三条硬边界（三不）：不进正式对话历史、不播正式答案、不下发导航或车控。减少等待的办法，是把前置计算挪到用户还在说话的期间，不是抢先把车开走。技术方案用专用预请求入口（材料常见 POST /aidv/v1/pre_query），和正式文字对话入口分开，避免多次停顿、多次准备在正式对话里刷出一串独立轮次，或让界面在聆听/思考态之间乱跳。推荐路径是端侧直连 AIDV（座舱云）、预请求不过豆包文本主链；若走「extra 透传」一类方案，材料曾指出第二次请求可能打断第一次、端侧思考态小云朵反复横跳——排期口径以现行技术方案为准，冲突处标【待核】。",
      "例子：同一句输入用 request_id（请求编号）关联；round_id（轮次编号）表示这段语音内部第几次预请求或正式提交。记成 A/1、A/2、A/3：共同的 A 认出同一次输入，递增轮次找到前一份准备。它们不是 Planner（规划器）调了几轮工具；chat_id（会话编号）只关联对话背景，同会话不等于同一次输入。缓存侧材料给出 key（键）形态量级（pre_query 按 module/channel/chat_id/request_id/round_id 区分，短时有效），用途是让云端找到「哪一次说话的哪一份准备」，字段名以协议为准。",
      "用户第一次只停约 400 ms 又补「附近的餐厅」，还没到 Hard VAD（硬判停）收尾。识别更新整句后，满足规则可以再发预请求（pre_query）——发的是更新后的整句，不是把「附近的餐厅」孤零零丢给下游。较长停顿达到门槛后，本段音频收尾，再等二遍出 final（定稿文字）。语义判停处理「我想去……」这类声停意未完；是否延长、延长多久，按车型版本确认，不在图上画成 Hard VAD（硬判停）之后再统一多等固定一秒。",
      "最终文字到来后，支持复用的模块核对：是否同一 request_id（请求编号）、正式文字与上一轮预请求（pre_query）是否完全相同、结果是否可用。A/2 已按「游泳馆附近的餐厅」准备且 A/3 文字相同，才复用；前一份还只有「去游泳馆」，或二遍改了地名，就重算受影响的前置处理。不在旧结果里找「意思差不多」的句子。差一个字就正式重算——「播放音月」与「播放音乐」不能复用。",
      "验收双边看：该复用时少等了多少；不该复用时有没有正确重算。材料预期收益量级约少 200 ms 文本链路等待，但这是目标收益，不是每次都拿到的保证。高复用率不能代替正确率——补话触发重算，往往是接住了完整意思。只盯复用率会奖励「忽略补话」的错误实现。",
      "补话是这条链路的试金石。半句游泳馆时准备可以跑，车不能动；补上餐厅后准备换新，仍不能动；Hard VAD（硬判停）收尾、二遍出 final（定稿文字）、全文一致才谈得上复用。把 Soft VAD（软判停）讲成「可以执行」，或把 Hard VAD（硬判停）讲成「已经 final（定稿文字）」，后面所有排障都会歪。旧多级 VAD（语音活动检测）与 OnePager（一页纸总览）数值冲突处保留【待核】，按项目版本核对，不在宣讲里擅自统一。",
      "「说完很久没反应」至少分四段时间戳：是否到达 Hard VAD（硬判停）；Hard VAD（硬判停）之后二遍 final（定稿文字）是否返回；final（定稿文字）是否已交入口；入口之后工具是否动作。语音章至少要能独立证伪前两段；后两段交给入口与 Planner（规划器），但不要把前两段的锅先甩给规划器。",
      "接到下一课：Soft VAD（软判停）/Hard VAD（硬判停）、预请求（pre_query）三不、复用条件都清楚之后，正式提交要带齐 final（定稿文字）、音区、编号与仍适用的预准备。下一课讲交接清单，以及失败出口为什么不能偷用 partial（过程文字）。",
    ],
  },
  {
    "id": "V-L4",
    "title": "把完整输入交给入口，后续再决定接话、采信和执行",
    "sourceIds": [],
    "paragraphs": [
      "【本课新增/改写要点】①交接清单四项用白话写死（定稿/音区/编号/预准备）；②五组「不等于」做成可背的评审话术；③明确语音章争定义权、不争执行归属。",
      "【名词解释｜本课】正式提交=把 final（定稿文字）+音区+request_id（请求编号）/round_id（轮次编号）+仍适用预准备交给入口；最终拒识=正式链上再判断这是不是对助手说的话（预请求里跑过的拒识不能直接当最终结论）；端云采信=车端结果与云端结果听谁的；可见即可说=把「第二个」这类话绑到当前页面上的可点对象；Planner（规划器；对内同职能也称 Director）=决定查记忆、找地点还是向用户澄清。",
      "场景：回到最初那句。系统在「去昨天那家游泳馆」后做过准备，又听见「附近的餐厅」。交出去的目标是找那家游泳馆附近的餐厅，并带上来源音区和输入编号，以及仍适用的预准备。入口再确认这是不是对豆包的有效请求、端云（车端与云端）采信信谁；输入管理安排正式推理；Context（上下文）复用仍适用的预准备并补齐背景；Planner（规划器；对内同职能也称 Director）再决定查记忆、找地点还是向用户澄清。缺少泳馆地址时，不能仅凭识别完成就开始附近搜索。",
      "机制：正式请求进主链路后，才做最终拒识、多音区合并、组装正式 Context（上下文），再交给 Planner（规划器）。预请求（pre_query）阶段跑过的拒识/Context（上下文），只有在复用三条件满足时才能沿用；否则正式重算。把「预请求已经跑过拒识」说成「最终拒识已通过」，会把入口章的定义权提前掏空。",
      "例子：若当前是可见即可说页面，正式输入也可能先匹配页面上的可操作对象。用户说「第二个」，页面注册内容帮助确定条目；未命中再走通用对话。热词（hotword）负责写对字，页面匹配负责把字绑到对象——输出不同，不能把热词命中当成按钮已点击。免唤醒的提前召回可以发生在 partial（过程文字）阶段；最终拒识、采信和真正执行仍看后续条件。打断后怎么恢复，归插话章，本章只交「过程字可提前停播，结论看 final（定稿文字）」这一句边界。",
      "边界：「音频已上传」「正式请求已提交」「车辆已执行」必须能分开举证。用户往往只看到一行字幕；产品要能指出字幕背后停在授权、声学、热词（hotword）、一遍/二遍 ASR（语音识别）、VAD（语音活动检测）、预请求（pre_query）复用，还是下游入口。自进化与长期反思不插入本轮必经路径；音区到身份记忆的授权链也不在本章展开。",
      "验收时先还原实际说话和停顿，再对齐每一次 partial（过程文字）、预请求（pre_query）、final（定稿文字）与正式提交。正常结果应完整保留「附近的餐厅」，预请求没有造成误导航，正式请求只进入一次有效业务办理。还要覆盖：停顿后不再补话、补了否定词、前后地名不同、最终识别为空。它们分别验证等待是否合理、复用是否安全、失败是否停在正确位置——不要用一个总识别率把不同断点糊成一件事。",
      "交接验收清单：①定稿文字里有没有「附近的餐厅」；②音区是不是主驾；③request_id（请求编号）/round_id（轮次编号）能否对上预准备；④有没有把预请求（pre_query）结果误当成已执行。清单对不上，后面入口再好也只能猜。记忆授权、自进化不在这张清单里——不是不重要，是不在本步发生。",
      "无有效声音、识别超时或二遍空结果，沿失败线留下原因，禁止用残缺 partial（过程文字）默认控车。半截「关……」既可能关窗也可能关音乐；失败出口上的任何文字——包括曾经正确闪过的游泳馆——都不再具有执行资格。失败与主链成功是两种结局，不要用 Soft VAD（软判停）/复用/交接的成功话术解释失败现场。",
      "易混点再收一次（下次评审可直接说）：字幕出现 ≠ 正式提交；Soft VAD（软判停）准备 ≠ 车已执行；音区 ≠ 身份记忆；热词（hotword）命中 ≠ 按钮已点击；复用成功 ≠ 业务办完。把这五组不等于讲清，语音章才交得出可验收的输入，而不是把定义权提前送给入口或 Planner（规划器）。",
      "下一章入口才决定该不该由豆包接、本地与云端谁生效。语音章争的是输入层的定义权：何时听完整、何时可准备、何时可交办；不争执行层的归属。带着交接清单进入口章，评审时才能用同一套证据说话。",
    ],
  },
]

CLOSING = [
    "【本轮可见改写｜章末】下面三段是评审可直接说的定义权/归属话术；名词一律带括注。",
    "语音章要争的定义权只有一层：什么叫「听完整、可准备、可交办」。听完整= Soft VAD（软判停）/Hard VAD（硬判停）同起点判停 + 二遍 ASR（语音识别）出 final（定稿文字）把补话收进来；可准备= Soft VAD（软判停）触发的预请求（pre_query）只跑无状态前置且守住三不；可交办= 正式提交带齐 final（定稿文字）、音区、request_id（请求编号）/round_id（轮次编号）与仍适用的预准备。评审时用游泳馆补餐厅主线举证：半句不导航、补话后目标变对、正式请求只进一次有效办理。",
    "明确不争、交给后面章节的归属：最终拒识与端云（车端与云端）采信、可见即可说页面匹配、打断恢复状态机、Planner（规划器；对内同职能也称 Director）/工具执行、记忆授权与自进化。预请求（pre_query）跑过拒识 ≠ 最终拒识通过；音区有结果 ≠ 私人记忆已打开。把这些边界写进评审纪要，避免语音优化需求被误派到规划或记忆团队。",
    "可验收证据建议固定四件：①同一次停顿的 Soft VAD（软判停）≈300 ms / Hard VAD（硬判停）≈600 ms 时间戳（与旧 500/1000【待核】按项目版本核对）；②同一 request_id（请求编号）下各 round_id（轮次编号）的预请求（pre_query）文字与 final（定稿文字）全文对照（差一字则重算）；③原声/处理后/partial（过程文字）/final（定稿文字）四层对齐找最早变错点；④失败出口原因码，禁止残缺 partial（过程文字）控车。有这四件，下次评审才能把「定义权/归属」换成具体动作。",
]

# Guide section openers: prepend visible marker + gloss to each of 10 sections
GUIDE_PREPEND = {
  0: [
    "【本轮可见改写｜图下第1节】本节补了：入口放行白话、互斥举例、request_id（请求编号）从这里挂上。",
    "【名词解释】互斥=电话/手机助手/OTA/CarPlay 等占麦或规则禁止进语音；request_id（请求编号）=同一次说话的身份证。",
  ],
  1: [
    "【本轮可见改写｜图下第2节】本节补了：AEC（回声消除）白话、越安静≠越好、音区≠身份。",
    "【名词解释】AEC（回声消除）=用扬声器参考音减掉车机自己的声；音区=哪一座在说，不是认出是谁。",
  ],
  2: [
    "【本轮可见改写｜图下第3节】本节补了：热词（hotword）七类数量、注入≠命中、热词≠按钮已点。",
    "【名词解释】热词（hotword）=专有名候选；POI（兴趣点）=商场、餐厅等地点名；ASR（语音识别）=把声音写成字。",
  ],
  3: [
    "【本轮可见改写｜图下第4节】本节补了：partial（过程文字）四不等于、流式拒识边界、ASR∥VAD 并行四拍。",
    "【名词解释】partial（过程文字）=还能改的字；VAD（语音活动检测）=看停顿；TTS（语音合成播报）=车机念回复。",
  ],
  4: [
    "【本轮可见改写｜图下第5节】本节补了：Soft VAD（软判停）≈300 ms 同起点、预请求（pre_query）三不、round_id（轮次编号）对账。",
    "【名词解释】Soft VAD（软判停）=短停顿先准备；预请求（pre_query）=无状态前置；round_id（轮次编号）=第几次准备。",
  ],
  5: [
    "【本轮可见改写｜图下第6节】本节补了：Hard VAD（硬判停）≈600 ms 收尾≠定稿、语义判停【待核】、四段时延拆账。",
    "【名词解释】Hard VAD（硬判停）=较长停顿结束本段收音；语义判停=声停但意思可能没说完时要不要再等。",
  ],
  6: [
    "【本轮可见改写｜图下第7节】本节补了：二遍 ASR（语音识别）出 final（定稿文字）、CER（字错误率）、离线/在线分账。",
    "【名词解释】final（定稿文字）=本段最终采用的字；CER（字错误率）=错字比例；上屏≠采信≠已获车控权。",
  ],
  7: [
    "【本轮可见改写｜图下第8节】本节补了：复用三条件白话、差一字重算、高复用率≠好体验。",
    "【名词解释】复用=同 request_id（请求编号）且全文相同且模块可复用时，沿用上一份预请求（pre_query）结果。",
  ],
  8: [
    "【本轮可见改写｜图下第9节】本节补了：交接四件套、Planner（规划器）在交接之后、五组不等于。",
    "【名词解释】正式提交=离开语音层；Planner（规划器；对内同职能也称 Director）=决定查什么、做什么。",
  ],
  9: [
    "【本轮可见改写｜图下第10节】本节补了：失败出口禁止偷用 partial（过程文字）、原因码分账。",
    "【名词解释】失败出口=无音频/超时/空 final（定稿文字）时停在语音层，不拿半截字控车。",
  ],
}

# Node extras: insert gloss-aware paragraph near front (after first) if not already present
NODE_GLOSS = {
  "V13": "【名词解释】本节点=语音入口放行。互斥（电话/助手/OTA/CarPlay）挡住时，后面 ASR（语音识别）/VAD（语音活动检测）都不应被讲成已经发生。",
  "V1": "【名词解释】request_id（请求编号）从这里挂上；约 200 ms 一帧是分片节奏，不是答完时限，更不是正式交办。",
  "V14": "【名词解释】AEC（回声消除）=减掉扬声器自己的声；整理后的声音同时送给一遍 ASR（语音识别）与 VAD（语音活动检测）。越安静≠越好。",
  "V15": "【名词解释】音区=哪一座在说；操控对象=句子要控哪一座。音区≠身份≠私人记忆已打开。",
  "V16": "【名词解释】热词（hotword）=专有名候选，在 ASR（语音识别）建联与上行注入才生效。配置台有词≠当次注入；热词命中≠按钮已点击。",
  "V17": "【名词解释】离线/在线可能各自产字；可先上屏离线 partial（过程文字），再用在线 final（定稿文字）刷新。上屏≠采信≠车控权。有网切离线【待核】。",
  "V2": "【名词解释】一遍 ASR（语音识别）边听边出 partial（过程文字），与 VAD（语音活动检测）并行，不是先识别完再计时。",
  "V3": "【名词解释】partial（过程文字）可供上屏、流式拒识、Soft VAD（软判停）预请求（pre_query），但不授予执行。过程字≠定稿≠正式请求≠车已执行。",
  "V18": "【名词解释】失败出口：无音频/超时/空 final（定稿文字）时留下原因，禁止残缺 partial（过程文字）控车。",
  "V4": "【名词解释】VAD（语音活动检测）看人声与停顿时长，不必等 ASR（语音识别）写完整句。与 ASR（语音识别）并行：左轨出字，右轨计停顿。",
  "V5": "【名词解释】Soft VAD（软判停）≈300 ms（OnePager 一页纸总览）从停顿零点起算，可多次触发，不结束 ASR（语音识别）。与 Hard VAD（硬判停）≈600 ms 同起点，不是 300+600。旧 500/1000【待核】。",
  "V6": "【名词解释】预请求（pre_query）三不：不进正式历史、不播答案、不下工具；且不抢跑 FC（功能调用）/Planner（规划器）/DM（对话管理）。用 request_id（请求编号）+round_id（轮次编号）对账。",
  "V7": "【名词解释】Hard VAD（硬判停）≈600 ms 收尾本段音频，不是已出 final（定稿文字），不是已执行。旧 500+语义1000【待核】。",
  "V8": "【名词解释】二遍 ASR（语音识别）用同一段录音出 final（定稿文字）。正式请求必须用 final（定稿文字）。final≠已解析地址≠已导航。",
  "V9": "【名词解释】复用三条件：同 request_id（请求编号）、与上一份预请求（pre_query）全文相同、模块可复用。差一字重算；大意接近不算。",
  "V10": "【名词解释】语义判停=声停意未完时要不要再等。延长多久跟车型；与 Soft/Hard 300/600 冲突处【待核】。",
  "V11": "【名词解释】不匹配=按 final（定稿文字）重算准备，不是回滚已发车控（预请求本就不能发车控）。",
  "V12": "【名词解释】交出 final（定稿文字）、音区、request_id（请求编号）/round_id（轮次编号）、仍适用预准备。最终拒识/采信/Planner（规划器）在交接之后。",
}


def thicken_guides(base_guide):
    sections = []
    for i, sec in enumerate(base_guide.get("sections") or []):
        existing = list(sec.get("paragraphs") or [])
        prepend = GUIDE_PREPEND.get(i) or []
        # avoid double-apply
        if existing and existing[0].startswith("【本轮可见改写"):
            new_paras = existing
        else:
            new_paras = prepend + existing
        # also gloss-touch a few bare terms in first original para if present
        sections.append({**sec, "paragraphs": new_paras})
    flat = []
    for s in sections:
        flat.extend(s.get("paragraphs") or [])
    return {**base_guide, "sections": sections, "paragraphs": flat}


def thicken_nodes(nodes):
    out = []
    for n in nodes:
        para = NODE_GLOSS.get(n["id"])
        paragraphs = list(n.get("paragraphs") or [])
        if para and not any(p.startswith("【名词解释】") for p in paragraphs):
            # insert after first paragraph
            if paragraphs:
                paragraphs.insert(1, para)
            else:
                paragraphs.append(para)
        out.append({**n, "paragraphs": paragraphs, "detail": "\n\n".join(paragraphs)})
    return out


def main():
    html = HTML.read_text(encoding="utf-8")
    scripts = list(re.finditer(r"<script([^>]*)>([\s\S]*?)</script>", html))
    if len(scripts) != 2:
        raise SystemExit(f"expected 2 scripts, got {len(scripts)}")
    data_body = scripts[0].group(2)
    # Parse DATA via json: strip 'const DATA=' 
    m = re.match(r"\s*const DATA=(\{[\s\S]*\})\s*;?\s*$", data_body)
    if not m:
        raise SystemExit("DATA parse failed")
    DATA = json.loads(m.group(1))

    page = next(p for p in DATA["pages"] if p["id"] == "V")
    mod = next(m for m in DATA["base"]["modules"] if m["id"] == "V")

    before = {
        "intro": sum_paras(page["teaching"]["intro"]),
        "lessons": sum_paras([p for L in page["teaching"]["lessons"] for p in L.get("paragraphs") or []]),
        "guides": sum_paras([p for s in page["teaching"]["guides"]["base"].get("sections") or [] for p in s.get("paragraphs") or []]),
        "closing": sum_paras(page["teaching"]["closing"]),
    }

    # Preserve sourceIds from old lessons
    old_lessons = {L["id"]: L for L in page["teaching"]["lessons"]}
    lessons = []
    for L in LESSONS:
        old = old_lessons.get(L["id"], {})
        lessons.append({
            "id": L["id"],
            "title": L["title"],
            "paragraphs": L["paragraphs"],
            "sourceIds": old.get("sourceIds") or L.get("sourceIds") or [],
        })

    teaching = {
        **page["teaching"],
        "intro": INTRO,
        "lessons": lessons,
        "closing": CLOSING,
        "guides": {
            **page["teaching"]["guides"],
            "base": thicken_guides(page["teaching"]["guides"]["base"]),
        },
    }

    sections = []
    for i, L in enumerate(lessons):
        old = (page.get("sections") or [None])[i] if i < len(page.get("sections") or []) else {}
        old = old or {}
        sections.append({
            "id": old.get("id") or L["id"],
            "title": L["title"],
            "paragraphs": list(L["paragraphs"]),
            "teachingTarget": old.get("teachingTarget") or L["title"],
            "sourceIds": L.get("sourceIds") or old.get("sourceIds") or [],
        })

    page["teaching"] = teaching
    page["sections"] = sections
    mod["nodes"] = thicken_nodes(mod["nodes"])

    # bump visible version hints in base if present
    ver = DATA["base"].get("version") or "v15"
    # keep geometric version but annotate teaching revision in title/summary lightly
    if "gloss" not in str(DATA["base"].get("title", "")):
        pass
    # Update page summary to make change visible in TOC/header if used
    if page.get("summary"):
        if "名词解释" not in page["summary"]:
            page["summary"] = "【已加名词解释与可见改写要点】" + page["summary"]
    if page.get("shortTitle") and "释义" not in page["shortTitle"]:
        page["shortTitle"] = page["shortTitle"] + "·释义加强"

    # Also bump a teaching meta if exists
    DATA["base"]["version"] = "v15-gloss"

    after = {
        "intro": sum_paras(page["teaching"]["intro"]),
        "lessons": sum_paras([p for L in page["teaching"]["lessons"] for p in L.get("paragraphs") or []]),
        "guides": sum_paras([p for s in page["teaching"]["guides"]["base"].get("sections") or [] for p in s.get("paragraphs") or []]),
        "closing": sum_paras(page["teaching"]["closing"]),
        "lessonParas": [len(L.get("paragraphs") or []) for L in page["teaching"]["lessons"]],
        "guideParas": [len(s.get("paragraphs") or []) for s in page["teaching"]["guides"]["base"]["sections"]],
        "markers": {
            "本课新增": sum(1 for L in page["teaching"]["lessons"] for p in L["paragraphs"] if "本课新增/改写要点" in p),
            "名词解释": sum(1 for L in page["teaching"]["lessons"] for p in L["paragraphs"] if "名词解释" in p)
                      + sum(1 for p in page["teaching"]["intro"] if "名词解释" in p)
                      + sum(1 for n in mod["nodes"] for p in n.get("paragraphs") or [] if p.startswith("【名词解释】"))
                      + sum(1 for s in page["teaching"]["guides"]["base"]["sections"] for p in s.get("paragraphs") or [] if "名词解释" in p),
            "本轮可见改写": sum(1 for p in page["teaching"]["intro"] if "本轮可见改写" in p)
                         + sum(1 for s in page["teaching"]["guides"]["base"]["sections"] for p in s.get("paragraphs") or [] if "本轮可见改写" in p),
        },
    }

    new_data = "const DATA=" + json.dumps(DATA, ensure_ascii=False, indent=2) + ";\n"
    # Replace first script body
    s0 = scripts[0]
    new_html = html[: s0.start()] + f"<script{s0.group(1)}>" + new_data + "</script>" + html[s0.end():]
    HTML.write_text(new_html, encoding="utf-8")

    report = {"before": before, "after": after, "file": str(HTML), "version": DATA["base"]["version"]}
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
