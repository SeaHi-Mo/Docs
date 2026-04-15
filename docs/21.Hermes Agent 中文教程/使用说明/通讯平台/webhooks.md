---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Webhooks
description: 使用 Webhooks 将外部服务连接到 Hermes Agent
permalink: /hermes/user-guide/messaging/webhooks
---

# Webhooks

Hermes Agent 可以通过 Webhooks 接收来自外部服务的消息和事件。

## 配置

将以下内容添加到 `~/.hermes/.env`：

```bash
WEBHOOK_ENABLED=true
WEBHOOK_SECRET=your-webhook-secret
WEBHOOK_ALLOWED_IPS=192.168.1.0/24,10.0.0.0/8
```

## Webhook 端点

### 接收消息

```
POST /webhook/message
Content-Type: application/json
X-Webhook-Secret: your-webhook-secret

{
  "user_id": "user-123",
  "message": "Hello Hermes",
  "platform": "custom"
}
```

### 响应格式

```json
{
  "response": "Hello! How can I help you today?",
  "session_id": "sess_abc123"
}
```

## 安全

- 始终使用 HTTPS 进行 webhook 传输
- 验证 webhook 密钥
- 限制允许的 IP 范围
- 使用唯一的用户 ID 进行访问控制

## 示例：Zapier 集成

1. 在 Zapier 中创建一个新的 Webhook 操作
2. 将 Hermes webhook URL 设置为端点
3. 在头部中包含 webhook 密钥
4. 映射您想要发送的数据字段

## 示例：自定义集成

```python
import requests

response = requests.post(
    "https://your-hermes-server.com/webhook/message",
    headers={"X-Webhook-Secret": "your-secret"},
    json={
        "user_id": "custom-user-123",
        "message": "Analyze this data",
        "platform": "internal-app"
    }
)

print(response.json()["response"])
```
