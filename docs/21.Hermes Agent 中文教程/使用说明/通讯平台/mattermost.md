---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Mattermost
description: 将 Hermes Agent 设置为 Mattermost 机器人
permalink: /hermes/user-guide/messaging/mattermost
---

# Mattermost 设置

Hermes Agent 可以作为 Mattermost 机器人运行，支持个人访问令牌认证。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
MATTERMOST_ENABLED=true
MATTERMOST_URL=https://mattermost.example.com
MATTERMOST_TOKEN=your-personal-access-token
MATTERMOST_ALLOWED_USERS=user-id-1,user-id-2
```

## 创建个人访问令牌

1. 在 Mattermost 中，转到账户设置 → 安全 → 个人访问令牌
2. 点击 "Create Token"
3. 输入描述并保存
4. 复制生成的令牌

## 启动网关

```bash
hermes gateway
```

## 功能

- 支持频道和私信
- 线程支持
- 文件上传
- 反应表情
