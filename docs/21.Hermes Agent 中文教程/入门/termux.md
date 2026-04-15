---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Android / Termux
description: 在 Android 手机上通过 Termux 直接运行 Hermes Agent
permalink: /hermes/getting-started/termux
---

## 使用 Termux 在 Android 上运行 Hermes

这是通过 [Termux](https://termux.dev/) 在 Android 手机上直接运行 Hermes Agent 的测试路径。

它为您提供了手机上可用的本地 CLI，以及当前已知可在 Android 上干净安装的核心附加功能。

## 测试路径支持什么？

经过测试的 Termux 捆绑包安装：
- Hermes CLI
- cron 支持
- PTY/后台终端支持
- MCP 支持
- Honcho 记忆支持
- ACP 支持

具体而言，它对应于：

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

## 哪些功能尚未包含在测试路径中？

一些功能仍然需要尚未为 Android 发布的桌面/服务器风格依赖项，或者尚未在手机上验证：

- `.[all]` 目前在 Android 上不受支持
- `voice` 额外功能被 `faster-whisper -> ctranslate2` 阻止，且 `ctranslate2` 不发布 Android 轮子
- Termux 安装程序跳过自动浏览器 / Playwright 引导
- Docker 基于终端的隔离在 Termux 内不可用

这并不会阻止 Hermes 作为手机原生 CLI Agent 良好运行 —— 这只是意味着推荐的移动安装有意比桌面/服务器安装更精简。

---

## 选项 1：一行安装程序

Hermes 现在提供 Termux 感知安装程序路径：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

在 Termux 上，安装程序自动：
- 使用 `pkg` 安装系统包
- 使用 `python -m venv` 创建 venv
- 使用 `pip` 安装 `.[termux]`
- 将 `hermes` 链接到 `$PREFIX/bin`，使其保持在 Termux PATH 上
- 跳过未经测试的浏览器 / WhatsApp 引导

如果您想要显式命令或需要调试失败的安装，请使用下面的手动路径。

---

## 选项 2：手动安装（完全显式）

### 1. 更新 Termux 并安装系统包

```bash
pkg update
pkg install -y git python clang rust make pkg-config libffi openssl nodejs ripgrep ffmpeg
```

为什么需要这些包？
- `python` —— 运行时 + venv 支持
- `git` —— 克隆/更新仓库
- `clang`、`rust`、`make`、`pkg-config`、`libffi`、`openssl` —— 用于在 Android 上构建一些 Python 依赖项
- `nodejs` —— 用于核心测试路径之外的实验的可选 Node 运行时
- `ripgrep` —— 快速文件搜索
- `ffmpeg` —— 媒体 / TTS 转换

### 2. 克隆 Hermes

```bash
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

如果您已经克隆但没有子模块：

```bash
git submodule update --init --recursive
```

### 3. 创建虚拟环境

```bash
python -m venv venv
source venv/bin/activate
export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"
python -m pip install --upgrade pip setuptools wheel
```

`ANDROID_API_LEVEL` 对于基于 Rust / maturin 的包（如 `jiter`）很重要。

### 4. 安装经过测试的 Termux 捆绑包

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

如果您只想要最小核心 Agent，这也适用：

```bash
python -m pip install -e '.' -c constraints-termux.txt
```

### 5. 将 `hermes` 添加到 Termux PATH

```bash
ln -sf "$PWD/venv/bin/hermes" "$PREFIX/bin/hermes"
```

`$PREFIX/bin` 已在 Termux 的 PATH 中，因此这使 `hermes` 命令在新 shell 中持久化，无需每次都重新激活 venv。

### 6. 验证安装

```bash
hermes version
hermes doctor
```

### 7. 启动 Hermes

```bash
hermes
```

---

## 推荐的后续设置

### 配置模型

```bash
hermes model
```

或直接在 `~/.hermes/.env` 中设置密钥。

### 稍后重新运行完整的交互式设置向导

```bash
hermes setup
```

### 手动安装可选 Node 依赖项

经过测试的 Termux 路径有意跳过 Node/浏览器引导。如果您稍后想要实验：

```bash
npm install
```

在另有文档说明之前，将 Android 上的浏览器 / WhatsApp 工具视为实验性的。

---

## 故障排除

### 安装 `.[all]` 时出现 `No solution found`

使用经过测试的 Termux 捆绑包：

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

当前的阻止程序是 `voice` 额外功能：
- `voice` 拉取 `faster-whisper`
- `faster-whisper` 依赖 `ctranslate2`
- `ctranslate2` 不发布 Android 轮子

### Android 上 `uv pip install` 失败

使用带有 stdlib venv + `pip` 的 Termux 路径：

```bash
python -m venv venv
source venv/bin/activate
export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"
python -m pip install --upgrade pip setuptools wheel
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

### `jiter` / `maturin` 抱怨 `ANDROID_API_LEVEL`

在安装前显式设置 API 级别：

```bash
export ANDROID_API_LEVEL="$(getprop ro.build.version.sdk)"
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

### `hermes doctor` 显示缺少 ripgrep 或 Node

使用 Termux 包安装它们：

```bash
pkg install ripgrep nodejs
```

### 安装 Python 包时构建失败

确保已安装构建工具链：

```bash
pkg install clang rust make pkg-config libffi openssl
```

然后重试：

```bash
python -m pip install -e '.[termux]' -c constraints-termux.txt
```

---

## 手机上的已知限制

- Docker 后端不可用
- 通过 `faster-whisper` 的本地语音转录在测试路径中不可用
- 浏览器自动化设置被安装程序有意跳过
- 某些可选额外功能可能有效，但当前仅将 `.[termux]` 记录为经过测试的 Android 捆绑包

如果您遇到新的 Android 特定问题，请开启 GitHub issue 并提供：
- 您的 Android 版本
- `termux-info`
- `python --version`
- `hermes doctor`
- 确切的安装命令和完整的错误输出
