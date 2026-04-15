---
title: "技能目录"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/skills-catalog
description: "可用技能目录"
---


# 技能目录

本文档的完整中文翻译正在进行中。

## 概述

可用技能目录。

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



# Bundled Skills Catalog

Hermes ships with a large built-in skill library copied into `~/.hermes/skills/` on install. This page catalogs the bundled skills that live in the repository under `skills/`.

## apple

Apple/macOS-specific skills — iMessage, Reminders, Notes, FindMy, and macOS automation. These skills only load on macOS systems.

| Skill | Description | Path |
|-------|-------------|------|
| `apple-notes` | Manage Apple Notes via the memo CLI on macOS (create, view, search, edit). | `apple/apple-notes` |
| `apple-reminders` | Manage Apple Reminders via remindctl CLI (list, add, complete, delete). | `apple/apple-reminders` |
| `findmy` | Track Apple devices and AirTags via FindMy.app on macOS using AppleScript and screen capture. | `apple/findmy` |
| `imessage` | Send and receive iMessages/SMS via the imsg CLI on macOS. | `apple/imessage` |

## autonomous-ai-agents

Skills for spawning and orchestrating autonomous AI coding agents and multi-agent workflows — running independent agent processes, delegating tasks, and coordinating parallel workstreams.

| Skill | Description | Path |
|-------|-------------|------|
| `claude-code` | Delegate coding tasks to Claude Code (Anthropic's CLI agent). Use for building features, refactoring, PR reviews, and iterative coding. Requires the claude CLI installed. | `autonomous-ai-agents/claude-code` |
| `codex` | Delegate coding tasks to OpenAI Codex CLI agent. Use for building features, refactoring, PR reviews, and batch issue fixing. Requires the codex CLI and a git repository. | `autonomous-ai-agents/codex` |
| `hermes-agent-spawning` | Spawn additional Hermes Agent instances as autonomous subprocesses for independent long-running tasks. Supports non-interactive one-shot mode (-q) and interactive PTY mode for multi-turn collaboration. Different from delegate_task — this runs a full separate hermes process. | `autonomous-ai-agents/hermes-agent` |
| `opencode` | Delegate coding tasks to OpenCode CLI agent for feature ...

*[完整翻译即将推出]*
