---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 语音模式
description: 与 Hermes Agent 的实时语音对话 —— CLI、Telegram、Discord（私信、文本频道和语音频道）
permalink: /hermes/user-guide/features/voice-mode
---

# 语音模式

Hermes Agent 支持跨 CLI 和消息平台的完整语音交互。使用麦克风与智能体对话，听到语音回复，并在 Discord 语音频道中进行实时语音对话。

如果您想要带有推荐配置和实际使用模式的实用设置演练，请参阅 [在 Hermes 中使用语音模式](/docs/guides/use-voice-mode-with-hermes)。

## 先决条件

在使用语音功能之前，请确保您有：

1. **已安装 Hermes Agent** —— `pip install hermes-agent`（请参阅 [安装](/docs/getting-started/installation)）
2. **已配置 LLM 提供商** —— 运行 `hermes model` 或在 `~/.hermes/.env` 中设置您首选的提供商凭据
3. **工作的基础设置** —— 运行 `hermes` 以验证智能体在启用语音之前响应文本

:::tip
第一次运行 `hermes` 时会自动创建 `~/.hermes/` 目录和默认 `config.yaml`。您只需要手动创建 `~/.hermes/.env` 以获取 API 密钥。
:::
## 概述

| 功能 | 平台 | 描述 |
|---------|----------|-------------|
| **交互式语音** | CLI | 按 Ctrl+B 录音，智能体自动检测静音并响应 |
| **自动语音回复** | Telegram, Discord | 智能体随文本响应一起发送语音音频 |
| **语音频道** | Discord | 机器人加入 VC，监听用户说话，回语音回复 |

## 要求

### Python 包

```bash
# CLI 语音模式（麦克风 + 音频播放）
pip install "hermes-agent[voice]"

# Discord + Telegram 消息（包括用于 VC 支持的 discord.py[voice]）
pip install "hermes-agent[messaging]"

# 高级 TTS（ElevenLabs）
pip install "hermes-agent[tts-premium]"

# 本地 TTS（NeuTTS，可选）
python -m pip install -U neutts[all]

# 一次性安装所有
pip install "hermes-agent[all]"
```

| 附加组件 | 包 | 需要用于 |
|-------|----------|-------------|
| `voice` | `sounddevice`, `numpy` | CLI 语音模式 |
| `messaging` | `discord.py[voice]`, `python-telegram-bot`, `aiohttp` | Discord 和 Telegram 机器人 |
| `tts-premium` | `elevenlabs` | ElevenLabs TTS 提供商 |

可选本地 TTS 提供商：使用 `python -m pip install -U neutts[all]` 单独安装 `neutts`。首次使用时自动下载模型。

:::info
`discord.py[voice]` 自动安装 **PyNaCl**（用于语音加密）和 **opus 绑定**。这是 Discord 语音频道支持所必需的。
:::
### 系统依赖

```bash
# macOS
brew install portaudio ffmpeg opus
brew install espeak-ng   # 用于 NeuTTS

# Ubuntu/Debian
sudo apt install portaudio19-dev ffmpeg libopus0
sudo apt install espeak-ng   # 用于 NeuTTS
```

| 依赖 | 目的 | 需要用于 |
|-----------|---------|-------------|
| **PortAudio** | 麦克风输入和音频播放 | CLI 语音模式 |
| **ffmpeg** | 音频格式转换（MP3 → Opus，PCM → WAV） | 所有平台 |
| **Opus** | Discord 语音编解码器 | Discord 语音频道 |
| **espeak-ng** | 音素器后端 | 本地 NeuTTS 提供商 |

### API 密钥

添加到 `~/.hermes/.env`：

```bash
# 语音转文本 —— 本地提供商完全不需要密钥
# pip install faster-whisper          # 免费，本地运行，推荐
GROQ_API_KEY=your-key                 # Groq Whisper —— 快速，免费层级（云端）
VOICE_TOOLS_OPENAI_KEY=your-key       # OpenAI Whisper —— 付费（云端）

# 文本转语音（可选 —— Edge TTS 和 NeuTTS 无需任何密钥即可工作）
ELEVENLABS_API_KEY=***           # ElevenLabs —— 高级质量
# 上面的 VOICE_TOOLS_OPENAI_KEY 也启用 OpenAI TTS
```

:::tip
如果安装了 `faster-whisper`，语音模式对 STT 使用**零 API 密钥**。模型（`base` 约 150 MB）在首次使用时自动下载。
:::
---

## CLI 语音模式

### 快速开始

启动 CLI 并启用语音模式：

```bash
hermes                # 启动交互式 CLI
```

然后在 CLI 中使用这些命令：

```
/voice          切换语音模式开/关
/voice on       启用语音模式
/voice off      禁用语音模式
/voice tts      切换 TTS 输出
/voice status   显示当前状态
```

### 工作原理

1. 使用 `hermes` 启动 CLI 并使用 `/voice on` 启用语音模式
2. **按 Ctrl+B** —— 播放蜂鸣声（880Hz），录音开始
3. **说话** —— 实时音频电平条显示您的输入：`● [▁▂▃▅▇▇▅▂] ❯`
4. **停止说话** —— 3 秒静音后，录音自动停止
5. 播放**两声蜂鸣**（660Hz）确认录音结束
6. 音频通过 Whisper 转录并发送给智能体
7. 如果启用 TTS，智能体的回复会大声朗读
8. 录音**自动重启** —— 无需按任何键再次说话

此循环继续，直到您在录音期间按 **Ctrl+B**（退出连续模式）或 3 次连续录音检测到没有语音。

:::tip
录音键可通过 `~/.hermes/config.yaml` 中的 `voice.record_key` 配置（默认：`ctrl+b`）。
:::
### 静音检测

两阶段算法检测您何时说完：

1. **语音确认** —— 等待音频高于 RMS 阈值（200）至少 0.3 秒，容忍音节之间的短暂下降
2. **结束检测** —— 一旦确认语音，在 3.0 秒连续静音后触发

如果 15 秒内根本没有检测到语音，录音自动停止。
