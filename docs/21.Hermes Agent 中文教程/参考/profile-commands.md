---
title: "配置文件命令"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/profile-commands
description: "配置文件管理命令"
---


# 配置文件命令

本文档的完整中文翻译正在进行中。

## 概述

配置文件管理命令。

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



# Profile Commands Reference

This page covers all commands related to [Hermes profiles](../user-guide/profiles.md). For general CLI commands, see [CLI Commands Reference](./cli-commands.md).

## `hermes profile`

```bash
hermes profile <subcommand>
```

Top-level command for managing profiles. Running `hermes profile` without a subcommand shows help.

| Subcommand | Description |
|------------|-------------|
| `list` | List all profiles. |
| `use` | Set the active (default) profile. |
| `create` | Create a new profile. |
| `delete` | Delete a profile. |
| `show` | Show details about a profile. |
| `alias` | Regenerate the shell alias for a profile. |
| `rename` | Rename a profile. |
| `export` | Export a profile to a tar.gz archive. |
| `import` | Import a profile from a tar.gz archive. |

## `hermes profile list`

```bash
hermes profile list
```

Lists all profiles. The currently active profile is marked with `*`.

**Example:**

```bash
$ hermes profile list
  default
* work
  dev
  personal
```

No options.

## `hermes profile use`

```bash
hermes profile use <name>
```

Sets `<name>` as the active profile. All subsequent `hermes` commands (without `-p`) will use this profile.

| Argument | Description |
|----------|-------------|
| `<name>` | Profile name to activate. Use `default` to return to the base profile. |

**Example:**

```bash
hermes profile use work
hermes profile use default
```

## `hermes profile create`

```bash
hermes profile create <name> [options]
```

Creates a new profile.

| Argument / Option | Description |
|-------------------|-------------|
| `<name>` | Name for the new profile. Must be a valid directory name (alphanumeric, hyphens, underscores). |
| `--clone` | Copy `config.yaml`, `.env`, and `SOUL.md` from the current profile. |
| `--clone-all` | Copy everything (config, memories, skills, sessions, state) from the current profile. |
| `--clone-from <profile>` | Clone from a specific profile instead of the current one. Used with `--clo...

*[完整翻译即将推出]*
