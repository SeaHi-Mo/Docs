---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 钉钉
description: 将 Hermes Agent 设置为钉钉机器人
permalink: /hermes/user-guide/messaging/dingtalk
---

# 钉钉设置

Hermes Agent 可以作为钉钉企业内部机器人运行。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
DINGTALK_ENABLED=true
DINGTALK_APP_KEY=your-app-key
DINGTALK_APP_SECRET=your-app-secret
DINGTALK_AGENT_ID=your-agent-id
DINGTALK_ALLOWED_USERS=user-id-1,user-id-2
```

## 创建钉钉应用

1. 登录 [钉钉开放平台](https://open.dingtalk.com)
2. 创建企业内部应用
3. 获取 AppKey 和 AppSecret
4. 配置机器人能力
5. 发布应用

## 启动网关

```bash
hermes gateway
```

## 功能

- 支持单聊和群聊
- 卡片消息支持
- 文件上传
