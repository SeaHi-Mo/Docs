---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Telegram
description: 将 Hermes Agent 设置为 Telegram 机器人
permalink: /hermes/user-guide/messaging/telegram
---

# Telegram 设置

Hermes Agent 作为功能齐全的对话机器人与 Telegram 集成。连接后，您可以从任何设备与您的 Agent 聊天，发送自动转录的语音备忘录，接收计划任务结果，并在群聊中使用 Agent。该集成基于 [python-telegram-bot](https://python-telegram-bot.org/) 构建，支持文本、语音、图像和文件附件。

## 第 1 步：通过 BotFather 创建机器人

每个 Telegram 机器人都需要通过 [@BotFather](https://t.me/BotFather)（Telegram 的官方机器人管理工具）颁发的 API 令牌。

1. 打开 Telegram 并搜索 **@BotFather**，或访问 [t.me/BotFather](https://t.me/BotFather)
2. 发送 `/newbot`
3. 选择**显示名称**（例如 "Hermes Agent"）—— 可以是任何名称
4. 选择**用户名** —— 必须是唯一的并以 `bot` 结尾（例如 `my_hermes_bot`）
5. BotFather 会回复您的 **API 令牌**。它看起来像这样：

```
123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
```

:::warning
对您的机器人令牌保密。任何拥有此令牌的人都可以控制您的机器人。如果泄露，请立即通过 BotFather 中的 `/revoke` 撤销它。
:::

## 第 2 步：自定义您的机器人（可选）

这些 BotFather 命令可改善用户体验。向 @BotFather 发送消息并使用：

| 命令 | 用途 |
|---------|---------|
| `/setdescription` | 用户开始聊天前显示的 "What can this bot do?" 文本 |
| `/setabouttext` | 机器人个人资料页面上的简短文本 |
| `/setuserpic` | 为机器人上传头像 |
| `/setcommands` | 定义命令菜单（聊天中的 `/` 按钮）|
| `/setprivacy` | 控制机器人是否看到所有群组消息（见第 3 步）|

:::tip
对于 `/setcommands`，一个有用的起始设置：

```
help - 显示帮助信息
new - 开始新对话
sethome - 将此聊天设置为主频道
```
:::

## 第 3 步：隐私模式（群组关键）

Telegram 机器人有一个**默认启用**的**隐私模式**。这是在群组中使用机器人时最常见的困惑来源。

**隐私模式开启时**，您的机器人只能看到：
- 以 `/` 命令开头的消息
- 直接回复机器人自己消息的消息
- 服务消息（成员加入/离开、置顶消息等）
- 机器人是管理员的频道中的消息

**隐私模式关闭时**，机器人接收群组中的每条消息。

### 如何禁用隐私模式

1. 向 **@BotFather** 发送消息
2. 发送 `/mybots`
3. 选择您的机器人
4. 转到 **Bot Settings → Group Privacy → Turn off**

:::warning
**更改隐私设置后，您必须从任何群组中移除并重新添加机器人。** Telegram 在机器人加入群组时缓存隐私状态，直到机器人被移除并重新添加才会更新。
:::

:::tip
禁用全局隐私模式的替代方案：将机器人提升为**群组管理员**。管理员机器人始终接收所有消息，无论隐私设置如何，这避免了需要切换全局隐私模式。
:::

## 第 4 步：查找您的用户 ID

Hermes Agent 使用数字 Telegram 用户 ID 来控制访问。您的用户 ID**不是**您的用户名 —— 它是一个像 `123456789` 这样的数字。

**方法 1（推荐）：** 向 [@userinfobot](https://t.me/userinfobot) 发送消息 —— 它会立即回复您的用户 ID。

**方法 2：** 向 [@get_id_bot](https://t.me/get_id_bot) 发送消息 —— 另一个可靠的选择。

保存此号码；下一步需要它。

## 第 5 步：配置 Hermes

### 选项 A：交互式设置（推荐）

```bash
hermes gateway setup
```

出现提示时选择 **Telegram**。向导会询问您的机器人令牌和允许的用户 ID，然后为您编写配置。

### 选项 B：手动配置

将以下内容添加到 `~/.hermes/.env`：

```bash
# 必需
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=your-bot-token-here
TELEGRAM_ALLOWED_USERS=123456789,987654321  # 逗号分隔的用户 ID

# 可选：主频道（cron 结果发送到这里）
TELEGRAM_HOME_CHANNEL=123456789
```

## 第 6 步：启动网关

```bash
hermes gateway
```

您将看到：

```
[Telegram] 机器人 @my_hermes_bot 已启动
```

向您的机器人发送消息。它应该响应！

## 可用命令

| 命令 | 描述 |
|---------|-------------|
| `/help` | 显示帮助信息 |
| `/new` | 开始新对话（重置会话）|
| `/model` | 切换 AI 模型 |
| `/memory` | 显示当前记忆 |
| `/sethome` | 将此聊天设置为主频道 |

## 故障排除

**机器人在群组中不响应：**
- 检查隐私模式（第 3 步）
- 尝试将机器人设为管理员
- 从群组中移除并重新添加机器人

**"未授权"错误：**
- 检查您的用户 ID 是否在 `TELEGRAM_ALLOWED_USERS` 中
- 确保您使用的是数字用户 ID，而不是用户名

**网关启动但机器人离线：**
- 验证令牌是否正确（在 BotFather 中检查）
- 检查是否有其他进程在使用该令牌
- 尝试通过 BotFather 撤销并重新生成令牌
