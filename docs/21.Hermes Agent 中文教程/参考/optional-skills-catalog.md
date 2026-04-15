---
title: "可选技能目录"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/optional-skills-catalog
description: "可选技能目录"
---


# 可选技能目录

本文档的完整中文翻译正在进行中。

## 概述

可选技能目录。

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



# Optional Skills Catalog

Official optional skills ship with the hermes-agent repository under `optional-skills/` but are **not active by default**. Install them explicitly:

```bash
hermes skills install official/<category>/<skill>
```

For example:

```bash
hermes skills install official/blockchain/solana
hermes skills install official/mlops/flash-attention
```

Once installed, the skill appears in the agent's skill list and can be loaded automatically when relevant tasks are detected.

To uninstall:

```bash
hermes skills uninstall <skill-name>
```

---

## Autonomous AI Agents

| Skill | Description |
|-------|-------------|
| **blackbox** | Delegate coding tasks to Blackbox AI CLI agent. Multi-model agent with built-in judge that runs tasks through multiple LLMs and picks the best result. |
| **honcho** | Configure and use Honcho memory with Hermes — cross-session user modeling, multi-profile peer isolation, observation config, and dialectic reasoning. |

## Blockchain

| Skill | Description |
|-------|-------------|
| **base** | Query Base (Ethereum L2) blockchain data with USD pricing — wallet balances, token info, transaction details, gas analysis, contract inspection, whale detection, and live network stats. No API key required. |
| **solana** | Query Solana blockchain data with USD pricing — wallet balances, token portfolios, transaction details, NFTs, whale detection, and live network stats. No API key required. |

## Communication

| Skill | Description |
|-------|-------------|
| **one-three-one-rule** | Structured communication framework for proposals and decision-making. |

## Creative

| Skill | Description |
|-------|-------------|
| **blender-mcp** | Control Blender directly from Hermes via socket connection to the blender-mcp addon. Create 3D objects, materials, animations, and run arbitrary Blender Python (bpy) code. |
| **meme-generation** | Generate real meme images by picking a template and overlaying text with Pillow. Produces actual `.png...

*[完整翻译即将推出]*
