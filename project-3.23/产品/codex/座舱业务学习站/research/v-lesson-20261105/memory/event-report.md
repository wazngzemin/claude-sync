# 事件数据上报

# 业务背景

[事件日志产品需求文档 ](https://bytedance.larkoffice.com/docx/K2ridyWEloBHt8x6uFgcgoK5nZf)

**背景**：在AI汽车的架构中，对context的依赖非常高，因此我们需要客观、全面、真实地记录各类原始基础数据，为其他模块（记忆、always on等）提供原始素材，再加工成context，使得豆包可以更好地服务用户；



# 概要设计

## 上报接口

都是用现有的端状态数据上报接口来上报所有数据，复用端状态接口对每个数据的定义、校验、增量更新的逻辑；

## 数据定义

<table><tbody>
<tr>
<td>

数据类型

</td>
<td>

数据保存方式

</td>
<td>

下游依赖方

</td>
<td>

解释

</td>
</tr>
<tr>
<td>

端状态



</td>
<td>

1\.端状态最新数据

2\.历史上报数据

</td>
<td>

context、触发器、弋途

</td>
<td>

车辆的状态数据上报，如车内温度、每个座椅是否有人等；

</td>
</tr>
<tr>
<td>

事件

</td>
<td>

1\.历史上报数据

</td>
<td>

context、记忆



</td>
<td>

车辆行驶及停留过程中发生的各类事件，大部分由客户端感知到事件发生时上报，少量如人车对话、人人对话由云端上报；

</td>
</tr>
<tr>
<td>

vlm

</td>
<td>

1\.vlm最新数据

</td>
<td>

context、触发器

</td>
<td>

端模型输出的车内外描述信息

</td>
</tr>
<tr>
<td>

agent



</td>
<td>

1\.历史上报数据

</td>
<td>

context、guiAgent



</td>
<td>

agent执行过程中的事件记录，例如gui进展上报，用于advisor主动询问；

</td>
</tr>
</tbody></table>



事件：

[【客户反馈文档】车端信号分类](https://bytedance.larkoffice.com/sheets/NfiSsDMhEhJZBStkB0oc6eEInWh?sheet=brEt9x)

当前在用的仅人车闲聊、执行指令；之前定义有一部分~~端状态数据（拼接成事件日志）~~和自定义事件数据，目前没有用上；

人车闲聊：没有拒识的，非“执行指令”的

执行指令：

var ToolCode2Name = map\[string\]string\{

\&\#34;operate\_user\_memory\&\#34;: \&\#34;记忆生成\&\#34;,

\&\#34;face\_id\_register\&\#34;:    \&\#34;人脸ID注册\&\#34;,

\}



var AgentCode2Name = map\[string\]string\{

\&\#34;vehicle\_basic\_control\&\#34;:    \&\#34;基础车控\&\#34;,

\&\#34;search\_and\_control\_music\&\#34;: \&\#34;音乐搜索和播放\&\#34;,

\&\#34;search\_short\_video\&\#34;:       \&\#34;短视频搜索\&\#34;,

\}

四音区合并后，例如：主驾：上海天气怎么样？；副驾：北京呢？，怎么记录人车对话；

```JSON

"chitchat_001": {
    "name": "人车闲聊",
    "type": "event",
    "desc": "不涉及查询、执行类的人机对话",
    "args": {
        "content": {
            "name": "人车闲聊",
            "desc": "",
            "type": "str",
            "value_to_chinese_enum_map": {}
        },
        "position": {
            "name": "位置",
            "desc": "",
            "type": "enum",
            "value_to_chinese_enum_map": {
                "主驾": "主驾",
                "副驾": "副驾",
                "左后": "左后",
                "右后": "右后",
                "前排": "前排",
                "后排": "后排",
                "全车": "全车"
            }
        },
        "subject": {
            "name": "主体",
            "desc": "",
            "type": "enum",
            "value_to_chinese_enum_map": {
                "豆包": "豆包",
                "用户": "用户"
            }
        }
    },
    "level1": "人车交互事件",
    "level2": "人机对话",
    "level3": "人车闲聊",
    "level4": "人车闲聊",
    "primary_key": "position"
},
"chitchat_002": {
    "name": "执行指令",
    "type": "event",
    "desc": "涉及查询、执行类的人机对话",
    "args": {
        "content": {
            "name": "执行指令",
            "desc": "",
            "type": "str",
            "value_to_chinese_enum_map": {}
        },
        "position": {
            "name": "位置",
            "desc": "",
            "type": "enum",
            "value_to_chinese_enum_map": {
                "主驾": "主驾",
                "副驾": "副驾",
                "左后": "左后",
                "右后": "右后",
                "前排": "前排",
                "后排": "后排",
                "全车": "全车"
            }
        },
        "subject": {
            "name": "主体",
            "desc": "",
            "type": "enum",
            "value_to_chinese_enum_map": {
                "豆包": "豆包",
                "用户": "用户"
            }
        }
    },
    "level1": "人车交互事件",
    "level2": "人机对话",
    "level3": "执行指令",
    "level4": "执行指令",
    "primary_key": "position"
},
"conv_001": {
    "name": "人人对话",
    "type": "event",
    "desc": "记录在车上发生的人与人之间的对话及内容",
    "args": {
        "position": {
            "name": "位置",
            "desc": "",
            "type": "enum",
            "value_to_chinese_enum_map": {
                "主驾": "主驾",
                "副驾": "副驾",
                "左后": "左后",
                "右后": "右后",
                "前排": "前排",
                "后排": "后排",
                "全车": "全车"
            }
        },
        "content": {
            "name": "对话内容",
            "desc": "",
            "type": "str",
            "value_to_chinese_enum_map": {}
        }
    },
    "level1": "人际及人宠互动事件",
    "level2": "对话",
    "level3": "",
    "level4": "与人对话",
    "primary_key": "position"
}
```

vlm：

```JSON
"vlm_inside_001": {
       "name": "舱内视觉输出（登车问候场景）",
       "type": "scene",
       "desc": "",
       "args": {
           "content": {
               "name": "端侧模型的输出",
               "desc": "",
               "type": "str",
               "value_to_chinese_enum_map": {}
           }
       },
       "level1": "机器视觉事件",
       "level2": "持续视觉感知",
       "level3": "端侧持续视觉输出",
       "level4": "舱内视觉输出（登车问候场景）"
   },
"vlm_inside_002": {
       "name": "舱内视觉输出（驾乘安全场景）",
       "type": "scene",
       "desc": "",
       "args": {
           "content": {
               "name": "端侧模型的输出",
               "desc": "",
               "type": "str",
               "value_to_chinese_enum_map": {}
           }
       },
       "level1": "机器视觉事件",
       "level2": "持续视觉感知",
       "level3": "端侧持续视觉输出",
       "level4": "舱内视觉输出（驾乘安全场景）"
   },
"vlm_inside_003": {
       "name": "舱内视觉输出（舒适空间场景）",
       "type": "scene",
       "desc": "",
       "args": {
           "content": {
               "name": "端侧模型的输出",
               "desc": "",
               "type": "str",
               "value_to_chinese_enum_map": {}
           }
       },
       "level1": "机器视觉事件",
       "level2": "持续视觉感知",
       "level3": "端侧持续视觉输出",
       "level4": "舱内视觉输出（舒适空间场景）"
   },
"vlm_inside_004": {
       "name": "舱内视觉输出（温感调节场景）",
       "type": "scene",
       "desc": "",
       "args": {
           "content": {
               "name": "端侧模型的输出",
               "desc": "",
               "type": "str",
               "value_to_chinese_enum_map": {}
           }
       },
       "level1": "机器视觉事件",
       "level2": "持续视觉感知",
       "level3": "端侧持续视觉输出",
       "level4": "舱内视觉输出（温感调节场景）"
   },
"vlm_outside_001": {
       "name": "舱外视觉输出",
       "type": "scene",
       "desc": "",
       "args": {
           "content": {
               "name": "端侧模型的输出",
               "desc": "",
               "type": "str",
               "value_to_chinese_enum_map": {}
           }
       },
       "level1": "机器视觉事件",
       "level2": "持续视觉感知",
       "level3": "端侧持续视觉输出",
       "level4": "端侧持续舱外视觉输出"
   }
```

Agent:

```JSON
"agent_gui_0001": {
    "name": "GUI客户端推理步骤",
    "type": "agent",
    "desc": "GUI客户端当前具体执行的步骤，用于给context查询同步给主动服务，下发推荐操作给用户",
    "args": {
        "content": {
            "name": "思考过程",
            "desc": "",
            "type": "str",
            "value_to_chinese_enum_map": {}
        }
    },
    "level1": "人车交互事件",
    "level2": "Agent",
    "level3": "GUI",
    "level4": "客户端上报推理步骤"
}
```

端状态：

[【仅对内】「主线」场景感知状态信号库](https://bytedance.larkoffice.com/sheets/Pbw4sSfIRhhc2EthDUicfRr1nWb?sheet=75P8pj)


