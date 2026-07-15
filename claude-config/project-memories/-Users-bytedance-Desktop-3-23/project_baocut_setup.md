---
name: project_baocut_setup
description: BaoCut 字幕/剪辑 skill 装好但被 Metal4/macOS26 卡住无法运行；附本机 HF 下载唯一可行路 hf-mirror + CorpLink 限制
metadata: 
  node_type: memory
  type: project
  originSessionId: 10d30d82-10f8-4659-98cf-4e4a4cb7ea0b
---

2026-07-15 装 BaoCut(github.com/jimliu/baocut，控制 BaoCut Mac app 做转写/字幕/翻译/口播剪辑的 skill)。

**已全部就绪**：skill 软链在 `~/.claude/skills/baocut`(源 `~/.agents/skills/baocut-src`，git pull 更新)；`/Applications/BaoCut.app` 0.1.8；权限白名单加在 `~/.claude/settings.json`(`Bash(baocut:*)` 等)；yt-dlp 有；模型全装(qwen3-asr-0.6b/whisper-large-v3-turbo/speaker-diarization，`baocut --json model list` 全 true)。**这个 skill 不用 API key/登录——Claude Code 本身就是它的 LLM**(CLI 不调 LLM，靠 claim/submit worker 协议让我答题)。

**致命阻塞(未解决)**：BaoCut 0.1.8 打包的 `mlx.metallib` 用 **Metal 4 编译(需 macOS 26)**，但本机 M3 在 **macOS 15.7.5 上限 Metal 3**。app 声明 LSMinimumSystemVersion=15.0 却塞 Metal4 库=**它的打包 bug**。转写时报 `MLX error: Failed to load the default metallib. language version 4.0 not supported`。换 Whisper 也一样(MLX 启动即加载)。真解法只有三条：①等 BaoCut 出 Metal3 兼容 build(该报 bug)②升 macOS 到 26 ③换已在 macOS 26 的 Mac 跑(模型可拷)。
补丁尝试失败：想用 Python mlx 0.31.2 的 Metal3 metallib(`~/Library/Python/3.14/lib/python/site-packages/mlx/lib/mlx.metallib`)替换——/Applications 内改文件"Operation not permitted"，拷副本到 ~/Applications 改完**被 CorpLink EDR 秒删**。

**本机网络铁律(反复踩，务必记住)**：装了字节 **CorpLink 零信任(firewall/EDR/DLP 系统扩展)**，把所有出网流量限死 ~50KB/s 且频繁 SSL 重置，个人梯子(白云机场 TUN)抢不住路由。env 里 `http_proxy=https_proxy=all_proxy=http://127.0.0.1:7990`。**下 HuggingFace 大模型唯一可行路 = hf-mirror.com 走系统代理，实测 2.1MB/s**(`curl -sSL -C - https://hf-mirror.com/<repo>/resolve/<commit>/<file>`；huggingface.co 直连/--noproxy TUN 都卡死)。断点续传+sha256 校验必备。相关 [[project_video_panel]] 也踩过国内拉模型卡死。BaoCut 模型实际落地在 `~/Library/Application Support/BaoCut/models/models/aufklarer/<repo>/`(平铺文件+`.vk-complete` 标记)，非 `~/.cache/huggingface`。
