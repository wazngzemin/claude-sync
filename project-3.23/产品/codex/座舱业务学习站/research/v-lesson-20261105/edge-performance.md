# 端侧大模型性能评测

Qwen家族模型地址：https://huggingface\.co/collections/Qwen/qwen3\-67dd247413f0e2e4f653967f

环境配置信息

1. CPU: 高通8775上测试小模型

    1. NPU：72Tops

    2. 内存带宽：60GB/s

    <table><tbody>
    <tr>
    <td>

    大模型名称

    

    </td>
    <td>

    核心场景

    

    </td>
    <td>

    参数量

    </td>
    <td>

    量化

    </td>
    <td>

    输入token数量

    （平均）

    </td>
    <td>

    TPS

    

    </td>
    <td>

    TTFT

    

    </td>
    <td>

    内存带宽占用

    </td>
    </tr>
    <tr>
    <td>

    Qwen3\-0\.6B

    </td>
    <td>

    - LLM：语义拒识、意图理解、Functioncall解析

    </td>
    <td>

    0\.6B

    </td>
    <td>

    INT4

    

    </td>
    <td>

    100

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    </tr>
    <tr>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    50

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    </tr>
    <tr>
    <td>

    Qwen3\-1\.7B

    

    </td>
    <td>

    - LLM：语义拒识、意图理解、Functioncall解析

    </td>
    <td>

    1\.7B

    

    </td>
    <td>

    INT4

    

    </td>
    <td>

    100

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    </tr>
    <tr>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    50

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    </tr>
    <tr>
    <td>

    Qwen2\.5\-3B

    

    </td>
    <td>

    - LLM：语义拒识、意图理解、Functioncall解析

    </td>
    <td>

    3B

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    </tr>
    <tr>
    <td>

    Qwen2\.5\-VL\-2B

    </td>
    <td>

    - LLM：语义拒识、意图理解、Functioncall解析

    - VLM：指定场景理解，情绪、睡觉、儿童老人、手势等

    </td>
    <td>

    2B

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    <td>

    

    </td>
    </tr>
    <tr>
    <td>

    面壁1\.6B模型

    

    </td>
    <td>

    - LLM：语义拒识、意图理解、Functioncall解析

    - VLM：指定场景理解，情绪、睡觉、儿童老人、手势等

    </td>
    <td>

    1\.6B

    

    </td>
    <td>

    INT4

    

    </td>
    <td>

    852

    

    </td>
    <td>

    45

    

    </td>
    <td>

    752ms

    

    </td>
    <td>

    

    </td>
    </tr>
    </tbody></table>



2. AI Box上测试模型效果

    1. 型号：Orin\-Y

    2. 算力：200TOPS

    3. 内存带宽：205GB/s

<table><tbody>
<tr>
<td>

大模型名称

</td>
<td>

核心场景

</td>
<td>

参数量

</td>
<td>

量化

</td>
<td>

输入token数量

（平均）

</td>
<td>

TPS

</td>
<td>

TTFT

</td>
</tr>
<tr>
<td>

Qwen3\-14B

</td>
<td>



</td>
<td>

14B

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
<tr>
<td>

Qwen2\.5\-VL\-7B\-Instruct\-AWQ

</td>
<td>



</td>
<td>

7B

</td>
<td>



</td>
<td>



</td>
<td>



</td>
<td>



</td>
</tr>
</tbody></table>

3. 面壁参考信息



Android 系统型号 \+ android 服务接口。

工程视角是啥，模型的云端。

模型算法

有些算法工作不能外透。





下一步Demo计划：

- 火山汽车：准备数据、板子（8775、Orin y）、sample code

- 于超、Andy：准备模型、demo测试




