---
title: "使用技能"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/work-with-skills
description: "如何使用和创建技能"
---


# 使用技能

本文档的完整中文翻译正在进行中。

## 概述

如何使用和创建技能。

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



# Working with Skills

Skills are on-demand knowledge documents that teach Hermes how to handle specific tasks — from generating ASCII art to managing GitHub PRs. This guide walks you through using them day to day.

For the full technical reference, see [Skills System](/docs/user-guide/features/skills).

---

## Finding Skills

Every Hermes installation ships with bundled skills. See what's available:

```bash
# In any chat session:
/skills

# Or from the CLI:
hermes skills list
```

This shows a compact list with names and descriptions:

```
ascii-art         Generate ASCII art using pyfiglet, cowsay, boxes...
arxiv             Search and retrieve academic papers from arXiv...
github-pr-workflow Full PR lifecycle — create branches, commit...
plan              Plan mode — inspect context, write a markdown...
excalidraw        Create hand-drawn style diagrams using Excalidraw...
```

### Searching for a Skill

```bash
# Search by keyword
/skills search docker
/skills search music
```

### The Skills Hub

Official optional skills (heavier or niche skills not active by default) are available via the Hub:

```bash
# Browse official optional skills
/skills browse

# Search the hub
/skills search blockchain
```

---

## Using a Skill

Every installed skill is automatically a slash command. Just type its name:

```bash
# Load a skill and give it a task
/ascii-art Make a banner that says "HELLO WORLD"
/plan Design a REST API for a todo app
/github-pr-workflow Create a PR for the auth refactor

# Just the skill name (no task) loads it and lets you describe what you need
/excalidraw
```

You can also trigger skills through natural conversation — ask Hermes to use a specific skill, and it will load it via the `skill_view` tool.

### Progressive Disclosure

Skills use a token-efficient loading pattern. The agent doesn't load everything at once:

1. **`skills_list()`** — compact list of all skills (~3k tokens). Loaded at session start.
2. **`skill_view(name)`** — full SKILL.md...

*[完整翻译即将推出]*
