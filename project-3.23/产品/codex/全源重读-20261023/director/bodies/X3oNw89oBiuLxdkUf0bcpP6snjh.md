# 天气卡片ui\-技术方案

# 需求

~~赛力斯~~

上汽

ui改动点：

增加发起query时刻的天气查询，展示当时温度和天气icon

发起query时，卡片中不同日期下展示的icon要随系统白天/黑夜模式切换

不同城市的展示以多张卡片展示

背景图\-固定

# 代码改动

### widget数据变更

```Go
type WeatherWidgetData struct {
        Items []WeatherCityItem `json:"items"`
}

type RealTimeWeather struct {
        Temp string `json:"temp"`
        Icon string `json:"icon"`
}

type WeatherCityItem struct {
        CityName          string          `json:"city_name"`           // 多城市分组展示
        WeatherInfos      []WeatherInfo   `json:"weather_infos"`       // 按天的预报列表
        RealTimeInfo      RealTimeWeather `json:"real_time_info"`      // 实时天气
        BackgroundPicCode string          `json:"background_pic_code"` // 背景图片code
}

type WeatherInfo struct {
        Date      string `json:"date"`       // YYYY年MM月DD日
        TextDay   string `json:"text_day"`   // 白天天气文本
        IconDay   string `json:"icon_day"`   // 白天图标 id
        TextNight string `json:"text_night"` // 夜间天气文本
        IconNight string `json:"icon_night"` // 夜间图标 id
        TempMax   string `json:"temp_max"`   // 最高温 tempMax
        TempMin   string `json:"temp_min"`   // 最低温 tempMin
}


```

### 更改tob天气插件

阅读方式：从左到右查看主链路，黄色分支表示配置开关，绿色路径表示成功返回，红色路径表示实时天气失败兜底。

**变更要点：**

- 新增 WeatherConfig\.EnableRealTimeWeather 配置，并在 saic\-dna 场景开启。

- WeatherParams 新增 EnableRealTimeWeather 字段，插件层向天气 provider 透传。

- HefengProvider 新增并发实时天气请求，并在 buildWeatherResponse 中统一汇总。

- Observation 支持新结构 WeatherInfoWithRealTime，summary 逻辑兼容新旧 Observation 格式。

- 新增 HefengCurrentWeatherKey 埋点，用于记录实时天气请求耗时。

### ~~迁移tob的天气提槽模型，aidv实现天气工具~~

### ~~agent注册变更 ~~

~~存在不同渠道不同天气工具~~

~~方案：数据库变更，原来对应渠道的天气工具实现信息修改~~

### ~~vehicle\_model\_aidv\_rpc服务，CurrentWeatherForecast变更，增加icon返回~~

```Thrift
~~type CurrentWeatherForecast struct {~~
~~    // 数据观测时间~~
~~    ObsTime string `thrift:"obsTime,1" frugal:"1,default,string" json:"obs_time,omitempty"`~~
~~    // 预报当天最高温度~~
~~    Temp string `thrift:"temp,2" frugal:"2,default,string" json:"temp,omitempty"`~~
~~    // 体感温度，默认单位：摄氏度~~
~~    FeelsLike string `thrift:"feelsLike,3" frugal:"3,default,string" json:"feels_like,omitempty"`~~
~~    // 天气状况的文字描述，包括阴晴雨雪等天气状态的描述~~
~~    Text string `thrift:"text,4" frugal:"4,default,string" json:"text,omitempty"`~~
~~    // 风向~~
~~    WindDir string `thrift:"windDir,5" frugal:"5,default,string" json:"wind_dir,omitempty"`~~
~~    // 风力等级~~
~~    WindScale string `thrift:"windScale,6" frugal:"6,default,string" json:"wind_scale,omitempty"`~~
~~    // 风速，公里/小时~~
~~    WindSpeed string `thrift:"windSpeed,7" frugal:"7,default,string" json:"wind_speed,omitempty"`~~
~~    // 相对湿度，百分比数值~~
~~    Humidity string `thrift:"humidity,8" frugal:"8,default,string" json:"humidity,omitempty"`~~
~~    // 当前小时累计降水量，默认单位：毫米~~
~~    Precip string `thrift:"precip,9" frugal:"9,default,string" json:"precip,omitempty"`~~
~~    // 云量，百分比数值~~
~~    Cloud string `thrift:"cloud,10" frugal:"10,default,string" json:"cloud,omitempty"`~~
~~    // 大气压强，默认单位：百帕~~
~~    Pressure string `thrift:"pressure,11" frugal:"11,default,string" json:"pressure,omitempty"`~~
~~    // 能见度，默认单位：公里~~
~~    Vis string `thrift:"vis,12" frugal:"12,default,string" json:"vis,omitempty"`~~
~~    // 天气状况的图标代码~~
~~   ~~~~ Icon string `thrift:"icon,3" frugal:"3,default,string" json:"icon,omitempty"`~~
~~}~~
```

### *~~WeatherType\_CurrentWithDaily ~~*~~增加对应能力实现~~

