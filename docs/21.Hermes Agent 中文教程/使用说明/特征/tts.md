---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 语音与 TTS
description: 跨所有平台的文本转语音和语音消息转录
permalink: /hermes/user-guide/features/tts
---

# 语音与 TTS

Hermes Agent 支持跨所有消息平台的文本转语音输出和语音消息转录。

## 文本转语音

使用六个提供商将文本转换为语音：

| 提供商 | 质量 | 成本 | API 密钥 |
|----------|---------|------|---------|
| **Edge TTS** (默认) | 好 | 免费 | 无需 |
| **ElevenLabs** | 优秀 | 付费 | `ELEVENLABS_API_KEY` |
| **OpenAI TTS** | 好 | 付费 | `VOICE_TOOLS_OPENAI_KEY` |
| **MiniMax TTS** | 优秀 | 付费 | `MINIMAX_API_KEY` |
| **Mistral (Voxtral TTS)** | 优秀 | 付费 | `MISTRAL_API_KEY` |
| **NeuTTS** | 好 | 免费 | 无需 |

### 平台交付

| 平台 | 交付方式 | 格式 |
|----------|----------|--------|
| Telegram | 语音气泡（内联播放）| Opus `.ogg` |
| Discord | 语音气泡（Opus/OGG），回退到文件附件 | Opus/MP3 |
| WhatsApp | 音频文件附件 | MP3 |
| CLI | 保存到 `~/.hermes/audio_cache/` | MP3 |

### 配置

```yaml
# 在 ~/.hermes/config.yaml 中
tts:
  provider: "edge"              # "edge" | "elevenlabs" | "openai" | "minimax" | "mistral" | "neutts"
  edge:
    voice: "en-US-AriaNeural"   # 322 种语音，74 种语言
  elevenlabs:
    voice_id: "pNInz6obpgDQGcFmaJgB"  # Adam
    model_id: "eleven_multilingual_v2"
  openai:
    model: "gpt-4o-mini-tts"
    voice: "alloy"              # alloy, echo, fable, onyx, nova, shimmer
    base_url: "https://api.openai.com/v1"  # 覆盖 OpenAI 兼容 TTS 端点
  minimax:
    model: "speech-2.8-hd"     # speech-2.8-hd (默认), speech-2.8-turbo
    voice_id: "English_Graceful_Lady"  # 见 https://platform.minimax.io/faq/system-voice-id
    speed: 1                    # 0.5 - 2.0
    vol: 1                      # 0 - 10
    pitch: 0                    # -12 - 12
  mistral:
    model: "voxtral-mini-tts-2603"
    voice_id: "c69964a6-ab8b-4f8a-9465-ec0925096ec8"  # Paul - 中性 (默认)
  neutts:
    ref_audio: ''
    ref_text: ''
    model: neuphonic/neutts-air-q4-gguf
    device: cpu
```

### Telegram 语音气泡与 ffmpeg

Telegram 语音气泡需要 Opus/OGG 音频格式：

- **OpenAI、ElevenLabs 和 Mistral** 原生产生 Opus —— 无需额外设置
- **Edge TTS** (默认) 输出 MP3 并需要 **ffmpeg** 进行转换：
- **MiniMax TTS** 输出 MP3 并需要 **ffmpeg** 转换为 Telegram 语音气泡
- **NeuTTS** 输出 WAV 并需要 **ffmpeg** 转换为 Telegram 语音气泡

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Fedora
sudo dnf install ffmpeg
```

没有 ffmpeg，Edge TTS、MiniMax TTS 和 NeuTTS 音频将作为常规音频文件发送（可播放，但显示为矩形播放器而不是语音气泡）。

:::tip
如果您想要语音气泡而不安装 ffmpeg，请切换到 OpenAI、ElevenLabs 或 Mistral 提供商。
:::
## 语音消息转录 (STT)

在 Telegram、Discord、WhatsApp、Slack 或 Signal 上发送的语音消息会自动转录并作为文本注入对话中。Agent 将转录视为正常文本。

| 提供商 | 质量 | 成本 | API 密钥 |
|----------|---------|------|---------| 
| **本地 Whisper** (默认) | 好 | 免费 | 无需 |
| **Groq Whisper API** | 好–最佳 | 免费套餐 | `GROQ_API_KEY` |
| **OpenAI Whisper API** | 好–最佳 | 付费 | `VOICE_TOOLS_OPENAI_KEY` 或 `OPENAI_API_KEY` |

:::info 零配置
本地转录在安装 `faster-whisper` 后开箱即用。如果不可用，Hermes 还可以使用来自常见安装位置（如 `/opt/homebrew/bin`）的本地 `whisper` CLI 或通过 `HERMES_LOCAL_STT_COMMAND` 的自定义命令。
:::
### 配置

```yaml
# 在 ~/.hermes/config.yaml 中
stt:
  provider: "local"           # "local" | "groq" | "openai"
  local:
    model: "base"             # tiny, base, small, medium, large-v3
  openai:
    model: "whisper-1"        # whisper-1, gpt-4o-mini-transcribe, gpt-4o-transcribe
```

### 提供商详情

**本地 (faster-whisper)** — 通过 [faster-whisper](https://github.com/SYSTRAN/faster-whisper) 本地运行 Whisper。默认使用 CPU，如果可用则使用 GPU。模型大小：

| 模型 | 大小 | 速度 | 质量 |
|-------|------|-------|---------|
| `tiny` | ~75 MB | 最快 | 基本 |
| `base` | ~150 MB | 快 | 好 (默认) |
| `small` | ~500 MB | 中等 | 更好 |
| `medium` | ~1.5 GB | 较慢 | 很棒 |
| `large-v3` | ~3 GB | 最慢 | 最佳 |

**Groq API** — 需要 `GROQ_API_KEY`。当您想要免费托管 STT 选项时，这是一个好的云端后备。

**OpenAI API** — 首先接受 `VOICE_TOOLS_OPENAI_KEY`，然后回退到 `OPENAI_API_KEY`。支持 `whisper-1`、`gpt-4o-mini-transcribe` 和 `gpt-4o-transcribe`。

**自定义本地 CLI 回退** — 如果您希望 Hermes 直接调用本地转录命令，请设置 `HERMES_LOCAL_STT_COMMAND`。命令模板支持 `{input_path}`、`{output_dir}`、`{language}` 和 `{model}` 占位符。

### 回退行为

如果配置的提供商不可用，Hermes 会自动回退：
- **本地 faster-whisper 不可用** → 尝试本地 `whisper` CLI 或 `HERMES_LOCAL_STT_COMMAND`，然后是云端提供商
- **Groq 密钥未设置** → 回退到本地转录，然后是 OpenAI
- **OpenAI 密钥未设置** → 回退到本地转录，然后是 Groq
- **都不可用** → 语音消息通过并附带准确说明传递给用户
