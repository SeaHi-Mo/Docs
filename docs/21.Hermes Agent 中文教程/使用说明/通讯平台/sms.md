---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: SMS (Twilio)
description: 使用 Twilio 将 Hermes Agent 设置为 SMS 机器人
permalink: /hermes/user-guide/messaging/sms
---

# SMS 设置 (Twilio)

Hermes Agent 可以通过 Twilio 发送和接收 SMS 消息。

## 设置 Twilio 账户

1. 在 [twilio.com](https://www.twilio.com) 注册
2. 获取一个电话号码
3. 从控制台获取您的 Account SID 和 Auth Token

## 配置 Webhook

Twilio 需要 webhook URL 来接收传入消息：

1. 在 Twilio 控制台中，转到您的电话号码设置
2. 在 "Messaging" 下，将 "Webhook" 设置为：
   ```
   https://your-server.com/webhook/twilio
   ```
   或使用本地隧道进行开发：
   ```
   ngrok http 8080
   ```

## 配置 Hermes

将以下内容添加到 `~/.hermes/.env`：

```bash
SMS_ENABLED=true
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+15551234567
SMS_ALLOWED_USERS=+15559876543
```

## 启动网关

```bash
hermes gateway
```

## 限制

- SMS 仅支持纯文本
- 消息长度限制为 160 个字符（长消息会被分割）
- 不支持图像或文件附件
