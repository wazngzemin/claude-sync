---
name: project-video-panel
description: "User's video-translation web control panel — GitHub repo, how to run, architecture"
metadata: 
  node_type: memory
  type: project
  originSessionId: 68134f74-6485-415d-bd84-c3707961af88
---

用户把小虎视频翻译工具(`xiaohu-video-translate`)包了一个**本地网页控制面板**,方便可视化操作。

- **GitHub(public)**: https://github.com/wazngzemin/video-translate-panel (SSH 身份 `wazngzemin`)
- **本地目录**: `/Users/bytedance/Desktop/3.23/video-panel/`
- **启动(首选)**: 双击 `视频翻译面板.app`(后台拉起+开浏览器,无终端窗口);停止双击 `停止面板.app`。也可 `python3 panel.py` / `bash start.sh`。默认 http://127.0.0.1:8765
- **App 原理**: `.app/Contents/MacOS/run` 里 `nohup python3 panel.py &` 脱离会话;脚本内写死 PATH(含 /opt/homebrew/bin、~/.npm-global/bin)解决 Finder 启动找不到 yt-dlp/ffmpeg/claude
- **架构**: 下载/Whisper 转写/ffmpeg 烧录由面板直接跑;翻译润色和出 Markdown 调度 `claude -p`(用现有登录,无 API key)。支持 YouTube/抖音/本地视频,中文/双语字幕。
- **可移植**: 路径全相对自身,`scripts/` 已 vendored 原仓库脚本(MIT),clone 即用;`setup.sh` 装依赖(Apple Silicon→mlx-whisper,其它→faster-whisper)。
- **依赖**: yt-dlp, ffmpeg, mlx-whisper/faster-whisper, claude CLI(需登录)。用户机器是 Mac M3。

**踩过的坑(都已修复并入库)**:
1. **HF 模型卡死**: mlx 模型走 xethub CDN,国内卡死。修复=转写子进程加 `HF_HUB_DISABLE_XET=1`(走普通 HTTP)。
2. **brew/Trae 的 ffmpeg 都没 libass**,烧字幕报 `No option name near`。修复=仓库 `bin/ffmpeg` 用带 libass 的静态版(setup.sh 从 ffmpeg.martin-riedl.de 下),Mac 烧录用 `h264_videotoolbox` 硬件编码(~3.5x)。
3. **claude -p 一次性翻 1800+ 行会 socket closed**。修复=每 ~100 条分段+失败重试 4 次。
4. 烧录截帧验证常落在字幕空隙,要按 bi.ass 里真实 Dialogue 时间截帧。
5. 转写跑在 homebrew python3.14(有 mlx),mlx 路径硬编码 large-v3-turbo,`--model` 只对 faster 生效。

**Why**: 用户不想只在本机用,要能在别的电脑复现;且在国内网络。
**How to apply**: 改面板看 `panel.py`(单文件:后端+内联HTML);提交后 `git push origin main`。一次完整任务实测:20分钟1080p视频,下载+转写+翻译+烧录全程约 30-40 分钟。
