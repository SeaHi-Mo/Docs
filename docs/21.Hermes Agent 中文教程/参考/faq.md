---
title: "常见问题与故障排除"
sidebar_position: 3
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/faq
description: "Hermes Agent 的常见问题和解决方案"
---


# 常见问题与故障排除

最常见问题和问题的快速解答和修复。

---

## 常见问题

### 哪些 LLM 提供商与 Hermes 兼容？

Hermes Agent 适用于任何 OpenAI 兼容的 API。支持的提供商包括：

- **[OpenRouter](https://openrouter.ai/)** — 通过一个 API 密钥访问数百个模型（推荐用于灵活性）
- **Nous Portal** — Nous Research 自己的推理端点
- **OpenAI** — GPT-4o、o1、o3 等
- **Anthropic** — Claude 模型（通过 OpenRouter 或兼容代理）
- **Google** — Gemini 模型（通过 OpenRouter 或兼容代理）
- **z.ai / ZhipuAI** — GLM 模型
- **Kimi / Moonshot AI** — Kimi 模型
- **MiniMax** — 全球和中国端点
- **本地模型** — 通过 Ollama、vLLM、llama.cpp、SGLang 或任何 OpenAI 兼容的服务器

使用 `hermes model` 设置您的提供商或通过编辑 `~/.hermes/.env`。

### 它能在 Windows 上运行吗？

**不能原生运行。** Hermes Agent 需要类 Unix 环境。在 Windows 上，安装 WSL2 并在其中运行 Hermes。

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### 它能在 Android / Termux 上运行吗？

是的 — Hermes 现在有一个经过测试的 Termux 安装路径，适用于 Android 手机。

### 我的数据会被发送到任何地方吗？

API 调用**仅发送到您配置的 LLM 提供商**。Hermes Agent 不会收集遥测、使用数据或分析。您的对话、记忆和技能存储在本地 `~/.hermes/` 中。

### 我可以在离线/本地模型中使用它吗？

是的。运行 `hermes model`，选择**自定义端点**，然后输入您服务器的 URL。

### 费用是多少？

Hermes Agent 本身是**免费和开源的**（MIT 许可证）。您只需为所选提供商的 LLM API 使用付费。

### 多个人可以使用一个实例吗？

是的。消息网关允许多个用户通过 Telegram、Discord、Slack、WhatsApp 或 Home Assistant 与同一个 Hermes Agent 实例交互。

### 记忆和技能有什么区别？

- **记忆**存储**事实** — 代理知道的关于您、您的项目和偏好的事情
- **技能**存储**程序** — 如何做事情的分步说明

---

## 故障排除

### 安装问题

#### 安装后 `hermes: command not found`

**原因：** 您的 shell 尚未重新加载更新的 PATH。

**解决方案：**
```bash
source ~/.bashrc    # bash
source ~/.zshrc     # zsh
```

#### Python 版本太旧

**原因：** Hermes 需要 Python 3.11 或更新版本。

**解决方案：**
```bash
sudo apt install python3.12   # Ubuntu/Debian
brew install python@3.12      # macOS
```

---

## 还有问题？

如果您的问题未在此处涵盖：

1. **搜索现有问题：** [GitHub Issues](https://github.com/NousResearch/hermes-agent/issues)
2. **询问社区：** [Nous Research Discord](https://discord.gg/nousresearch)
3. **提交错误报告：** 包括您的操作系统、Python 版本 (`python3 --version`)、Hermes 版本 (`hermes --version`) 和完整的错误消息
