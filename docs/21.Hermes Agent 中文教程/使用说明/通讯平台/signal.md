---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Signal
description: 将 Hermes Agent 设置为 Signal 机器人
permalink: /hermes/user-guide/messaging/signal
---

# Signal 设置

Hermes Agent 可以通过 Signal 的独立 CLI 客户端集成作为 Signal 机器人运行。

## 前提条件

- **Signal CLI** —— 独立的 Signal 命令行客户端
- **一个电话号码** —— 用于机器人的 Signal 账户

## 安装 Signal CLI

```bash
# macOS
brew install signal-cli

# Ubuntu/Debian (从官方仓库)
sudo apt install signal-cli

# 或从源代码构建
# 见 https://github.com/AsamK/signal-cli
```

## 注册 Signal 账户

```bash
# 注册新号码（会发送短信验证码）
signal-cli -a +15551234567 register

# 验证验证码
signal-cli -a +15551234567 verify 123456

# 设置个人资料
signal-cli -a +15551234567 updateProfile --name "Hermes Agent"
```

## 配置 Hermes

将以下内容添加到 `~/.hermes/.env`：

```bash
SIGNAL_ENABLED=true
SIGNAL_ACCOUNT=+15551234567
SIGNAL_ALLOWED_USERS=+15559876543,+15551112222
```

## 启动网关

```bash
hermes gateway
```

## 故障排除

**无法接收消息：**
- 确保 signal-cli 守护进程正在运行
- 检查号码是否已正确注册
- 验证允许的用户列表

**链接设备：**
- Signal CLI 可以作为主设备或链接设备运行
- 主设备：直接注册号码
- 链接设备：使用 `signal-cli link` 并扫描二维码
