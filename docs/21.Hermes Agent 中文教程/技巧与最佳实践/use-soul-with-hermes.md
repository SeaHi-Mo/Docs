---
title: "在 Hermes 中使用 SOUL"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/use-soul-with-hermes
description: "使用 SOUL 个性化"
---


# 在 Hermes 中使用 SOUL

本文档的完整中文翻译正在进行中。

## 概述

使用 SOUL 个性化。

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



# Use SOUL.md with Hermes

`SOUL.md` is the **primary identity** for your Hermes instance. It's the first thing in the system prompt — it defines who the agent is, how it speaks, and what it avoids.

If you want Hermes to feel like the same assistant every time you talk to it — or if you want to replace the Hermes persona entirely with your own — this is the file to use.

## What SOUL.md is for

Use `SOUL.md` for:
- tone
- personality
- communication style
- how direct or warm Hermes should be
- what Hermes should avoid stylistically
- how Hermes should relate to uncertainty, disagreement, and ambiguity

In short:
- `SOUL.md` is about who Hermes is and how Hermes speaks

## What SOUL.md is not for

Do not use it for:
- repo-specific coding conventions
- file paths
- commands
- service ports
- architecture notes
- project workflow instructions

Those belong in `AGENTS.md`.

A good rule:
- if it should apply everywhere, put it in `SOUL.md`
- if it only belongs to one project, put it in `AGENTS.md`

## Where it lives

Hermes now uses only the global SOUL file for the current instance:

```text
~/.hermes/SOUL.md
```

If you run Hermes with a custom home directory, it becomes:

```text
$HERMES_HOME/SOUL.md
```

## First-run behavior

Hermes automatically seeds a starter `SOUL.md` for you if one does not already exist.

That means most users now begin with a real file they can read and edit immediately.

Important:
- if you already have a `SOUL.md`, Hermes does not overwrite it
- if the file exists but is empty, Hermes adds nothing from it to the prompt

## How Hermes uses it

When Hermes starts a session, it reads `SOUL.md` from `HERMES_HOME`, scans it for prompt-injection patterns, truncates it if needed, and uses it as the **agent identity** — slot #1 in the system prompt. This means SOUL.md completely replaces the built-in default identity text.

If SOUL.md is missing, empty, or cannot be loaded, Hermes falls back to a built-in default identity.

No wrapper language...

*[完整翻译即将推出]*
