---
inHomePost: false
categories:
  - Hermes Agent 中文教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
articleUpdate: false
date: 2026-04-14 02:06:04
title: Open WebUI
description: 将 Hermes Agent 与 Open WebUI 集成
permalink: /hermes/user-guide/messaging/open-webui
---

# Open WebUI 集成

Open WebUI 是一个功能丰富的、自托管的 AI 界面，与 Hermes 的 API 服务器完全兼容。

## 设置

### 1. 启动 Hermes API 服务器

```bash
# 在 ~/.hermes/.env 中设置
API_SERVER_ENABLED=true
API_SERVER_KEY=your-secret-key

# 启动网关
hermes gateway
```

### 2. 安装 Open WebUI

```bash
# 使用 Docker
docker run -d -p 3000:8080 -e OPENAI_API_KEY=your-secret-key -e OPENAI_API_BASE_URL=http://host.docker.internal:8642/v1 --name open-webui ghcr.io/open-webui/open-webui:main
```

### 3. 配置 Open WebUI

1. 打开 `http://localhost:3000`
2. 创建管理员账户
3. 在设置中，API 配置应已指向您的 Hermes 实例

## 功能

- **完全兼容**：Open WebUI 支持 Hermes 的所有功能
- **多模型支持**：在 Open WebUI 中切换 Hermes 模型
- **文件上传**：支持文档分析
- **语音模式**：集成语音输入/输出

## 故障排除

**连接错误：**
- 确保 Hermes 网关正在运行
- 检查 API 密钥是否匹配
- 验证 Open WebUI 可以访问 Hermes 端口

**模型未显示：**
- 在 Open WebUI 设置中刷新模型列表
- 检查 Hermes API 服务器是否返回模型列表
