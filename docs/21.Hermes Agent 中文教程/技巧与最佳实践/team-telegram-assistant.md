---
title: "团队 Telegram 助手"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/team-telegram-assistant
description: "为团队设置 Telegram 助手"
---


# 团队 Telegram 助手

本文档的完整中文翻译正在进行中。

## 概述

为团队设置 Telegram 助手。

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



# Set Up a Team Telegram Assistant

This tutorial walks you through setting up a Telegram bot powered by Hermes Agent that multiple team members can use. By the end, your team will have a shared AI assistant they can message for help with code, research, system administration, and anything else — secured with per-user authorization.

## What We're Building

A Telegram bot that:

- **Any authorized team member** can DM for help — code reviews, research, shell commands, debugging
- **Runs on your server** with full tool access — terminal, file editing, web search, code execution
- **Per-user sessions** — each person gets their own conversation context
- **Secure by default** — only approved users can interact, with two authorization methods
- **Scheduled tasks** — daily standups, health checks, and reminders delivered to a team channel

---

## Prerequisites

Before starting, make sure you have:

- **Hermes Agent installed** on a server or VPS (not your laptop — the bot needs to stay running). Follow the [installation guide](/docs/getting-started/installation) if you haven't yet.
- **A Telegram account** for yourself (the bot owner)
- **An LLM provider configured** — at minimum, an API key for OpenAI, Anthropic, or another supported provider in `~/.hermes/.env`

:::tip
A $5/month VPS is plenty for running the gateway. Hermes itself is lightweight — the LLM API calls are what cost money, and those happen remotely.
:::

---

## Step 1: Create a Telegram Bot

Every Telegram bot starts with **@BotFather** — Telegram's official bot for creating bots.

1. **Open Telegram** and search for `@BotFather`, or go to [t.me/BotFather](https://t.me/BotFather)

2. **Send `/newbot`** — BotFather will ask you two things:
   - **Display name** — what users see (e.g., `Team Hermes Assistant`)
   - **Username** — must end in `bot` (e.g., `myteam_hermes_bot`)

3. **Copy the bot token** — BotFather replies with something like:
   ```
   Use this token to access the HTTP API:
   7123456789...

*[完整翻译即将推出]*
