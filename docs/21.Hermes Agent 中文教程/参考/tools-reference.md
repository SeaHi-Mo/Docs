---
title: "工具参考"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/tools-reference
description: "Hermes 工具参考"
---


# 工具参考

本文档的完整中文翻译正在进行中。

## 概述

Hermes 工具参考。

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



# Built-in Tools Reference

This page documents all 47 built-in tools in the Hermes tool registry, grouped by toolset. Availability varies by platform, credentials, and enabled toolsets.

**Quick counts:** 10 browser tools, 4 file tools, 10 RL tools, 4 Home Assistant tools, 2 terminal tools, 2 web tools, and 15 standalone tools across other toolsets.

:::tip MCP Tools
In addition to built-in tools, Hermes can load tools dynamically from MCP servers. MCP tools appear with a server-name prefix (e.g., `github_create_issue` for the `github` MCP server). See [MCP Integration](/docs/user-guide/features/mcp) for configuration.
:::

## `browser` toolset

| Tool | Description | Requires environment |
|------|-------------|----------------------|
| `browser_back` | Navigate back to the previous page in browser history. Requires browser_navigate to be called first. | — |
| `browser_click` | Click on an element identified by its ref ID from the snapshot (e.g., '@e5'). The ref IDs are shown in square brackets in the snapshot output. Requires browser_navigate and browser_snapshot to be called first. | — |
| `browser_console` | Get browser console output and JavaScript errors from the current page. Returns console.log/warn/error/info messages and uncaught JS exceptions. Use this to detect silent JavaScript errors, failed API calls, and application warnings. Requi… | — |
| `browser_get_images` | Get a list of all images on the current page with their URLs and alt text. Useful for finding images to analyze with the vision tool. Requires browser_navigate to be called first. | — |
| `browser_navigate` | Navigate to a URL in the browser. Initializes the session and loads the page. Must be called before other browser tools. For simple information retrieval, prefer web_search or web_extract (faster, cheaper). Use browser tools when you need… | — |
| `browser_press` | Press a keyboard key. Useful for submitting forms (Enter), navigating (Tab), or keyboard shortcuts. Requires browser_nav...

*[完整翻译即将推出]*
