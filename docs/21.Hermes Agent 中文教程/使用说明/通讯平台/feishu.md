---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 飞书
description: 将 Hermes Agent 设置为飞书机器人
permalink: /hermes/user-guide/messaging/feishu
---

# 飞书设置

Hermes Agent 可以作为飞书自定义机器人或企业自建应用运行。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
FEISHU_ENABLED=true
FEISHU_APP_ID=cli_xxxxxxxx
FEISHU_APP_SECRET=xxxxxxxx
FEISHU_ENCRYPT_KEY=optional-encrypt-key
FEISHU_ALLOWED_USERS=ou_xxxxxxxx,ou_yyyyyyyy
```

## 创建飞书应用

1. 登录 [飞书开放平台](https://open.feishu.cn)
2. 创建企业自建应用
3. 获取 App ID 和 App Secret
4. 启用机器人能力
5. 发布应用

## 启动网关

```bash
hermes gateway
```

## 功能

- 支持私聊和群聊
- 富文本消息
- 交互式卡片
- 文件上传
