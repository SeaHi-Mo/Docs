---
title: "工具集参考"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/toolsets-reference
description: "Hermes 工具集参考"
---


# 工具集参考

本文档的完整中文翻译正在进行中。

## 概述

Hermes 工具集参考。

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



# Toolsets Reference

Toolsets are named bundles of tools that control what the agent can do. They're the primary mechanism for configuring tool availability per platform, per session, or per task.

## How Toolsets Work

Every tool belongs to exactly one toolset. When you enable a toolset, all tools in that bundle become available to the agent. Toolsets come in three kinds:

- **Core** — A single logical group of related tools (e.g., `file` bundles `read_file`, `write_file`, `patch`, `search_files`)
- **Composite** — Combines multiple core toolsets for a common scenario (e.g., `debugging` bundles file, terminal, and web tools)
- **Platform** — A complete tool configuration for a specific deployment context (e.g., `hermes-cli` is the default for interactive CLI sessions)

## Configuring Toolsets

### Per-session (CLI)

```bash
hermes chat --toolsets web,file,terminal
hermes chat --toolsets debugging        # composite — expands to file + terminal + web
hermes chat --toolsets all              # everything
```

### Per-platform (config.yaml)

```yaml
toolsets:
  - hermes-cli          # default for CLI
  # - hermes-telegram   # override for Telegram gateway
```

### Interactive management

```bash
hermes tools                            # curses UI to enable/disable per platform
```

Or in-session:

```
/tools list
/tools disable browser
/tools enable rl
```

## Core Toolsets

| Toolset | Tools | Purpose |
|---------|-------|---------|
| `browser` | `browser_back`, `browser_click`, `browser_console`, `browser_get_images`, `browser_navigate`, `browser_press`, `browser_scroll`, `browser_snapshot`, `browser_type`, `browser_vision`, `web_search` | Full browser automation. Includes `web_search` as a fallback for quick lookups. |
| `clarify` | `clarify` | Ask the user a question when the agent needs clarification. |
| `code_execution` | `execute_code` | Run Python scripts that call Hermes tools programmatically. |
| `cronjob` | `cronjob` | Schedule and manage recurring task...

*[完整翻译即将推出]*
