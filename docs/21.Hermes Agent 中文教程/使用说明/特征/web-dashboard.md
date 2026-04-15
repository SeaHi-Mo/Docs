---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Web 仪表板
description: 用于管理配置、API 密钥和监控会话的基于浏览器的仪表板
permalink: /hermes/user-guide/features/web-dashboard
---

# Web 仪表板

Web 仪表板是一个基于浏览器的 UI，用于管理您的 Hermes Agent 安装。您可以从干净的 Web 界面配置设置、管理 API 密钥和监控会话，而无需编辑 YAML 文件或运行 CLI 命令。

## 快速开始

```bash
hermes web
```

这会启动一个本地 Web 服务器并在浏览器中打开 `http://127.0.0.1:9119`。仪表板完全在您的机器上运行 —— 没有数据离开 localhost。

### 选项

| 标志 | 默认值 | 描述 |
|------|---------|-------------|
| `--port` | `9119` | 运行 Web 服务器的端口 |
| `--host` | `127.0.0.1` | 绑定地址 |
| `--no-open` | — | 不自动打开浏览器 |

```bash
# 自定义端口
hermes web --port 8080

# 绑定到所有接口（在共享网络上谨慎使用）
hermes web --host 0.0.0.0

# 启动但不打开浏览器
hermes web --no-open
```

## 前提条件

Web 仪表板需要 FastAPI 和 Uvicorn。使用以下命令安装：

```bash
pip install hermes-agent[web]
```

如果您使用 `pip install hermes-agent[all]` 安装，Web 依赖项已包含在内。

当您运行 `hermes web` 而没有依赖项时，它会告诉您要安装什么。如果前端尚未构建且 `npm` 可用，它会在首次启动时自动构建。

## 页面

### 状态

登录页面显示安装的实时概览：

- **Agent 版本**和发布日期
- **网关状态** —— 运行/停止、PID、连接的平台及其状态
- **活动会话** —— 过去 5 分钟内活动的会话计数
- **最近会话** —— 20 个最近会话的列表，包含模型、消息计数、令牌使用和对话预览

状态页面每 5 秒自动刷新。

### 配置

`config.yaml` 的基于表单的编辑器。所有 150+ 配置字段都是从 `DEFAULT_CONFIG` 自动发现的，并组织成带标签的类别：

- **model** —— 默认模型、提供商、基础 URL、推理设置
- **terminal** —— 后端（本地/docker/ssh/modal）、超时、shell 偏好
- **display** —— 皮肤、工具进度、恢复显示、旋转器设置
- **agent** —— 最大迭代次数、网关超时、服务层级
- **delegation** —— 子代理限制、推理努力
- **memory** —— 提供商选择、上下文注入设置
- **approvals** —— 危险命令审批模式（询问/自动/拒绝）
- 还有更多 —— config.yaml 的每个部分都有相应的表单字段

具有已知有效值的字段（终端后端、皮肤、审批模式等）渲染为下拉菜单。布尔值渲染为切换开关。其他所有内容都是文本输入。

**操作：**

- **保存** —— 立即将更改写入 `config.yaml`
- **重置为默认值** —— 将所有字段恢复为其默认值（点击保存前不会保存）
- **导出** —— 将当前配置作为 JSON 下载
- **导入** —— 上传 JSON 配置文件以替换当前值

:::tip
配置更改在下一个 Agent 会话或网关重启时生效。Web 仪表板编辑与 `hermes config set` 和网关读取的相同的 `config.yaml` 文件。
:::
### API 密钥

管理存储 API 密钥和凭证的 `.env` 文件。密钥按类别分组：

- **LLM 提供商** —— OpenRouter、Anthropic、OpenAI、DeepSeek 等
- **工具 API 密钥** —— Browserbase、Firecrawl、Tavily、ElevenLabs 等
- **消息平台** —— Telegram、Discord、Slack 机器人令牌等
- **Agent 设置** —— 非机密环境变量如 `API_SERVER_ENABLED`

每个密钥显示：
- 当前是否已设置（带有值的脱敏预览）
- 它的用途描述
- 提供商注册/密钥页面的链接
- 设置或更新值的输入字段
- 删除按钮以移除它

默认情况下，高级/很少使用的密钥隐藏在切换后面。

:::warning 安全
Web 仪表板读取和写入您的 `.env` 文件，其中包含 API 密钥和机密。它默认绑定到 `127.0.0.1` —— 只能从您的本地机器访问。如果您绑定到 `0.0.0.0`，您网络上的任何人都可以查看和修改您的凭证。仪表板本身没有身份验证。
:::
## `/reload` 斜杠命令

仪表板 PR 还向交互式 CLI 添加了 `/reload` 斜杠命令。通过 Web 仪表板（或直接编辑 `.env`）更改 API 密钥后，在活动 CLI 会话中使用 `/reload` 以在不重启的情况下获取更改：

```
You → /reload
  Reloaded .env (3 var(s) updated)
```

这会将 `~/.hermes/.env` 重新读入运行进程的环境。当您通过仪表板添加了新的提供商密钥并希望立即使用它时很有用。

## REST API

Web 仪表板暴露前端使用的 REST API。您也可以直接调用这些端点进行自动化：

### GET /api/status

返回 Agent 版本、网关状态、平台状态和活动会话计数。

### GET /api/sessions

返回 20 个最近会话的元数据（模型、令牌计数、时间戳、预览）。

### GET /api/config

将当前 `config.yaml` 内容作为 JSON 返回。

### GET /api/config/defaults

返回默认配置值。

### GET /api/config/schema

返回描述每个配置字段的架构 —— 类型、描述、类别和适用的选择选项。前端使用它为每个字段渲染正确的输入小部件。

### PUT /api/config

保存新配置。正文：`{"config": {...}}`。

### GET /api/env

返回所有已知环境变量及其设置/未设置状态、脱敏值、描述和类别。

### PUT /api/env

设置环境变量。正文：`{"key": "VAR_NAME", "value": "secret"}`。

### DELETE /api/env

移除环境变量。正文：`{"key": "VAR_NAME"}`。

## CORS

Web 服务器将 CORS 限制为仅限 localhost 来源：

- `http://localhost:9119` / `http://127.0.0.1:9119` (生产)
- `http://localhost:3000` / `http://127.0.0.1:3000`
- `http://localhost:5173` / `http://127.0.0.1:5173` (Vite 开发服务器)

如果您在自定义端口上运行服务器，该来源会自动添加。

## 开发

如果您正在为 Web 仪表板前端做贡献：

```bash
# 终端 1：启动后端 API
hermes web --no-open

# 终端 2：启动带 HMR 的 Vite 开发服务器
cd web/
npm install
npm run dev
```

`http://localhost:5173` 的 Vite 开发服务器将 `/api` 请求代理到 `http://127.0.0.1:9119` 的 FastAPI 后端。

前端使用 React 19、TypeScript、Tailwind CSS v4 和 shadcn/ui 风格组件构建。生产构建输出到 `hermes_cli/web_dist/`，FastAPI 服务器将其作为静态 SPA 提供。

## 更新时自动构建

当您运行 `hermes update` 时，如果 `npm` 可用，Web 前端会自动重建。这使仪表板与代码更新保持同步。如果未安装 `npm`，更新会跳过前端构建，`hermes web` 将在首次启动时构建它。
