---
title: "从 OpenClaw 迁移"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/migrate-from-openclaw
description: "从 OpenClaw 迁移到 Hermes"
---


# 从 OpenClaw 迁移

本文档的完整中文翻译正在进行中。

## 概述

从 OpenClaw 迁移到 Hermes。

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



# Migrate from OpenClaw

`hermes claw migrate` imports your OpenClaw (or legacy Clawdbot/Moldbot) setup into Hermes. This guide covers exactly what gets migrated, the config key mappings, and what to verify after migration.

## Quick start

```bash
# Preview then migrate (always shows a preview first, then asks to confirm)
hermes claw migrate

# Preview only, no changes
hermes claw migrate --dry-run

# Full migration including API keys, skip confirmation
hermes claw migrate --preset full --yes
```

The migration always shows a full preview of what will be imported before making any changes. Review the list, then confirm to proceed.

Reads from `~/.openclaw/` by default. Legacy `~/.clawdbot/` or `~/.moltbot/` directories are detected automatically. Same for legacy config filenames (`clawdbot.json`, `moltbot.json`).

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview only — stop after showing what would be migrated. |
| `--preset <name>` | `full` (default, includes secrets) or `user-data` (excludes API keys). |
| `--overwrite` | Overwrite existing Hermes files on conflicts (default: skip). |
| `--migrate-secrets` | Include API keys (on by default with `--preset full`). |
| `--source <path>` | Custom OpenClaw directory. |
| `--workspace-target <path>` | Where to place `AGENTS.md`. |
| `--skill-conflict <mode>` | `skip` (default), `overwrite`, or `rename`. |
| `--yes` | Skip the confirmation prompt after preview. |

## What gets migrated

### Persona, memory, and instructions

| What | OpenClaw source | Hermes destination | Notes |
|------|----------------|-------------------|-------|
| Persona | `workspace/SOUL.md` | `~/.hermes/SOUL.md` | Direct copy |
| Workspace instructions | `workspace/AGENTS.md` | `AGENTS.md` in `--workspace-target` | Requires `--workspace-target` flag |
| Long-term memory | `workspace/MEMORY.md` | `~/.hermes/memories/MEMORY.md` | Parsed into entries, merged with existing, deduped. Uses `§` delimiter. |
| User ...

*[完整翻译即将推出]*
