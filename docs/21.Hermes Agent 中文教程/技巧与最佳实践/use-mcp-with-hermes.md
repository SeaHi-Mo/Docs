---
title: "在 Hermes 中使用 MCP"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/guides/use-mcp-with-hermes
description: "使用 MCP 与 Hermes"
---


# 在 Hermes 中使用 MCP

本文档的完整中文翻译正在进行中。

## 概述

使用 MCP 与 Hermes。

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



# Use MCP with Hermes

This guide shows how to actually use MCP with Hermes Agent in day-to-day workflows.

If the feature page explains what MCP is, this guide is about how to get value from it quickly and safely.

## When should you use MCP?

Use MCP when:
- a tool already exists in MCP form and you do not want to build a native Hermes tool
- you want Hermes to operate against a local or remote system through a clean RPC layer
- you want fine-grained per-server exposure control
- you want to connect Hermes to internal APIs, databases, or company systems without modifying Hermes core

Do not use MCP when:
- a built-in Hermes tool already solves the job well
- the server exposes a huge dangerous tool surface and you are not prepared to filter it
- you only need one very narrow integration and a native tool would be simpler and safer

## Mental model

Think of MCP as an adapter layer:

- Hermes remains the agent
- MCP servers contribute tools
- Hermes discovers those tools at startup or reload time
- the model can use them like normal tools
- you control how much of each server is visible

That last part matters. Good MCP usage is not just “connect everything.” It is “connect the right thing, with the smallest useful surface.”

## Step 1: install MCP support

If you installed Hermes with the standard install script, MCP support is already included (the installer runs `uv pip install -e ".[all]"`).

If you installed without extras and need to add MCP separately:

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

For npm-based servers, make sure Node.js and `npx` are available.

For many Python MCP servers, `uvx` is a nice default.

## Step 2: add one server first

Start with a single, safe server.

Example: filesystem access to one project directory only.

```yaml
mcp_servers:
  project_fs:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/my-project"]
```

Then start Hermes:

```bash
hermes chat
```

Now ask ...

*[完整翻译即将推出]*
