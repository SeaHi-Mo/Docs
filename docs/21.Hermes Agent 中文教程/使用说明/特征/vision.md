---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 视觉与图像粘贴
description: 将图像从剪贴板粘贴到 Hermes CLI 进行多模态视觉分析。
sidebar_label: 视觉与图像粘贴
permalink: /hermes/user-guide/features/vision
---

# 视觉与图像粘贴

Hermes Agent 支持**多模态视觉** —— 您可以将图像从剪贴板直接粘贴到 CLI 中，并要求 Agent 分析、描述或处理它们。图像作为 base64 编码的内容块发送给模型，因此任何视觉能力模型都可以处理它们。

## 工作原理

1. 将图像复制到剪贴板（截图、浏览器图像等）
2. 使用以下方法之一附加它
3. 输入您的问题并按 Enter
4. 图像显示为输入上方的 `[📎 Image #1]` 徽章
5. 提交时，图像作为视觉内容块发送给模型

您可以在发送前附加多个图像 —— 每个都有自己的徽章。按 `Ctrl+C` 清除所有附加图像。

图像以带时间戳的文件名保存为 `~/.hermes/images/` 中的 PNG 文件。

## 粘贴方法

如何附加图像取决于您的终端环境。并非所有方法在任何地方都有效 —— 这里是完整分解：

### `/paste` 命令

**最可靠的方法。随处可用。**

```
/paste
```

输入 `/paste` 并按 Enter。Hermes 检查剪贴板中的图像并附加它。这在每个环境中都有效，因为它显式调用剪贴板后端 —— 无需担心终端键绑定拦截。

### Ctrl+V / Cmd+V（括号粘贴）

当您粘贴剪贴板上的文本以及图像时，Hermes 也会自动检查图像。这在以下情况下有效：
- 您的剪贴板包含**文本和图像**（某些应用程序在复制时同时放入两者）
- 您的终端支持括号粘贴（大多数现代终端都支持）

:::warning
如果您的剪贴板**只有图像**（没有文本），Ctrl+V 在大多数终端中什么都不做。终端只能粘贴文本 —— 没有粘贴二进制图像数据的标准机制。改用 `/paste` 或 Alt+V。
:::
### Alt+V

Alt 键组合通过大多数终端模拟器（它们作为 ESC + 键发送，而不是被拦截）。按 `Alt+V` 检查剪贴板中的图像。

:::caution
**在 VSCode 的集成终端中不起作用。** VSCode 拦截许多 Alt+键组合用于自己的 UI。改用 `/paste`。
:::
### Ctrl+V（原始 —— 仅 Linux）

在 Linux 桌面终端（GNOME Terminal、Konsole、Alacritty 等）上，`Ctrl+V`**不是**粘贴快捷键 —— `Ctrl+Shift+V` 才是。因此 `Ctrl+V` 向应用程序发送原始字节，Hermes 捕获它以检查剪贴板。这仅适用于具有 X11 或 Wayland 剪贴板访问权限的 Linux 桌面终端。

## 平台兼容性

| 环境 | `/paste` | Ctrl+V 文本+图像 | Alt+V | 说明 |
|---|:---:|:---:|:---:|---|
| **macOS Terminal / iTerm2** | ✅ | ✅ | ✅ | 最佳体验 —— `osascript` 始终可用 |
| **Linux X11 桌面** | ✅ | ✅ | ✅ | 需要 `xclip` (`apt install xclip`) |
| **Linux Wayland 桌面** | ✅ | ✅ | ✅ | 需要 `wl-paste` (`apt install wl-clipboard`) |
| **WSL2 (Windows Terminal)** | ✅ | ✅¹ | ✅ | 使用 `powershell.exe` —— 无需额外安装 |
| **VSCode Terminal (本地)** | ✅ | ✅¹ | ❌ | VSCode 拦截 Alt+键 |
| **VSCode Terminal (SSH)** | ❌² | ❌² | ❌ | 无法访问远程剪贴板 |
| **SSH 终端 (任何)** | ❌² | ❌² | ❌² | 无法访问远程剪贴板 |

