---
inHomePost: false
date: 2026-04-14 02:06:04
categories:
  - HemesAgent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
title: 安装
description: 在 Linux、macOS、WSL2 或通过 Termux 在 Android 上安装 Hermes Agent
permalink: /hermes/getting-started/installation
---

## 一键安装

使用一键安装程序在两分钟内启动并运行 Hermes Agent，或按照手动步骤进行完全控制。

## 快速安装

### Linux / macOS / WSL2

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### Android / Termux

Hermes 现在也提供 Termux 感知安装程序路径：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装程序会自动检测 Termux 并切换到经过测试的 Android 流程：
- 使用 Termux `pkg` 安装系统依赖（`git`、`python`、`nodejs`、`ripgrep`、`ffmpeg`、构建工具）
- 使用 `python -m venv` 创建虚拟环境
- 为 Android wheel 构建自动导出 `ANDROID_API_LEVEL`
- 使用 `pip` 安装精选的 `.[termux]` 附加组件
- 默认跳过未经验证的浏览器 / WhatsApp 引导

如果您想要完全显式的路径，请遵循专门的 [Termux 指南](./termux.md)。

:::warning Windows
原生 Windows **不受支持**。请安装 [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) 并从那里运行 Hermes Agent。上述安装命令在 WSL2 内有效。
:::

### 安装程序的作用

安装程序自动处理一切 —— 所有依赖项（Python、Node.js、ripgrep、ffmpeg）、仓库克隆、虚拟环境、全局 `hermes` 命令设置和 LLM 提供商配置。完成后，您就可以开始聊天了。

### 安装后

重新加载您的 shell 并开始聊天：

```bash
source ~/.bashrc   # 或：source ~/.zshrc
hermes             # 开始聊天！
```

以后要重新配置个别设置，请使用专用命令：

```bash
hermes model          # 选择您的 LLM 提供商和模型
hermes tools          # 配置启用哪些工具
hermes gateway setup  # 设置消息平台
hermes config set     # 设置单个配置值
hermes setup          # 或运行完整设置向导一次性配置所有内容
```

---

## 先决条件

唯一的先决条件是 **Git**。安装程序自动处理其他所有内容：

- **uv**（快速 Python 包管理器）
- **Python 3.11**（通过 uv，无需 sudo）
- **Node.js v22**（用于浏览器自动化和 WhatsApp 桥接）
- **ripgrep**（快速文件搜索）
- **ffmpeg**（TTS 音频格式转换）

:::info
您 **无需** 手动安装 Python、Node.js、ripgrep 或 ffmpeg。安装程序会检测缺少的内容并为您安装。只需确保 `git` 可用（`git --version`）。
:::

:::tip Nix 用户
如果您使用 Nix（在 NixOS、macOS 或 Linux 上），有专门的设置路径，包含 Nix flake、声明式 NixOS 模块和可选容器模式。请参阅 **[Nix & NixOS 设置](./nix-setup.md)** 指南。
:::

---

## 手动安装

如果您希望对安装过程进行完全控制，请按照以下步骤操作。

### 第 1 步：克隆仓库

使用 `--recurse-submodules` 克隆以拉取所需的子模块：

```bash
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

如果您已经克隆但没有 `--recurse-submodules`：
```bash
git submodule update --init --recursive
```

### 第 2 步：安装 uv 并创建虚拟环境

```bash
# 安装 uv（如果尚未安装）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 使用 Python 3.11 创建 venv（uv 会下载它（如果不存在）— 无需 sudo）
uv venv venv --python 3.11
```

:::tip
您 **无需** 激活 venv 即可使用 `hermes`。入口点有一个硬编码的 shebang 指向 venv Python，因此一旦符号链接后它就可以全局工作。
:::

### 第 3 步：安装 Python 依赖项

```bash
# 告诉 uv 安装到哪个 venv
export VIRTUAL_ENV="$(pwd)/venv"

