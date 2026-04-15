---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: WhatsApp
description: 通过内置 Baileys 桥接将 Hermes Agent 设置为 WhatsApp 机器人
permalink: /hermes/user-guide/messaging/whatsapp
---

# WhatsApp 设置

Hermes 通过基于 **Baileys** 的内置桥接连接到 WhatsApp。这通过模拟 WhatsApp Web 会话工作 —— **不是**通过官方 WhatsApp Business API。不需要 Meta 开发者账户或企业验证。

:::warning 非官方 API —— 封禁风险
WhatsApp **不** officially 支持 Business API 之外的第三方机器人。使用第三方桥接有账号受限的小风险。为最小化风险：
- 为机器人使用**专用电话号码**（不是您的个人号码）
- **不要发送批量/垃圾消息** —— 保持对话式使用
- **不要向未先发送消息的人自动发送出站消息**
:::

:::warning WhatsApp Web 协议更新
WhatsApp 定期更新他们的 Web 协议，这可能暂时破坏与第三方桥接的兼容性。当这种情况发生时，Hermes 将更新桥接依赖。如果机器人在 WhatsApp 更新后停止工作，请拉取最新的 Hermes 版本并重新配对。
:::

## 两种模式

| 模式 | 工作原理 | 最适合 |
|------|-------------|----------|
| **单独机器人号码**（推荐）| 将电话号码专用于机器人。人们直接向该号码发送消息。| 干净的 UX、多用户、较低的封禁风险 |
| **个人自我聊天** | 使用您自己的 WhatsApp。您向自己发送消息以与 Agent 交谈。| 快速设置、单用户、测试 |

---

## 前提条件

- **Node.js v18+** 和 **npm** —— WhatsApp 桥接作为 Node.js 进程运行
- **安装了 WhatsApp 的手机**（用于扫描二维码）

与旧的浏览器驱动桥接不同，当前基于 Baileys 的桥接**不**需要本地 Chromium 或 Puppeteer 依赖堆栈。

---

## 第 1 步：运行设置向导

```bash
hermes whatsapp
```

向导将：

1. 询问您想要哪种模式（**bot** 或 **self-chat**）
2. 如果需要，安装桥接依赖
3. 在终端中显示**二维码**
4. 等待您扫描它

**扫描二维码：**

1. 在手机上打开 WhatsApp
2. 转到 **Settings → Linked Devices**
3. 点击 **Link a Device**
4. 将相机对准终端二维码

配对后，向导确认连接并退出。您的会话会自动保存。

:::tip
如果二维码看起来乱码，请确保您的终端至少有 60 列宽并支持 Unicode。您也可以尝试不同的终端模拟器。
:::

---

## 第 2 步：获取第二个电话号码（机器人模式）

对于机器人模式，您需要一个尚未注册 WhatsApp 的电话号码。三个选项：

| 选项 | 成本 | 说明 |
|--------|------|-------|
| **Google Voice** | 免费 | 仅限美国。在 [voice.google.com](https://voice.google.com) 获取号码。通过 Google Voice 应用通过 SMS 验证 WhatsApp。|
| **预付费 SIM** | $5–15 一次性 | 任何运营商。激活、验证 WhatsApp，然后 SIM 可以放在抽屉里。号码必须保持活跃（每 90 天拨打一次电话）。|
| **VoIP 服务** | 免费–$5/月 | TextNow、TextFree 或类似服务。某些 VoIP 号码被 WhatsApp 阻止 —— 如果第一个不起作用，请尝试几个。|

获取号码后：

1. 在手机上安装 WhatsApp（或使用双 SIM 的 WhatsApp Business 应用）
2. 向 WhatsApp 注册新号码
3. 运行 `hermes whatsapp` 并从该 WhatsApp 账户扫描二维码

---

## 第 3 步：配置 Hermes

将以下内容添加到您的 `~/.hermes/.env` 文件：

```bash
# 必需
WHATSAPP_ENABLED=true
WHATSAPP_MODE=bot                          # "bot" 或 "self-chat"

# 访问控制 —— 选择以下选项之一：
WHATSAPP_ALLOWED_USERS=15551234567         # 逗号分隔的电话号码（带国家代码，不带 +）
# WHATSAPP_ALLOWED_USERS=*                 # 或使用 * 允许所有人
```

---

## 第 4 步：启动网关

```bash
hermes gateway
```

您将看到：

```
[WhatsApp] 机器人已连接
```

向机器人发送 WhatsApp 消息。它应该响应！

## 故障排除

**二维码不显示：**
- 确保您的终端支持 Unicode 且至少有 60 列
- 尝试不同的终端模拟器

**配对后"未授权"：**
- 检查发送者的电话号码是否在 `WHATSAPP_ALLOWED_USERS` 中
- 确保使用带国家代码的数字格式（例如 15551234567）

**机器人停止响应：**
- WhatsApp 可能已更新其协议。拉取最新的 Hermes 并重新运行 `hermes whatsapp`
- 检查网关日志中的连接错误

**会话过期：**
- Baileys 会话有时会过期。运行 `hermes whatsapp` 重新扫描二维码
