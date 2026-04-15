---
title: "每日简报机器人"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/daily-briefing-bot
description: "创建每日简报机器人的指南"
---


# 每日简报机器人

本文档的完整中文翻译正在进行中。

## 概述

创建每日简报机器人的指南。

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



# Tutorial: Build a Daily Briefing Bot

In this tutorial, you'll build a personal briefing bot that wakes up every morning, researches topics you care about, summarizes the findings, and delivers a concise briefing straight to your Telegram or Discord.

By the end, you'll have a fully automated workflow combining **web search**, **cron scheduling**, **delegation**, and **messaging delivery** — no code required.

## What We're Building

Here's the flow:

1. **8:00 AM** — The cron scheduler triggers your job
2. **Hermes spins up** a fresh agent session with your prompt
3. **Web search** pulls the latest news on your topics
4. **Summarization** distills it into a clean briefing format
5. **Delivery** sends the briefing to your Telegram or Discord

The whole thing runs hands-free. You just read your briefing with your morning coffee.

## Prerequisites

Before starting, make sure you have:

- **Hermes Agent installed** — see the [Installation guide](/docs/getting-started/installation)
- **Gateway running** — the gateway daemon handles cron execution:
  ```bash
  hermes gateway install   # Install as a user service
  sudo hermes gateway install --system   # Linux servers: boot-time system service
  # or
  hermes gateway           # Run in foreground
  ```
- **Firecrawl API key** — set `FIRECRAWL_API_KEY` in your environment for web search
- **Messaging configured** (optional but recommended) — [Telegram](/docs/user-guide/messaging/telegram) or Discord set up with a home channel

:::tip No messaging? No problem
You can still follow this tutorial using `deliver: "local"`. Briefings will be saved to `~/.hermes/cron/output/` and you can read them anytime.
:::

## Step 1: Test the Workflow Manually

Before automating anything, let's make sure the briefing works. Start a chat session:

```bash
hermes
```

Then enter this prompt:

```
Search for the latest news about AI agents and open source LLMs.
Summarize the top 3 stories in a concise briefing format with links.
```

Herme...

*[完整翻译即将推出]*
