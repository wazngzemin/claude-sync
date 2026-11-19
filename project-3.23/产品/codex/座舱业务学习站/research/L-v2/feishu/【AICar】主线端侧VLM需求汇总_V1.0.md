# 【AICar】主线端侧VLM需求汇总 V1.0（飞书原文转存；更新时间 2026-11-11T16:48:13+08:00）

来源链接：https://bytedance.larkoffice.com/wiki/HqaswAMWviJEVAkdmBxcZ8eUnBb

# 修订记录

<lark-table rows="15" cols="3" header-row="true" column-widths="127,65,628">

  <lark-tr>
    <lark-td>
      修订日期
    </lark-td>
    <lark-td>
      修订人
    </lark-td>
    <lark-td>
      修订内容摘要
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-03-25
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      补充具体场景采集摄像头的需求，并提供样张
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-03-27
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      补充采集摄像头实车位置，完善缴费二维码业务流程图
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-03-30
    </lark-td>
    <lark-td>
      张兰若
    </lark-td>
    <lark-td>
      增加E68车型，环视&周视摄像头安装位置示意图&数模图
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-03-31
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      根据场景情况增加采集比例百分比，场景 × 光照 × 镜头 × 黑白样本 组合
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-04-07
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      调整室外黑天无路灯，停车场（楼）暗处 灯光亮度描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-04-07
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      增加寻车场景输出要求，
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-04-20
    </lark-td>
    <lark-td>
      陈西钺
    </lark-td>
    <lark-td>
      更新3.1「舱内持续感知」业务流程、功能列表、功能详情、任务评测指标
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-04-27
    </lark-td>
    <lark-td>
      陈西钺
    </lark-td>
    <lark-td>
      新增VLM识别任务说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-04-29
    </lark-td>
    <lark-td>
      陈西钺
    </lark-td>
    <lark-td>
      新增Always on舱内识别「模型基础能力」
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-05-06
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      完善车位号产品定义，覆盖更多case
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-05-09
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      新增充电桩识别
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2026-05-09
    </lark-td>
    <lark-td>
      陈西钺
    </lark-td>
    <lark-td>
      更新「模型基础能力」年龄标签
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025-05-09
    </lark-td>
    <lark-td>
      张兰若
    </lark-td>
    <lark-td>
      更新智驾VLM任务识别目标及数据分布、PE
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2025-09-04
    </lark-td>
    <lark-td>
      丁彬
    </lark-td>
    <lark-td>
      新增舱外alwayson的caption描述，红色标记，计划变更为v1.1，跳转链接：<mention-doc token="HqaswAMWviJEVAkdmBxcZ8eUnBb" type="wiki">【AICar】主线端侧VLM需求汇总 V1.0</mention-doc>
    </lark-td>
  </lark-tr>
</lark-table>

参考文档：

<mention-doc token="Q3CJwUH5wiUkEjkQp7TcqPfunQi" type="wiki">VLM资源采买需求说明-汽车智能驾驶座舱【产研对齐内部版本】</mention-doc>

<mention-doc token="NuunwklpIiGS91kg7lRcAprqnMd" type="wiki">端侧模型能力 & 输入输出定义</mention-doc>

# 总揽

<sheet token="BtlCsKLkMhOMkGtIiVXcZqsVnAb_T5Cn9j"/>

630 阶段目标：

1. 链路跑通
1. 量化掉点3%以内
1. 推理速度模爬升至最终性能的80%（【480P】TTFT 245 ms，TPOT 52 tokens/s）

# 整车Camera布局

<whiteboard token="D1Yawq7Oyhuwu2b6cdOcCTDCnZe" width="820" height="425"/>

- 环视摄像头示意图

<grid cols="3">

  <column width="32">
    <image token="KKD8bho4MopT13xZ6wgcPPhOnVh" width="839" height="507" align="center"/>

  </column>
  <column width="38">
    <image token="OB2rb01vcodgXWxVvrXcLO1anVc" width="1280" height="662" align="center"/>

  </column>
  <column width="29">
    <image token="OyR4b1kcBo3IZgxqfsucqPcinva" width="1216" height="826" align="center"/>

  </column>

</grid>

- 周视摄像头示意图

<grid cols="3">

  <column width="31">
    <image token="Fu0Mb31JPo5SFrxrAdPcN5WMnkd" width="1096" height="628" align="center"/>

  </column>
  <column width="39">
    <image token="V7ezbbB44ouD6Kxsmbpc1XA8nmb" width="1280" height="585" align="center"/>

  </column>
  <column width="28">
    <image token="VexKb7MXpozTEsxPtVbcZVgSnUd" width="685" height="439" align="center"/>

  </column>

</grid>

