---
title: "集成"
sidebar_position: 0
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/integrations/index
---


# 集成

Hermes Agent 连接到外部系统以进行 AI 推理、工具服务器、IDE 工作流、程序化访问等。这些集成扩展了 Hermes 的功能和运行位置。

## AI 提供商与路由

Hermes 开箱即用地支持多个 AI 推理提供商。使用 `hermes model` 进行交互式配置，或在 `config.yaml` 中设置它们。

- **[AI 提供商](/docs/user-guide/features/provider-routing)** — OpenRouter、Anthropic、OpenAI、Google 和任何 OpenAI 兼容的端点。Hermes 自动检测每个提供商的视觉、流式和工具使用功能。
- **[提供商路由](/docs/user-guide/features/provider-routing)** — 对哪些底层提供商处理您的 OpenRouter 请求进行细粒度控制。使用排序、白名单、黑名单和显式优先级排序来优化成本、速度或质量。
- **[备用提供商](/docs/user-guide/features/fallback-providers)** — 当主模型遇到错误时自动故障转移到备用 LLM 提供商。包括主模型备用和用于视觉、压缩和网页提取的独立辅助任务备用。

## 工具服务器 (MCP)

- **[MCP 服务器](/docs/user-guide/features/mcp)** — 通过模型上下文协议将 Hermes 连接到外部工具服务器。无需编写原生 Hermes 工具即可访问来自 GitHub、数据库、文件系统、浏览器堆栈、内部 API 等的工具。支持 stdio 和 SSE 传输、每服务器工具过滤和支持能力的资源/提示注册。

## 网页搜索后端

`web_search` 和 `web_extract` 工具支持四个后端提供商，通过 `config.yaml` 或 `hermes tools` 配置：

| 后端 | 环境变量 | 搜索 | 提取 | 爬取 |
|---------|---------|--------|---------|-------|
| **Firecrawl**（默认） | `FIRECRAWL_API_KEY` | ✔ | ✔ | ✔ |
| **Parallel** | `PARALLEL_API_KEY` | ✔ | ✔ | — |
| **Tavily** | `TAVILY_API_KEY` | ✔ | ✔ | ✔ |
| **Exa** | `EXA_API_KEY` | ✔ | ✔ | — |

快速设置示例：

```yaml
web:
  backend: firecrawl    # firecrawl | parallel | tavily | exa
```

如果未设置 `web.backend`，则从任何可用的 API 密钥自动检测后端。自托管 Firecrawl 也通过 `FIRECRAWL_API_URL` 支持。

## 浏览器自动化

Hermes 包含完整的浏览器自动化，具有多个后端选项，用于导航网站、填写表单和提取信息：

- **Browserbase** — 托管云浏览器，具有反机器人工具、CAPTCHA 解决和住宅代理
- **Browser Use** — 替代云浏览器提供商
- **通过 CDP 的本地 Chrome** — 使用 `/browser connect` 连接到您运行的 Chrome 实例
- **本地 Chromium** — 通过 `agent-browser` CLI 的无头本地浏览器

有关设置和使用，请参阅[浏览器自动化](/docs/user-guide/features/browser)。

## 语音与 TTS 提供商

跨所有消息平台的文本转语音和语音转文本：

| 提供商 | 质量 | 成本 | API 密钥 |
||----------|---------|------|---------|
|| **Edge TTS**（默认） | 良好 | 免费 | 无需 |
|| **ElevenLabs** | 优秀 | 付费 | `ELEVENLABS_API_KEY` |
|| **OpenAI TTS** | 良好 | 付费 | `VOICE_TOOLS_OPENAI_KEY` |
|| **MiniMax** | 良好 | 付费 | `MINIMAX_API_KEY` |
|| **NeuTTS** | 良好 | 免费 | 无需 |

语音转文本支持三个提供商：本地 Whisper（免费，设备上运行）、Groq（快速云）和 OpenAI Whisper API。语音消息转录适用于 Telegram、Discord、WhatsApp 和其他消息平台。有关详细信息，请参阅[语音与 TTS](/docs/user-guide/features/tts)和[语音模式](/docs/user-guide/features/voice-mode)。