¹ 仅当剪贴板同时有文本和图像时（仅图像剪贴板 = 什么都不发生）
² 见下方的 [SSH 与远程会话](#ssh--远程会话)

## 平台特定设置

### macOS

**无需设置。** Hermes 使用 `osascript`（内置于 macOS）读取剪贴板。为了更快的性能，可选安装 `pngpaste`：

```bash
brew install pngpaste
```

### Linux (X11)

安装 `xclip`：

```bash
# Ubuntu/Debian
sudo apt install xclip

# Fedora
sudo dnf install xclip

# Arch
sudo pacman -S xclip
```

### Linux (Wayland)

现代 Linux 桌面（Ubuntu 22.04+、Fedora 34+）通常默认使用 Wayland。安装 `wl-clipboard`：

```bash
# Ubuntu/Debian
sudo apt install wl-clipboard

# Fedora
sudo dnf install wl-clipboard

# Arch
sudo pacman -S wl-clipboard
```

:::tip 如何检查您是否在 Wayland 上
```bash
echo $XDG_SESSION_TYPE
# "wayland" = Wayland, "x11" = X11, "tty" = 无显示服务器
```
:::
### WSL2

**无需额外设置。** Hermes 通过 `/proc/version` 自动检测 WSL2 并使用 `powershell.exe` 通过 .NET 的 `System.Windows.Forms.Clipboard` 访问 Windows 剪贴板。这内置于 WSL2 的 Windows 互操作中 —— `powershell.exe` 默认可用。

剪贴板数据通过 stdout 作为 base64 编码的 PNG 传输，因此无需文件路径转换或临时文件。

:::info WSLg 说明
如果您运行 WSLg（带 GUI 支持的 WSL2），Hermes 首先尝试 PowerShell 路径，然后回退到 `wl-paste`。WSLg 的剪贴板桥仅支持 BMP 格式的图像 —— Hermes 使用 Pillow（如果已安装）或 ImageMagick 的 `convert` 命令自动将 BMP 转换为 PNG。
:::
#### 验证 WSL2 剪贴板访问

```bash
# 1. 检查 WSL 检测
grep -i microsoft /proc/version

# 2. 检查 PowerShell 是否可访问
which powershell.exe

# 3. 复制图像，然后检查
powershell.exe -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::ContainsImage()"
# 应打印 "True"
```

## SSH 与远程会话

**剪贴板粘贴不通过 SSH 工作。** 当您 SSH 到远程机器时，Hermes CLI 在远程主机上运行。所有剪贴板工具（`xclip`、`wl-paste`、`powershell.exe`、`osascript`）读取它们运行的机器的剪贴板 —— 即远程服务器，不是您的本地机器。您的本地剪贴板从远程端无法访问。

### SSH 的解决方法

1. **上传图像文件** —— 本地保存图像，通过 `scp`、VSCode 的文件资源管理器（拖放）或任何文件传输方法上传到远程服务器。然后通过路径引用它。*(未来的版本计划支持 `/attach <filepath>` 命令。)*

2. **使用 URL** —— 如果图像可在线访问，只需在消息中粘贴 URL。Agent 可以使用 `vision_analyze` 直接查看任何图像 URL。

3. **X11 转发** —— 使用 `ssh -X` 连接以转发 X11。这让远程机器上的 `xclip` 访问您的本地 X11 剪贴板。需要在本地运行 X 服务器（macOS 上为 XQuartz，Linux X11 桌面上为内置）。大图像较慢。

4. **使用消息平台** —— 通过 Telegram、Discord、Slack 或 WhatsApp 向 Hermes 发送图像。这些平台原生处理图像上传，不受剪贴板/终端限制影响。

## 为什么终端无法粘贴图像

这是常见的困惑来源，因此这里是技术解释：

终端是**基于文本**的界面。当您按 Ctrl+V（或 Cmd+V）时，终端模拟器：

1. 读取剪贴板中的**文本内容**
2. 将其包装在[括号粘贴](https://en.wikipedia.org/wiki/Bracketed-paste)转义序列中
3. 通过终端的文本流将其发送给应用程序

如果剪贴板仅包含图像（没有文本），终端没有可发送的内容。没有二进制图像数据的标准终端转义序列。终端只是什么都不做。

这就是 Hermes 使用单独剪贴板检查的原因 —— 不是通过终端粘贴事件接收图像数据，而是通过子进程直接调用操作系统级工具（`osascript`、`powershell.exe`、`xclip`、`wl-paste`）独立读取剪贴板。

## 支持的模型

图像粘贴适用于任何视觉能力模型。图像在 OpenAI 视觉内容格式中作为 base64 编码的数据 URL 发送：

```json
{
  "type": "image_url",
  "image_url": {
    "url": "data:image/png;base64,..."
  }
}
```

大多数现代模型支持此格式，包括 GPT-4 Vision、Claude（带视觉）、Gemini 和通过 OpenRouter 服务的开源多模态模型。
