---
title: "在 Hermes 中使用语音模式"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/use-voice-mode-with-hermes
description: "使用语音模式"
---


# 在 Hermes 中使用语音模式

本文档的完整中文翻译正在进行中。

## 概述

使用语音模式。

## 快速开始

```bash
hermes help
hermes config
hermes skills
```

## 相关链接

- [配置指南](../user-guide/configuration.md)
- [技能系统](../user-guide/features/skills.md)
- [CLI 参考](../reference/cli-commands.md)

## 获取帮助

如需帮助，请运行 `hermes doctor` 或访问 [GitHub Issues](https://github.com/NousResearch/hermes-agent/issues)。

---

*原文档内容：*



# Use Voice Mode with Hermes

This guide is the practical companion to the [Voice Mode feature reference](/docs/user-guide/features/voice-mode).

If the feature page explains what voice mode can do, this guide shows how to actually use it well.

## What voice mode is good for

Voice mode is especially useful when:
- you want a hands-free CLI workflow
- you want spoken responses in Telegram or Discord
- you want Hermes sitting in a Discord voice channel for live conversation
- you want quick idea capture, debugging, or back-and-forth while walking around instead of typing

## Choose your voice mode setup

There are really three different voice experiences in Hermes.

| Mode | Best for | Platform |
|---|---|---|
| Interactive microphone loop | Personal hands-free use while coding or researching | CLI |
| Voice replies in chat | Spoken responses alongside normal messaging | Telegram, Discord |
| Live voice channel bot | Group or personal live conversation in a VC | Discord voice channels |

A good path is:
1. get text working first
2. enable voice replies second
3. move to Discord voice channels last if you want the full experience

## Step 1: make sure normal Hermes works first

Before touching voice mode, verify that:
- Hermes starts
- your provider is configured
- the agent can answer text prompts normally

```bash
hermes
```

Ask something simple:

```text
What tools do you have available?
```

If that is not solid yet, fix text mode first.

## Step 2: install the right extras

### CLI microphone + playback

```bash
pip install "hermes-agent[voice]"
```

### Messaging platforms

```bash
pip install "hermes-agent[messaging]"
```

### Premium ElevenLabs TTS

```bash
pip install "hermes-agent[tts-premium]"
```

### Local NeuTTS (optional)

```bash
python -m pip install -U neutts[all]
```

### Everything

```bash
pip install "hermes-agent[all]"
```

## Step 3: install system dependencies

### macOS

```bash
brew install portaudio ffmpeg opus
brew install espeak-ng
``...

*[完整翻译即将推出]*