## IDE 与编辑器集成

- **[IDE 集成 (ACP)](/docs/user-guide/features/acp)** — 在 ACP 兼容的编辑器中使用 Hermes Agent，例如 VS Code、Zed 和 JetBrains。Hermes 作为 ACP 服务器运行，在您的编辑器中渲染聊天消息、工具活动、文件差异和终端命令。

## 程序化访问

- **[API 服务器](/docs/user-guide/features/api-server)** — 将 Hermes 公开为 OpenAI 兼容的 HTTP 端点。任何使用 OpenAI 格式的前端 — Open WebUI、LobeChat、LibreChat、NextChat、ChatBox — 都可以连接并使用 Hermes 作为其后端及其完整的工具集。

## 记忆与个性化

- **[内置记忆](/docs/user-guide/features/memory)** — 通过 `MEMORY.md` 和 `USER.md` 文件实现持久、精选的记忆。代理维护跨越会话的个人笔记和用户个人资料数据的有限存储。
- **[记忆提供商](/docs/user-guide/features/memory-providers)** — 插入外部记忆后端以实现更深入的个性化。支持七个提供商：Honcho（辩证推理）、OpenViking（分层检索）、Mem0（云提取）、Hindsight（知识图谱）、Holographic（本地 SQLite）、RetainDB（混合搜索）和 ByteRover（基于 CLI）。

## 消息平台

Hermes 在 15+ 消息平台上作为网关机器人运行，全部通过相同的 `gateway` 子系统配置：

- **[Telegram](/docs/user-guide/messaging/telegram)**、**[Discord](/docs/user-guide/messaging/discord)**、**[Slack](/docs/user-guide/messaging/slack)**、**[WhatsApp](/docs/user-guide/messaging/whatsapp)**、**[Signal](/docs/user-guide/messaging/signal)**、**[Matrix](/docs/user-guide/messaging/matrix)**、**[Mattermost](/docs/user-guide/messaging/mattermost)**、**[Email](/docs/user-guide/messaging/email)**、**[SMS](/docs/user-guide/messaging/sms)**、**[DingTalk](/docs/user-guide/messaging/dingtalk)**、**[Feishu/Lark](/docs/user-guide/messaging/feishu)**、**[WeCom](/docs/user-guide/messaging/wecom)**、**[WeCom Callback](/docs/user-guide/messaging/wecom-callback)**、**[Weixin](/docs/user-guide/messaging/weixin)**、**[BlueBubbles](/docs/user-guide/messaging/bluebubbles)**、**[QQ Bot](/docs/user-guide/messaging/qqbot)**、**[Home Assistant](/docs/user-guide/messaging/homeassistant)**、**[Webhooks](/docs/user-guide/messaging/webhooks)**

有关平台比较表和设置指南，请参阅[消息网关概述](/docs/user-guide/messaging)。

## 家庭自动化

- **[Home Assistant](/docs/user-guide/messaging/homeassistant)** — 通过四个专用工具（`ha_list_entities`、`ha_get_state`、`ha_list_services`、`ha_call_service`）控制智能家居设备。当配置 `HASS_TOKEN` 时，Home Assistant 工具集会自动激活。

## 插件

- **[插件系统](/docs/user-guide/features/plugins)** — 使用自定义工具、生命周期钩子和 CLI 命令扩展 Hermes，无需修改核心代码。插件从 `~/.hermes/plugins/`、项目本地 `.hermes/plugins/` 和 pip 安装的入口点发现。
- **[构建插件](/docs/guides/build-a-hermes-plugin)** — 创建带有工具、钩子和 CLI 命令的 Hermes 插件的分步指南。

## 训练与评估

- **[RL 训练](/docs/user-guide/features/rl-training)** — 从代理会话生成轨迹数据，用于强化学习和模型微调。支持具有可自定义奖励函数的 Atropos 环境。
- **[批处理](/docs/user-guide/features/batch-processing)** — 在数百个提示上并行运行代理，生成用于训练数据生成或评估的结构化 ShareGPT 格式轨迹数据。