# 安装所有附加组件
uv pip install -e ".[all]"
```

如果您只想要核心智能体（无 Telegram/Discord/cron 支持）：
```bash
uv pip install -e "."
```

<details>
<summary><strong>可选附加组件细分</strong></summary>

| 附加组件 | 添加的内容 | 安装命令 |
|-------|-------------|-----------------|
| `all` | 下面所有内容 | `uv pip install -e ".[all]"` |
| `messaging` | Telegram 和 Discord 网关 | `uv pip install -e ".[messaging]"` |
| `cron` | 定时任务的 Cron 表达式解析 | `uv pip install -e ".[cron]"` |
| `cli` | 设置向导的终端菜单 UI | `uv pip install -e ".[cli]"` |
| `modal` | Modal 云执行后端 | `uv pip install -e ".[modal]"` |
| `tts-premium` | ElevenLabs 高级语音 | `uv pip install -e ".[tts-premium]"` |
| `voice` | CLI 麦克风输入 + 音频播放 | `uv pip install -e ".[voice]"` |
| `pty` | PTY 终端支持 | `uv pip install -e ".[pty]"` |
| `termux` | 经过测试的 Android / Termux 包（`cron`、`cli`、`pty`、`mcp`、`honcho`、`acp`） | `python -m pip install -e ".[termux]" -c constraints-termux.txt` |
| `honcho` | AI 原生记忆（Honcho 集成） | `uv pip install -e ".[honcho]"` |
| `mcp` | 模型上下文协议支持 | `uv pip install -e ".[mcp]"` |
| `homeassistant` | Home Assistant 集成 | `uv pip install -e ".[homeassistant]"` |
| `acp` | ACP 编辑器集成支持 | `uv pip install -e ".[acp]"` |
| `slack` | Slack 消息 | `uv pip install -e ".[slack]"` |
| `dev` | pytest 和测试工具 | `uv pip install -e ".[dev]"` |

您可以组合附加组件：`uv pip install -e ".[messaging,cron]"`

:::tip Termux 用户
`.[all]` 目前在 Android 上不可用，因为 `voice` 附加组件会拉取 `faster-whisper`，它依赖于未为 Android 发布的 `ctranslate2` wheel。使用 `.[termux]` 作为经过测试的移动安装路径，然后仅根据需要添加单个附加组件。
:::

</details>

### 第 4 步：安装可选子模块（如果需要）

```bash
# RL 训练后端（可选）
uv pip install -e "./tinker-atropos"
```

两者都是可选的 —— 如果您跳过它们，相应的工具集将不可用。

### 第 5 步：安装 Node.js 依赖项（可选）

仅 **浏览器自动化**（基于 Browserbase）和 **WhatsApp 桥接** 需要：

```bash
npm install
```

### 第 6 步：创建配置目录

```bash
# 创建目录结构
mkdir -p ~/.hermes/{cron,sessions,logs,memories,skills,pairing,hooks,image_cache,audio_cache,whatsapp/session}

# 复制示例配置文件
cp cli-config.yaml.example ~/.hermes/config.yaml

# 为 API 密钥创建空的 .env 文件
touch ~/.hermes/.env
```

### 第 7 步：添加您的 API 密钥

打开 `~/.hermes/.env` 并至少添加一个 LLM 提供商密钥：

```bash
# 必需 —— 至少一个 LLM 提供商：
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# 可选 —— 启用附加工具：
FIRECRAWL_API_KEY=fc-your-key          # 网络搜索和抓取（或自托管，请参阅文档）
FAL_KEY=your-fal-key                   # 图像生成（FLUX）
```

或通过 CLI 设置：
```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-your-key-here
```

### 第 8 步：将 `hermes` 添加到您的 PATH

```bash
mkdir -p ~/.local/bin
ln -sf "$(pwd)/venv/bin/hermes" ~/.local/bin/hermes
```

如果 `~/.local/bin` 不在您的 PATH 中，请将其添加到您的 shell 配置：

```bash
# Bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc

# Zsh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc

# Fish
fish_add_path $HOME/.local/bin
```

### 第 9 步：配置您的提供商

```bash
hermes model       # 选择您的 LLM 提供商和模型
```

### 第 10 步：验证安装

```bash
hermes version    # 检查命令是否可用
hermes doctor     # 运行诊断以验证一切正常工作
hermes status     # 检查您的配置
hermes chat -q "你好！你有什么可用工具？"
```

---

## 快速参考：手动安装（精简版）

对于那些只想要命令的人：

```bash
# 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 克隆并进入
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent

# 使用 Python 3.11 创建 venv
uv venv venv --python 3.11
export VIRTUAL_ENV="$(pwd)/venv"

# 安装所有内容
uv pip install -e ".[all]"
uv pip install -e "./tinker-atropos"
npm install  # 可选，用于浏览器工具和 WhatsApp

# 配置
mkdir -p ~/.hermes/{cron,sessions,logs,memories,skills,pairing,hooks,image_cache,audio_cache,whatsapp/session}
cp cli-config.yaml.example ~/.hermes/config.yaml
touch ~/.hermes/.env
echo 'OPENROUTER_API_KEY=sk-or-v1-your-key' >> ~/.hermes/.env

# 全局可用 hermes
mkdir -p ~/.local/bin
ln -sf "$(pwd)/venv/bin/hermes" ~/.local/bin/hermes

# 验证
hermes doctor
hermes
```

---

## 故障排除

| 问题 | 解决方案 |
|---------|----------|
| `hermes: 命令未找到` | 重新加载您的 shell（`source ~/.bashrc`）或检查 PATH |
| `API 密钥未设置` | 运行 `hermes model` 配置您的提供商，或 `hermes config set OPENROUTER_API_KEY your_key` |
| 更新后缺少配置 | 运行 `hermes config check` 然后 `hermes config migrate` |

有关更多诊断，请运行 `hermes doctor` —— 它会准确告诉您缺少什么以及如何修复。
