---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Email
description: 将 Hermes Agent 设置为 Email 机器人
permalink: /hermes/user-guide/messaging/email
---

# Email 设置

Hermes Agent 可以通过 IMAP/SMTP 发送和接收电子邮件。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
EMAIL_ENABLED=true
EMAIL_IMAP_SERVER=imap.gmail.com
EMAIL_IMAP_PORT=993
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_ALLOWED_SENDERS=trusted@example.com,colleague@work.com
```

## Gmail 设置

对于 Gmail，您需要使用应用专用密码：

1. 启用两步验证
2. 生成应用专用密码：
   - 转到 Google 账户设置
   - 安全性 → 两步验证 → 应用专用密码
   - 选择 "邮件" 和您的设备
   - 复制生成的密码

## 启动网关

```bash
hermes gateway
```

## 工作原理

- 网关每 30 秒检查一次新邮件
- 来自允许发件人的邮件被处理为对话
- 回复通过 SMTP 发送回发件人
- 支持线程（基于主题）

## 限制

- 仅支持纯文本内容（HTML 会被转换）
- 附件会被下载并作为文件提供