<lark-table rows="12" cols="6" column-widths="149,137,137,170,202,232">

  <lark-tr>
    <lark-td colspan="3">
      目标摄像头（以下同时采集） {align="center"}
    </lark-td>
    <lark-td colspan="3">
      样张 {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
    <lark-td>
      参考
    </lark-td>
    <lark-td>
      摄像头位置
    </lark-td>
    <lark-td>
      赛力斯改制样张
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_F
    </lark-td>
    <lark-td>
      环视前
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="PVyUb05MzoMMOxxrl20cDl5lnMd" width="739" height="507" align="center"/>
    </lark-td>
    <lark-td>
      <image token="PfOSbYpASox5AHxtc4IcqyQ4neh" width="1504" height="790" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_LH
    </lark-td>
    <lark-td>
      环视左
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="MK02bL0ehoghZNxb1P5c6Uxrnnf" width="754" height="455" align="center"/>
    </lark-td>
    <lark-td>
      <image token="FAYBbvJr1oY5EyxDBrncFXCcnHd" width="2584" height="1122" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_R
    </lark-td>
    <lark-td>
      环视后
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="Ur19bO5V1oYVSSxjkXdc9MzXnqh" width="758" height="507" align="center"/>
    </lark-td>
    <lark-td>
      <image token="PxlBbMkpwoTHtwx2bo1c4rqgnYJ" width="2242" height="1096" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_RH
    </lark-td>
    <lark-td>
      环视右
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="RmSEbWMR1oeDKYxD4mDc7NqnnQb" width="760" height="449" align="center"/>
    </lark-td>
    <lark-td>
      <image token="Z8wqbjTZqoDjZFxr6pxcNjUon0d" width="2468" height="1114" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_F3
    </lark-td>
    <lark-td>
      前120度周视
    </lark-td>
    <lark-td>
      <text color="red">3840x2160</text>
    </lark-td>
    <lark-td>
      <image token="KkAOb0LAaoFSvjxwgoscUkEpnpg" width="952" height="532" align="center"/>
    </lark-td>
    <lark-td>
      <image token="FfO6bZXOWoA1PSx3WwYcoCfYn5g" width="2024" height="1142" align="center"/>
    </lark-td>
    <lark-td>
      <image token="ADkZblV2AoHmjyxt0sLcH17Rnrg" width="1280" height="778" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_R
    </lark-td>
    <lark-td>
      后周视
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="TMgUbEbRcoSuPcx64GQcz9HWn9f" width="1462" height="988" align="center"/>
    </lark-td>
    <lark-td>
      <image token="WtC6bNkGKomXnvxFQPucTGfjnQe" width="2188" height="1124" align="center"/>
    </lark-td>
    <lark-td>
      <image token="Q4cebcsujoUlkdxl4yzczSc4nKe" width="1280" height="778" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_FLS
    </lark-td>
    <lark-td>
      左前周视
    </lark-td>
    <lark-td>
      <text color="red">3840x2160</text>
    </lark-td>
    <lark-td>
      待补充
    </lark-td>
    <lark-td>
      <image token="MSAIbaEAholAH4x8NnwcCv8qnzb" width="2200" height="1174" align="center"/>
    </lark-td>
    <lark-td>
      <image token="J3QebVuTeoxHrgxFTGOctkXQnve" width="1280" height="778" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_RLS
    </lark-td>
    <lark-td>
      左后周视
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="PLpSbLifaofDdDx5RgIc8uI3nvb" width="2530" height="1570" align="center"/>
    </lark-td>
    <lark-td>
      <image token="AxgtbRuaooNCwOx8uzNckxRenxd" width="2446" height="1110" align="center"/>
    </lark-td>
    <lark-td>
      <image token="AOi0bgJE4ozGKJx0NeKclY7Hnfh" width="1280" height="778" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_FRS
    </lark-td>
    <lark-td>
      右前周视
    </lark-td>
    <lark-td>
      <text color="red">3840x2160</text>
    </lark-td>
    <lark-td>
      待补充
    </lark-td>
    <lark-td>
      <image token="Zkd1bIyMTo9Fxyxq5QlcjAXRnFh" width="2384" height="1126" align="center"/>
    </lark-td>
    <lark-td>
      <image token="FJAdb8G0Voc23NxbvJacYl0Wn4d" width="1280" height="778" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_RRS
    </lark-td>
    <lark-td>
      右后周视
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="DMWobPBcfoiNcmxqQCHcCR1hnSh" width="2490" height="1574" align="center"/>
    </lark-td>
    <lark-td>
      <image token="VUWbbdKkio1cQYxclsbcrp26ncw" width="2380" height="1140" align="center"/>
    </lark-td>
    <lark-td>
      <image token="HuNHbLFPWoQUBZxDVXJcIPtpn0X" width="1280" height="778" align="center"/>
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="7" cols="4" column-widths="193,453,216,300">

  <lark-tr>
    <lark-td>
      光照示意
    </lark-td>
    <lark-td>
      样张
    </lark-td>
    <lark-td>
      检出要求
    </lark-td>
    <lark-td>
      待判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      室外白天
    </lark-td>
    <lark-td>
      <grid cols="4">
        <column width="24">
          <image token="SfGWbEDLoodyfkxxvSxcjq2cnQb" width="165" height="103" align="center"/>
        </column>
        <column width="24">
          <image token="WEYpb3zBjoku4Hx4o2wcdIzNn8b" width="167" height="103" align="center"/>
        </column>
        <column width="23">
          <image token="KuYhb2Q9zo86gqxG8RicirKgn7d" width="774" height="500" align="center"/>
        </column>
        <column width="28">
          <image token="NvQ7bPGRFoxARaxE1CFcwEApnVb" width="477" height="254" align="center"/>
        </column>
      </grid>
    </lark-td>
    <lark-td>
      - Pre 95%;
			- Recall 95%
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      室外黑天有路灯
    </lark-td>
    <lark-td>
      <image token="T0iIbu98loOmdJx6aNFcFij2n7p" width="932" height="496" align="center"/>
    </lark-td>
    <lark-td>
      - Pre 90%;
			- Recall 88%
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      室外黑天无路灯
      （有微弱光照，但人眼无法判断视频内容）
    </lark-td>
    <lark-td>
      <grid cols="2">
        <column width="37">
          <image token="MZn6bNcrzopzWTxbQSAcYuJznMf" width="500" height="1109" align="center"/>
        </column>
        <column width="62">
          <image token="X2b0bXQm7oZX0Fxxc7fckH2RnuT" width="500" height="667" align="center"/>
        </column>
      </grid>
    </lark-td>
    <lark-td>
      不做要求
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      停车场（楼）灯光较亮
      （包括白天的停车楼）
    </lark-td>
    <lark-td>
      <grid cols="2">
        <column width="37">
          <image token="XNlGbMom0oH9krx4Ljfce0TYnpg" width="1067" height="800" align="left"/>
        </column>
        <column width="62">
          <image token="AnJfbWrNQod4dyxSY90cwKyKnfh" width="1920" height="848" align="center"/>
        </column>
      </grid>
    </lark-td>
    <lark-td>
      - Pre 90%;
			- Recall 88%
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      停车场（楼）灯光较暗
    </lark-td>
    <lark-td>
      <grid cols="3">
        <column width="29">
          <image token="BFHPbUa6pojevYxSXj2cGamYn2n" width="1280" height="1024" align="center"/>
        </column>
        <column width="29">
          <image token="Kz25beGQmosrQsxVw2Yc3lEznTb" width="1280" height="1024"/>
        </column>
        <column width="41">
          <image token="LCULb9jIaoRu7oxhDETcRNCwnSE" width="1080" height="608"/>
        </column>
      </grid>
    </lark-td>
    <lark-td>
      - Pre 90%;
			- Recall 88%
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      停车场（楼）暗处
      （有微弱光照，但人眼无法判断视频内容）
    </lark-td>
    <lark-td>
      <grid cols="2">
        <column width="36">
          <image token="Q4FKbzXA1o0H0Cxkv7HcYFzrnTg" width="3072" height="4096" align="center"/>
        </column>
        <column width="63">
          <image token="W3mmbrgRco2OfTxZBr0ceyGznYf" width="1067" height="800" align="center"/>
        </column>
      </grid>
    </lark-td>
    <lark-td>
      不做要求
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

# PR&高感Case示例

<mention-doc token="RSAiwOOySiPNuGkVnYkc0StgnGg" type="wiki">【AI汽车】视觉场景梳理</mention-doc>

# 识别任务说明

**任务类型：**

- Always on（一直触发）
- 预制VQA（云端动态下发+规则触发）
- VQA（云端动态下发）
- 端侧闭环（规则触发）

**优先级 ：**<mention-doc token="KHsxwrJB9iv4IjkCmMecXwTon7d" type="wiki">【AICar】端侧VLM任务优先级</mention-doc>

# AlwaysOn舱内外感知任务

<whiteboard token="QhEXw1tY3hPrfwbLKpMc8A3Gnae"/>

## 舱内持续感知

### 业务流程

<quote-container>

内部端到端链路：<mention-doc token="JudNw7Za8irLLOk3qhkcvhFDnfd" type="wiki">【AI汽车】端侧视需求</mention-doc>
</quote-container>

<reference-synced source-block-id="QWKMdEvRQseVCmbA9YKctxJFnIc" source-document-id="CYE6dKYWooi56Zx9v9rc6l0Dnke">

  <whiteboard token="FZstwKQxKhCDzAbYYazcF96anke" width="376" height="179"/>

</reference-synced>

<grid cols="2">

  <column width="50">
    **儿童照看**
    <whiteboard token="LLI0wbYNghzd7yb17Wzc6T0Jnib"/>

    
  </column>
  <column width="50">
    **安全提醒**
    <whiteboard token="HH8rwTYaShlB2QbyCsic8zJunjb"/>

    
  </column>

</grid>

### 识别场景 {folded="true"}

<lark-table rows="3" cols="4" header-row="true" column-widths="106,200,560,224">

  <lark-tr>
    <lark-td>
      **场景名称**
    </lark-td>
    <lark-td>
      **场景特征组合（人数｜年龄｜座位｜目的地｜时长｜车辆状态）**
    </lark-td>
    <lark-td>
      **高频需求或痛点**
    </lark-td>
    <lark-td>
      **备注**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      儿童照看
    </lark-td>
    <lark-td>
      1-5人 | 婴儿/儿童+成人 | 主驾+后排 | 城市道路/高速/国道/学校附近/医院附近 | 中短途 | 行驶+停车
    </lark-td>
    <lark-td>
      <text color="gray">*基于视觉能力，对儿童在车内的状态与行为进行感知，提供安全提醒、舒适调节与成长记录等服务。*</text>
      1. **儿童（0-12岁）****危险提醒**
				- **不安全乘坐**：识别到儿童座椅未被正确使用，例如座椅被放置在副驾或二排中间等存在安全隐患的位置时；或儿童在座位或车内地面进行跳跃、走动、爬行、躺卧、环抱座椅靠背等不安全行为时，提示照顾者
				- **身体伸出车外**：识别到儿童将头、手、脚或躯干伸出天窗或侧窗等车外空间时，发出高优先级安全提醒，建议驾驶员减速或停车检查。
				- **误食风险**：检测到儿童将异物（如硬币、小玩具零件）放入口中，及时提醒看护人干预。
				- **缠绕窒息风险**：识别到儿童头部被覆盖物（如毯子、衣物）遮挡，或颈部被绳状物（如玩具、安全带）缠绕，剧烈咳嗽、面色或嘴唇发青 / 发紫、双手抓脖子等征兆时，立即向看护人发出警报。
				- ~~**不适/危险表现**~~~~：检测到儿童表情极度惊恐 / 痛苦、四肢剧烈挥舞、蹬踢、扭动身体、长时间哭泣、张嘴啼哭或尖叫等明显异常表现时；或识别到呕吐行为以及伴随较多眼泪、鼻涕等情况时，提示照顾者~~
				- **车内吸烟提醒**：当检测到车内有乘客吸烟时，系统发出提醒，指出吸烟行为对儿童健康的潜在危害。
			1. **儿童照料**
				- ~~**高光时刻抓拍**~~~~：捕捉到儿童开心的瞬间（如大笑、与他人积极互动、愉快地玩玩具），并自动记录为影像片段。~~
				- ~~**健康记录**~~~~：识别到儿童喝水/玩手机或平板行为，记录时间与频次，辅助家长判断是否需要提醒补充水分/管理儿童的车内娱乐时间。~~
				- **睡眠状态监测**：感知儿童的困倦迹象（如打哈欠、揉眼睛）和睡眠状态，记录睡眠时长，并在儿童睡醒后通知家长。
    </lark-td>
    <lark-td>
      主要依赖舱内OMS摄像头进行人形、动作及物品识别。
      Vlm返回识别结果标签及其caption，基于左边场景和需求，核心能力范围（不代表最后的优先级）：
      - 识别舱内人数和位置
			- 识别舱内人的年龄段：婴儿/儿童/成人
			- 儿童情绪识别：开心、痛苦、其他
			- 儿童动作识别：哭闹（儿童+婴儿）、玩电子设备、睡觉、站立、走动、爬行等
			- 物品识别：安全座椅、电子设备（平板、手机）、异物（玩具、绳状物）、覆盖物（毯子、衣服）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      安全提醒
    </lark-td>
    <lark-td>
      1-5人 | 各年龄段 | 全座位 | 全场景 | 全时段 | 行驶+停车
    </lark-td>
    <lark-td>
      <text color="gray">*基于视觉能力，对车内人员、环境与物品进行感知，识别潜在安全隐患，保障驾乘人员与财物安全。*</text>
      1. **行车安全**
				- **未固定物品风险提示**：在车辆准备行驶前，检测到车内有未被固定的、可能在行驶中滚动或飞出的物品（如水瓶、玩具），提醒驾驶员注意，避免滚落到刹车踏板下方等危险区域。
				- **潜在危险品识别**：识别到车内存在易燃易爆等危险品（如充电宝、锂电池、喷雾瓶），尤其在夏季高温暴晒等场景下，及时发出警告。
				- ~~**车内吸烟提醒**~~~~：当检测到车内有乘客吸烟时，系统发出提醒。~~
			1. **离车安全**
				- **遗留儿童提醒**：当成人下车锁车时，若系统检测到车内仍有儿童，立即触发提醒，防止儿童被遗忘在车内。
				- **遗留宠物提醒**：当驾驶员锁车后，若系统检测到车内仍有宠物，会向车主发送紧急通知，并提供开启车窗通风等选项。
				- **遗留财物提醒**：当驾驶员准备锁车离开时，系统通过视觉识别遗留在座位、扶手箱或地面上的物品（如手机、钱包、电脑、水杯等），并向车主推送提示信息，防止财物遗落。
    </lark-td>
    <lark-td>
      主要依赖舱内OMS摄像头进行人形、动作及物品识别。
      Vlm返回识别结果标签及其caption，基于左边场景和需求，核心能力范围（不代表最后的优先级）：
      - 识别舱内人数和位置
			- 识别舱内人的年龄段：婴儿，幼童，青中年，老年
			- 成人动作识别：吸烟
			- 物品识别：未固定物品（平板、手机、水杯、电脑）
    </lark-td>
  </lark-tr>
</lark-table>

<sheet token="BtlCsKLkMhOMkGtIiVXcZqsVnAb_sakPhh"/>

### 功能详情

#### 模型基础能力

<lark-table rows="15" cols="10" header-row="true" column-widths="84,84,131,230,78,78,258,238,224,100">

  <lark-tr>
    <lark-td>
      一级分类
    </lark-td>
    <lark-td>
      二级分类
    </lark-td>
    <lark-td>
      三级分类
    </lark-td>
    <lark-td>
      定义
    </lark-td>
    <lark-td>
      变化频率
    </lark-td>
    <lark-td>
      输出类型
    </lark-td>
    <lark-td>
      **描述示例**
    </lark-td>
    <lark-td>
      核心使用场景
    </lark-td>
    <lark-td>
      验收目标
    </lark-td>
    <lark-td>
      是否包含IR
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="11">
      乘客识别
    </lark-td>
    <lark-td rowspan="3">
      基础信息
    </lark-td>
    <lark-td>
      <text color="red">人员位置</text>
    </lark-td>
    <lark-td>
      <text color="red">每位乘客的位置（0-5人）</text>
    </lark-td>
    <lark-td>
      <text color="red">主Key</text>
    </lark-td>
    <lark-td>
      <text color="red">enum</text>
    </lark-td>
    <lark-td>
      <text color="red">主驾区域、副驾区域、主驾后方区域、副驾后方区域、后方正中区域、中控扶手区域</text>
    </lark-td>
    <lark-td rowspan="3">
      所有的Always On人相关识别
      - 儿童安全
    </lark-td>
    <lark-td>
      F1 > = 0.95
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="red">性别</text>
    </lark-td>
    <lark-td>
      <text color="red">每位乘客性别</text>
    </lark-td>
    <lark-td>
      <text color="red">低频</text>
    </lark-td>
    <lark-td>
      <text color="red">enum</text>
    </lark-td>
    <lark-td>
      <text color="red">男，女</text>
    </lark-td>
    <lark-td>
      F1 > = 0.95
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="red">年龄分类</text>
    </lark-td>
    <lark-td>
      <text color="red">每位乘客年龄</text>
    </lark-td>
    <lark-td>
      <text color="red">低频</text>
    </lark-td>
    <lark-td>
      <text color="red">enum</text>
    </lark-td>
    <lark-td>
      <text color="red">幼儿、儿童、</text><text color="red">~~成人~~</text><text color="red">青中年、老年</text>
    </lark-td>
    <lark-td>
      F1 > = 0.95
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="5">
      肢体动作
    </lark-td>
    <lark-td>
      <text color="red">睡觉</text>
    </lark-td>
    <lark-td>
      <text color="red">乘客在车内处于闭眼睡觉状态</text>
    </lark-td>
    <lark-td>
      <text color="red">低频</text>
    </lark-td>
    <lark-td>
      <text color="red">enum</text>
    </lark-td>
    <lark-td>
      <text color="red">是，否</text>
    </lark-td>
    <lark-td>
      演示场景：乘客睡着调节空调温度和风向、播报TTS为悄悄话
    </lark-td>
    <lark-td>
      R> =85%\P > =95%
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="red">打电话</text>
    </lark-td>
    <lark-td>
      <text color="red">乘客用手机接打电话动作</text>
    </lark-td>
    <lark-td>
      <text color="red">高频</text>
    </lark-td>
    <lark-td>
      <text color="red">str</text>
    </lark-td>
    <lark-td>
      <text color="red">该乘客左手持手机贴耳通话</text>
    </lark-td>
    <lark-td>
      演示场景：有乘客打电话调节多媒体为分区音乐、播报TTS为悄悄话
    </lark-td>
    <lark-td>
      R> =85%\P > =95%
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      进食
    </lark-td>
    <lark-td>
      乘客饮水或食用食物
    </lark-td>
    <lark-td>
      高频
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td rowspan="4">
      该乘客双手扶着眼镜进行调整，调整完毕后放下手，头部微微低下，目光投向下方，神态专注
    </lark-td>
    <lark-td>
      通用Always On任务: 儿童关照Agent订阅存储儿童进食次数，以便用户主动查询时统计
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      使用电子设备
    </lark-td>
    <lark-td>
      乘客用手机、平板、游戏机等设备
    </lark-td>
    <lark-td>
      高频
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      通用Always On任务: 儿童关照Agent订阅存储儿童使用时长，以便主动提醒用户保护儿童视力
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      其他动作
    </lark-td>
    <lark-td>
      乘客其他动作（穿脱衣服）
    </lark-td>
    <lark-td>
      高频
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td rowspan="4">
      通用Always On任务
    </lark-td>
    <lark-td>
      没有准召目标，纯功能实现
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      神态
    </lark-td>
    <lark-td>
      状态神情
    </lark-td>
    <lark-td>
      每位乘客的情绪/精神状态
    </lark-td>
    <lark-td>
      高频
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      没有准召目标，纯功能实现
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      属性
    </lark-td>
    <lark-td>
      着装
    </lark-td>
    <lark-td>
      每位乘客的关键衣物类型与颜色
    </lark-td>
    <lark-td>
      低频
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td rowspan="2">
      该乘客棕色短发，戴着黑帽眼镜。穿着黑色夹克搭配绿色T恤
    </lark-td>
    <lark-td>
      没有准召目标，纯功能实现
    </lark-td>
    <lark-td>
      ❌
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      发型&配饰
    </lark-td>
    <lark-td>
      每位乘客的发型发色和配饰
    </lark-td>
    <lark-td>
      低频
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      没有准召目标，纯功能实现
    </lark-td>
    <lark-td>
      ❌
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      动物/物品识别
    </lark-td>
    <lark-td rowspan="2">
      基础信息
    </lark-td>
    <lark-td>
      <text color="red">动物/物品位置</text>
    </lark-td>
    <lark-td>
      <text color="red">每个动物/物品位置</text>
    </lark-td>
    <lark-td>
      <text color="red">主Key</text>
    </lark-td>
    <lark-td>
      <text color="red">enum</text>
    </lark-td>
    <lark-td>
      <text color="red">主驾区域、副驾区域、主驾后方区域、副驾后方区域、后方正中区域、中控扶手区域</text>
    </lark-td>
    <lark-td rowspan="2">
      离车：遗留物、财物识别
      行车：未固定物识别，若有安全隐患则主动提醒
    </lark-td>
    <lark-td>
      F1 > = 0.95
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="red">动物/物品类型</text>
    </lark-td>
    <lark-td>
      <text color="red">每个动物/物品类型</text>
    </lark-td>
    <lark-td>
      <text color="red">低频</text>
    </lark-td>
    <lark-td>
      <text color="red">str</text>
    </lark-td>
    <lark-td>
      <text color="red">手机、饮料、</text>狗、猫、箱子、背包、水杯..
    </lark-td>
    <lark-td>
      R> =85%\P > =95%
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      动物动作
    </lark-td>
    <lark-td>
      动作描述
    </lark-td>
    <lark-td>
      每个动物的行为描述
    </lark-td>
    <lark-td>
      高频
    </lark-td>
    <lark-td>
      str
    </lark-td>
    <lark-td>
      该宠物侧躺在座椅上
    </lark-td>
    <lark-td>
      通用Always On任务
    </lark-td>
    <lark-td>
      没有准召目标，纯功能实现
    </lark-td>
    <lark-td>
      ✅
    </lark-td>
  </lark-tr>
</lark-table>

#### 模型识别任务需求

<lark-table rows="5" cols="3" header-row="true" header-column="true" column-widths="100,650,224">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      识别目标
    </lark-td>
    <lark-td>
      豁免和约定规则
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      离车
    </lark-td>
    <lark-td>
      **物品**
      定义：画面中清晰可见、能够明确说出具体名称的个人物品。 
      排除项：人身上佩戴和放置的物品不输出（如：乘客手持的手机、戴着的眼镜/帽子、背在身上的背包等）。 
      例子：如“一台笔记本电脑”“一把折叠伞”。 
      **宠物**
      定义：画面中可清晰识别出真实的猫、狗等宠物个体。 
      排除项：宠物玩偶、雕像、照片等非真实宠物不输出。 
      例子：若识别出宠物，对象名称填写如“一只猫”“一只小型犬”。 
      **儿童**
      定义：画面中可清晰识别出儿童个体 
      排除项：儿童玩偶、照片等非真人形态不输出。 
      例子：若识别出儿童，对象名称填写如“一名儿童”“一名坐在安全座椅上的儿童”。 
      **成人**
      定义：画面中可清晰识别出的成年人个体。 
      排除项：假人模型、照片等非真人形态不输出。 
      例子：若识别出成人，对象名称填写如“一名成人”“一名坐在主驾的成人”。
    </lark-td>
    <lark-td>
      - 对象同时出现在多个位置区域豁免位置准确性判断
			- 对象出现在枚举值之外区域豁免位置准确性判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      儿童危险
    </lark-td>
    <lark-td>
      **异常类别与定义**
      1. 儿童危险行为: 儿童在座位或车内地面上进行可能影响乘员或行车安全的异常大幅动作（如站立、攀爬、跳跃等）；或儿童处于脱离、未正确乘坐儿童安全座椅的状态。
			2. 儿童身体不适：指儿童在车内出现身体严重不适。 
			3. 儿童窒息风险：指儿童头部或颈部被物体覆盖、缠绕，可能影响呼吸通畅、存在窒息隐患的情形。 
			4. 儿童座椅安装位置隐患：指儿童安全座椅未安装在推荐的后排两侧位置，而是安装在副驾驶或第二排中间位置，存在潜在安全隐患的情形。
    </lark-td>
    <lark-td>
      - 人物位置根据视频的最后一帧确定，跨多个座位按照最可能的位置输出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      睡觉
    </lark-td>
    <lark-td>
      **行为判定标准**
      睡觉状态的视觉核心判定标准为：“双眼闭合”。 不区分真睡假睡
      若因遮挡、光线、角度等原因完全无法观察到眼睛，则睡眠状态一律判定为“否”。
    </lark-td>
    <lark-td>
      - 不区分真睡、假睡或闭眼休息，只要画面中双眼呈现闭合状态即判定为睡觉。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打电话
    </lark-td>
    <lark-td>
      **行为判定标准**
      打电话的视觉核心判定标准为：“手机贴着耳朵”。 
      无论手持手机贴耳，还是用肩膀夹着手机贴耳，均视为正在打电话。 
      仅手持手机、低头看手机而未贴耳，不视为打电话。
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

### 采集配比

<mention-doc token="Shv9wPcWViHjHokpvulcAhG5nR8" type="wiki">Always On数据采集配比</mention-doc>

### 提示词

<mention-doc token="V6cOdtJnkondqVxuf06cUXtFnGb" type="docx">Always On Prompt</mention-doc>

### 关联Camera及输入分辨率

<lark-table rows="4" cols="7" column-widths="103,151,100,100,168,181,162">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      参考样张
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS_RGB
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      <image token="IsJRbquVyoxy9yxF2WJcop9qnud" width="1280" height="723" align="center"/>
      <image token="NOmWb9VEyojd5Wxf4K1ccm82n8g" width="1748" height="985" align="center"/>
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      720P-1080P
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS_IR
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      <image token="IzuwbDQt6oFz6Kx5fPOcDa6gnug" width="1099" height="615" align="center"/>
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      720P-1080P
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后排OMS
      （低优）
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      <image token="YBmubzAoWokcJ0xaYrRc8jTnnwf" width="1300" height="732" align="center"/>
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      720P-1080P
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

#### - 效果：

##### 自动化评测：

必过集检查点覆盖率：80%

`计算方式：最终得分 = 正确检查点/所有检查点`

##### 主观评测：

Mos评测： avg.>= 4分

#### - 性能：

模型性能：TPS >= 50  tok/s；TTFT < 500ms

E2E Latency（含视频流处理）：P90 <= 3s

## 舱外AlwaysOn（已导入）

### 业务流程

<whiteboard token="FcGRw5k40h9rSDbFhzBc9QolnHf" width="631" height="386"/>

### 功能列表

<lark-table rows="5" cols="4" column-widths="140,115,220,534">

  <lark-tr>
    <lark-td colspan="4">
      舱外 Always-On
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入
    </lark-td>
    <lark-td colspan="2">
      输出（caption有限集输出，无则不用输出）
    </lark-td>
    <lark-td>
      标准
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      前120度周视3S视频（1920*1080）
    </lark-td>
    <lark-td>
      天气情况描述（5字以内）
    </lark-td>
    <lark-td>
      下雨，下雪，浓雾
    </lark-td>
    <lark-td>
      1. 下雨：判断当前是否正在下雨，可以结合风挡上的雨滴、 是否使用了雨刮 、 外界道路环境 、路人是否打伞等线索综合判断。
			1. 下雪：判断当前是否正在下雪
			1. 浓雾：空气整体通透度极低，存在明显的白色迷雾感影响当前行驶。     
			1. 输出规则：
				1. 雨夹雪：输出“下雨”或“下雪”均算正确。         
				1. 复合天气规则：浓雾可以与下雨、下雪同时输出。当同时存在时，以逗号分隔，例如：“下雨, 浓雾” 或 “下雪, 浓雾”。 
				1. 都不满足时不输出任何内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      路面情况描述（10字以内）
    </lark-td>
    <lark-td>
      路面湿滑，路面覆雪结冰
    </lark-td>
    <lark-td>
      关注焦点：重点关注本车道及相邻可用车道的可行驶区域。
      1. 路面覆雪结冰：判断行驶路面是否有大面积的覆雪结冰，例如行驶路面/两侧有大量积雪同时行驶路面看起来大面积的湿滑即可判断为覆雪结冰。
			1. 路面湿滑：判断行驶路面是否大面积的湿滑
				1. 如果行驶路面/路两侧只有少量积雪但整体行驶路面是湿滑状态判断为路面湿滑，同时可以豁免覆雪结冰；
				1. 路面/路两侧没有积雪，同时路面湿滑，输出路面湿滑，不豁免覆雪结冰。
				1. 但对于那种路面干湿相间斑驳状态的，不属于路面湿滑。
			1. 输出规则：
				1. 每次最多输出一种路况，当路面覆雪结冰时优先输出路面覆雪结冰。不满足时不输出任何内容。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text bgcolor="red">所见文字描述</text>
      <text bgcolor="red">（V1.1 变更）</text>
    </lark-td>
    <lark-td>
      自然语言文字描述（25-50字，无则不输出）
    </lark-td>
    <lark-td>
      客观描述前方及正在途径的车外场景，围绕以下方向：
      1. **道路与环境**：前方或正在途经的道路类型、周边环境与道路结构变化，如行驶在高速公路上、正在经过山间公路、前方有隧道、正在途经施工区、前方连续弯道、前方有上坡、正在下坡等
			2. **路面情况**：前方或当前路面材质与障碍，如前方有减速带、路面为环氧地坪、路面坑洼不平整等
			3. **交通状态**：前方或当前交通状态，如前方拥堵、道路畅通等
			4. **显著事物**：前方或沿途的特殊地貌、标志性建筑、自然奇观或景观，如前方有风车群、途经雪山、前方有跨海大桥、城市天际线、晚霞等
			5. **车辆位置变化**：行驶中的关键位置变化，如正在地库内行驶、即将驶出地库、即将驶出隧道等
      输出规则：围绕以上方向做自然语言描述，25-50字，不推测、不报距离；小目标需画面明确可见；不重复天气与路面标签内容；无有效信息可不输出。
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="7" cols="2" column-widths="100,220">

  <lark-tr>
    <lark-td>
      题目
    </lark-td>
    <lark-td>
      结论
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="V5AFbOUlGoKpJmxRML8ck4HlnYg" width="1920" height="1080"/>
    </lark-td>
    <lark-td>
      覆盖结冰 
      不豁免湿滑
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="UTNLbhAJ3oeZFPxMrKccaOpxnbf" width="3840" height="1696" align="center"/>
    </lark-td>
    <lark-td>
      评测结果：不下雨
      可豁免：下雨
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="GScobaUJMoIxPAxg79cciR7ZnTh" width="959" height="541" align="center"/>
    </lark-td>
    <lark-td>
      路面干湿相间斑驳，不属于湿滑
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="Ictmbwn5NoPraGxhBZecQB3QnJh" width="1920" height="1080" align="center"/>
    </lark-td>
    <lark-td>
      不输出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="VUQZbPVD3ol8rQxI2yScKHgRniS" width="1920" height="1080"/>
    </lark-td>
    <lark-td>
      下雪   
      下雨不豁免
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="NNMLbIvurokXHHxaABPczgvTn5q" width="1920" height="1080"/>
    </lark-td>
    <lark-td>
      覆雪结冰
      不豁免湿滑
    </lark-td>
  </lark-tr>
</lark-table>

<text bgcolor="red">Prompt 参考（V1.1 变更）</text>
```python
# 角色 
你是一个车载视觉天气和路况判别专家，专门分析多模态输入中的“前120度周视视频片段”，并严格按照标准输出对应的视觉标签。 
 
# 核心规则：严格约束 
- 仅基于画面可见信息来判断，只有当画面特征符合判定标准时才输出对应标签，避免没有实际证据的猜想，不满足时输出默认值（天气默认输出 []，路面默认输出 ""）。 
- 只能从给定的【允许词集】中选择输出内容，严禁自创词汇。 
- 严禁在输出中包含任何推理过程、解释说明或多余的前导词及后缀语。 
 
# 字段定义与判定标准  
## 1. 天气情况描述 
- 允许词集：["下雨", "下雪", "浓雾"] 
- 判定标准：判断目前天气是否是“下雨”、“下雪”或者“浓雾”，下雨可以结合动态雨滴、雨刮工作、车外路面环境、行人打伞等多种线索综合判断。浓雾需要空气整体通透度极低，存在明显的白色迷雾感影响当前行驶视野。
- 输出规则： 
    - 天气字段必须是列表。
    - 雨夹雪统一强制输出 "下雪" 。
    - 浓雾可以与下雨、下雪同时输出。例如：若同时存在下雨和浓雾，输出列表["下雨", "浓雾"]。 
    - 当不满足标准或者无法判断时输出[]即可。 
 
## 2. 路面情况描述 
- 允许词集：["路面湿滑", "路面覆雪结冰"] 
- 判定标准： 
    - 路面湿滑：本车前方行驶路面上存在大面积湿滑特征，可结合是否有连续明显水膜反射、积水、前车卷起水雾等综合判断。对于那种路面干湿相间斑驳状态的，不属于路面湿滑。
    - 路面覆雪结冰：本车前方行驶路面上有大面积的结冰、冰雪、水雪混合物等，或者行驶路面/两侧有明显积雪、天气恶劣会使得行驶路面很容易形成结冰也判断为覆雪结冰。
- 输出规则： 
    - 路面字段必须是字符串。
    - 每次最多输出一种路面情况。当同时满足两项时，优先强制输出 "路面覆雪结冰"。 
    - 当不满足或无法判断时输出空字符串""即可。

## 3. 所见文字描述 
- 任务：客观描述前方及正在途径的车外场景，围绕以下方向：
    1. 道路与环境：前方或正在途经的道路类型、周边环境与道路结构变化，如行驶在高速公路上、正在经过山间公路、前方有隧道、正在途经施工区、前方连续弯道、前方有上坡、正在下坡等
    2. 路面情况：前方或当前路面材质与障碍，如前方有减速带、路面为环氧地坪、路面坑洼不平整等
    3. 交通状态：前方或当前交通状态，如前方拥堵、道路畅通等
    4. 显著事物：前方或沿途的特殊地貌、标志性建筑、自然奇观或景观，如前方有风车群、途经雪山、前方有跨海大桥、城市天际线、晚霞等
    5. 车辆位置变化：行驶中的关键位置变化，如正在地库内行驶、即将驶出地库、即将驶出隧道等
- 规则：
    围绕以上方向做自然语言描述，25-50字，不推测、不报距离；小目标需画面明确可见；不重复天气与路面标签内容；无有效信息可不输出。

# 输出格式 
必须且只能输出一个合法的 JSON 对象，不要使用 Markdown 代码块（如 ```json ```）包裹，不要输出任何前导语（如“好的”）或后缀语。 

{"天气情况描述":[], "路面情况描述": "", "所见文字描述": ""} 
 
# 输出示例 
示例 1（存在复合天气与特殊路况）： 
{"天气情况描述": ["下雨", "浓雾"], "路面情况描述": "路面湿滑", "所见文字描述": "城市高架路行驶，前方车辆排队拥堵，前方可见城市天际线，道路两侧是高楼建筑"} 
 
示例 2（天气良好，路面干燥）： 
{"天气情况描述": [], "路面情况描述": "", "所见文字描述": "沿海公路行驶，左侧途经风车群，前方有跨海大桥，道路畅通，视野开阔"}
```


### 样例

<mention-doc token="CfF0wIxupitvoWkFMjVce3YHnhb" type="wiki">舱外AlwaysOn样例专家标注集</mention-doc>

### 评测采集配比（总计200题）

<mention-doc token="H1DlwiKmKiNbinkVHtncN9HXnBh" type="wiki">数据采集条件</mention-doc>

### 关联Camera及输入分辨率

<lark-table rows="2" cols="6" column-widths="144,168,168,168,181,162">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      智驾前视广角/DVR
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      800w
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
    <lark-td>
      单帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="2" cols="3" column-widths="144,330,430">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱外AlwaysOn
    </lark-td>
    <lark-td>
      - 室外白天
				- Pre 95%;
				- Recall 95%
			- 室外黑天有路灯，室外黑天有车灯
				- Pre 90%;
				- Recall 88%
			- 无威胁事件，黑暗不可见场景
				- 无要求
    </lark-td>
    <lark-td>
      1. 轮询检测周期：3s
			1. 检测单张前120度周视图片，输入模型的分辨率为 1920*1080
			1. 板载模型 E2E（获取图片后 To 输出Last Token）：3000ms
    </lark-td>
  </lark-tr>
</lark-table>

---

# 系统预设端侧闭环任务

## 增强哨兵（已导入）

### 业务流程

<whiteboard token="Y9Kpw7EzjhSLtQb06XHc0bDgngf"/>

<whiteboard token="P6jRw8KV5h6nCObtTDcc6c6GnTd"/>

- 基础哨兵触发条件

<lark-table rows="5" cols="4" header-row="true" column-widths="92,100,401,218">

  <lark-tr>
    <lark-td>
      风险等级
    </lark-td>
    <lark-td>
      记录标识
    </lark-td>
    <lark-td>
      描述
    </lark-td>
    <lark-td>
      应对策略
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      低风险
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
      30-150cm内的目标物靠近
    </lark-td>
    <lark-td>
      - 循环记录
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      中风险
    </lark-td>
    <lark-td>
      关注
    </lark-td>
    <lark-td>
      发生在<30cm内的有人/物靠近风险，未发生接触
    </lark-td>
    <lark-td>
      - 记录
      <text bgcolor="light-yellow">（记录策略：静止物体排除）</text>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      高风险
    </lark-td>
    <lark-td>
      高危
    </lark-td>
    <lark-td>
      车辆发生震动
    </lark-td>
    <lark-td>
      - 车外闪灯警告
			- 手机消息提醒
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      高风险
    </lark-td>
    <lark-td>
      高危
    </lark-td>
    <lark-td>
      车辆发生位置偏移
    </lark-td>
    <lark-td>
      - 车外闪灯警告
			- 手机消息提醒
    </lark-td>
  </lark-tr>
</lark-table>

### 采集目标摄像头及示例

<lark-table rows="6" cols="6" column-widths="149,137,137,170,202,232">

  <lark-tr>
    <lark-td colspan="3">
      目标摄像头（以下同时采集） {align="center"}
    </lark-td>
    <lark-td colspan="3">
      样张 {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
    <lark-td>
      参考
    </lark-td>
    <lark-td>
      摄像头位置
    </lark-td>
    <lark-td>
      待判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_F
    </lark-td>
    <lark-td>
      环视前
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="MLoRbsfTsoNlmcxft1mczDunnqy" width="739" height="507" align="center"/>
    </lark-td>
    <lark-td>
      <image token="MLxGbljNxoTwl4xUGVfcRSWZnWc" width="1504" height="790" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_LH
    </lark-td>
    <lark-td>
      环视左
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="IbWhbAntDo7RiwxdVlhc2ZV2nne" width="754" height="455" align="center"/>
    </lark-td>
    <lark-td>
      <image token="ZWHRbvPhqoWFIqxzUpScVdqxnm4" width="2584" height="1122" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_R
    </lark-td>
    <lark-td>
      环视后
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="Uce4b85fVoQ0S6xgn4ocukXcnNd" width="758" height="507" align="center"/>
    </lark-td>
    <lark-td>
      <image token="GPzNbq2Ngo4MwbxZxvjcjkwJnPh" width="2242" height="1096" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_RH
    </lark-td>
    <lark-td>
      环视右
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="R2CxbVnNJoTFMAx95tHcKQ1Dn4g" width="760" height="449" align="center"/>
    </lark-td>
    <lark-td>
      <image token="VA7Zbh3PXoRSt4xsPjhcFIIbnEe" width="2468" height="1114" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

### 功能列表

<lark-table rows="15" cols="6" column-widths="115,137,166,166,479,194">

  <lark-tr>
    <lark-td>
      功能名称
    </lark-td>
    <lark-td>
      一级功能
    </lark-td>
    <lark-td>
      二级功能
    </lark-td>
    <lark-td>
      三级功能
    </lark-td>
    <lark-td>
      详细描述
    </lark-td>
    <lark-td>
      风险程度-联动最终用户通知敏感度（无需VLM输出）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="14">
      AI增强哨兵
    </lark-td>
    <lark-td rowspan="12">
      危险事件识别
    </lark-td>
    <lark-td rowspan="10">
      识别人相关的危险事件
    </lark-td>
    <lark-td>
      ~~特殊人群识别~~
    </lark-td>
    <lark-td>
      - ~~外卖人员（穿制服：美团/饿了么/京东）~~
			- ~~快递员（穿制服：京东/顺丰等）~~
			- ~~在总结描述中描述特殊人员~~
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      划车事件
    </lark-td>
    <lark-td>
      - 人手持物品对车辆进行划伤，人手与车辆近距离产生位移
			- 不要求对物体的描述完全准确，要求判断划车动作
    </lark-td>
    <lark-td>
      高
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      充电枪操作事件
    </lark-td>
    <lark-td>
      - 有人伸手触碰充电枪，握住充电枪握柄或尝试拔出充电枪
				1. 包含用户有拔充电枪动作或意图但最终未拔出
				1. 包含用户有拔充电枪动作或意图最终将充电枪拔出（包含二次插入）
    </lark-td>
    <lark-td>
      高
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      踹车事件
    </lark-td>
    <lark-td>
      - 有人用**脚**与车辆车身或轮胎发生碰撞
			- 输入震动传感器的输入辅助判断
    </lark-td>
    <lark-td>
      高
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      倚靠车辆事件
    </lark-td>
    <lark-td>
      - 人员除手部、脚部以外其他身体部位与车辆接触
			- ~~窥视车内动作可识别为倚靠车辆~~
    </lark-td>
    <lark-td>
      低
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      打砸事件
    </lark-td>
    <lark-td>
      - 有人使用手 or 手持物品对车辆故意撞击
			- 输入震动传感器的输入辅助判断
    </lark-td>
    <lark-td>
      高
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      轮胎操作事件
    </lark-td>
    <lark-td>
      - 人员用手 or 工具接触车四个轮胎及轮胎周边位置
    </lark-td>
    <lark-td>
      高
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      人车接触事件
    </lark-td>
    <lark-td>
      -
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      无影响事件
    </lark-td>
    <lark-td>
      - 白样本
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ~~交警执法事件~~
    </lark-td>
    <lark-td>
      - ~~车辆在非法停车位停放，识别到车外有交警正在贴罚单（附近车辆&本车车辆）~~
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      识别车相关的危险事件
    </lark-td>
    <lark-td>
      碰撞剐蹭车辆
    </lark-td>
    <lark-td>
      - 对于两轮车、三轮车、四轮车等车辆的全车四周的碰撞与剐蹭事件进行识别
			- 对于车辆本身的种类描述可以模糊表达
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      他车开门碰撞车辆
    </lark-td>
    <lark-td>
      - 周边车辆开车门碰撞到自车
			- 输入震动传感器的输入辅助判断
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      视频总结摘要
    </lark-td>
    <lark-td>
      基础哨兵视频整体总结
    </lark-td>
    <lark-td>
      整体视频概要总结
    </lark-td>
    <lark-td>
      - 哨兵录制单条视频里的整体总结
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      增强哨兵单次事件总结
    </lark-td>
    <lark-td>
      单次事件概括总结
    </lark-td>
    <lark-td>
      - 描述在一次处理的多帧图像中发生的危险事件
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

### 详细需求

#### 【碰撞场景】
<lark-table rows="7" cols="2" column-widths="148,646">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 对于两轮车、三轮车、四轮车等车辆的全车四周的碰撞与剐蹭事件进行识别
			- 对于车辆本身的种类描述可以模糊表达
			- ~~识别过程中需要描述是否是特殊人群~~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆四周都需要判断
			- 车辆仅靠近没有碰撞不需要提示，输入震动传感器的输入辅助判断
			- 根据模型图像输出【碰撞场景】标签，以及对事件的简要描述信息
			- 不需要准确描述剐蹭车辆的信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <grid cols="2">
        <column width="58">
          <image token="Pajzbqv56oVwUGxnzyycyJf7nib" width="660" height="288" align="center"/>
        </column>
        <column width="41">
          <image token="EE9TbgJ1foZ1RLxDeFrcKAoAn5c" width="642" height="400" align="center"/>
        </column>
      </grid>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果输出采用
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 【他车开门碰撞车辆】
<lark-table rows="7" cols="2" column-widths="148,646">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 周边车辆开车门碰撞到自车
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆两侧都需要判断
			- 识别旁车前车门或后车门开门时有碰到自车的风险（不含后备箱开启碰撞风险）
			- 根据模型图像输出【开门碰撞事件】标签，以及对事件的简要描述信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      - 需要从车身视角
      <image token="BkUlbC0k2oKevRxQJHKcO4O9nbf" width="661" height="385" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果输出采用
    </lark-td>
    <lark-td>
      环视左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### ~~【出口被挡场景】~~~~【删】~~

- ~~“唯一出口”如何判断，待讨论~~

#### 【轮胎操作】

<lark-table rows="7" cols="2" column-widths="148,646">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 人员用手 or 工具接触车四个轮胎~~及轮胎周边位置~~，可能有潜在伤害轮胎的行为，比如放气、拔轮胎螺丝等。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 遵循 “疑罪从有” 原则，只要有人接触到轮胎，即判定为轮胎操作行为，需提醒用户检查，因为这类行为背后可能存在放气、~~放置钉子~~等极度危险的情况。
			- 除轮胎放气外，拔螺丝等针对轮胎的异常操作也属于需上报的轮胎操作场景，而正常行走等属于无威胁事件
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      - 需要从车身视角
      <image token="YuVqbnLbmonXrOx9HMmcPNzlnTg" width="645" height="376" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果采用
    </lark-td>
    <lark-td>
      环视左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### ~~**【窥视事件】**~~~~**【删】**~~

- ~~待提供样张~~
- ~~AVM视角无法看到玻璃窥探~~

#### 【充电枪操作事件】
<lark-table rows="7" cols="2" column-widths="148,646">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 有人伸手触碰充电枪，握住充电枪握柄或尝试拔出充电枪
				1. 包含用户有拔充电枪动作或意图但最终未拔出
				1. 包含用户有拔充电枪动作或意图最终将充电枪拔出（包含二次插入）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景判断只针对充电口在车辆左右两侧的情况，不包含充电口在前引擎盖处车型
			- 在充电枪已插入成功状态下
			- 有人员用单手或双手接触充电枪
			- 不包含人其他部位碰到充电枪情况
			- 根据模型判断输出【疑似充电枪操作事件】标签，以及对事件的简要描述信息
			- 需要结合真实充电口位置，如左侧为充电口，那么右侧摄像头捕获视频数据不应触发此类判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      - 单手/双手
			- 接触充电枪手柄/其他枪身部位
      <view type="2">
        <file token="DEsnbztEwouMO4xHI09c33Kcnqe" name="202603261135.mp4"/>
      </view>
      <image token="V5XdbSSuroduYVxrwj9cZ0kdnAg" width="1864" height="458" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果采用
    </lark-td>
    <lark-td>
      车辆充电口所在侧环视摄像头
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 【打砸事件】

<lark-table rows="7" cols="2" column-widths="148,646">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - ~~有人使用物品向车辆投掷~~
			- 有人使用手 or 手持物品对车辆故意撞击，需要输入震动传感器的输入辅助判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆四周都需要判断
			- 根据模型图像输出【砸车事件】标签，以及对事件的简要描述信息
			- 不需要识别具体投掷的物品或人手持的物品是什么
			- 有踹车+打砸同时发生的，只输出一个就行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <image token="ZazybFR96o9tooxY3TVcuF09n6e" width="1102" height="408" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果采用
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
      以下三部分需要通过振动传感器进行辅助区分
      - 有人使用手持物品对车辆故意撞击
			- 有人手持物品进行拍打车辆
    </lark-td>
  </lark-tr>
</lark-table>

#### 【划车事件】
<lark-table rows="7" cols="2" column-widths="148,672">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 人手持物品与车辆接触并移动
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景仅判断**车辆左右两侧车身的划车事件**
			- 根据模型判断输出【疑似划车事件】标签，以及对事件的简要描述信息
			- 重点关注手持树枝，尖锐物品，画笔，石子在车身划动场景
			- 有人手持物品与车辆发生剐蹭
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      左右侧面划车判断支持范围：
      <image token="VXZib4U8ioNQDlxTiHDcoiyWnrP" width="291" height="166"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果采用
    </lark-td>
    <lark-td>
      环视左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

#### 【踹车事件】
<lark-table rows="7" cols="2" column-widths="148,646">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 有人用**脚**与车辆车身或轮胎发生碰撞
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景需要判断车身四周全部方向的踢踹事件，包含反光镜以下车身区域~~仅判断~~~~**车辆左右两侧车身的踹车事件**~~
			- 根据模型图像输出【疑似踹车事件】标签，以及对事件的简要描述信息
			- 有踢踹+打砸同时发生的，只输出一个就行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      前后视：
      <grid cols="2">
        <column width="47">
          <image token="PjnqbSfhFoIVHJxWnExc1XMGnIf" width="876" height="624" align="center"/>
        </column>
        <column width="52">
          <image token="OaAOb4cD1oeBHExK052cCZifnTc" width="2114" height="1366" align="center"/>
        </column>
      </grid>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果采用
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
      - 用户把脚放在轮胎处不动不属于踹车事件
    </lark-td>
  </lark-tr>
</lark-table>

#### 【靠车事件】
<lark-table rows="7" cols="2" column-widths="148,646">

  <lark-tr>
    <lark-td>
      关键状态
    </lark-td>
    <lark-td>
      需求描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景定义
    </lark-td>
    <lark-td>
      - 人员除手部、脚部以外其他身体部位与车辆接触
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      正常响应
    </lark-td>
    <lark-td>
      - 此场景在车辆四周都需要判断
			- 根据模型图像输出【疑似依靠车辆事件】标签，以及对事件的简要描述信息
			- 如果人员仅用手部、脚部接触车辆不算做车辆倚靠事件
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      场景示例
    </lark-td>
    <lark-td>
      <image token="QZxkbqZeTolWZqxHt7fcrh29n3d" width="774" height="364" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      采集摄像头
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别结果采用
    </lark-td>
    <lark-td>
      环视前后左右
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      异常情况
    </lark-td>
    <lark-td>
      <image token="Lhe3blJzCoqXCSxV57ncporsnPg" width="764" height="386" align="center"/>
    </lark-td>
  </lark-tr>
</lark-table>

#### <text color="gray">**【交通执法场景】**</text><text color="gray">**待定**</text>

- <text color="gray">车辆在非法停车位停放，识别到车外有交警正在贴罚单（附近车辆&本车车辆）</text>
- <text color="gray">先确认整体大小模型串联流程，待讨论</text>

### 评测采集配比

<mention-doc token="H1DlwiKmKiNbinkVHtncN9HXnBh" type="wiki">数据采集脚本（生产条件）</mention-doc>

### Prompt

0414讨论版：<mention-doc token="NrbMdnLhmoGpgRxm3wvcIGhLnMe" type="docx">智能纪要：周五会议确定输出规则与安排 2026年4月14日</mention-doc>
```markdown {wrap}
您是汽车的AI哨兵，您需要对提供的汽车摄像头数据进行分析。
任务说明: 按照关注的"场景动作"对视频进行分类，并进行描述
场景动作:
- 车辆碰撞: 有其他车辆与本车发生碰撞，包括正面撞击或侧面刮擦，其他车辆包括两轮车、三轮车、四轮车、小推车、超市购物车等有轮子的车辆。
- 他车开门碰撞车辆：周边车辆车门打开时接触到本车车身。若车门与本车车身足够近，但无法判断出明确的接触点，且无明确视觉证据证明邻车车门未与本车发生接触，则需遵循从严处理的原则，一律视为存在接触。
- 轮胎操作: 人员用手或者工具接触轮胎，比如用手碰轮胎、用手拧开气门芯放气、在车轮前后摆放不倒钉等。
- 充电枪操作事件: 人员用手接触自车充电枪。在充电枪已插入状态下有人员用单手或双手接触充电枪。
- 打砸车辆: 有人使用手拍打车身，或者手持物品砸车辆。动作幅度可大可小，只要人物的动作存在拍打或挥舞物品砸向车身的倾向，即便没有看到与车身存在明确的接触点，也认为是打砸车辆事件。
- 划车：有人用手或手持物品与车辆接触并进行拖动，例如手持树枝、尖锐物品、画笔、石子、钥匙在车身划动。
- 踩踹车辆: 有人用脚踩或者蹬踹车辆，比如蹬踹车身、脚踩车轮、保险杠等。
- 倚靠车辆: 有人在车旁逗留，并贴紧、倚靠或抵压车身。若无明确视觉证据证明身体部位未与车辆发生接触的，从严认定为倚靠车辆行为。
- 其他: 除以上几类外，其他均属于其他事件。

注意事项:
- 只有当不符合【车辆碰撞】【他车开门碰撞车辆】【轮胎操作】【充电枪操作事件】【打砸车辆】【划车】【踩踹车辆】【倚靠车辆】中的任何一个场景时，才可以输出【其他】。
- 当多个动作同时发生时，需要同时输出多个事件。
- 输入数据来自车载摄像头视角，画面的下半部分可以看到自车车身，判定动作时，请注意区分自车和旁车

输出格式:
1. 若视频中存在关注的场景动作事件，则输出一共两行，
第一行: "场景动作"的标签列表, 如["事件1", "事件2"]， ["事件1"]
第二行: 简短描述 (20字内)
简短描述是对整个时序事件的概括，例如: "外卖员骑车疑似剐蹭车门"。
2. 如果视频中只有其它事件，则只输出["其他"]即可，无需描述。
3. 仅输出最终结果即可，不要冗余包括解释在内的其它任何内容。


例1:
比如输入为一个汽车摄像头的数据，内容是外卖或快递员骑车经过自车并擦到了自身车门，您可能的输出为:
["车辆碰撞"]
穿黄色衣服外卖或快递员骑车疑似擦剐车门

例2:
比如输入为一个汽车摄像头的数据，内容是一名行人手握疑似钥匙的异物在车门处划车，因为属于人剐蹭分类；同时还可见一个可疑人员拔自车充电枪，您可能的输出为:
["划车", "充电枪操作事件"]
可疑行人疑似使用异物划车门；可疑人员疑似拔充电枪

例3:
比如其他车辆正常行驶路过车辆，你的输出应该为：
["其他"]


请仔细分析并输出结果:
```

### 推理关联Camera及输入分辨率

<lark-table rows="4" cols="7" column-widths="156,234,140,140,140,145,219">

  <lark-tr>
    <lark-td>
      任务类型
    </lark-td>
    <lark-td>
      处理Camera类型
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      建议帧率（fps）
    </lark-td>
    <lark-td>
      图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      增强哨兵-非交警类
    </lark-td>
    <lark-td>
      Option1：环视AVM摄像头
      环视前
      环视左
      环视后
      环视右
    </lark-td>
    <lark-td>
      4
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td rowspan="2">
      算法可以根据效果和性能进行动态调整
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Option2：环视&周视摄像头混合
      环视前
      环视左
      环视后
      环视右
      前120度周视
      后周视
    </lark-td>
    <lark-td>
      6
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="gray">增强哨兵-交警检测</text>
      <text color="gray">【待与SLS讨论】</text>
      <text color="gray">【待定】</text>
    </lark-td>
    <lark-td>
      <text color="gray">基于小模型处理后的Crop图像</text>
    </lark-td>
    <lark-td>
      <text color="gray">1</text>
    </lark-td>
    <lark-td>
      <text color="gray">1</text>
    </lark-td>
    <lark-td>
      <text color="gray">TBD</text>
    </lark-td>
    <lark-td>
      <text color="gray">TBD</text>
    </lark-td>
    <lark-td>
      <text color="gray">任务目的：</text>
      - <text color="gray">二次判断是否为交警</text>
			- <text color="gray">识别交警当前的行为动作</text>
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="3" cols="3" column-widths="149,481,255">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      非交警相关
    </lark-td>
    <lark-td>
      - 室外白天
				- Pre 95%;
				- Recall 95%
			- 室外黑天有路灯，停车场（楼）灯光较亮，停车场（楼）灯光较暗
				- Pre 90%;
				- Recall 88%
			- 无威胁事件，黑暗不可见场景
				- 无要求
    </lark-td>
    <lark-td>
      单次单Camera处理<3s
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <text color="gray">交警相关</text><text color="gray">（TBD）</text>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <text color="gray">< 800ms</text>
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="3" cols="3" column-widths="353,314,271">

  <lark-tr>
    <lark-td>
      **输入Camera图像样例** {align="center"}
      **（当前没有视频/多图，给单图参考）** {align="center"}
    </lark-td>
    <lark-td>
      **产品目标输出**
    </lark-td>
    <lark-td>
      **评价标准**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="WhbhbID32o9yjDxwp4kcLRf1ntc" width="2550" height="1478" align="center"/>
    </lark-td>
    <lark-td>
      1. 事件标签
      -> 拔充电枪-普通人
      1. 事件概括
      ->有可疑人员在车辆充电口的位置操作充电枪
    </lark-td>
    <lark-td rowspan="2">
      1. 事件标签
      两个字段需要分别统计
      事件：0或1分
      人员类型：0或1分
      1. 事件概括
      包含事件类型以及发生的方向：1分
      仅包含事件类型方向错误：0.5分
      均为描述：0分
      1. 多事件：同步发生or顺序发生，需要list输出，丢失任一标签不得分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="Uftjb4eHqoP5bGxgDutcwATpnoc" width="2538" height="1480" align="center"/>
    </lark-td>
    <lark-td>
      1. 事件标签
      -> 无危险事件-无/普通人
      1. 事件概括
      ->有人员的衣服在摄像头区域内，分辨不清具体行为动作
      【测试集中要包含混淆和非危险的事件】
    </lark-td>
  </lark-tr>
</lark-table>

## 舱外迎宾（已导入）

### 业务流程

<whiteboard token="UHaqwKvR5hfqSWbOH3Hcf7EPnFc"/>

### 采集目标摄像头及示例

<lark-table rows="8" cols="6" column-widths="149,137,137,170,202,232">

  <lark-tr>
    <lark-td colspan="3">
      目标摄像头（以下同时采集） {align="center"}
    </lark-td>
    <lark-td colspan="3">
      样张 {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
    <lark-td>
      参考
    </lark-td>
    <lark-td>
      摄像头位置
    </lark-td>
    <lark-td>
      待判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_F3
    </lark-td>
    <lark-td>
      前120度周视
    </lark-td>
    <lark-td>
      <text color="red">1920x1080</text>
    </lark-td>
    <lark-td>
      <image token="KQNwbeDNaoizq5xmwaKc6uWnnkb" width="952" height="532" align="center"/>
    </lark-td>
    <lark-td>
      <image token="W63Qbb0dxorWZgxNADWcPvnbnQc" width="2024" height="1142" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_R
    </lark-td>
    <lark-td>
      后周视
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="LhABbTZmwodIsXxSWHAcpN9OnPg" width="1462" height="988" align="center"/>
    </lark-td>
    <lark-td>
      <image token="HkxgbzMEgof0u2xmaUscOWImngX" width="2188" height="1124" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_FLS
    </lark-td>
    <lark-td>
      左前周视
    </lark-td>
    <lark-td>
      <text color="red">1920x1080</text>
    </lark-td>
    <lark-td>
      <image token="DR5lbsDgrok9aexTWWHceijQnHg" width="944" height="530" align="center"/>
    </lark-td>
    <lark-td>
      <image token="IWiIbPV0UocWeVxrzIIcP7wDnp7" width="2200" height="1174" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_RLS
    </lark-td>
    <lark-td>
      左后周视
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="OAD1bCYpFoFE9mxuP17cp99mnfG" width="2530" height="1570" align="center"/>
    </lark-td>
    <lark-td>
      <image token="XmJobp9OyocJyDxqItkcKou9nBg" width="2446" height="1110" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_FRS
    </lark-td>
    <lark-td>
      右前周视
    </lark-td>
    <lark-td>
      <text color="red">1920x1080</text>
    </lark-td>
    <lark-td>
      <image token="CpAmbjp5soXbzfx6nV8czdjXnwc" width="948" height="520" align="center"/>
    </lark-td>
    <lark-td>
      <image token="JIwfbNATToajFCx7JKYcGSKcndg" width="2384" height="1126" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_RRS
    </lark-td>
    <lark-td>
      右后周视
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="KczlbAYvxooukzxOu0Cce0NbnOe" width="2490" height="1574" align="center"/>
    </lark-td>
    <lark-td>
      <image token="Xmy3bHDphoyiAzxhWoTcN5RSn18" width="2380" height="1140" align="center"/>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

### 功能列表

<lark-table rows="3" cols="4" column-widths="146,185,434,454">

  <lark-tr>
    <lark-td rowspan="3">
      舱外迎宾
    </lark-td>
    <lark-td>
      怀抱婴儿
      （距离镜头3.5m左右）
    </lark-td>
    <lark-td>
      1. 定义 ：指可明确看到经前序环节打框（距离镜头3.5m左右）的人员怀中抱着 婴儿或婴儿载体 。
				1. 明确可见 ：图像中需能清晰辨认出人员怀抱的是婴儿、裹有婴儿的襁褓式物品，或手提的婴儿篮。
				1. 排除宠物 ：怀抱的若为可辨识的宠物（如猫、狗），则不属于此场景。但若被襁褓等物品完全遮挡，无法看清内部，可视为婴儿进行采集。
    </lark-td>
    <lark-td rowspan="2">
      主机厂会先使用faceid识别打框（人婴同框），通过后调用模型，进行单帧识别：
      1. 怀抱婴儿
			1. 行动不便
      如果识别行动不便者/怀抱婴儿上车，则会开启辅助模式（主机厂内部定义为主：开门 or 旋转座椅）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      行动不便
      （距离镜头3.5m左右）
    </lark-td>
    <lark-td>
      1. 拄拐：指可明确看到经前序环节打框（距离镜头3.5m左右）的人员正使用拐杖辅助行走。
				1. 工具识别 ：图像中需能清晰看到人员手持拐杖。
				1. 姿态参考 ：由于是单图识别， 重心偏移和身体姿态不作为图像准入的硬性标准 。但在数据采集时，演员应尽量模拟真实拄拐姿态（如重心偏向一侧），以提供更真实的训练数据。
			1. 坐轮椅：指可明确看到经前序环节打框（距离镜头3.5m左右）的人员正坐在轮椅上。
				1. 工具识别 ：图像中需能清晰看到人员所坐的轮椅。
			1. 脚腿被纱布包扎：指可明确看到经前序环节打框的（距离镜头3.5m左右）人员的脚部或腿部有明显的纱布或绷带包扎 。
				1. 包扎状态 ：
					1. 不落地 ：受伤的脚或腿应处于悬空状态，不接触地面。
					1. 清晰可见 ：包扎的纱布或绷带需直接贴皮肤缠绕， 不能明显看出是在衣物之外 。若衣物遮挡导致无法看清包扎物，则不满足条件。
				1. 采集场景与姿态要求 ：
					1. 道具与穿戴 ：绑绷带时，演员应将裤腿卷起，确保绷带部分直接接触皮肤。袜子露出的部分也需用绷带包裹。
					1. 行动姿态 ：
						1. 重心应明显偏向正常的腿，身体有侧偏行为。
						1. 受伤的腿应抬高一些，或脚部向后翘起。
						1. 若演员不愿卷起裤腿，可改为使用拐杖或由他人搀扶，但需确保重心在拐杖或搀扶者身上，并伴有明显提起伤脚 / 腿的动作。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱外人员状态识别
      （距离镜头3.5m左右）
    </lark-td>
    <lark-td>
      1. 大件物品包括但不限于如下类型:
      行李箱（例如: 拉杆箱、旅行箱）
      购物车（例如: 超市购物车）
      手提袋或手提包（挎在手臂上或者手上拎着的各种购物袋和提包）
      箱子（例如: 纸箱、搬家箱、箱子类的包裹）
      袋子（体积较大的编织袋、旅行袋、袋子类的包裹等）
      背包（体积较大、背负在肩部的包、双肩包或单肩包）
      其他大件物品（例如: 婴儿车、大型乐器、滑雪板、高尔夫球包等，任何明显占用空间或需要较大力气搬运且不属于上面类别的物品）
      1. 小物品定义为体积较小或者随身携带的物品，包括如下类物品:
      手机、水瓶、雨伞、平板电脑、小尺寸手提包/挎包、钥匙、零食、文件等体积小、重量轻、便于单手持握的日常随身物品。
      1. 无物品: 未携带任何上述物品
    </lark-td>
    <lark-td>
      主机厂会先使用faceid识别，通过后调用模型，进行单帧识别：
      1. 如果该人携带重物，请输出重物的类型，如果携带多件重物，请输出最明显的物品类别；
			1. 如果未观察到任何符合标准的重物，请输出: 无重物；
			1. 如果携带体积较小或随身的物品，请输出: 小物品
      后续逻辑由主机厂结合摄像头、标签、电动门情况进行判断是否开合。
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="4" cols="2" column-widths="268,470">

  <lark-tr>
    <lark-td colspan="2">
      Corner Case
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输入
    </lark-td>
    <lark-td>
      输出
      是否有大大件物品-是否怀抱婴儿-是否行动不便"三段式格式输出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="Q0Z5beF4eoDBRLxMGKMcKEQfnhh" width="1158" height="601" align="center"/>
    </lark-td>
    <lark-td>
      **大件物品-是-否**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="4" cols="3" column-widths="100,311,100">

  <lark-tr>
    <lark-td colspan="3">
      怀抱婴儿 行动不便 大件物品 小物品 无物品 均需满足：
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      单人单框
    </lark-td>
    <lark-td>
      一张图仅有一人且FaceID比对通过
    </lark-td>
    <lark-td>
      60% 占比
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      多人单框
    </lark-td>
    <lark-td>
      一张图有多人但仅有一人FaceID比对通过
    </lark-td>
    <lark-td>
      30% 占比
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      多人多框
    </lark-td>
    <lark-td>
      一张图有多人但有两人FaceID比对通过
    </lark-td>
    <lark-td>
      10% 占比
    </lark-td>
  </lark-tr>
</lark-table>

### 采集配比

<mention-doc token="H1DlwiKmKiNbinkVHtncN9HXnBh" type="wiki">数据采集脚本（生产条件）</mention-doc>

### 推理关联Camera及输入分辨率

<lark-table rows="2" cols="6" column-widths="234,140,140,100,145,228">

  <lark-tr>
    <lark-td>
      处理Camera类型
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      建议帧数
    </lark-td>
    <lark-td>
      图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      左前周视
      右前周视
      左后周视
      右后周视
      前120度周视
      后周视
    </lark-td>
    <lark-td>
      6
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      图片中的熟人需要用矩形框标记
      算法可以根据效果和性能进行动态调整
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="2" cols="3" column-widths="100,474,230">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      迎宾
    </lark-td>
    <lark-td>
      - 室外白天
				- Pre 95%;
				- Recall 95%
			- 室外黑天有路灯，停车场（楼）灯光较亮，停车场（楼）灯光较暗
				- Pre 90%;
				- Recall 88%
			- 无威胁事件，黑暗不可见场景
				- 无要求
    </lark-td>
    <lark-td>
      单次单Camera处理<800ms
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="3" cols="3" column-widths="353,314,291">

  <lark-tr>
    <lark-td>
      **输入Camera图像样例** {align="center"}
    </lark-td>
    <lark-td>
      **产品目标输出**
    </lark-td>
    <lark-td>
      **评价标准**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="ASJJb3rqfoYBJnxs8cHcdHrVnUe" width="1308" height="908" align="center"/>
    </lark-td>
    <lark-td>
      大件物品-否-否
    </lark-td>
    <lark-td rowspan="2">
      标签输出：
      三个字段分别评分，每个字段只有0分和1分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="B6qibVzdZorhsOxHmsNcFgd3nUl" width="1450" height="882" align="center"/>
    </lark-td>
    <lark-td>
      大件物品-否-是
    </lark-td>
  </lark-tr>
</lark-table>

## 停车寻车 <text color="red">+ 缴费（已导入）（有部分基模cover）</text>

### 业务流程

前序依赖：需要有触发信号，识别进入停车场和驶离停车场

进入停车场 开启 

<whiteboard token="KzMMwVQNzhGqeWbzbegcSGHqn6d"/>

<whiteboard token="P8fOwDwj3hyDCQbfQ2wcrZGqnYf"/>

### 采集目标摄像头及示例

<lark-table rows="4" cols="4" column-widths="149,159,137,304">

  <lark-tr>
    <lark-td colspan="3">
      <text color="red">停车寻车</text>目标摄像头（以下同时采集） {align="center"}
    </lark-td>
    <lark-td rowspan="2">
      样张
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_F3
    </lark-td>
    <lark-td>
      前120度周视
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
    <lark-td>
      <image token="MlhhbASpDoRxdDxi4q3ckUHnntm" width="848" height="478" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      非摄像头
      <text color="red">（待系统打通后采集）</text>
    </lark-td>
    <lark-td>
      透明底盘鸟瞰俯视图
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
    <lark-td>
      <image token="NCNRbqnDvo4wGYx3F3pcQfBynDh" width="652" height="482" align="center"/>
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="5" cols="4" column-widths="149,159,137,304">

  <lark-tr>
    <lark-td colspan="3">
      <text color="red">缴费</text>目标摄像头（以下同时采集） {align="center"}
    </lark-td>
    <lark-td rowspan="2">
      样张
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_FLS
    </lark-td>
    <lark-td>
      左前周视
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      <image token="UxCbbdxEqosaMkxhkxbcXRPYnTg" width="874" height="486" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_FRS
    </lark-td>
    <lark-td>
      右前周视
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      <image token="Ejm6bpHDZoLJX1xJxmycQnUwnMh" width="868" height="484" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_F3
    </lark-td>
    <lark-td>
      前120度周视
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      <image token="JAUzbflAboUlU3xCSBXctUQpn3d" width="848" height="478" align="center"/>
    </lark-td>
  </lark-tr>
</lark-table>

### 功能列表

<lark-table rows="8" cols="3" column-widths="220,388,147">

  <lark-tr>
    <lark-td>
      **需求名称** {align="center"}
    </lark-td>
    <lark-td>
      **详细需求** {align="center"}
    </lark-td>
    <lark-td>
      **信息类型**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别停车场闸机抬杆<text color="red">（待导入）</text> {align="center"}
    </lark-td>
    <lark-td>
      快速识别停车场门口闸机抬杆，作为整体功能的 trigger
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      提供停车详细位置信息 {align="center"}
    </lark-td>
    <lark-td>
      - 准确的地理位置
    </lark-td>
    <lark-td>
      GPS信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 准确的楼号、楼层、区域信息
    </lark-td>
    <lark-td>
      VLM返回标签
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 准确的车位号（无，无法识别，具体车位号）
    </lark-td>
    <lark-td>
      VLM返回标签
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      提取缴费二维码信息 {align="center"}
    </lark-td>
    <lark-td>
      - 在车速 <=20Km/H 工况下（20Km/H待定，以实验为准）
			- 准确识别缴费二维码
			- 保存并在APP和车机中控大屏中投射缴费二维码
			- 二维码包含方形二维码，葵花码等常见二维码
    </lark-td>
    <lark-td>
      图片
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      提供停车相对参照物<text color="red">（基模）</text> {align="center"}
    </lark-td>
    <lark-td rowspan="2">
      - 可供找车的区域颜色、电梯口
			- 周边静态建筑
			- 最近的出入口或明显店铺
			- 显著的图案（包含涂鸦）或立柱
			- 不包含可移动的元素：车辆，购物车
    </lark-td>
    <lark-td rowspan="2">
      自然语言描述
    </lark-td>
  </lark-tr>
  <lark-tr>
  </lark-tr>
</lark-table>

#### 停车参照物

重点覆盖（评测范围）：

<sheet token="BtlCsKLkMhOMkGtIiVXcZqsVnAb_fuEWZW"/>

描述规则：全量描述，识别到的有效参照物均可参与描述

Prompt 待更新

#### 车位号

识别透明底盘鸟瞰俯视图中的车位号，透明底盘鸟瞰俯视图由上游业务提供，识别后的车位号会由下游业务推送给用户或者联动其他功能。

1. 输入的透明底盘鸟瞰俯视图分辨率一般不超过1920*1080
1. 输出的结果为：
	1. <text color="red">可以识别：输出“识别 or 推理结果”（包含可以清晰识别的结果，部分模糊但可以推理识别的结果）</text>
	1. <text color="red">画面过糊：输出“无法识别”（无任何有效信息可以识别，也无法进行推理）</text>
	1. <text color="red">画面清晰但无车位号：输出“无此类信息”（下游业务将不推送车位信息）</text>
1. 输出举例：

<lark-table rows="11" cols="4" column-widths="180,250,135,189">

  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      示例
    </lark-td>
    <lark-td>
      以下结果均可得分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      1. 首字母模糊
    </lark-td>
    <lark-td>
      首字母模糊且无法推理时：
      首字母可能会导致区域发生重大变化，对用户找车造成困扰，所以建议输出无法识别，或者用“？”替代首字母
    </lark-td>
    <lark-td>
      <image token="ObLXbf5AcoduQzxF0oBcA6NunAe" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      1. 无法识别
			1. ？007
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
    </lark-td>
    <lark-td>
      首字母模糊但可以推理时：
      进行推理输出
    </lark-td>
    <lark-td>
      <image token="BaMGbm1veoC3WixinnOcLnmlnjf" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      D096
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      2. 车位号模糊
    </lark-td>
    <lark-td rowspan="2">
      车位号模糊但可进行推理时（单一参考车位）：
      1. 进行推理输出
			1. 推理结果可以豁免至参考车位的左右1个位置
			1. 相邻车位均对用户找车有帮助。
    </lark-td>
    <lark-td>
      <image token="HTECbj59LoArKsxCPr5cx4mJnwx" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      1. 1896
			1. 1898
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="WArSbuo4zoFy2Dx9vM7cjoLSn0d" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      1. 169
			1. 167
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      车位号模糊但可进行推理时（双参考车位）：
      1. 进行推理输出
			1. 无豁免
    </lark-td>
    <lark-td>
      <image token="HPV0bczpmohh3QxlPbicGNIknhg" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      1699
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="MQvPbPZKsonptmxv8oQcgX7cn4a" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      249
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      3. 需要支持侧向车位号
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <image token="UiznbIcevohsVCxyyuncFg5vnLe" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      1237
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      4. 需要支持画面旋转
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      <image token="HPFmbuEN7oColixFTSTct1jCnIh" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      D484
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      5. 文字描述车位
    </lark-td>
    <lark-td>
      画面模糊时，可以输出关键性有效信息帮助用户定位车辆位置，例如示意图中，迪卡侬车位在商场中是一种聚焦且有标识性的车位，具体车位号无法识别时可以不显示，也可以显示为“  ？”
    </lark-td>
    <lark-td>
      <image token="Ony7bipAeo2wgtxnZffcJxbUndh" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      1. DECATHLON
			1. 迪卡侬
			1. DECATHLON迪卡侬 
			1. DECATHLON迪卡侬 ？
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      6. 跨车位停放
    </lark-td>
    <lark-td>
      跨停车位停放，输出占据面积较大的车位号，跨域比例接近1:1时，输出二者任一都可以得分
    </lark-td>
    <lark-td>
      <image token="FCTQbTRrnoxvsnxvIwvcAhxvnCh" width="720" height="1000" align="center"/>
    </lark-td>
    <lark-td>
      E-470
    </lark-td>
  </lark-tr>
</lark-table>


```markdown {wrap}
下面是固定在汽车车身上的摄像头拍摄的连续多张图片，请你完成以下任务:
##任务
请聚焦墙壁、立柱和吊牌，尽力辨认出当前汽车行驶所在的楼层与区域。
* 楼层标识一般为B1、-2F、F3、地下1层等样式；
* 区域标识可以由单个字母、单个数字、字母加数字的组合、汉字与字母、汉字与数字组合、或者其他汉字名称构成（例如A、B1、C、长颈鹿、西瓜、D区等）。也可以由多级区域从大到小组合，例如P2-E1表示P2停车场的E1区域、H-3表示H区的3号立柱等，请根据具体场景进行判断。
#注意：
1. 若楼层或区域标识旁边有左转/右转/直走的方向指示箭头,一般来说不属于当前车辆所在的区域。
2. 我会在user prompt中提供给你上一小段视频中识别出来的结果，你可以进行参考。无论上一小段是否有识别出来有效信息，只要当前视频帧片段无法识别到有效楼层或区域信息，只能输出未知。
3. 若图中同时出现多个同级区域信息（例如同时存在A1 A2 A3），只需要输出距离本车最近的一个区域信息。
4. 如果单个字母或数字出现在柱子上，应优先认为是区域标识，例如B认定为是B区域而不是地下层，1认定为是1区域而不是1楼；字母F/G出现在柱子上，则可认定为F/G区域，而不是Floor或Ground的缩写，以此类推。
5. 如果柱子上同时出现两个标识，其中一个符合楼层标识特征，则优先认为是楼层标识，另一个则为区域标识；若均不符合楼层标识，一般可认为是多级区域标识。
##输出
最终输出请严格按照"楼层-区域1-……"多段式格式对数据进行输出
任何一项无法确认均输出“未知”，禁止没有识别到有效信息，但随便输出结果
##输出示例
示例1，B2层C区：
B2-C
示例2，未知楼层D2区：
未知-D2
示例3，B2层H2区A11小区：
B2-H2-A11
```

```markdown {wrap}
您是汽车的停车场车位号识别专家，您需要基于提供的一张车辆在透明底盘状态的图片完成本车位的车位号识别。

##任务
1. 若当前车位信息存在，且可以看清，则车位上存在的车位编号信息都应当全部输出，若车位前方和后方信息是一样的则仅需输出一次。
2. 若当前车位信息存在，但较模糊，且左右两侧的车位信息清晰时，则应当结合两侧信息和当前车位信息，进行推理，将最合理最有可能的车位信息输出；
3. 若当前车位信息存在但较模糊，且左右两侧也无清晰信息时（例如两侧已经停放其他车辆遮挡了地面，或两侧为墙面无车位信息），则输出“未识别出车位信息”；例如
4. 若当前存在确有可能代表车位信息的文本内容，也应当全部输出。
5. 若当前车位无任何中文、英文、数字信息时，则输出“无车位号”。

##注意
1. 只输出当前透明底盘所在车位的信息，不要输出旁边车位的信息。
2. 除了车位信息，不要输出任何冗余信息。

输出示例：

示例1
输入图中本车位号清晰，则应该输出：
D-198

示例2
输入图中本车位号模糊，但通过左侧车位“10”和右侧车位“8”可推测出本车位是“9”，则应该输出：
9

示例3
本车位模糊，且右侧是墙壁，左侧也无法识别车位信息，则应该输出：
未识别出车位信息

示例4
本车位没有任何信息，则应该输出
无车位号
```


### 采集配比

<mention-doc token="H1DlwiKmKiNbinkVHtncN9HXnBh" type="wiki">数据采集脚本（生产条件）</mention-doc>

<mention-doc token="LiD4wdqyniBmTlkpMlDcKXnFnOf" type="wiki">透明底盘数据采集需求</mention-doc>

### 推理关联Camera及输入分辨率

输入

<lark-table rows="4" cols="7" column-widths="100,243,144,144,168,181,162">

  <lark-tr>
    <lark-td>
      任务类型
    </lark-td>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      建议帧率 fps
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      停车寻车
    </lark-td>
    <lark-td>
      前120度周视
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
    <lark-td rowspan="3">
      算法可以根据效果和性能进行动态调整
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      透明底盘鸟瞰俯视图（非摄像头）
    </lark-td>
    <lark-td>
      0
    </lark-td>
    <lark-td>
      0
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      缴费二维码
    </lark-td>
    <lark-td>
      左前周视
      右前周视
      前120度周视
    </lark-td>
    <lark-td>
      3
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
  </lark-tr>
</lark-table>

<text color="red">输出</text>

<grid cols="2">

  <column width="54">

    <lark-table rows="5" cols="3" column-widths="100,100,224">

      <lark-tr>
        <lark-td>
          <text color="red">任务</text>
        </lark-td>
        <lark-td>
          <text color="red">识别目标</text>
        </lark-td>
        <lark-td>
          <text color="red">输出</text>
        </lark-td>
      </lark-tr>
      <lark-tr>
        <lark-td rowspan="4">
          <text color="red">停车寻车</text>
        </lark-td>
        <lark-td>
          <text color="red">楼层</text>
        </lark-td>
        <lark-td>
          1. <text color="red">可以识别：输出结果</text>
					1. <text color="red">无法识别</text>
					1. <text color="red">无此类信息</text>
        </lark-td>
      </lark-tr>
      <lark-tr>
        <lark-td>
          <text color="red">区域</text>
        </lark-td>
        <lark-td>
          1. <text color="red">可以识别：输出结果</text>
					1. <text color="red">无法识别</text>
					1. <text color="red">无此类信息</text>
        </lark-td>
      </lark-tr>
      <lark-tr>
        <lark-td>
          <text color="red">车位号</text>
        </lark-td>
        <lark-td>
          1. <text color="red">可以识别：输出结果</text>
					1. <text color="red">无法识别</text>
					1. <text color="red">无此类信息</text>
        </lark-td>
      </lark-tr>
      <lark-tr>
        <lark-td>
          <text color="red">参照物</text>
        </lark-td>
        <lark-td>
          1. <text color="red">可以识别：输出结果</text>
					1. <text color="red">无此类信息</text>
        </lark-td>
      </lark-tr>
    </lark-table>

  </column>
  <column width="45">

    <lark-table rows="2" cols="3" column-widths="100,100,224">

      <lark-tr>
        <lark-td>
          <text color="red">任务</text>
        </lark-td>
        <lark-td>
          <text color="red">识别目标</text>
        </lark-td>
        <lark-td>
          <text color="red">输出</text>
        </lark-td>
      </lark-tr>
      <lark-tr>
        <lark-td>
          <text color="red">缴费二维码</text>
        </lark-td>
        <lark-td>
          <text color="red">缴费二维码</text>
        </lark-td>
        <lark-td>
          1. <text color="red">可以识别：输出结果</text>
					1. <text color="red">无法识别</text>
					1. <text color="red">无此类信息</text>
        </lark-td>
      </lark-tr>
    </lark-table>

  </column>

</grid>

### 任务测评指标（待数据采集完成）

<lark-table rows="2" cols="3" column-widths="144,474,230">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      停车寻车 + 缴费
    </lark-td>
    <lark-td>
      - 室外白天
				- Pre 95%;
				- Recall 95%
			- 室外黑天有路灯，停车场（楼）灯光较亮，停车场（楼）灯光较暗
				- Pre 90%;
				- Recall 88%
			- 无威胁事件，黑暗不可见场景
				- 无要求
    </lark-td>
    <lark-td>
      单次单Camera处理<500ms
      二维码截图去畸变输出 <1000ms
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="3" cols="6" column-widths="131,66,100,100,100,100">

  <lark-tr>
    <lark-td colspan="2">
      Corner Case
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="JYkrb2tRGoyrl0xr3EucdW17nle" width="1920" height="1080" align="center"/>
    </lark-td>
    <lark-td>
      <image token="MVdRblRXyoM3Wkxi9IIcOPIInHd" width="546" height="758" align="center"/>
    </lark-td>
    <lark-td>
      <image token="RGbAbZfiQoP7NPxcJ1wc0ro0njh" width="720" height="1000" align="center"/>
    </lark-td>
    <lark-td>
      <image token="DzUwb7MCNo6YevxAY1wcPupqnbb" width="1157" height="824" align="center"/>
    </lark-td>
    <lark-td>
      <image token="JeZobzps6obDCOxr6eocBANGnff" width="1141" height="808" align="center"/>
    </lark-td>
    <lark-td>
      <image token="LbunbOIlrofWBux2WtJcvISLnpg" width="545" height="445" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      输出AB都对
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
      E-470
    </lark-td>
    <lark-td>
      未知-土-F （地面信息清晰的可参考）
    </lark-td>
    <lark-td>
      未知-土SOIL （中英文如实输出）
    </lark-td>
    <lark-td>
      未知-水WATER-088-090 （如实输出，数字应该是车位号范围）
    </lark-td>
  </lark-tr>
</lark-table>

## 舱外元素识别：充电桩、室内外<text color="red">（基模）</text>

### 业务流程

<whiteboard token="DC7Rw3iWPheHPzbIPOFc2B1Dnlh"/>

<whiteboard token="MpJ1wfXLchpN2Vb1MwGcAjw5nqh" width="807" height="423"/>

### 采集目标摄像头及示例

<lark-table rows="4" cols="5" column-widths="149,137,369,170,202">

  <lark-tr>
    <lark-td colspan="3">
      目标摄像头 {align="center"}
    </lark-td>
    <lark-td colspan="2">
      样张 {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      摄像头分辨率
    </lark-td>
    <lark-td>
      参考样张
    </lark-td>
    <lark-td>
      摄像头位置
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_R
    </lark-td>
    <lark-td>
      环视后
    </lark-td>
    <lark-td>
      1920x1080
      （输入模型的图片会被压缩，压缩后的分辨率为720P）
    </lark-td>
    <lark-td>
      <image token="X23ybL3MNocmzMxu4hbcsG9InGh" width="801" height="588" align="center"/>
    </lark-td>
    <lark-td>
      <image token="HhGYb42r0oxGexxG5zPcUuf4nqf" width="2242" height="1096" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_F3
    </lark-td>
    <lark-td>
      前120度周视
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="Dwzrb1zPIovyjrxKomucHED2nPb" width="1280" height="778" align="center"/>
    </lark-td>
    <lark-td>
      <image token="GRroblvYlowiD7x3T1acAia8nWb" width="2024" height="1142" align="center"/>
    </lark-td>
  </lark-tr>
</lark-table>

<mention-doc token="VnoNwux1IiSNqWkAL4tcUDZynQx" type="wiki">充电桩 （后环视，后周视）试采数据</mention-doc>

### 功能需求

<lark-table rows="3" cols="4" column-widths="100,203,273,154">

  <lark-tr>
    <lark-td>
      触发档位
    </lark-td>
    <lark-td>
      输入
    </lark-td>
    <lark-td>
      判断
    </lark-td>
    <lark-td>
      输出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="2">
      P档任务
    </lark-td>
    <lark-td>
      单帧后环视图 1280*720
    </lark-td>
    <lark-td>
      识别当前停车位是否有可使用的充电桩
    </lark-td>
    <lark-td>
      有，无
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      单帧前120度周视
    </lark-td>
    <lark-td>
      当前是否为室外停车环境
    </lark-td>
    <lark-td>
      是，否
    </lark-td>
  </lark-tr>
</lark-table>

Prompt 参考（室内外+充电桩合并，暂不激活，当前按照两个任务分别测试，后续合并）
```sql {wrap}
Role
你是一个车载视觉感知指令遵循模型，专门分析输入的图片，并严格按照标准输出对应的视觉标签。

Core Rule: Strict Constraint
仅当画面特征完全符合判定标准时，才输出对应标签；若不符合或属于拦截类型，对应字段必须输出 null。
只能从给定的【允许词集】中选择输出内容，严禁自创词汇。
严禁在输出中包含任何推理过程、解释说明或多余的前导词。

Field Definitions & Decision Standards
1. 车辆所处环境判断 (environment_judgment)
允许词集：["室内", "室外", "无法确定"]
判定标准：
室内（满足其一即可）：顶部可见人工天花板、密集的管道、消防喷淋头、室内照明灯具、低矮的梁柱；地面有环氧地坪漆（通常反光且有颜色）、明确画线的地下车位、写有“出口/入口”的地面标线；周边有密集的承重柱、编号柱、收费道闸、室内指示牌（如：A区、B区）。
室外（满足其一即可）：顶部可见自然天空（无论晴天、阴天或夜间）、云朵、太阳、露天路灯；地面为标准的沥青路面、水泥公路、马路两边的道牙（路缘石）、露天标志线；周边有自然植被（树木、草丛）、远处的建筑物外墙、行人、非结构化的自然街景。
典型误判拦截：
坡道边界拦截：如果图片处于地下车库出入口的坡道上（能看到部分天空但身处通道内），请统一归类为 "室内"。
视线受阻拦截：如果由于光线极暗、严重遮挡或大雾导致完全无法分辨，请统一归类为 "无法确定"。

2. 充电桩识别 (charging_pile)
允许词集：["有", "无"]
关注焦点：判断当前目标停车位是否存在可使用的充电桩。
空间范围约束（满足其一即可）：
支持检测本车位正后方的充电桩。
支持检测两个车位之间（车位分界线/间隙处）、供本车位使用的充电桩。
典型误判拦截：
空间范围拦截：严格忽略与本车位无关的、更远处的或其他相邻车位的充电桩。若画面完全不属于本车位充电桩检测范围，对应字段必须输出无。

Output Format
请直接输出严格的 JSON 格式，不要使用 Markdown 代码块（json ），不要输出任何其他文本。
定义：
{"环境判断": ["室内", "室外"，"无法判断"], "充电桩": ["有", "无"]}
示例 1（地下车库车位内且有充电桩）：
{"环境判断": "室内", "充电桩": "有"}
示例 2（非车位场景的正常室外街景）：
{"环境判断": "室外", "充电桩": "无"}
```


### 室内外

<lark-table rows="5" cols="3" column-widths="121,354,918">

  <lark-tr>
    <lark-td>
      分类
    </lark-td>
    <lark-td>
      定义
    </lark-td>
    <lark-td>
      正例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      室内
    </lark-td>
    <lark-td>
      1. 特征：有完整顶棚，四周有墙体或结构围合，主要为人工照明，不直接暴露于自然环境
			1. 正例：地下停车场，室内封闭停车楼，隧道不可见出口段
			1. 负例：路面停车位，桥下空间，雨棚停车位，隧道可见出口段
    </lark-td>
    <lark-td>
      <grid cols="3">
        <column width="33">
          <image token="PQSfbFgjDoydJ4xqFuDcbLf5n0f" width="762" height="456" align="center"/>
        </column>
        <column width="33">
          <image token="OADSbCFdgove7JxLHwkc7nDqnXd" width="762" height="456" align="center"/>
        </column>
        <column width="33">
          <image token="KyWmb4EM4oIjD3xwWTycjkKlnwc" width="762" height="456" align="center"/>
        </column>
      </grid>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      室外
    </lark-td>
    <lark-td>
      1. 特征：可见天空，无顶部结构遮挡，自然光照（太阳光直射），空间完全开放，属于道路或广场环境
			1. 正例：路边停车位，地面露天停车场，小区室外车位，露天道路
			1. 负例：地库/室内停车场，桥下，雨棚停车位，隧道
    </lark-td>
    <lark-td>
      <grid cols="4">
        <column width="23">
          <image token="SvkWba01boE8hvxIwtZcakoPnoc" width="762" height="456" align="center"/>
        </column>
        <column width="25">
          <image token="E59pbBVvPosxrGxW2dCcItIvnAe" width="1920" height="1080"/>
        </column>
        <column width="25">
          <image token="OAKLbkq0poZ22PxZIiGcRGl0nUg" width="1920" height="1080"/>
        </column>
        <column width="25">
          <image token="SgupbxTF0o4ufixfIpkc0FAknce" width="1920" height="1080"/>
        </column>
      </grid>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      半露天遮挡室外
    </lark-td>
    <lark-td>
      1. 特征：有顶部遮挡但不封闭，侧向开放，可见天空但被部分遮挡
			1. 正例：立交桥下 / 高架桥下，雨棚停车位，商场外连廊下，开放式遮蔽停车区 ，可见出口的隧道段，可见出口的地库段
			1. 负例：地下停车场，完全露天道路，完全封闭隧道
    </lark-td>
    <lark-td>
      <grid cols="3">
        <column width="34">
          <image token="MsWCbOsELoLDzlxil45cngMLnSg" width="1920" height="1080"/>
        </column>
        <column width="31">
          <image token="Bas9bX5o5oIlxIxnyOpcoRKbnFc" width="762" height="456" align="center"/>
        </column>
        <column width="34">
          <image token="NnMMb1heiolonvx1pOscCuidntg" width="1920" height="1080"/>
        </column>
      </grid>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      豁免项
    </lark-td>
    <lark-td>
      1. 车辆位于地库出入口、高架桥洞下，且上方结构在画面中被截断（看不见顶部天空）时，一律统一归为【半露天遮挡室外】
    </lark-td>
    <lark-td>
      <grid cols="3">
        <column width="33">
          <image token="BcHnbKX9Dogk9FxY568cc7lHnAh" width="1920" height="1080" align="center"/>
        </column>
        <column width="33">
          <image token="ZhK7biloWouK5vxKHeZcpxSBnvf" width="1920" height="1080"/>
        </column>
        <column width="33">
          <image token="QbKrb64fQofibexQ0ijc9NBRnod" width="1280" height="720"/>
        </column>
      </grid>
    </lark-td>
  </lark-tr>
</lark-table>

```markdown {wrap}
# 角色
你是一个智能座舱 AI 助手，专门负责通过分析车辆前广角周视相机拍摄的图片，精准且快速地判断车辆当前所处的空间环境。

# 任务
分析用户提供的车辆前广角周视图片，严格根据以下定义、特征及豁免规则进行判断。你不需要输出任何分析过程或原因，只能直接输出最终的分类结论。

# 定义与规则

## 1. 室内
- 特征：有完整顶棚，四周有墙体或结构围合，主要为人工照明，不直接暴露于自然环境。
- 正例：地下停车场、室内封闭停车楼、隧道不可见出口段。
- 负例：路面停车位、桥下空间、雨棚停车位、隧道可见出口段。

## 2. 室外
- 特征：可见天空，无顶部结构遮挡，自然光照（太阳光直射），空间完全开放，属于道路或广场环境。
- 正例：路边停车位、地面露天停车场、小区室外车位、露天道路。
- 负例：地库/室内停车场、桥下、雨棚停车位、隧道。

## 3. 半露天遮挡室外
- 特征：有顶部遮挡但不封闭，侧向开放，可见天空但被部分遮挡。
- 正例：立交桥下/高架桥下、雨棚停车位、商场外连廊下、开放式遮蔽停车区、可见出口的隧道段、可见出口的地库段。
- 负例：地下停车场、完全露天道路、完全封闭隧道。

## 4. 优先豁免情况
- 结构截断豁免：只要车辆位于【地库出入口】或【高架桥洞下】，且上方结构在画面中被截断（即在画面中看不见顶部天空），一律无条件统一归为【半露天遮挡室外】。
- 视线受阻豁免：当由于【光线太暗】、【雾霾太大】、【暴雨暴雪遮挡】或【镜头污损】等客观原因导致画面极度模糊、完全看不清周围环境时，一律统一归为【无法识别】。

# 输出格式规范

## [输出格式]
请直接输出一个标准的 JSON 对象，JSON 必须严格符合以下结构，其中键值必须且只能是“室内”、“室外”、“半露天遮挡室外”、“无法识别”中的一个：
{
  "外界环境": "字符串"
}

## [输出示例]

### 示例 1
{
  "外界环境": "半露天遮挡室外"
}

### 示例 2
{
  "外界环境": "室内"
}

### 示例 3
{
  "外界环境": "室外"
}

### 示例 4
{
  "外界环境": "无法识别"
}

```


### 可使用充电桩详细描述
```markdown {wrap}

# 角色
你是一个高精度的车载视觉感知专家，负责对单帧图像进行特征提取，输出必须高度准确且符合业务逻辑。

# 核心策略：无则静默
核心规则：有则输出，无则保持静默。
你只能从给定的【输出集合】中选择。若图片不符合任何描述词，该字段严禁在输出结果中出现。

# 字段定义
字段名：“当前停车位是否有充电桩”
- 判断目标：判断当前目标停车位是否存在可使用的充电桩。
- 空间范围约束：   
    1. 支持检测本车位正后方的充电桩。   
    2. 支持检测两个车位之间（车位分界线/间隙处）、供本车位使用的充电桩。   
    3. 严格忽略与本车位无关的、更远处的或其他相邻车位的充电桩。
- 输出集合：[“有”, “无”]

# 输出格式
必须严格以 json 格式直接输出结果，禁止任何前导词（如“图片显示……”）或解释。

# 示例
示例一：当本车位正后方有一个完好的充电桩时：
{
  "当前停车位是否有充电桩": "有"
}

示例二：当本车位及分界线周围完全没有充电桩，或者充电桩属于隔壁车位时：
{
  "当前停车位是否有充电桩": "无"
}
```

采集和评测的识别目标为：公共充电桩（安装会相对规范一些）。用户倒车入库挂入P档后，调用<text color="red">后摄像头</text>识别本车位周边是否有充电桩，如果有，则会作为有效信息发送至云端，由云端advisor结合其他信号信息判断用户是否有充电意图，如果有，则主动询问用户开启充电口，否则静默。

需要检出的桩

1. 车位后方充电桩（包括慢充桩，快充桩）
	1. 停车位1：桩1
	1. 停车位2：桩2
	1. 停车位3：桩3

<grid cols="3">

  <column width="34">
    <image token="ZhWBbp5tJo8HVYxAknUcD4Xonrh" width="1436" height="774" align="center"/>

  </column>
  <column width="32">
    <image token="N6Acb76JdoSYY3xjKCachd5VnFH" width="1418" height="794" align="center"/>

  </column>
  <column width="32">
    <image token="UagJbqs9jo71FWxiXFfcQLEsn8d" width="1410" height="794" align="center"/>

  </column>

</grid>

1. 两车位之间充电桩（包括慢充桩，快充桩）
	1. 停车位4：<text color="red">桩4</text>
	1. 停车位5：<text color="red">桩4</text>
	1. 停车位6：<text color="red">桩5</text>
	1. 停车位7：<text color="red">桩</text><text color="red">5</text>

<grid cols="2">

  <column width="49">
    <image token="ESg7b0jCeogCVsxgVD6ciL4wnCd" width="1410" height="794" align="center"/>

  </column>
  <column width="50">
    <image token="JC4NbZrm4oEpb5x7oyXcUyTXn8d" width="1248" height="685" align="center"/>

  </column>

</grid>

<whiteboard token="VQLFwxFEIhZNv2bnVtxckzsAnXe"/>

<lark-table rows="2" cols="2" column-widths="182,614">

  <lark-tr>
    <lark-td>
      慢充桩
    </lark-td>
    <lark-td>
      <image token="H4qLb5eW7oKxcCxRF9BcGkhEnxe" width="1080" height="810" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      快充桩
    </lark-td>
    <lark-td>
      <grid cols="3">
        <column width="38">
          <image token="Q2V9b4psLoNpZ3xQmVdchWcPnxc" width="1600" height="1067" align="center"/>
        </column>
        <column width="26">
          <image token="IJRBbaxfjom6mCxBrBhcwSQenPh" width="750" height="750" align="center"/>
        </column>
        <column width="34">
          <image token="GU6lbMWwhov51Xx1Rh0cQb5Nnsb" width="1000" height="750" align="center"/>
        </column>
      </grid>
      <grid cols="3">
        <column width="37">
          <image token="B2AIbrbgzo0jEbxVQVKcYDNLnfd" width="865" height="540" align="center"/>
        </column>
        <column width="31">
          <image token="TsqrbZEEroNRo8x2EUfcSMbAnfg" width="801" height="588" align="center"/>
        </column>
        <column width="31">
          <image token="DyyBbiTJzoNwMAxje3ncOwULnBb" width="831" height="624" align="center"/>
        </column>
      </grid>
    </lark-td>
  </lark-tr>
</lark-table>

### 采集配比

<mention-doc token="H1DlwiKmKiNbinkVHtncN9HXnBh" type="wiki">数据采集条件</mention-doc>

### 任务测评指标（待数据采集完成）

<lark-table rows="2" cols="3" column-widths="144,474,462">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      充电桩识别
    </lark-td>
    <lark-td>
      - 室外白天
				- Pre 95%;
				- Recall 95%
			- 室外黑天有路灯，停车场（楼）灯光较亮，停车场（楼）灯光较暗
				- Pre 90%;
				- Recall 88%
			- 黑暗不可见场景
				- 无要求
    </lark-td>
    <lark-td>
      1. 触发类任务
			1. 检测单张后环视图片，输入模型的分辨率为 720P
			1. 板载模型 E2E（获取图片后 To 输出Last Token）：800ms
    </lark-td>
  </lark-tr>
</lark-table>

---

## 上/下车安全（已导入）

### 业务流程

- 上车安全泊出

<whiteboard token="GbfrwQ6O1hazNxbjAj5cMuman4f"/>

- 下车安全提醒

<whiteboard token="QKYRweoQ3hHNIYb2wKAc9TsingO"/>

### 采集目标摄像头及示例

<lark-table rows="4" cols="4" column-widths="185,224,188,230">

  <lark-tr>
    <lark-td colspan="3">
      目标摄像头（以下同时采集） {align="center"}
    </lark-td>
    <lark-td rowspan="2">
      样张
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_LH
    </lark-td>
    <lark-td>
      环视左
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="XmYBbs78Kojwy4xiwVKccnNsnGV" width="651" height="435" align="center"/>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      HDAVMCamr_RH
    </lark-td>
    <lark-td>
      环视右
    </lark-td>
    <lark-td>
      1920x1080
    </lark-td>
    <lark-td>
      <image token="KafSbFfkQo10uSxxmnac7oqRn7c" width="656" height="410" align="center"/>
    </lark-td>
  </lark-tr>
</lark-table>

### 功能列表

<lark-table rows="7" cols="4" column-widths="228,210,100,315">

  <lark-tr>
    <lark-td rowspan="7">
      上车安全泊出/下车安全提醒
    </lark-td>
    <lark-td rowspan="6">
      识别妨碍上下车和开门的实体
    </lark-td>
    <lark-td>
      路面异常
    </lark-td>
    <lark-td>
      坑洼，积水，泥潭
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      路旁设施
    </lark-td>
    <lark-td>
      马路牙子，路灯柱，垃圾桶，广告牌、消防栓
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      路障设施
    </lark-td>
    <lark-td>
      护栏，雪糕筒，石墩
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      绿化植物
    </lark-td>
    <lark-td>
      灌木，树木
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      周边车辆
    </lark-td>
    <lark-td>
      汽车，自行车，电动车，三轮车，摩托车等
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      墙面立柱
    </lark-td>
    <lark-td>
      立柱，墙体
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      识别会被影响的成员位
    </lark-td>
    <lark-td colspan="2">
      主驾位、副驾位、左后位、右后位
    </lark-td>
  </lark-tr>
</lark-table>

```markdown {wrap}
你需要观察我提供给你的这张图片，识别车门外是否存在异常情况，包括异常路面和开门障碍两种。
图片是某车辆环视左或者环视右摄像头的画面，红色框代表了前车门开启的范围，黄色框代表了后车门开启的范围。
仅根据图片内容，按照如下的标签以及下方的输出格式要求进行输出。
异常情况的一级标签如下：
1. 异常路面：存在坑洼、积水、泥潭、马路牙子、花坛边缘石等影响用户落脚的情况。
2. 开门障碍：存在路灯柱、垃圾桶、广告牌、消防栓、护栏、雪糕筒、石墩、灌木花草、树木、汽车、自行车、电动车、三轮车、摩托车、立柱、墙体等影响用户打开车门的情况。
3. 开门障碍&异常路面：同时存在上述两种情况。
输出格式要求：
1. 你需要分别识别红框和黄框内是否存在异常情况，若仅有红框内存在异常情况，则方位只需输出前门，若仅有黄框内存在异常情况，则方位只输出后门，若两个框内均存在异常情况，则输出前后门。
2. 综合前后门出现的异常情况，选择最符合的一级标签。并将方位、一级标签、异常物的名称分别用【】括起来，中间用短横线连接进行输出，例如【前后门】-【开门障碍】-【电动车】。
3. 若图片中无任何异常情况，则仅输出“无影响”。
4. 除了以上要求内容外，不要输出任何冗余内容。
5. 若同时存在多种异常物，则每个异常物之间用、分隔。
输出示例：
示例1（前门存在影响用户落脚的泥潭）
输出：
【前门】-【异常路面】-【泥潭】
示例2（前后门均存在影响用户落脚和开门的积水和雪糕筒）
输出：
【前后门】-【开门障碍&异常路面】-【雪糕筒、积水】
示例3（前后门均不存在影响用户开门的异常情况）
输出：
无影响
```

### 评测采集配比（总计200题）

<mention-doc token="H1DlwiKmKiNbinkVHtncN9HXnBh" type="wiki">数据采集脚本（生产条件）</mention-doc>

### 推理关联Camera及输入输出

输入：

<lark-table rows="2" cols="7" column-widths="100,241,144,144,168,181,162">

  <lark-tr>
    <lark-td>
      任务类型
    </lark-td>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      建议帧率 fps
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      下车安全
    </lark-td>
    <lark-td>
      环视左 + 开门区域识别框
      （预置&前门红色、后门黄色）
      环视右 + 开门区域识别框
      （预置&前门红色、后门黄色）
    </lark-td>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
    <lark-td>
      算法可以根据效果和性能进行动态调整
    </lark-td>
  </lark-tr>
</lark-table>

输出：

<lark-table rows="5" cols="4" column-widths="96,155,193,401">

  <lark-tr>
    <lark-td>
      影响位置
      （封闭集）
      （一期）
    </lark-td>
    <lark-td>
      影响类型
      （封闭集）
      （一期）
    </lark-td>
    <lark-td>
      影响物
      （开放集）
      （二期）
    </lark-td>
    <lark-td>
      抽象规则
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      前门 or 
      后门 or 
      前后门
    </lark-td>
    <lark-td>
      异常路面
    </lark-td>
    <lark-td>
      Caption 输出影响物名
    </lark-td>
    <lark-td>
      影响用户下车落脚，比如：坑洼，积水，泥潭、马路牙子
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开门障碍
    </lark-td>
    <lark-td>
      Caption 输出影响物名
    </lark-td>
    <lark-td>
      影响用户开门的障碍物，比如：路灯柱，垃圾桶，广告牌、消防栓、护栏，雪糕筒，石墩、灌木，树木、汽车，自行车，电动车，三轮车，摩托车、立柱，墙体
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开门障碍&异常路面
    </lark-td>
    <lark-td>
      Caption 输出影响物名
      （先输出开门障碍物名，再输出异常路面物名）
    </lark-td>
    <lark-td>
      以上两者的交集
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      无影响
    </lark-td>
    <lark-td>
      无
    </lark-td>
    <lark-td>
      无影响用户开门和下车的物体
    </lark-td>
  </lark-tr>
</lark-table>

eg：

影响位置 + 影响类型 + caption 

【前门】+ 【异常路面】+【积水】

【后门】+ 【开门障碍&异常路面】+【垃圾桶、路牙子】

【前后门】+ 【开门障碍】+【立柱】

后续逻辑会根据输出内容进行生成提醒用户（端侧规则模板生成语音播报：右侧有垃圾桶，请小心开门）或者触发其他逻辑（上车泊出）

### 任务测评指标

<lark-table rows="2" cols="3" column-widths="144,474,230">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      下车安全
    </lark-td>
    <lark-td>
      - 室外白天
				- Pre 95%;
				- Recall 95%
			- 室外黑天有路灯，停车场（楼）灯光较亮，停车场（楼）灯光较暗
				- Pre 90%;
				- Recall 88%
			- 无威胁事件，黑暗不可见场景
				- 无要求
    </lark-td>
    <lark-td>
      单次单Camera处理<500ms
      左右两侧整体处理<1s
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="7" cols="3" column-widths="353,314,291">

  <lark-tr>
    <lark-td>
      **输入Camera图像样例** {align="center"}
    </lark-td>
    <lark-td>
      **产品目标输出**
    </lark-td>
    <lark-td>
      **评价标准**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 用户上下车区域无明显积水，支持稍许潮湿
      <image token="M4oobZqP6omi8BxJkmXcvuOdnTc" width="898" height="724" align="center"/>
    </lark-td>
    <lark-td>
      标签输出：“无影响”
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 用户上下车区域无明显积水，地面全部潮湿
      <image token="C5yJbMRh1oi11GxbuTccy4uEnyb" width="892" height="724" align="center"/>
    </lark-td>
    <lark-td>
      标签输出：“无影响”
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 用户上下车区域有明显积水
      <image token="N8sDbNQpdolLc5x0iQSc7WQ4ngh" width="900" height="730" align="center"/>
    </lark-td>
    <lark-td>
      标签输出：“右后-有积水泥泞路面”
    </lark-td>
    <lark-td rowspan="4">
      标签输出：需要输出完全正确，只有0分和1分
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      - 用户上下车区域有明显积水
      <image token="Qm3tb2COjodObIxAtrociBPqn8d" width="896" height="732" align="center"/>
    </lark-td>
    <lark-td>
      标签输出：“右后-有积水泥泞路面”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="Jyenbd5h4o7VJAxur3mcjajfnxh" width="1280" height="720" align="center"/>
    </lark-td>
    <lark-td>
      标签输出：
      “右前-不平整路面-灌木”
      “右后-不平整路面-灌木”
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      <image token="E9zZbRn3Rogduhxfs5ScW1XPnBc" width="1280" height="720" align="center"/>
    </lark-td>
    <lark-td>
      标签输出：
      “右前-无-立柱”
      “右后-无-立柱”
    </lark-td>
  </lark-tr>
</lark-table>

# 长时动态感知任务（未导入）

## 长时任务

### 业务流程

<whiteboard token="ZShZwmMN1h5r2sb5yz6c82GQnQb"/>

### 功能列表

<lark-table rows="7" cols="3" column-widths="181,217,495">

  <lark-tr>
    <lark-td>
      **一级功能** {align="center"}
    </lark-td>
    <lark-td>
      **二级功能** {align="center"}
    </lark-td>
    <lark-td>
      **任务示例** {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      舱内视觉感知相关
    </lark-td>
    <lark-td>
      情感陪伴类任务
    </lark-td>
    <lark-td>
      帮我照看一下后排小朋友
      看着后排宝宝的毯子，如果没盖好告诉我一下
      等下我女朋友上车，你要根据她的打扮，夸一夸她
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱内安全类任务
    </lark-td>
    <lark-td>
      如果驾驶员犯困了，就多陪他聊聊天
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      个性化提醒任务
    </lark-td>
    <lark-td>
      如果一会儿有女生上车，祝她女生节快乐
      如果看到车里有人抽烟，就diss他一下
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      舱外视觉感知相关
    </lark-td>
    <lark-td>
      便捷辅助类任务
    </lark-td>
    <lark-td>
      帮我留意一个靠电梯间近的停车位
      看看周围有没有万达影城的标识
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      行程陪伴类任务
    </lark-td>
    <lark-td>
      如果看到路边有小动物出现就拍张照片记录一下
      一会儿路过看到天安门的时候放一首我爱你中国
      我想兜兜风，路上要是路过有意思的地方，你给我介绍介绍
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      个性化提醒任务
    </lark-td>
    <lark-td>
      如果开始下雪了，提醒我下车的时候抬起来雨刷
      路上有进隧道的话，把远关灯关一下
    </lark-td>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="3" cols="6" column-widths="144,168,168,168,181,162">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      智驾前视广角/DVR
    </lark-td>
    <lark-td>
      水平FOV >=120°
    </lark-td>
    <lark-td>
      800w
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS
    </lark-td>
    <lark-td>
      水平FOV >=180°
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      TBD
    </lark-td>
    <lark-td>
      静态信息：单帧
      动态信息：多帧
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标（TBD待与云端打合）

- 端侧模型指标（非端到端功能指标）
	- 用户体验指标
		- **时机合理性**：1–5 分，评估提醒 / 交互是否在合适时机触发（如进隧道关远光灯、下雪提醒抬雨刷）。
		- **内容匹配度**：1–5 分，评估系统输出内容与用户指令 / 场景的匹配程度（如介绍路过的景点）。
		- **满意度评分**：1–5 分，用户对任务完成效果的整体评价。
	- 技术指标
		- **事件识别准确率**：准确率=总测试次数正确识别次数×100%例：后排儿童识别、驾驶员疲劳识别、路边小动物识别等。
		- **首响应延迟**：从视觉触发条件满足到系统首次输出响应 / 动作的时间（ms）。
		- **任务处理能力：**每秒可处理的视觉帧或任务数，衡量并发与吞吐能力。
		- **召回率**：召回率=实际存在的目标数识别到的目标数×100%例：停车位识别、万达影城标识识别等。

# VQA舱内问答任务（未导入）

## 舱内问答

### 业务流程

<whiteboard token="NhtfwoTqKhq4yxbgF5tcN6OvnMb" width="820" height="173"/>

### 功能列表

<lark-table rows="3" cols="5" header-row="true" column-widths="124,209,262,194,216">

  <lark-tr>
    <lark-td>
      场景
    </lark-td>
    <lark-td>
      句式主要构成
    </lark-td>
    <lark-td>
      示例Query
    </lark-td>
    <lark-td>
      提槽模型
    </lark-td>
    <lark-td>
      工程处理
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      人物相关问询
    </lark-td>
    <lark-td>
      【位置】+人状态/动作表情/性别/年龄/穿搭等
    </lark-td>
    <lark-td>
      你猜一下副驾的年龄是多少
      后排那个女生正在做什么
      评价一下我今天的打扮
    </lark-td>
    <lark-td>
      Camera=舱内
    </lark-td>
    <lark-td rowspan="2">
      均按时间戳获取用户提问时舱内OMS摄像头图像
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      物品相关问询
    </lark-td>
    <lark-td>
      车内+【物品】位置/状态
      <quote-container>
      为防止大量的误召，此类表达可以限定用户问的是“车内/车里”物品情况
      </quote-container>
    </lark-td>
    <lark-td>
      看看我的保温杯放在车哪里了
      我手机放在车后排了么
      看看我的包是不是放在后排座位了
    </lark-td>
    <lark-td>
      Camera=舱内
    </lark-td>
  </lark-tr>
</lark-table>

- VLM输入需求分类

<lark-table rows="8" cols="4" header-row="true" column-widths="124,100,290,347">

  <lark-tr>
    <lark-td>
      场景
    </lark-td>
    <lark-td>
      优先级
    </lark-td>
    <lark-td>
      询问信息分类
    </lark-td>
    <lark-td>
      示例Query
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      物品相关问询
    </lark-td>
    <lark-td rowspan="4">
      【P0】
    </lark-td>
    <lark-td>
      对于物品的【位置】进行询问
    </lark-td>
    <lark-td>
      具体位置查询：
      - 我手机放在车后排了么
			- 看看我的包是不是放在后排座位了
      泛化位置查询：
      - 看看我的保温杯放在车里哪里了
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      对于物品的【属性】进行询问
    </lark-td>
    <lark-td>
      颜色查询：
      - 后排我拿的外套是什么颜色的来着？
      品牌查询：
      - 看下这个水杯是什么牌子的？
      状态查询：
      - 后面的水杯带盖子了么？
			- 苹果没有从袋子里撒出来吧？
      数量查询：
      - 后排座子上有几瓶水？
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      对于物品的【存在】进行询问
    </lark-td>
    <lark-td>
      车里有没有红色的东西？
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      对于物品的【关系】进行询问
    </lark-td>
    <lark-td>
      毯子还在宝宝身上盖着么？
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="3">
      人物相关问询
    </lark-td>
    <lark-td rowspan="3">
      【P1】
    </lark-td>
    <lark-td>
      对于人员【基础信息】进行询问
    </lark-td>
    <lark-td>
      - 年龄
      你猜一下副驾的年龄是多少
      - 性别
      车里面有几个女生呀
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      对于人员【穿搭/外貌】进行询问
    </lark-td>
    <lark-td>
      评价一下我今天的打扮吧？
      我的新发型怎么样？
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      对于人员【状态/动作/神情】进行询问
    </lark-td>
    <lark-td>
      后排宝宝睡着了么？
      宝宝在玩儿手机么？
    </lark-td>
  </lark-tr>
</lark-table>

### 关联Camera及输入分辨率

<lark-table rows="3" cols="6" column-widths="185,168,168,168,181,162">

  <lark-tr>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      视角范围
    </lark-td>
    <lark-td>
      摄像头像素
    </lark-td>
    <lark-td>
      原始图像分辨率
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      任务所需帧率
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS（后视镜下方）
    </lark-td>
    <lark-td>
      水平FOV >=140°
    </lark-td>
    <lark-td>
      500w
    </lark-td>
    <lark-td>
      2592*1944
    </lark-td>
    <lark-td>
      720P-1080P
    </lark-td>
    <lark-td>
      单帧
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS（后排顶棚横梁）
    </lark-td>
    <lark-td>
      /
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

### 任务评测指标

<lark-table rows="6" cols="6" column-widths="95,171,350,109,394,339">

  <lark-tr>
    <lark-td>
      指标类型
    </lark-td>
    <lark-td>
      指标名称
    </lark-td>
    <lark-td>
      指标定义
    </lark-td>
    <lark-td>
      目标
    </lark-td>
    <lark-td>
      计算方法
    </lark-td>
    <lark-td>
      示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      主观指标
    </lark-td>
    <lark-td>
      端到端满足度
    </lark-td>
    <lark-td>
      指用户通过语音**交互发起**的需求从发出指令到最终**得到满足**的全过程中，用户对结果的整体满意程度，是衡量语音交互系统整体服务质量的综合性指标。
    </lark-td>
    <lark-td>
      90%
    </lark-td>
    <lark-td>
      满足（1分）：planner分发正确+提槽模型准确+介绍信息准确合理
      不满足（0分）：planner分发错误/提槽模型错误/介绍信息不准确合理
      <quote-container>
      因拍摄不清楚导致回答不知道（以人眼可见为准），可获得0.5分
      </quote-container>
      公式=满足得分/测试集数量
      <quote-container>
      测试集按照场景优先级准备（比例暂定）
      前车识别：LBS识别：通用识别：舱内识别=4:4:1:1
      </quote-container>
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td rowspan="4">
      客观指标
    </lark-td>
    <lark-td>
      planner准确率
    </lark-td>
    <lark-td>
      指用户发起以上视觉查询指令，planner正确判别属于VQA-Agent处理范围
    </lark-td>
    <lark-td>
      95%
    </lark-td>
    <lark-td>
      准确：planner分发准确
      不准确：planner分发错误
      <quote-container>
      如果context有足够信息，planner自行回答，也属于准确
      </quote-container>
    </lark-td>
    <lark-td>
      NA
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      提槽模型准确率
    </lark-td>
    <lark-td>
      指用户发起以上视觉查询指令，模型提槽正确判别属于哪类场景，并正确提出摄像头方位选择和识别对象
    </lark-td>
    <lark-td>
      95%
    </lark-td>
    <lark-td>
      准确：提槽模型结果准确
      不准确：提槽模型结果错误
    </lark-td>
    <lark-td>
      NA
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱内识别准确率
    </lark-td>
    <lark-td>
      指用户发起“后排小孩睡着了吗”等舱内人物或物品信息和状态查询时，系统识别出的信息与实际信息的一致程度，是衡量舱内识别功能精准性的核心指标。
    </lark-td>
    <lark-td>
      85%
    </lark-td>
    <lark-td>
      准确：人物/物品识别和描述准确 1分
      不准确：人物/物品识别或描述错误 0分 
      因看不到识别对象，回复看不清或看不到 0.5分
    </lark-td>
    <lark-td>
      **毯子还盖在宝宝身上么？（真实情况毯子盖在宝宝身上，宝宝在睡觉）**
      1分：还盖着呢没有掉，不要担心啦~
      0分：没有看到宝宝身上有毯子呢
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱内识别响应速度指标
    </lark-td>
    <lark-td>
      从用户完成语音指令输入（如停止说话）到系统返回首字结果的耗时。
    </lark-td>
    <lark-td>
      3s内
    </lark-td>
    <lark-td>
      根据端到端响应速度做耗时拆解
      端到端响应速度=planner耗时+Agent耗时（含端模处理时长）+端云上下行工程链路速度
      **VLM模型独立处理时间<1s**
    </lark-td>
    <lark-td>
    </lark-td>
  </lark-tr>
</lark-table>

- 样例

<lark-table rows="4" cols="5" column-widths="113,129,330,204,248">

  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
    <lark-td>
      输入图像
    </lark-td>
    <lark-td>
      用户Query
    </lark-td>
    <lark-td>
      预期回复
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS
    </lark-td>
    <lark-td>
      Unkonwn
    </lark-td>
    <lark-td>
      <image token="AqhEb5CaKoHGOyxf0vicutlLnuh" width="1280" height="720" align="center"/>
    </lark-td>
    <lark-td>
      副驾的上衣是什么品牌的呀？
    </lark-td>
    <lark-td>
      是阿迪达斯三叶草系列运动外套哦~
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS
    </lark-td>
    <lark-td>
      Unkonwn
    </lark-td>
    <lark-td>
      <image token="LxHUbOBvjo0R0AxHiilc7TH7nac" width="2940" height="1654" align="center"/>
    </lark-td>
    <lark-td>
      后排是不是还有一个话筒？
    </lark-td>
    <lark-td>
      是的在右后排的座位上呢
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      OMS
    </lark-td>
    <lark-td>
      Unkonwn
    </lark-td>
    <lark-td>
      <image token="QeGbbPyl9oAGiVxxPcwcpTVBnkb" width="2720" height="1602" align="center"/>
    </lark-td>
    <lark-td>
      豆包，看看哥哥是不是还在玩儿手机或者PAD？
    </lark-td>
    <lark-td>
      看不到手机或者PAD，但有光在哥哥脸上，看起来是在玩儿电子产品呢
    </lark-td>
  </lark-tr>
</lark-table>

# 智驾相关VLM任务（待评审）

### 业务流程

详细流程见<mention-doc token="HFQCdKoMUou0Pyx4YmNcbbxunIw" type="docx">【AICar主线】司机Agent（舱驾融合）产品需求文档PRD</mention-doc>

### 采集目标摄像头及示例

<lark-table rows="3" cols="6" column-widths="149,137,137,240,202,281">

  <lark-tr>
    <lark-td colspan="3">
      目标摄像头（以下同时采集） {align="center"}
    </lark-td>
    <lark-td colspan="3">
      样张 {align="center"}
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Camera
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      采集分辨率
    </lark-td>
    <lark-td>
      参考
    </lark-td>
    <lark-td>
      摄像头位置
    </lark-td>
    <lark-td>
      待判断
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      AVCamr_F3
    </lark-td>
    <lark-td>
      前120度周视
    </lark-td>
    <lark-td>
      3840x2160
    </lark-td>
    <lark-td>
      <text color="gray">**从目标肉眼不可见至超越过目标的视频段**</text>
      <mention-doc token="OGOfwNIQMiQx66kQ7i3cK3Evnvg" type="wiki">To元戎-人车参照物临停样张</mention-doc>
    </lark-td>
    <lark-td>
      <image token="Psdtbs3vFoqK3mx9wQ8cAzdonqf" width="2024" height="1142" align="center"/>
    </lark-td>
    <lark-td>
      是否需要智驾感知侧的数据，辅助做目标物距离判断
      - 如需要仅能通过智驾方获取数据
			- 如无需可从数据采集供应商处购买
    </lark-td>
  </lark-tr>
</lark-table>

<lark-table rows="2" cols="7" column-widths="100,241,144,144,168,181,162">

  <lark-tr>
    <lark-td>
      任务类型
    </lark-td>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      建议帧率 fps
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱驾融合
    </lark-td>
    <lark-td>
      前120度周视 <text color="red">3840x2160</text>
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
    <lark-td>
      算法可以根据效果和性能进行动态调整
    </lark-td>
  </lark-tr>
</lark-table>

### PE（参考）
```markdown {wrap}
# Role
你是一个具备超强泛化能力的视觉感知专家，负责处理车载前视图像。你的核心任务是根据用户询问的“目标物”信息，对图像中的目标进行识别并给目标物进行框选

# Task
请根据输入的"Target"目标特征信息，在输入的图像上寻找所有符合特征的目标，并输出对应目标在图像上的2D坐标值。

# 目标描述与框选目标匹配方式
不要局限于固定的关键词，请基于以下三个层级进行逻辑泛化：

## 1. 交通参与者 (Person & Crowd)
- 基本分类：单个人、特定职业服装的人、有携带物的人。
- 泛化属性指标：
    - 身份：根据制服、头盔、工具等推断职业（如：清洁工、建筑工、外卖骑手等）。
    - 着装：根据衣物的类型如短袖、长袖、羽绒服，衣物的颜色如粉红、深灰，衣物的图案条纹、格子等进行判断
    - 附件/携带物：识别其手持或随身物品（如：雨伞、行李箱、婴儿车、各种包装袋等）。
- 逻辑组合：支持[颜色+附件+身份]的任意组合。例如：“穿黄色背心的外卖员”、“拉红色行李箱的男人”。
- 注意：对于着装颜色与图案的描述可以有一定的泛化性理解，比如一个人穿了粉色和灰色结合的条纹衣服，描述为粉色衣服的人，灰色衣服的人，条纹衣服的人都需要进行匹配

## 2. 交通工具 (Vehicle)
- 基本分类：轿车、SUV、MPV、卡车、特种车辆（警/消/救）。
- 泛化属性指标：
    - 外观特征：颜色、车型、车身广告（如快递车、冷链车）。
    - 特殊用图：警车、消防车、大货车。
- 逻辑组合：支持[颜色+品牌+用图]的任意组合。例如：“白色顺丰货车”、“路边开着双闪的黑色SUV”。
注意：对于外观特征的描述可以有一定的泛化性理解，比如一辆底色为白色的车贴了有一定色彩的卡通车模，描述为白色的车也需要进行匹配

# 输出规范
1. 输出图像中所有符合条件的目标物的坐标：
    - 如仅有一个目标物，输出：<bbox>632 515 691 621</bbox>[514 501 543 537]
    - 如有多个目标物：输出<bbox>632 515 691 621</bbox>，<bbox>414 401 443 437</bbox>
2. 如没有任何符合表述的目标物，输出：无
3. 泛化策略：如果遇到上述外的新元素（如：自行车、三轮车），请根据最接近的物理逻辑分类进行识别。

# Input
- Image: [前视广角图像]
- Target: 背书包的男孩

```


### 目标识别功能列表及数据分布

<mention-doc token="GWVcwPevGiOjAfkOZwBcDsVan5g" type="wiki">智驾临停VLM数据分布</mention-doc>

<sheet token="BtlCsKLkMhOMkGtIiVXcZqsVnAb_rBoL95"/>

### 推理关联Camera及输入分辨率

<lark-table rows="2" cols="7" column-widths="100,241,144,144,168,181,162">

  <lark-tr>
    <lark-td>
      任务类型
    </lark-td>
    <lark-td>
      关联摄像头
    </lark-td>
    <lark-td>
      总相关Camera数量
    </lark-td>
    <lark-td>
      单次处理Camera
    </lark-td>
    <lark-td>
      建议帧率 fps
    </lark-td>
    <lark-td>
      输入模型图像分辨率
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱驾融合
    </lark-td>
    <lark-td>
      前120度周视 <text color="red">3840x2160</text>
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      1920*1080
    </lark-td>
    <lark-td>
      算法可以根据效果和性能进行动态调整
    </lark-td>
  </lark-tr>
</lark-table>

### 任务测评指标

<lark-table rows="2" cols="3" column-widths="144,474,230">

  <lark-tr>
    <lark-td>
      场景任务
    </lark-td>
    <lark-td>
      准召要求
    </lark-td>
    <lark-td>
      性能要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      舱驾融合
    </lark-td>
    <lark-td>
      - 室外白天F1：95%
			- 室外黑天有路灯，室内灯光较亮：90%
			- 黑暗不可见场景：不做要求
    </lark-td>
    <lark-td>
      单次请求处理<2.5s
    </lark-td>
  </lark-tr>
</lark-table>

# 屏幕识别VLM任务

- 待补充
