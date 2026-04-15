---
title: "环境变量"
sidebar_position: 2
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/environment-variables
description: "Hermes Agent 使用的所有环境变量的完整参考"
---


# 环境变量参考

所有变量都放在 `~/.hermes/.env` 中。

## LLM 提供商

| 变量 | 描述 |
|----------|-------------|
| `OPENROUTER_API_KEY` | OpenRouter API 密钥 |
| `OPENAI_API_KEY` | OpenAI API 密钥 |
| `ANTHROPIC_API_KEY` | Anthropic API 密钥 |
| `GLM_API_KEY` | ZhipuAI GLM API 密钥 |
| `KIMI_API_KEY` | Moonshot AI API 密钥 |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 |
| `GEMINI_API_KEY` | Google Gemini API 密钥 |
| `MINIMAX_API_KEY` | MiniMax API 密钥 |

## 工具 API

| 变量 | 描述 |
|----------|-------------|
| `FIRECRAWL_API_KEY` | Firecrawl 网页抓取 API |
| `TAVILY_API_KEY` | Tavily 搜索 API |
| `EXA_API_KEY` | Exa 搜索 API |
| `GROQ_API_KEY` | Groq STT API |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS API |
| `GITHUB_TOKEN` | GitHub 令牌 |

## 终端后端

| 变量 | 描述 |
|----------|-------------|
| `TERMINAL_ENV` | 后端类型：local/docker/ssh |
| `TERMINAL_SSH_HOST` | SSH 主机 |
| `TERMINAL_SSH_USER` | SSH 用户名 |
| `TERMINAL_SSH_PORT` | SSH 端口 |

## 容器资源

| 变量 | 描述 |
|----------|-------------|
| `TERMINAL_CONTAINER_CPU` | CPU 核心数 |
| `TERMINAL_CONTAINER_MEMORY` | 内存 (MB) |
| `TERMINAL_CONTAINER_DISK` | 磁盘 (MB) |
