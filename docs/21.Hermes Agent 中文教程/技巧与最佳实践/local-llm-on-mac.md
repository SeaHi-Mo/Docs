---
title: "Mac 上的本地 LLM"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/local-llm-on-mac
description: "在 Mac 上设置本地 LLM"
---


# Mac 上的本地 LLM

本文档的完整中文翻译正在进行中。

## 概述

在 Mac 上设置本地 LLM。

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



# Run Local LLMs on Mac

This guide walks you through running a local LLM server on macOS with an OpenAI-compatible API. You get full privacy, zero API costs, and surprisingly good performance on Apple Silicon.

We cover two backends:

| Backend | Install | Best at | Format |
|---------|---------|---------|--------|
| **llama.cpp** | `brew install llama.cpp` | Fastest time-to-first-token, quantized KV cache for low memory | GGUF |
| **omlx** | [omlx.ai](https://omlx.ai) | Fastest token generation, native Metal optimization | MLX (safetensors) |

Both expose an OpenAI-compatible `/v1/chat/completions` endpoint. Hermes works with either one — just point it at `http://localhost:8080` or `http://localhost:8000`.

:::info Apple Silicon only
This guide targets Macs with Apple Silicon (M1 and later). Intel Macs will work with llama.cpp but without GPU acceleration — expect significantly slower performance.
:::

---

## Choosing a model

For getting started, we recommend **Qwen3.5-9B** — it's a strong reasoning model that fits comfortably in 8GB+ of unified memory with quantization.

| Variant | Size on disk | RAM needed (128K context) | Backend |
|---------|-------------|---------------------------|---------|
| Qwen3.5-9B-Q4_K_M (GGUF) | 5.3 GB | ~10 GB with quantized KV cache | llama.cpp |
| Qwen3.5-9B-mlx-lm-mxfp4 (MLX) | ~5 GB | ~12 GB | omlx |

**Memory rule of thumb:** model size + KV cache. A 9B Q4 model is ~5 GB. The KV cache at 128K context with Q4 quantization adds ~4-5 GB. With default (f16) KV cache, that balloons to ~16 GB. The quantized KV cache flags in llama.cpp are the key trick for memory-constrained systems.

For larger models (27B, 35B), you'll need 32 GB+ of unified memory. The 9B is the sweet spot for 8-16 GB machines.

---

## Option A: llama.cpp

llama.cpp is the most portable local LLM runtime. On macOS it uses Metal for GPU acceleration out of the box.

### Install

```bash
brew install llama.cpp
```

This gives you the `llama-server` command glo...

*[完整翻译即将推出]*
