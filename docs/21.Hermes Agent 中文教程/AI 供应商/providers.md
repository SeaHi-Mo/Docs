---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: AI 提供商
sidebar_label: AI 提供商
permalink: /hermes/integrations/providers
---

# AI 提供商

本页面涵盖为 Hermes Agent 设置推理提供商 —— 从 OpenRouter 和 Anthropic 等云 API，到 Ollama 和 vLLM 等自托管端点，再到高级路由和回退配置。您需要至少配置一个提供商才能使用 Hermes。

## 推理提供商

您需要至少一种连接 LLM 的方式。使用 `hermes model` 交互式切换提供商和模型，或直接配置：

| 提供商 | 设置 |
|----------|-------|
| **Nous Portal** | `hermes model` (OAuth, 基于订阅) |
| **OpenAI Codex** | `hermes model` (ChatGPT OAuth, 使用 Codex 模型) |
| **GitHub Copilot** | `hermes model` (OAuth 设备代码流, `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, 或 `gh auth token`) |
| **GitHub Copilot ACP** | `hermes model` (生成本地 `copilot --acp --stdio`) |
| **Anthropic** | `hermes model` (通过 Claude Code 认证的 Claude Pro/Max, Anthropic API 密钥, 或手动设置令牌) |
| **OpenRouter** | `~/.hermes/.env` 中的 `OPENROUTER_API_KEY` |
| **AI Gateway** | `~/.hermes/.env` 中的 `AI_GATEWAY_API_KEY` (提供商: `ai-gateway`) |
| **z.ai / GLM** | `~/.hermes/.env` 中的 `GLM_API_KEY` (提供商: `zai`) |
| **Kimi / Moonshot** | `~/.hermes/.env` 中的 `KIMI_API_KEY` (提供商: `kimi-coding`) |
| **MiniMax** | `~/.hermes/.env` 中的 `MINIMAX_API_KEY` (提供商: `minimax`) |
| **MiniMax China** | `~/.hermes/.env` 中的 `MINIMAX_CN_API_KEY` (提供商: `minimax-cn`) |
| **Alibaba Cloud** | `~/.hermes/.env` 中的 `DASHSCOPE_API_KEY` (提供商: `alibaba`, 别名: `dashscope`, `qwen`) |
| **Kilo Code** | `~/.hermes/.env` 中的 `KILOCODE_API_KEY` (提供商: `kilocode`) |
| **Xiaomi MiMo** | `~/.hermes/.env` 中的 `XIAOMI_API_KEY` (提供商: `xiaomi`, 别名: `mimo`, `xiaomi-mimo`) |
| **OpenCode Zen** | `~/.hermes/.env` 中的 `OPENCODE_ZEN_API_KEY` (提供商: `opencode-zen`) |
| **OpenCode Go** | `~/.hermes/.env` 中的 `OPENCODE_GO_API_KEY` (提供商: `opencode-go`) |
| **DeepSeek** | `~/.hermes/.env` 中的 `DEEPSEEK_API_KEY` (提供商: `deepseek`) |
| **Hugging Face** | `~/.hermes/.env` 中的 `HF_TOKEN` (提供商: `huggingface`, 别名: `hf`) |
| **Google / Gemini** | `~/.hermes/.env` 中的 `GOOGLE_API_KEY` (或 `GEMINI_API_KEY`) (提供商: `gemini`) |
| **Custom Endpoint** | `hermes model` → 选择 "Custom endpoint" (保存在 `config.yaml` 中) |

:::tip 模型键别名
在 `model:` 配置部分，您可以使用 `default:` 或 `model:` 作为模型 ID 的键名。`model: { default: my-model }` 和 `model: { model: my-model }` 都同样有效。
:::
:::info Codex 说明
OpenAI Codex 提供商通过设备代码认证（打开 URL，输入代码）。Hermes 将生成的凭据存储在其自己的身份验证存储中，位于 `~/.hermes/auth.json`，并且可以在存在时从 `~/.codex/auth.json` 导入现有的 Codex CLI 凭据。不需要 Codex CLI 安装。
:::
:::warning
即使使用 Nous Portal、Codex 或自定义端点时，某些工具（视觉、web 摘要、MoA）使用单独的"辅助"模型 —— 默认通过 OpenRouter 使用 Gemini Flash。`OPENROUTER_API_KEY` 自动启用这些工具。您还可以配置这些工具使用的模型和提供商 —— 请参阅 [辅助模型](/docs/user-guide/configuration#auxiliary-models)。
:::
### Anthropic (原生)

直接通过 Anthropic API 使用 Claude 模型 —— 无需 OpenRouter 代理。支持三种认证方法：

```bash
# 使用 API 密钥（按令牌付费）
export ANTHROPIC_API_KEY=***
hermes chat --provider anthropic --model claude-sonnet-4-6

# 首选：通过 `hermes model` 认证
# 当可用时，Hermes 将直接使用 Claude Code 的凭据存储
hermes model

# 使用设置令牌手动覆盖（回退 / 传统）
export ANTHROPIC_TOKEN=***  # 设置令牌或手动 OAuth 令牌
hermes chat --provider anthropic

# 自动检测 Claude Code 凭据（如果您已使用 Claude Code）
hermes chat --provider anthropic  # 自动读取 Claude Code 凭据文件
```

当您通过 `hermes model` 选择 Anthropic OAuth 时，Hermes 优先选择 Claude Code 自己的凭据存储，而不是将令牌复制到 `~/.hermes/.env`。这保持了可刷新的 Claude 凭据可刷新。

或永久设置：
```yaml
model:
  provider: "anthropic"
  default: "claude-sonnet-4-6"
```

:::tip 别名
`--provider claude` 和 `--provider claude-code` 也可以作为 `--provider anthropic` 的简写。
:::
### GitHub Copilot

Hermes 支持 GitHub Copilot 作为一级提供商，有两种模式：

**`copilot` —— 直接 Copilot API**（推荐）。使用您的 GitHub Copilot 订阅通过 Copilot API 访问 GPT-5.x、Claude、Gemini 和其他模型。

```bash
hermes chat --provider copilot --model gpt-5.4
```

**认证选项**（按此顺序检查）：

1. `COPILOT_GITHUB_TOKEN` 环境变量
2. `GH_TOKEN` 环境变量
3. `GITHUB_TOKEN` 环境变量
4. `gh auth token` CLI 回退

如果没有找到令牌，`hermes model` 提供 **OAuth 设备代码登录** —— 与 Copilot CLI 和 opencode 使用的相同流程。

:::warning 令牌类型
Copilot API **不**支持经典个人访问令牌 (`ghp_*`)。支持的令牌类型：

| 类型 | 前缀 | 如何获取 |
|------|--------|------------|
| OAuth 令牌 | `gho_` | `hermes model` → GitHub Copilot → 使用 GitHub 登录 |
| 细粒度 PAT | `github_pat_` | GitHub 设置 → 开发者设置 → 细粒度令牌（需要 **Copilot 请求**权限） |
| GitHub App 令牌 | `ghu_` | 通过 GitHub App 安装 |

如果您的 `gh auth token` 返回 `ghp_*` 令牌，请改用 `hermes model` 通过 OAuth 认证。
:::
**API 路由**：GPT-5+ 模型（除 `gpt-5-mini` 外）自动使用 Responses API。所有其他模型（GPT-4o、Claude、Gemini 等）使用 Chat Completions。模型从实时 Copilot 目录自动检测。

**`copilot-acp` —— Copilot ACP 智能体后端**。生成本地 Copilot CLI 作为子进程：

```bash
hermes chat --provider copilot-acp --model copilot-acp
# 需要 PATH 中的 GitHub Copilot CLI 和现有的 `copilot login` 会话
```

**永久配置：**
```yaml
model:
  provider: "copilot"
  default: "gpt-5.4"
```

| 环境变量 | 描述 |
|---------------------|-------------|
| `COPILOT_GITHUB_TOKEN` | Copilot API 的 GitHub 令牌（第一优先级） |
| `HERMES_COPILOT_ACP_COMMAND` | 覆盖 Copilot CLI 二进制路径（默认：`copilot`） |
| `HERMES_COPILOT_ACP_ARGS` | 覆盖 ACP 参数（默认：`--acp --stdio`） |

### 一级中国 AI 提供商

这些提供商具有内置支持，带有专用提供商 ID。设置 API 密钥并使用 `--provider` 选择：

```bash
# z.ai / ZhipuAI GLM
hermes chat --provider zai --model glm-5
# 需要：~/.hermes/.env 中的 GLM_API_KEY

# Kimi / Moonshot AI
hermes chat --provider kimi-coding --model kimi-for-coding
# 需要：~/.hermes/.env 中的 KIMI_API_KEY

# MiniMax (全球端点)
