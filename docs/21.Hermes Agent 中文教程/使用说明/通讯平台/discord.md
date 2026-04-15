---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Discord
description: 将 Hermes Agent 设置为 Discord 机器人
permalink: /hermes/user-guide/messaging/discord
---

# Discord 设置

Hermes Agent 作为机器人与 Discord 集成，让您可以通过私信或服务器频道与您的 AI 助手聊天。机器人接收您的消息，通过 Hermes Agent 管道处理（包括工具使用、记忆和推理），并实时响应。它支持文本、语音消息、文件附件和斜杠命令。

## Hermes 的行为方式

| 上下文 | 行为 |
|---------|----------|
| **私信** | Hermes 响应每条消息。不需要 `@mention`。每个私信有自己的会话。|
| **服务器频道** | 默认情况下，Hermes 仅在您 `@mention` 它时响应。如果您在没有提及它的频道中发帖，Hermes 会忽略该消息。|
| **自由响应频道** | 您可以使用 `DISCORD_FREE_RESPONSE_CHANNELS` 使特定频道免提及，或使用 `DISCORD_REQUIRE_MENTION=false` 全局禁用提及。|
| **线程** | Hermes 在同一线程中回复。提及规则仍然适用，除非该线程或其父频道配置为自由响应。线程与父频道保持隔离以维护会话历史。|
| **多用户的共享频道** | 默认情况下，Hermes 在频道内按用户隔离会话历史以确保安全和清晰。同个房间中交谈的两个人不会共享一个转录，除非您明确禁用该功能。|
| **提及其他用户的消息** | 当 `DISCORD_IGNORE_NO_MENTION` 为 `true`（默认）时，如果消息 @提及其他用户但**没有**提及机器人，Hermes 保持沉默。这可以防止机器人跳入针对其他人的对话。如果您希望机器人响应所有消息而不管提及谁，请设置为 `false`。这仅适用于服务器频道，不适用于私信。|

:::tip
如果您想要一个普通的机器人帮助频道，人们可以在那里与 Hermes 交谈而无需每次都标记它，请将该频道添加到 `DISCORD_FREE_RESPONSE_CHANNELS`。
:::

### Discord 网关模型

Hermes on Discord 不是一个无状态回复的 webhook。它通过完整的消息网关运行，这意味着每条传入消息都经过：

1. 授权 (`DISCORD_ALLOWED_USERS`)
2. 提及 / 自由响应检查
3. 会话查找
4. 会话转录加载
5. 正常的 Hermes Agent 执行，包括工具、记忆和斜杠命令
6. 响应传递回 Discord

这很重要，因为在繁忙服务器中的行为取决于 Discord 路由和 Hermes 会话策略。

### Discord 中的会话模型

默认情况下：

- 每个私信获得自己的会话
- 每个服务器线程获得自己的会话命名空间
- 共享频道中的每个用户在该频道内获得自己的会话

因此，如果 Alice 和 Bob 都在 `#research` 中与 Hermes 交谈，Hermes 默认将那些视为单独的对话，即使他们使用相同的可见 Discord 频道。

这在 `config.yaml` 中控制：

```yaml
group_sessions_per_user: true
```

仅当您明确希望整个房间共享一个对话时才设置为 `false`：

```yaml
group_sessions_per_user: false
```

共享会话对协作房间很有用，但它们也意味着：

- 用户共享上下文增长和令牌成本
- 一个人的长工具密集型任务可能会膨胀其他所有人的上下文
- 一个人的进行中运行可能会中断同个房间中另一个人的跟进

### 中断和并发

Hermes 按会话键跟踪运行的 Agent。

使用默认的 `group_sessions_per_user: true`：

- Alice 中断她自己正在进行的请求仅影响她在该频道中的会话
- Bob 可以在同一频道中继续交谈而不会继承 Alice 的历史或中断 Alice 的运行

使用 `group_sessions_per_user: false`：

- 整个房间共享该频道/线程的一个运行 Agent 槽位
- 来自不同人的跟进消息可能会相互中断或排队

本指南将引导您完成完整的设置过程 —— 从在 Discord 开发者门户上创建机器人到发送您的第一条消息。

## 第 1 步：创建 Discord 应用程序

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications) 并使用您的 Discord 账户登录。
2. 点击右上角的 **New Application**。
3. 输入应用程序的名称（例如 "Hermes Agent"）并接受开发者服务条款。
4. 点击 **Create**。

您将登录到 **General Information** 页面。记下 **Application ID** —— 稍后构建邀请 URL 时需要它。

## 第 2 步：创建机器人

1. 在左侧边栏中，点击 **Bot**。
2. Discord 自动为您的应用程序创建一个机器人用户。您会看到可以自定义的机器人用户名。
3. 在 **Authorization Flow** 下：
   - 将 **Public Bot** 设置为 **ON** —— 需要使用 Discord 提供的邀请链接（推荐）。这允许 Installation 标签生成默认授权 URL。
   - 保持 **Require OAuth2 Code Grant** 设置为 **OFF**。
