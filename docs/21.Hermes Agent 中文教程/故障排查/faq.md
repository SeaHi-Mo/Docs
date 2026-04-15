---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 常见问题与故障排除
description: Hermes Agent 的常见问题和解决方案
permalink: /hermes/troubleshooting/faq
---

## 常见问题与故障排除

最常见问题和问题的快速答案和修复。

---

## 常见问题

### 什么 LLM 提供商与 Hermes 兼容？

Hermes Agent 适用于任何 OpenAI 兼容的 API。支持的提供商包括：

- **[OpenRouter](https://openrouter.ai/)** —— 通过一个 API 密钥访问数百个模型（推荐用于灵活性）
- **Nous Portal** —— Nous Research 自己的推理端点
- **OpenAI** —— GPT-4o、o1、o3 等
- **Anthropic** —— Claude 模型（通过 OpenRouter 或兼容代理）
- **Google** —— Gemini 模型（通过 OpenRouter 或兼容代理）
- **z.ai / ZhipuAI** —— GLM 模型
- **Kimi / Moonshot AI** —— Kimi 模型
- **MiniMax** —— 全球和中国端点
- **本地模型** —— 通过 [Ollama](https://ollama.com/)、[vLLM](https://docs.vllm.ai/)、[llama.cpp](https://github.com/ggerganov/llama.cpp)、[SGLang](https://github.com/sgl-project/sglang) 或任何 OpenAI 兼容服务器

使用 `hermes model` 设置您的提供商，或通过编辑 `~/.hermes/.env`。有关所有提供商密钥，请参阅 [环境变量](./environment-variables.md) 参考。

### 它能在 Windows 上工作吗？

**不能原生运行。** Hermes Agent 需要类 Unix 环境。在 Windows 上，安装 [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) 并从内部运行 Hermes。标准安装命令在 WSL2 中完美运行：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### 它能在 Android / Termux 上工作吗？

是的 —— Hermes 现在有一个经过测试的 Termux 安装路径用于 Android 手机。

快速安装：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

有关完全显式的手动步骤、支持的附加组件和当前限制，请参阅 [Termux 指南](../getting-started/termux.md)。

重要提示：完整的 `.[all]` 附加组件目前在 Android 上不可用，因为 `voice` 附加组件依赖于 `faster-whisper` → `ctranslate2`，而 `ctranslate2` 不发布 Android wheel。请改用经过测试的 `.[termux]` 附加组件。

### 我的数据会被发送到任何地方吗？

API 调用**仅发送到您配置的 LLM 提供商**（例如，OpenRouter、您的本地 Ollama 实例）。Hermes Agent 不收集遥测、使用数据或分析。您的对话、记忆和技能存储在本地 `~/.hermes/` 中。

### 我可以在离线 / 使用本地模型时使用它吗？

是的。运行 `hermes model`，选择**自定义端点**，然后输入您服务器的 URL：

```bash
hermes model
# 选择：自定义端点（手动输入 URL）
# API 基础 URL：http://localhost:11434/v1
# API 密钥：ollama
# 模型名称：qwen3.5:27b
# 上下文长度：32768   ← 将其设置为与服务器实际上下文窗口匹配
```

或直接在 `config.yaml` 中配置：

```yaml
model:
  default: qwen3.5:27b
  provider: custom
  base_url: http://localhost:11434/v1
```

Hermes 将端点、提供商和基础 URL 持久化到 `config.yaml`，以便它在重启后仍然存在。如果您的本地服务器恰好加载了一个模型，`/model custom` 会自动检测它。您还可以在 config.yaml 中设置 `provider: custom` —— 它是一级提供商，不是任何其他东西的别名。

这适用于 Ollama、vLLM、llama.cpp 服务器、SGLang、LocalAI 等。详情请参阅 [配置指南](../user-guide/configuration.md)。

:::tip Ollama 用户
如果您在 Ollama 中设置了自定义 `num_ctx`（例如，`ollama run --num_ctx 16384`），请确保在 Hermes 中设置匹配的上下文长度 —— Ollama 的 `/api/show` 报告模型的*最大*上下文，而不是您配置的有效 `num_ctx`。
:::

:::tip 本地模型超时
Hermes 自动检测本地端点并放宽流式超时（读取超时从 120 秒提高到 1800 秒，禁用陈旧流检测）。如果您在非常大的上下文中仍然遇到超时，请在 `.env` 中设置 `HERMES_STREAM_READ_TIMEOUT=1800`。详情请参阅 [本地 LLM 指南](../guides/local-llm-on-mac.md#timeouts)。
:::

### 它要花多少钱？

Hermes Agent 本身是**免费和开源的**（MIT 许可证）。您只需为您选择的提供商的 LLM API 使用付费。本地模型完全免费运行。

### 多人可以使用一个实例吗？

是的。[消息网关](../user-guide/messaging/index.md) 允许多个用户通过 Telegram、Discord、Slack、WhatsApp 或 Home Assistant 与同一个 Hermes Agent 实例交互。访问通过允许列表（特定用户 ID）和 DM 配对（第一个发消息的用户声明访问权限）控制。

### 记忆和技能有什么区别？

- **记忆**存储**事实** —— 智能体知道的关于您、您的项目和偏好的事情。记忆基于相关性自动检索。
- **技能**存储**程序** —— 如何做事的分步说明。当智能体遇到类似任务时回忆技能。

两者都跨会话持久化。详情请参阅 [记忆](../user-guide/features/memory.md) 和 [技能](../user-guide/features/skills.md)。

### 我可以在自己的 Python 项目中使用它吗？

是的。导入 `AIAgent` 类并以编程方式使用 Hermes：

```python
from run_agent import AIAgent

agent = AIAgent(model="openrouter/nous/hermes-3-llama-3.1-70b")
response = agent.chat("简要解释量子计算")
```

有关完整 API 用法，请参阅 [Python 库指南](../user-guide/features/code-execution.md)。

---

## 故障排除

### 安装问题

#### 安装后 `hermes: command not found`

**原因：** 您的 shell 尚未重新加载更新的 PATH。

**解决方案：**
```bash
# 重新加载您的 shell 配置文件
source ~/.bashrc    # bash
source ~/.zshrc     # zsh

# 或开始新的终端会话
```

如果仍然不起作用，请验证安装位置：
```bash
which hermes
ls ~/.local/bin/hermes
```

:::tip
安装程序将 `~/.local/bin` 添加到您的 PATH。如果您使用非标准 shell 配置，请手动添加 `export PATH="$HOME/.local/bin:$PATH"`。
:::

#### Python 版本太旧

**原因：** Hermes 需要 Python 3.11 或更新版本。
