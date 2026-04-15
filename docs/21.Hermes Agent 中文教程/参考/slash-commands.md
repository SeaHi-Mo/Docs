---
title: "斜杠命令参考"
sidebar_position: 2
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
permalink: /hermes/reference/slash-commands
description: "交互式 CLI 和消息斜杠命令的完整参考"
---


# 斜杠命令参考

Hermes 有两个斜杠命令界面：

- **交互式 CLI 斜杠命令** — 由 `cli.py` 调度
- **消息斜杠命令** — 由 `gateway/run.py` 调度

## 交互式 CLI 斜杠命令

在 CLI 中键入 `/` 以打开自动完成菜单。

### 会话

| 命令 | 描述 |
|---------|-------------|
| `/new` (别名: `/reset`) | 开始新会话 |
| `/clear` | 清除屏幕并开始新会话 |
| `/history` | 显示对话历史 |
| `/save` | 保存当前对话 |
| `/retry` | 重试最后一条消息 |
| `/undo` | 删除最后一条交换 |
| `/title` | 为当前会话设置标题 |
| `/compress` | 手动压缩对话上下文 |
| `/rollback` | 列出或恢复文件系统检查点 |
| `/stop` | 终止所有后台进程 |
| `/background` (别名: `/bg`) | 在后台会话中运行提示 |

### 配置

| 命令 | 描述 |
|---------|-------------|
| `/config` | 显示当前配置 |
| `/model` | 显示或更改当前模型 |
| `/provider` | 显示可用提供商 |
| `/personality` | 设置个性 |
| `/verbose` | 循环工具进度显示 |
| `/skin` | 更改显示皮肤/主题 |
| `/voice` | 切换语音模式 |
| `/yolo` | 切换 YOLO 模式 |

### 工具与技能

| 命令 | 描述 |
|---------|-------------|
| `/tools` | 管理工具 |
| `/skills` | 搜索、安装、管理技能 |
| `/cron` | 管理计划任务 |
| `/browser` | 管理浏览器连接 |

### 信息

| 命令 | 描述 |
|---------|-------------|
| `/help` | 显示帮助 |
| `/usage` | 显示令牌使用 |
| `/debug` | 上传调试报告 |

### 退出

| 命令 | 描述 |
|---------|-------------|
| `/quit` | 退出 CLI |

## 消息斜杠命令

消息网关支持以下内置命令：

| 命令 | 描述 |
|---------|-------------|
| `/new` | 开始新对话 |
| `/reset` | 重置对话历史 |
| `/status` | 显示会话信息 |
| `/stop` | 终止后台进程 |
| `/model` | 更改模型 |
| `/compress` | 压缩对话上下文 |
| `/usage` | 显示令牌使用 |
| `/help` | 显示帮助 |
