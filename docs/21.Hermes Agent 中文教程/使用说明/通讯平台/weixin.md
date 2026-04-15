---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 微信
description: 将 Hermes Agent 设置为微信公众号机器人
permalink: /hermes/user-guide/messaging/weixin
---

# 微信设置

Hermes Agent 可以作为微信公众号（服务号/订阅号）机器人运行。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
WEIXIN_ENABLED=true
WEIXIN_APP_ID=wxxxxxxxxxxxxxxxx
WEIXIN_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WEIXIN_TOKEN=your-token
WEIXIN_ENCODING_AES_KEY=optional-aes-key
WEIXIN_ALLOWED_USERS=openid-1,openid-2
```

## 注册微信公众号

1. 访问 [微信公众平台](https://mp.weixin.qq.com)
2. 注册服务号或订阅号
3. 获取 AppID 和 AppSecret
4. 在 "基本配置" 中设置服务器配置

## 设置服务器 URL

1. 在公众号后台，进入 "开发 → 基本配置"
2. 启用服务器配置
3. 设置 URL：`https://your-server.com/webhook/weixin`
4. 设置 Token
5. 设置 EncodingAESKey（可选，用于消息加密）

## 启动网关

```bash
hermes gateway
```

## 限制

- 微信公众号有 48 小时客服消息限制
- 需要微信认证才能使用高级接口
- 消息内容需要符合微信规范
