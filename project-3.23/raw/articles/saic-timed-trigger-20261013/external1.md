# 触发器 DSL 定义【对外】

<table><tbody>
<tr>
<td>

字段

</td>
<td>

使用方式

</td>
</tr>
<tr>
<td>

Condition

</td>
<td>

复用场景引擎定义

</td>
</tr>
<tr>
<td>

Action

</td>
<td>

复用场景引擎定义，后续按需增删

</td>
</tr>
</tbody></table>

```Go
type *Condition *struct {
    *ID         *int64                    `json:"id"`
    *Code       *string                   `json:"code"`        *// 英文标识*
*    Name       *string                   `json:"name"`        *// **名称*
*    Value      *Option                   `json:"value"`       *// 条件值*
*    Operator   *common.ConditionOperator `json:"operator"`    *// **条件操作符*
*    Logic      *common.ConditionLogic    `json:"logic"`       *// 条件运算符*
*    GroupIndex *int                      `json:"group_index"` *// 条件组号*
*    GroupLogic *common.ConditionLogic    `json:"group_logic"` *// 条件组运算符*
}

type *Option *struct {
    Type*  *string `json:"type"`  *// 值类型。string int float bool*
*    **Value** *string `json:"value"` *// 值数据*
}

type *Action *struct {
    *ID          *int64       `json:"id"`
    *Code        *string      `json:"code"`         *// 英文标识*
*    Name        *string      `json:"name"`         *// 名称*
*    Type        *string      `json:"type"`         *// 类型，预留*
    *Params**      *[]Param
*    ExecuteInfo *ExecuteInfo `json:"execute_info"` *// 执行信息*
}

type Param struct {
   *ID      *int64
   *Code    *string
   *Name    *string
   *Value   *Option
}

type *ExecuteInfo *struct {
    *RepeatNum      *int64         `json:"repeat_num"`      *// 上下电周期内执行总次数*
*    RepeatInterval *time.Duration `json:"repeat_interval"` *// 执行间隔，精度纳秒*
}
```


