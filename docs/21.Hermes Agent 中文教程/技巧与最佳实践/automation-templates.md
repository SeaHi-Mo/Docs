---
title: "自动化模板"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/automation-templates
description: "常见自动化任务的模板"
---


# 自动化模板

本文档的完整中文翻译正在进行中。

## 概述

常见自动化任务的模板。

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



# Automation Templates

Copy-paste recipes for common automation patterns. Each template uses Hermes's built-in [cron scheduler](/docs/user-guide/features/cron) for time-based triggers and [webhook platform](/docs/user-guide/messaging/webhooks) for event-driven triggers.

Every template works with **any model** — not locked to a single provider.

:::tip Three Trigger Types
| Trigger | How | Tool |
|---------|-----|------|
| **Schedule** | Runs on a cadence (hourly, nightly, weekly) | `cronjob` tool or `/cron` slash command |
| **GitHub Event** | Fires on PR opens, pushes, issues, CI results | Webhook platform (`hermes webhook subscribe`) |
| **API Call** | External service POSTs JSON to your endpoint | Webhook platform (config.yaml routes or `hermes webhook subscribe`) |

All three support delivery to Telegram, Discord, Slack, SMS, email, GitHub comments, or local files.
:::

---

## Development Workflow

### Nightly Backlog Triage

Label, prioritize, and summarize new issues every night. Delivers a digest to your team channel.

**Trigger:** Schedule (nightly)

```bash
hermes cron create "0 2 * * *" \
  "You are a project manager triaging the NousResearch/hermes-agent GitHub repo.

1. Run: gh issue list --repo NousResearch/hermes-agent --state open --json number,title,labels,author,createdAt --limit 30
2. Identify issues opened in the last 24 hours
3. For each new issue:
   - Suggest a priority label (P0-critical, P1-high, P2-medium, P3-low)
   - Suggest a category label (bug, feature, docs, security)
   - Write a one-line triage note
4. Summarize: total open issues, new today, breakdown by priority

Format as a clean digest. If no new issues, respond with [SILENT]." \
  --name "Nightly backlog triage" \
  --deliver telegram
```

### Automatic PR Code Review

Review every pull request automatically when it's opened. Posts a review comment directly on the PR.

**Trigger:** GitHub webhook

**Option A — Dynamic subscription (CLI):**

```bash
hermes webhook subscribe ...

*[完整翻译即将推出]*
