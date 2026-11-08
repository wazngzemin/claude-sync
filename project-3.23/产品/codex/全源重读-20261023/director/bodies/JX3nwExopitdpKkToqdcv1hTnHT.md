服务端技术方案【Context优化v1.0】
需求背景
需求简介


需求类型

产品需求

Meego链接

-

PRD链接

Context优化v1.0

PM

@吴仁杰

研发Owner

@刘杨

需求群

飞书20260428-103213.png

需求合作方


合作方

接口人

技术方案文档

算法

@李晨延

-

QA

@马绿坡

-
需求点提炼
支持 Context 生产逻辑中“端状态”和“世界信息”的生产优化


详细方案
功能设计
端状态自筛选

核心端状态知识梳理


vehicle_resource_params.skip_self_llm_filter 参数控制是否跳过端状态自筛选功能，用于实验。默认值 false

注入核心端状态

// 只获取定义的必需要返回的端状态
if val.FilterMode == signal_types.FilterModeReturnMinimumResult { // 有该参数时才会生效
    signalNoFilter, err := choose.GetSignalNoFilter(ctx, &val)
    if err != nil {
       log.AppLogger.Warn(ctx, "implement vehicle resource GetSignalNoFilter failed: %v", err)
       return
    }
    newSignalRes := make(signal_types.VehicleSignal, len(mustReturnSignalKeysWhenFirstFilter)) // 更改配置：https://bytedance.larkoffice.com/wiki/JPDow9KM5iuOLrkEclocenolnuh#share-A9RHd0DWYokkRwx4TlRcAZqTnNb
    for signalKey, signalInfo := range signalNoFilter {
       if mustReturnSignalKeysWhenFirstFilter[signalKey] {
          newSignalRes[signalKey] = signalInfo
       }
    }
    v.structData = newSignalRes
    return
}

端状态自筛选

端状态 source 实现 FilterByLLM 接口，其他 source 空实现
实现上把端状态自筛选和原有精筛逻辑做并行，merge 得到的结果，再执行 makeContextQueryResponseFromFilterResult

端状态自筛选 SP @李晨延
端状态筛选算法方案 

TODO


端状态自然语言拼接

func (v *VehicleResourceRetrieval) GetTextData(ctx context.Context) []string {
    if len(v.simulateText) > 0 {
       log.AppLogger.Info(ctx, "VehicleResourceRetrieval GetTextData with simulateText: %v", v.simulateText)
       return v.simulateText
    }

    result := make([]string, 0)
    textMap := make(map[string]string)
    for _, v1 := range toS2SSystemPromptSignalStr(ctx, v.structData) { // 按照新的拼接规则重新这里
       // 数据去重
       if _, ok := textMap[v1.TextData]; ok {
          continue
       }
       result = append(result, v1.TextData)
       textMap[v1.TextData] = v1.TextData
    }
    return result
}
需要确认以下字段在端状态表格的对应字段@吴仁杰
【极值描述】    ->
【安全值描述】->
【相关知识】    ->

世界信息
BasicInfoRetrievalParams.DealFunc 没有使用到，可以删除

func (b *BasicInfoRetrieval) RetrievalRawData(ctx context.Context, qp QueryParams) {
    now := time.Now()
    defer func() {
       b.timeCost = time.Since(now).Milliseconds()
    }()

    val, ok := qp.ContextCustomParams[ContextSourceTypeBasicInfo].(BasicInfoRetrievalParams)
    if !ok {
       log.AppLogger.Warn(ctx, "implement basic_info transfer params failed")
       return
    }
    resp, err := basic_info.NewBasicInfoService(ctx).GetWeatherInfo(ctx, &val.Request) // 按照新的规则修改
    if err != nil {
       log.AppLogger.Warn(ctx, "implement basic_info get info failed: %v", err)
       return
    }
    b.structData = gptr.Indirect(resp)
    if val.DealFunc == nil {
       respString, _ := config.Json.MarshalToString(resp)
       b.text = respString
       return
    }
    b.text = val.DealFunc(ctx, *resp)
}
工程实现上：
GetWeatherInfo 方法名改成 GetBasicInfo

当前使用的天气信息如下：
https://dev.qweather.com/docs/api/weather/weather-now/
image



头条热榜[P1]

节选头条热榜每个分类榜下的top3新闻标题，包括：地区榜、国际榜、科技榜、体育榜、财经榜、娱乐榜、汽车榜、教育榜、健康榜、军事榜、文旅榜、台海榜。
刷新频率：每5分钟
ToB侧已有函数`GetToutiaoBoardInfo`，需要单独写个接口暴露出来标题信息给 AI 汽车使用
直接调用头条接口


type BasicInfoResponse struct {
    LocationId  string       `thrift:"location_id,1" frugal:"1,default,string" json:"location_id,omitempty"`
    WeatherInfo *WeatherInfo `thrift:"weather_info,2" frugal:"2,default,WeatherInfo" json:"weather_info,omitempty"`
    DateInfo    *DateInfo    `thrift:"date_info,3" frugal:"3,default,DateInfo" json:"date_info,omitempty"`
    HotBoardInfo *[]HotBoardInfo    `thrift:"hot_board_info,3" frugal:"3,default,HotBoardInfo" json:"hot_board_info,omitempty"`
}

type HotBoardInfo struct {
    // 榜单类别
    CategoryName string `json:"category_name"`
    // 榜单标题
    Title string `json:"title"`
}

TODO
需要产品给出天气数据拼接的格式 @吴仁杰

上线方案
QA 测试
Code Review
Context 接口上线

开发估时和里程碑


工作项

估时(pd)

端状态自筛选

 1

端状态自然语言拼接修改

0.5

世界信息

0.5

头条热榜

1

评审记录
一审记录


