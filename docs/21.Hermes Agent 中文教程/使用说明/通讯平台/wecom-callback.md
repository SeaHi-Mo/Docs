---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 企业微信回调模式
description: 使用回调模式接收企业微信消息
permalink: /hermes/user-guide/messaging/wecom-callback
---

# 企业微信回调模式

除了主动拉取消息，企业微信还支持回调模式推送消息。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
WECOM_CALLBACK_ENABLED=true
WECOM_CORP_ID=wwxxxxxxxxxxxxxxxx
WECOM_TOKEN=xxxxxxxx
WECOM_ENCODING_AES_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WECOM_ALLOWED_USERS=user-id-1,user-id-2
```

## 设置回调 URL

1. 在企业微信管理后台，进入应用设置
2. 启用 "接收消息"
3. 设置 URL：`https://your-server.com/webhook/wecom`
4. 设置 Token 和 EncodingAESKey

## 启动网关

```bash
hermes gateway
```

## 回调模式 vs 主动轮询

| 模式 | 优点 | 缺点 |
|------|------|------|
| 回调 | 实时接收消息 | 需要公网服务器 |
| 轮询 | 无需公网 | 有延迟 |
