---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Home Assistant
description: 将 Hermes Agent 与 Home Assistant 集成
permalink: /hermes/user-guide/messaging/homeassistant
---

# Home Assistant 集成

Hermes Agent 可以作为 Home Assistant 的聊天机器人运行，让您通过消息控制智能家居设备。

## 设置

### 1. 配置 Home Assistant

在 Home Assistant 中创建长期访问令牌：

1. 转到您的个人资料（左下角用户名）
2. 滚动到 "Long-Lived Access Tokens"
3. 点击 "Create Token"
4. 复制生成的令牌

### 2. 配置 Hermes

将以下内容添加到 `~/.hermes/.env`：

```bash
HOMEASSISTANT_ENABLED=true
HOMEASSISTANT_URL=http://homeassistant.local:8123
HOMEASSISTANT_TOKEN=your-long-lived-token
HOMEASSISTANT_ALLOWED_USERS=your-user-id
```

### 3. 启动网关

```bash
hermes gateway
```

## Home Assistant 工具

Hermes 在 Home Assistant 模式下包含额外的工具：

- `ha_list_entities` — 列出所有设备
- `ha_get_state` — 获取设备状态
- `ha_call_service` — 控制设备
- `ha_list_services` — 列出可用服务

## 使用示例

```
用户：打开客厅的灯
Hermes：调用 light.turn_on 服务 → 客厅灯已打开

用户：温度是多少？
Hermes：客厅温度是 22°C

用户：设置恒温器为 24 度
Hermes：调用 climate.set_temperature 服务 → 恒温器已设置为 24°C
```

## 故障排除

**无法连接：**
- 验证 Home Assistant URL 是否正确
- 检查令牌是否有效
- 确保 Home Assistant 可访问

**设备未显示：**
- 检查 Hermes 是否有权限访问所有域
- 验证设备在 Home Assistant 中可见
