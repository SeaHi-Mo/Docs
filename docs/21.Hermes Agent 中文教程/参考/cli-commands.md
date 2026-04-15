---
title: "CLI 命令参考"
sidebar_position: 1
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/cli-commands
description: "Hermes 终端命令和命令族的权威参考"
---


# CLI 命令参考

此页面涵盖您从 shell 运行的**终端命令**。

## 全局入口点

```bash
hermes [global-options] <command> [subcommand/options]
```

### 全局选项

| 选项 | 描述 |
|--------|-------------|
| `--version`, `-V` | 显示版本并退出 |
| `--profile <name>` | 选择要使用的 Hermes 配置文件 |
| `--resume <session>` | 按 ID 或标题恢复以前的会话 |

## 顶级命令

| 命令 | 用途 |
|---------|---------|
| `hermes chat` | 与代理进行交互式或一次性聊天 |
| `hermes model` | 交互式选择默认提供商和模型 |
| `hermes gateway` | 运行或管理消息网关服务 |
| `hermes setup` | 交互式设置向导 |
| `hermes config` | 显示、编辑、迁移和查询配置文件 |
| `hermes skills` | 浏览、安装、发布、审计和配置技能 |
| `hermes sessions` | 浏览、导出、修剪、重命名和删除会话 |
| `hermes update` | 拉取最新代码并重新安装依赖项 |

## `hermes chat`

```bash
hermes chat [options]
```

常用选项：

| 选项 | 描述 |
|--------|-------------|
| `-q`, `--query` | 一次性非交互式提示 |
| `-m`, `--model` | 覆盖此运行的模型 |
| `-t`, `--toolsets` | 启用逗号分隔的工具集 |
| `--worktree` | 在隔离的 git 工作树中启动 |
| `--yolo` | 绕过危险命令批准提示 |

## `hermes model`

交互式提供商 + 模型选择器。

```bash
hermes model
```

## `hermes gateway`

```bash
hermes gateway <subcommand>
```

子命令：

| 子命令 | 描述 |
|------------|-------------|
| `run` | 在前台运行网关 |
| `start` | 启动后台服务 |
| `stop` | 停止服务 |
| `status` | 显示服务状态 |

## `hermes config`

```bash
hermes config <subcommand>
```

子命令：

| 子命令 | 描述 |
|------------|-------------|
| `show` | 显示当前配置值 |
| `edit` | 在编辑器中打开 `config.yaml` |
| `set` | 设置配置值 |
| `check` | 检查缺失或过时的配置 |