```Java
~~const (~~
~~    ~~*~~WeatherType_Default ~~*~~WeatherType = 0~~
~~    ~~*~~WeatherType_Current ~~*~~WeatherType = 1~~
~~    ~~*~~WeatherType_Hourly ~~*~~WeatherType = 2~~
~~    ~~*~~WeatherType_Daily ~~*~~WeatherType = 3~~
~~    // 当前实时天气 + 逐小时天气预报~~
~~    ~~*~~WeatherType_CurrentWithHourly ~~*~~WeatherType = 4~~
~~    // 当前实时天气 + 逐天天气预报~~
~~    ~~*~~WeatherType_CurrentWithDaily ~~*~~WeatherType = 5~~
~~    // 当前实时天气 + 未来24小时天气预报 + 未来3天天气预报~~
~~    ~~*~~WeatherType_CurrentWithAll ~~*~~WeatherType = 6~~
~~)~~
```

***~~应该还需要增加3天的空气质量和天气预警~~***

```Go
~~// GetWeatherInfo 获取城市天气信息~~
~~func (w *weatherService) GetWeatherInfo(ctx context.Context, req *basicinfoidl.BasicInfoRequest) (*basicinfoidl.BasicInfoResponse, error) {~~
~~    var (~~
~~       now  = time.Now().In(pkg_util.CnLocation)~~
~~       resp = &basicinfoidl.BasicInfoResponse{~~
~~          DateInfo: &basicinfoidl.DateInfo{~~
~~             Date:         now.Format(pkg_util.DateFormat),~~
~~             LunarDate:    pkg_util.GetLunarDateSting(now),~~
~~             LunarHoliday: pkg_util.GetLunarFestivals(now),~~
~~             SolarHoliday: pkg_util.GetSolarFestivals(now),~~
~~             SolarTerms:   pkg_util.GetSolarTerms(now),~~
~~             LunarWeekday: pkg_util.GetLunarWeekdayInChinese(now),~~
~~             SolarWeekday: pkg_util.GetSolarWeekday(now),~~
~~             LunarTime:    now.Format(pkg_util.TimeFormatCalendar),~~
~~             // SolarTime:    now.Format(pkg_util.TimeFormat), // 产品需求：删除时间~~
~~          },~~
~~          WeatherInfo: &basicinfoidl.WeatherInfo{},~~
~~       }~~
~~    )~~
~~    if req.GetLocationId() == "" && (req.GetLocationInfo().GetLatitude() == 0 && req.GetLocationInfo().GetLongitude() == 0) {~~
~~       log.AppLogger.Warn(ctx, "weatherService.GetWeatherInfo.params.err, only return date info")~~
~~       return resp, nil~~
~~    }~~

~~    cityInfo, err := w.getCityInfo(ctx, req)~~
~~    if err != nil {~~
~~       return nil, err~~
~~    }~~
~~    resp.WeatherInfo.CityInfo = cityInfo~~

~~    weatherConfig, err := tcc.GetWeatherConfig(ctx)~~
~~    if err != nil {~~
~~       return nil, err~~
~~    }~~

~~    // 后续都使用城市id, 容易命中缓存~~
~~    switch req.WeatherType {~~
~~    case basicinfoidl.~~*~~WeatherType_Current~~*~~:~~
~~       // 实时天气+实时空气质量+实时天气预警~~
~~       // ...~~
~~    case basicinfoidl.~~*~~WeatherType_Hourly~~*~~:~~
~~       hourlyWeatherForecast, err := w.getHourlyWeatherForecast(ctx, cityInfo.GetId(), weatherConfig)~~
~~       if err != nil {~~
~~          return nil, err~~
~~       }~~
~~       resp.WeatherInfo.HourlyWeatherForecast = hourlyWeatherForecast~~
~~    case basicinfoidl.~~*~~WeatherType_Daily~~*~~:~~
~~       dailyWeatherForecast, err := w.getDailyWeatherForecast(ctx, cityInfo.GetId(), weatherConfig, req.GetDailyWeatherType())~~
~~       if err != nil {~~
~~          return nil, err~~
~~       }~~
~~       resp.WeatherInfo.DailyWeatherForecast = dailyWeatherForecast~~
~~    ~~~~case basicinfoidl.~~*~~WeatherType_CurrentWithDaily~~*~~:~~
~~       // 实时天气+逐天天气预报~~
~~      ~~~~ currentWeatherWithDailyResult := w.getWeatherConcurrent(ctx, cityInfo.GetId(), weatherConfig, req.LocationInfo, req.GetDailyWeatherType(), weatherConcurrentSources{~~
~~          needCurrentWeatherForecast: true,~~
~~          needDailyWeatherForecast:   true,~~
~~       })~~
~~       if currentWeatherWithDailyResult.currentWeatherForecastErr != nil {~~
~~          return nil, currentWeatherWithDailyResult.currentWeatherForecastErr~~
~~       }~~
~~       if currentWeatherWithDailyResult.dailyWeatherForecastErr != nil {~~
~~          return nil, currentWeatherWithDailyResult.dailyWeatherForecastErr~~
~~       }~~
~~       resp.WeatherInfo.CurrentWeatherForecast = currentWeatherWithDailyResult.currentWeatherForecast~~
~~       resp.WeatherInfo.DailyWeatherForecast = currentWeatherWithDailyResult.dailyWeatherForecast~~
~~    case basicinfoidl.~~*~~WeatherType_CurrentWithAll~~*~~:~~
~~        // ...~~
```

# 天气图标\-确认项

[https://www.figma.com/design/Xy6kbNrlkJ1sAuL743a5Jn/%E5%A4%A9%E6%B0%94?node-id=1-737&t=AbCnD23vYwh2cf4t-0]()

[https://dev.qweather.com/docs/resource/icons/]()

###### 缺少icon:

###### 兜底icon




