---
name: playwright-setup
description: Playwright 隐身浏览器已装全（1200/1208/1223/1234）；国内必须用 npmmirror 镜像下载，官方源只有 7KB/s
metadata: 
  node_type: memory
  type: project
  originSessionId: 62cd50a6-8f5d-458b-aa48-191996a04476
  modified: 2026-07-29T07:53:18.170Z
---

泽民的机器上 Codex 跑任务时用 Playwright 截图/校验 HTML 页面，Dock 会冒 Chrome 图标（每启动一个浏览器实例冒一个，任务结束消失，属正常）。

**Why:** 之前缺 headless shell（隐身浏览器组件），Playwright 报错并退回带界面浏览器，图标更多。

**How to apply:**
- 下载 Playwright 浏览器必须走国内镜像：`PLAYWRIGHT_DOWNLOAD_HOST=https://cdn.npmmirror.com/binaries/playwright npx playwright install chromium`（官方源实测 7KB/s，镜像 2MB/s，与 [[project_baocut_setup]] 里 HF 走 hf-mirror 同理）
- **机器上有多个 Playwright，修图标问题必须装 Codex 主运行时的那份**：`~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`（要 1228 版）。缺壳时 Codex 会 fallback 到 `executablePath: /Applications/Google Chrome.app/...` 用真实 Chrome → 真 Chrome 即使 --headless 也在 Dock 冒图标。正确装法：`PLAYWRIGHT_DOWNLOAD_HOST=<镜像> node <该路径>/cli.js install chromium`
- 已装齐 5 个版本（~/Library/Caches/ms-playwright/）：1200（ChatGPT.app cua_node）+ 1208/1223/1234（npx）+ **1228（Codex 主运行时，关键）**
- 若 Codex 更新后报新的 "headless_shell-XXXX 缺失"，找到对应 playwright 的 cli.js 用镜像命令补装
- Playwright 没有全局 npm 安装，普通 `node script.mjs` 里 `import 'playwright'` 会报 module not found；Codex 环境自带解析
- 教训：第一次只装了 npx 版和 ChatGPT.app cua_node 版，漏了主运行时版，问题没解决被用户批评——修这类问题先 grep 会话日志找 executablePath/报错里的真实版本号再动手
