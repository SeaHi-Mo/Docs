---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: 企业微信
description: 将 Hermes Agent 设置为企业微信机器人
permalink: /hermes/user-guide/messaging/wecom
---

# 企业微信设置

Hermes Agent 可以作为企业微信自建应用运行。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
WECOM_ENABLED=true
WECOM_CORP_ID=wwxxxxxxxxxxxxxxxx
WECOM_AGENT_ID=1000002
WECOM_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WECOM_ALLOWED_USERS=user-id-1,user-id-2
```

## 创建企业微信应用

1. 登录 [企业微信管理后台](https://work.weixin.qq.com)
2. 进入 "应用管理"
3. 点击 "创建应用"
4. 上传应用图标，填写应用名称
5. 获取 CorpID、AgentID 和 Secret

## 启动网关

```bash
hermes gateway
```

## 功能

- 支持单聊和群聊
- 文本、图片、文件消息
- 接收消息回调
