---
title: "qqbot"
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/user-guide/通讯平台/qqbot
---
# QQ 机器人

通过**官方 QQ 机器人 API (v2)**连接 Hermes — 支持私聊 (C2C)、群聊 @提及、频道和直接消息，以及语音转录。

## 概述

QQ 机器人适配器使用[官方 QQ 机器人 API](https://bot.q.qq.com/wiki/develop/api-v2/)来：

- 通过到 QQ 网关的持久 **WebSocket** 连接接收消息
- 通过 **REST API** 发送文本和 Markdown 回复
- 下载和处理图片、语音消息和文件附件
- 使用腾讯内置 ASR 或可配置 STT 提供商进行语音消息转录

## 前提条件

1. **QQ 机器人应用** — 在 [q.qq.com](https://q.qq.com) 注册：
   - 创建新应用并记下您的 **App ID** 和 **App Secret**
   - 启用所需的意图：C2C 消息、群聊 @消息、频道消息
   - 在沙盒模式中配置您的机器人进行测试，或发布用于生产

2. **依赖项** — 适配器需要 `aiohttp` 和 `httpx`：
   ```bash
   pip install aiohttp httpx
   ```

## 配置

### 交互式设置

```bash
hermes setup gateway
```

从平台列表中选择 **QQ 机器人** 并按照提示操作。

### 手动配置

在 `~/.hermes/.env` 中设置所需的环境变量：

```bash
QQ_APP_ID=your-app-id
QQ_CLIENT_SECRET=your-app-secret
```

## 环境变量

| 变量 | 描述 | 默认值 |
|---|---|---|
| `QQ_APP_ID` | QQ 机器人 App ID（必需） | — |
| `QQ_CLIENT_SECRET` | QQ 机器人 App Secret（必需） | — |
| `QQ_HOME_CHANNEL` | 用于定时任务/通知传递的 OpenID | — |
| `QQ_HOME_CHANNEL_NAME` | 主页频道的显示名称 | `Home` |
| `QQ_ALLOWED_USERS` | 用于 DM 访问的逗号分隔用户 OpenID | 开放（所有用户） |
| `QQ_ALLOW_ALL_USERS` | 设置为 `true` 以允许所有 DM | `false` |
| `QQ_MARKDOWN_SUPPORT` | 启用 QQ Markdown（msg_type 2） | `true` |
| `QQ_STT_API_KEY` | 语音转文本提供商的 API 密钥 | — |
| `QQ_STT_BASE_URL` | STT 提供商的基本 URL | `https://open.bigmodel.cn/api/coding/paas/v4` |
| `QQ_STT_MODEL` | STT 模型名称 | `glm-asr` |

## 高级配置

如需精细控制，请在 `~/.hermes/config.yaml` 中添加平台设置：

```yaml
platforms:
  qq:
    enabled: true
    extra:
      app_id: "your-app-id"
      client_secret: "your-secret"
      markdown_support: true
      dm_policy: "open"          # open | allowlist | disabled
      allow_from:
        - "user_openid_1"
      group_policy: "open"       # open | allowlist | disabled
      group_allow_from:
        - "group_openid_1"
      stt:
        provider: "zai"          # zai (GLM-ASR), openai (Whisper) 等
        baseUrl: "https://open.bigmodel.cn/api/coding/paas/v4"
        apiKey: "your-stt-key"
        model: "glm-asr"
```

## 语音消息 (STT)

语音转录分两个阶段工作：

1. **QQ 内置 ASR**（免费，始终首先尝试）— QQ 在语音消息附件中提供 `asr_refer_text`，使用腾讯自己的语音识别
2. **配置的 STT 提供商**（回退）— 如果 QQ 的 ASR 没有返回文本，适配器会调用 OpenAI 兼容的 STT API：

   - **智谱/GLM (zai)**：默认提供商，使用 `glm-asr` 模型
   - **OpenAI Whisper**：设置 `QQ_STT_BASE_URL` 和 `QQ_STT_MODEL`
   - 任何 OpenAI 兼容的 STT 端点

## 故障排除

### 机器人立即断开连接（快速断开）

这通常意味着：
- **无效的 App ID / Secret** — 在 q.qq.com 仔细检查您的凭据
- **缺少权限** — 确保机器人已启用所需的意图
- **仅限沙盒的机器人** — 如果机器人处于沙盒模式，它只能接收来自 QQ 沙盒测试频道的消息

### 语音消息未转录

1. 检查 QQ 的内置 `asr_refer_text` 是否存在于附件数据中
2. 如果使用自定义 STT 提供商，请验证 `QQ_STT_API_KEY` 是否正确设置
3. 检查网关日志中的 STT 错误消息

### 消息未送达

- 验证机器人的**意图**是否在 q.qq.com 上启用
- 如果 DM 访问受限，请检查 `QQ_ALLOWED_USERS`
- 对于群消息，请确保机器人被 **@提及**（群策略可能需要允许列表）
- 检查 `QQ_HOME_CHANNEL` 以进行定时任务/通知传递

### 连接错误

- 确保安装了 `aiohttp` 和 `httpx`：`pip install aiohttp httpx`
- 检查与 `api.sgroup.qq.com` 和 WebSocket 网关的网络连接
- 查看网关日志以获取详细的错误消息和重新连接行为
