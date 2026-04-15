---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Slack
description: 使用 Socket 模式将 Hermes Agent 设置为 Slack 机器人
permalink: /hermes/user-guide/messaging/slack
---

# Slack 设置

使用 Socket 模式将 Hermes Agent 连接到 Slack 作为机器人。Socket 模式使用 WebSockets 而不是公共 HTTP 端点，因此您的 Hermes 实例不需要公开访问 —— 它可以在防火墙后、笔记本电脑上或私有服务器上工作。

:::warning 经典 Slack 应用已弃用
经典 Slack 应用（使用 RTM API）已于 **2025 年 3 月完全弃用**。Hermes 使用现代 Bolt SDK 与 Socket 模式。如果您有旧版经典应用，必须按照以下步骤创建新应用。
:::

## 概述

| 组件 | 值 |
|-----------|-------|
| **库** | `slack-bolt` / `slack_sdk` for Python (Socket 模式) |
| **连接** | WebSocket —— 不需要公共 URL |
| **所需认证令牌** | 机器人令牌 (`xoxb-`) + 应用级令牌 (`xapp-`) |
| **用户识别** | Slack 成员 ID（例如 `U01ABC2DEF3`）|

---

## 第 1 步：创建 Slack 应用

1. 前往 [https://api.slack.com/apps](https://api.slack.com/apps)
2. 点击 **Create New App**
3. 选择 **From scratch**
4. 输入应用名称（例如 "Hermes Agent"）并选择您的工作区
5. 点击 **Create App**

您将登录到应用的 **Basic Information** 页面。

---

## 第 2 步：配置机器人令牌范围

在侧边栏中导航到 **Features → OAuth & Permissions**。滚动到 **Scopes → Bot Token Scopes** 并添加以下内容：

| 范围 | 用途 |
|-------|---------|
| `chat:write` | 作为机器人发送消息 |
| `app_mentions:read` | 检测在频道中被 @提及 |
| `channels:history` | 读取机器人在的公共频道中的消息 |
| `channels:read` | 列出并获取有关公共频道的信息 |
| `groups:history` | 读取机器人在的私有频道中的消息 |
| `im:history` | 读取私信历史 |
| `im:read` | 查看基本私信信息 |
| `im:write` | 打开和管理私信 |
| `users:read` | 查找用户信息 |
| `files:write` | 上传文件（图像、音频、文档）|

:::caution 缺少范围 = 缺少功能
没有 `channels:history` 和 `groups:history`，机器人**将无法接收频道中的消息** —— 它只能在私信中工作。这些是最常被遗漏的范围。
:::

**可选范围：**

| 范围 | 用途 |
|-------|---------|
| `groups:read` | 列出并获取有关私有频道的信息 |

---

## 第 3 步：启用 Socket 模式

Socket 模式让机器人通过 WebSocket 连接，而不需要公共 URL。

1. 在侧边栏中，转到 **Settings → Socket Mode**
2. 将 **Enable Socket Mode** 切换为 ON
3. 系统会提示您创建**应用级令牌**：
   - 将其命名为类似 `hermes-socket` 的名称（名称无关紧要）
   - 添加 **`connections:write`** 范围
   - 点击 **Generate**
4. **复制令牌** —— 它以 `xapp-` 开头。这是您的 `SLACK_APP_TOKEN`

:::tip
您始终可以在 **Settings → Basic Information → App-Level Tokens** 下找到或重新生成应用级令牌。
:::

---

## 第 4 步：订阅事件

这一步很关键 —— 它控制机器人可以看到哪些消息。

1. 在侧边栏中，转到 **Features → Event Subscriptions**
2. 将 **Enable Events** 切换为 ON
3. 展开 **Subscribe to bot events** 并添加：

| 事件 | 必需？| 用途 |
|-------|-----------|---------|
| `message.channels` | 是 | 机器人是成员的公共频道中的消息 |
| `message.groups` | 推荐 | 机器人是成员的私有频道中的消息 |
| `message.im` | 推荐 | 私信 |
| `app_mention` | 推荐 | 当机器人被 @提及 |

---

## 第 5 步：安装到工作区

1. 转到 **Settings → Install App**
2. 点击 **Install to Workspace**
3. 授权权限
4. **复制机器人令牌** —— 它以 `xoxb-` 开头。这是您的 `SLACK_BOT_TOKEN`

---

## 第 6 步：配置 Hermes

将以下内容添加到 `~/.hermes/.env`：

```bash
# 必需
SLACK_ENABLED=true
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token

# 访问控制（逗号分隔的成员 ID）
SLACK_ALLOWED_USERS=U01ABC2DEF3,U02GHI3JKL4

# 可选：主频道（cron 结果发送到这里）
SLACK_HOME_CHANNEL=C01XYZ2ABC3
```

查找 Slack 成员 ID：
- 点击 Slack 中的用户个人资料
- 点击 **三个点 → Copy member ID**

---

## 第 7 步：启动网关

```bash
hermes gateway
```

您将看到：

```
[Slack] 机器人已连接
```

在 Slack 中向机器人发送消息。它应该响应！
