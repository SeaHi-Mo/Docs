---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 后备提供商
description: 配置当主模型不可用时自动故障转移到备用 LLM 提供商。
sidebar_label: 后备提供商
permalink: /hermes/user-guide/features/fallback-providers
---

# 后备提供商

Hermes Agent 有三层弹性机制，可在提供商出现问题时保持会话运行：

1. **[凭证池](./credential-pools.md)** —— 在同一提供商的多个 API 密钥之间轮换（首先尝试）
2. **主模型后备** —— 当主模型失败时自动切换到不同的提供商:模型
3. **辅助任务后备** —— 视觉、压缩和网络提取等辅助任务的独立提供商解析

凭证池处理同一提供商的轮换（例如，多个 OpenRouter 密钥）。本页介绍跨提供商后备。两者都是可选的，独立工作。

## 主模型后备

当主 LLM 提供商遇到错误 —— 速率限制、服务器过载、认证失败、连接断开 —— Hermes 可以在不丢失对话的情况下自动切换到后备提供商:模型对。

### 配置

将 `fallback_model` 部分添加到 `~/.hermes/config.yaml`：

```yaml
fallback_model:
  provider: openrouter
  model: anthropic/claude-sonnet-4
```

`provider` 和 `model` 都是**必需的**。如果缺少任何一个，后备将被禁用。

### 支持的提供商

| 提供商 | 值 | 要求 |
|----------|-------|-------------|
| AI Gateway | `ai-gateway` | `AI_GATEWAY_API_KEY` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` |
| Nous Portal | `nous` | `hermes auth` (OAuth) |
| OpenAI Codex | `openai-codex` | `hermes model` (ChatGPT OAuth) |
| GitHub Copilot | `copilot` | `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, 或 `GITHUB_TOKEN` |
| GitHub Copilot ACP | `copilot-acp` | 外部进程（编辑器集成）|
| Anthropic | `anthropic` | `ANTHROPIC_API_KEY` 或 Claude Code 凭证 |
| z.ai / GLM | `zai` | `GLM_API_KEY` |
| Kimi / Moonshot | `kimi-coding` | `KIMI_API_KEY` |
| MiniMax | `minimax` | `MINIMAX_API_KEY` |
| MiniMax (中国) | `minimax-cn` | `MINIMAX_CN_API_KEY` |
| DeepSeek | `deepseek` | `DEEPSEEK_API_KEY` |
| OpenCode Zen | `opencode-zen` | `OPENCODE_ZEN_API_KEY` |
| OpenCode Go | `opencode-go` | `OPENCODE_GO_API_KEY` |
| Kilo Code | `kilocode` | `KILOCODE_API_KEY` |
| Xiaomi MiMo | `xiaomi` | `XIAOMI_API_KEY` |
| Alibaba / DashScope | `alibaba` | `DASHSCOPE_API_KEY` |
| Hugging Face | `huggingface` | `HF_TOKEN` |
| 自定义端点 | `custom` | `base_url` + `api_key_env` (见下文) |

### 自定义端点后备

对于自定义 OpenAI 兼容端点，添加 `base_url` 和可选的 `api_key_env`：

```yaml
fallback_model:
  provider: custom
  model: my-local-model
  base_url: http://localhost:8000/v1
  api_key_env: MY_LOCAL_KEY          # 包含 API 密钥的环境变量名
```

### 后备触发时机

当主模型出现以下错误时，后备会自动激活：

- **速率限制** (HTTP 429) —— 用尽重试尝试后
- **服务器错误** (HTTP 500, 502, 503) —— 用尽重试尝试后
- **认证失败** (HTTP 401, 403) —— 立即（无需重试）
- **未找到** (HTTP 404) —— 立即
- **无效响应** —— 当 API 反复返回格式错误或空响应时

触发时，Hermes：

1. 解析后备提供商的凭证
2. 构建新的 API 客户端
3. 原地交换模型、提供商和客户端
4. 重置重试计数器并继续对话

切换是无缝的 —— 您的对话历史、工具调用和上下文被保留。Agent 从它离开的地方继续，只是使用不同的模型。

:::info 一次性
后备每会话**最多激活一次**。如果后备提供商也失败，正常的错误处理将接管（重试，然后错误消息）。这防止了级联故障转移循环。
:::
### 示例

**OpenRouter 作为 Anthropic 原生后备：**
```yaml
model:
  provider: anthropic
  default: claude-sonnet-4-6

fallback_model:
  provider: openrouter
  model: anthropic/claude-sonnet-4
```

**Nous Portal 作为 OpenRouter 后备：**
```yaml
model:
  provider: openrouter
  default: anthropic/claude-opus-4

fallback_model:
  provider: nous
  model: nous-hermes-3
```

**本地模型作为云端后备：**
```yaml
fallback_model:
  provider: custom
  model: llama-3.1-70b
  base_url: http://localhost:8000/v1
  api_key_env: LOCAL_API_KEY
```

**Codex OAuth 作为后备：**
```yaml
fallback_model:
  provider: openai-codex
  model: gpt-5.3-codex
```

### 后备工作场景

| 上下文 | 支持后备 |
|---------|-------------------|
| CLI 会话 | ✔ |
| 消息网关 (Telegram, Discord 等) | ✔ |
| 子代理委托 | ✘ (子代理不继承后备配置) |
| Cron 作业 | ✘ (使用固定提供商运行) |
| 辅助任务 (视觉, 压缩) | ✘ (使用自己的提供商链 —— 见下文) |

:::tip
`fallback_model` 没有环境变量 —— 它完全通过 `config.yaml` 配置。这是有意为之：后备配置是一个深思熟虑的选择，不是陈旧的 shell 导出应该覆盖的东西。
:::
## 辅助任务后备

Hermes 对辅助任务使用单独的轻量级模型。每个任务都有自己的提供商解析链，作为内置后备系统。
