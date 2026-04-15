---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: BlueBubbles (iMessage)
description: 使用 BlueBubbles 将 Hermes Agent 连接到 iMessage
permalink: /hermes/user-guide/messaging/bluebubbles
---

# BlueBubbles 设置 (iMessage)

BlueBubbles 是一个开源项目，可以让您在非 Apple 设备上访问 iMessage。Hermes Agent 可以通过 BlueBubbles 服务器发送和接收 iMessage。

## 前提条件

- 一台 Mac 运行 BlueBubbles 服务器
- iMessage 账户已登录 Mac

## 设置 BlueBubbles 服务器

1. 在 Mac 上下载 [BlueBubbles 服务器](https://bluebubbles.app)
2. 安装并配置服务器
3. 获取服务器 URL 和密码

## 配置 Hermes

将以下内容添加到 `~/.hermes/.env`：

```bash
BLUEBUBBLES_ENABLED=true
BLUEBUBBLES_URL=http://your-mac-ip:12345
BLUEBUBBLES_PASSWORD=your-server-password
BLUEBUBBLES_ALLOWED_USERS=+15551234567,+15559876543
```

## 启动网关

```bash
hermes gateway
```

## 功能

- 发送/接收 iMessage 文本
- 支持 Tapbacks（反应）
- 查看消息已读状态
- 发送/接收图像

## 限制

- 需要 Mac 始终开机
- 不支持 FaceTime
- 某些 iMessage 功能（如动画效果）不受支持
